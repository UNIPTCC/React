<template>
  <div id="menu-desktop">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <router-link :to="{ path: item.path }">
          <font-awesome-icon v-if="item.icon" :icon="item.icon" />
          {{ item.name }}
        </router-link>
      </li>
      <li>
        <a v-on:click="$logout">
          <font-awesome-icon icon="sign-out-alt" />
          Sair
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MenuDestkop',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/globals";
@import "./MenuDestkop";
</style>