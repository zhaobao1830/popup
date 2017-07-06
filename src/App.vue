<template>
  <div class="myApp displayNone">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'myApp',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    showMyApp: function () {
      this.isShow = true
    },
    hideMyApp: function () {
      this.isShow = false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
*
  margin: 0
  padding: 0
.myApp
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  z-index: 999;
.displayNone
  display: none
.displayBlock
  display: block
</style>
