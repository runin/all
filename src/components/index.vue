<template>
  <div id="index" class="wrap-page">
      <img class="mark" src="../assets/images/mark.png" />
      <img class="logo" src="../assets/images/logo.png"/>
      <img class="h1" src="../assets/images/h1.png" />
      <router-link to="/yao" class="go"></router-link>
      <copyright class="copyright"></copyright>
  </div>
</template>

<script>
import copyright from './common/copyright.vue'

export default {
  name: 'index',
  components: {
    'copyright': copyright
  },
  methods: {
    init: function () {
    }
  },
  created: function () {
  }
}
</script>

<style scoped>
    .wrap-page{
        background: url(../assets/images/index-bg.jpg) no-repeat;
        background-size: 100% 100%;
    }
    .mark{
        width: 22%;
        position: absolute;
        left: 3%;
        top: 2%;
    }
    .logo{
        width: 83%;
        padding-top: 22%;
        padding-bottom: 5%;
        margin: 0 auto;
    }
    .h1{
        width: 85%;
        margin: 0 auto;
    }
    .go{
        display: block;
        position: absolute;
        width: 350px;
        height: 86px;
        margin: 0 auto;
        bottom: 20%;
        left: 0;
        right: 0;
        background: url(../assets/images/go.png) no-repeat;
        background-size: 100% 100%;
    }
</style>
