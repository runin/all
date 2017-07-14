<template>
    <div id="showTips" v-if="isShow">
        <div class="showTips">{{ message }}</div>
    </div>
</template>

<script>
  export default {
    name: 'showTips',
    data () {
      return {
        isShow: true,
        styleObject: {}
      }
    },
    props: ['message'],
    methods: {
      init () {
        this.resize(this.message)
      },
      resize (tips, timer) {
        let that = this
        if (tips) {
          that.isShow = true
          let timer = timer || 1200
          setTimeout(function () {
            that.isShow = false
          }, timer)
        }
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
