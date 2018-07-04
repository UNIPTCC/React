const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { promisify } = require('util')
const getTranslationNamespaces = require('./getNamespaces')

const copyFileAsync = promisify(fs.copyFile)
const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)
const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)
const baseFolder = path.dirname(path.dirname(__dirname))

exports.createNew = function (args) {
  return new Promise(async (resolve, reject) => {
    try {
      let [ componentName ] = args
      const componentFolder = path.join(baseFolder, './src/Components/', componentName)
      const componentFile = path.join(componentFolder, `${componentName}.js`)
      const componentTestFile = path.join(componentFolder, `${componentName}.test.js`)
      const translationDir = path.join(baseFolder, 'public/locales')
      const i18nServiceFile = path.join(baseFolder, 'src/Services/i18n.js')

      console.log(chalk.cyan(` Criando componente ${componentName}`))

      await mkdirAsync(componentFolder) // Cria a pasta do componente

      await Promise.all([
        copyFileAsync(path.join(__dirname, '/templates/componentTest.test.js'), componentTestFile), // Move os arquivos de teste para dentro
        copyFileAsync(path.join(__dirname, '/templates/component.js'), componentFile), // Move o arquivo base do componente pra dentro
        copyFileAsync(path.join(__dirname, '/templates/i18n.js'), i18nServiceFile) // Move o arquivo base do i18n
      ])

      readdirAsync(translationDir).then((languages) => {
        languages.forEach((language) => {
          const filename = path.join(translationDir, language, `${componentName}.json`)
          writeFileAsync(filename, '{}').then(() => console.log(chalk.yellow(`    Arquivo de tradução criado em ${chalk.magenta(filename)} -> Coloque suas traduções aqui`)))
        })
      })

      // Atualiza o nome no arquivo de teste
      let fileContents = (await readFileAsync(componentTestFile)).toString()
      fileContents = fileContents.replace(/@componentName/g, componentName)
      writeFileAsync(componentTestFile, fileContents)

      // Atualiza o nome no arquivo do componente
      fileContents = (await readFileAsync(componentFile)).toString()
      fileContents = fileContents.replace(/@componentName/g, componentName)
      writeFileAsync(componentFile, fileContents)

      // Atualiza a lista de namespaces do i18n
      fileContents = (await readFileAsync(i18nServiceFile)).toString()
      const namespaces = await getTranslationNamespaces(baseFolder)
      fileContents = fileContents.replace(/@translationNamespaces/g, namespaces)
      writeFileAsync(i18nServiceFile, fileContents)

      console.log(chalk.bold.yellow(`    >> Arquivos base criados, por favor altere a estrutura dos mesmos:`))
      console.log(chalk.bold.red(`      -> ${chalk.magenta(componentFile)}`))

      console.log(chalk.bold.yellow(`    >> Não esqueça de alterar o teste:`))
      console.log(chalk.bold.red(`      -> ${chalk.magenta(componentTestFile)}`))

      const returnObject = { name: componentName, path: path.join(componentFolder, componentName) }
      resolve(returnObject)
    } catch (error) {
      reject(error)
    }
  })
}
