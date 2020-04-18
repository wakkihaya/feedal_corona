<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <header>
      <p>Feedal Corona</p>
        <div><font-awesome-icon icon="ellipsis-h" size="1x"/></div>
    </header>
      <Home></Home>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from './components/Home.vue';


@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {}
</script>

<style>
  body{
    margin:0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
  }

  header{
    background-color: #E14500;
    height: 10vh;
    position:fixed;
      width: 100%;
      z-index: 10;
  }

  header p{
    margin:0;
    color: #fff;
    font-size: 1.4em;
    line-height: 10vh;
  }

  header div{
    position: absolute;
    right: 5%;
    color: #fff;
    top:45%;
  }
</style>
