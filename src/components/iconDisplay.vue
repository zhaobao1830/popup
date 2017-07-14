<template>
  <div class="iconDisplay">
    <div class="iconImg">
      <img :src="appli.icon"/>
    </div>
    <span>{{appli.name}}</span>
    <v-drag :src="appli.url" :dragNum="dragNum" :whetherShow="whetherShow" :activeName="activeName"
            :dragIndex="dragIndex" :showIndex="showIndex" @is_max_redu="max_redu" @newShowIndex="newShowIndex"></v-drag>
  </div>
</template>

<script type="text/ecmascript-6">
  import drag from './drag'

  export default {
    props: ['appli', 'dragNum', 'whetherShow', 'dragIndex', 'showIndex'],
    data () {
      return {
        activeName: '' // 点击li时的name值
      }
    },
    methods: {
      max_redu: function (data) {
        this.redu_max = data[0]
        this.ifMin = data[2]
        if (data[1]) {
          this.emitSrc = data[1]
          this.activeName = data[3]
        } else {
          this.activeName = ''
        }
      },
      newShowIndex: function (data) {
        this.$emit('newIndex', data)
      }
    },
    components: {
      'v-drag': drag
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .iconDisplay
    width: 70px
    height: 92px
    .iconImg
      width: 70px
      height: 50px
    & > span
      width 60px
      display block
      margin-left 5px
      font-size 12px
      text-align center
      color #fff
      margin-top 10px
</style>
