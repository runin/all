<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import api from '@/api/api'
export default {
  name: 'app',
  data () {
    return {
      isWxReady: false,
      isError: false
    }
  },
  created: function () {
    var that = this
    api.getTicket().then(function () {
      that.isWxReady = true
    }, function () {
      that.isError = true
    })
  }
}
</script>

<style>

</style>
