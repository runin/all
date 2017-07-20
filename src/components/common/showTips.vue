<template>
    <div id="showTips">
        <div class="showTips">{{ message }}</div>
    </div>
</template>

<script>
  export default {
    name: 'showTips',
    data () {
      return {
        styleObject: {}
      }
    },
    props: ['message'],
    methods: {
      init () {
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>
    .showTips{
        position:fixed;
        max-width:80%;
        z-index:999999999999;
        color:#FFF;
        padding:15px 18px;
        font-size:24px;
        border-radius:3px;
        background:rgba(0,0,0,.7);
        text-align:center;
        top: 50%;
        left: 50%;
    }
</style>
