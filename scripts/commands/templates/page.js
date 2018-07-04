import React, { Component } from 'react'
import { connect as ConnectToRedux } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './@pageName.conf'

/**
 * Uma descrição da sua página aqui
 */
export class @pageName extends Component {
  constructor () { // Remova o construtor se não for necessário
    super()
  }

  render () { // Método Render deve retornar APENAS chamadas para regras de negócio e JSX renderizáveis conforme README na seção "Estilo de Código"
    return (
      <div>
        <h1>@pageName</h1>
      </div>
    )
  }
}

export default ConnectToRedux(mapStateToProps, mapDispatchToProps)(@pageName)
