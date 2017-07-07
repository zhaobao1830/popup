<template>
  <div class="myDesktop" :style="desktopStyle">
    <div class="iconList" id="iconList">
      <ul id="iconUl" class="iconUl iconSize" ref="iconUl">
        <li v-for="(appli, index) in appliList" ref="iconLi" @click="showDrag(appli.name,appli.url)"
            :class="{active: activeName === appli.name}">
          <div>
            <img :src="appli.icon"/>
          </div>
          <span>{{appli.name}}</span>
        </li>
      </ul>
    </div>
    <v-drag :src="src" :dragNum="dragNum" :whetherShow="whetherShow" :activeName="activeName" @is_max_redu="max_redu"></v-drag>
    <div class="operation" ref="operation" :style="operationStyle">
      <span v-show="redu_max" @click="recovery">最小化</span>
      <span class="line" @click="chageline"></span>
      <span class="column" @click="chagecolumn"></span>
      <span class="close" @click="myAppClose"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import drag from './drag'
  import dataJson from '../common/data/data.json'

  export default {
    data () {
      return {
        appliList: [], // 保存请求返回的数据
        desktopStyle: {
          height: document.documentElement.clientHeight + 'px',
          width: document.documentElement.clientWidth + 'px'
        },
        redu_max: false,
        ifMin: '', // 是否最小化
        src: '', // iframe的src
        dragNum: { // 随意定义的，点击icon，自动+1,传给子类
          type: Number,
          value: 0
        },
        whetherShow: 0, // 0显示，1不显示 判断drag层是否显示
        desktopLi: {  //  图标li样式
          width: '',
          height: ''
        },
        operationStyle: {  // operation(操作)样式
          left: ''
        },
        plchioce: 'line', // line 纵向排列，column 横向排列
        emitSrc: '', // 子组件传过来的src
        activeName: '' // 点击li时的name值
      }
    },
    components: {
      'v-drag': drag
    },
    mounted () {
//      this.$http.get('/api/application').then((response) => {
//        this.appliList = response.body.data
//        this.$nextTick(() => {
//          if (this.plchioce === 'line') {
//            this.operationLineUl()
//          } else if (this.plchioce === 'column') {
//            this.operationColumnUl()
//          }
//          this.setOperation()
//        })
//      })
      this.appliList = dataJson.application
      this.$nextTick(() => {
        if (this.plchioce === 'line') {
          this.operationLineUl()
        } else if (this.plchioce === 'column') {
          this.operationColumnUl()
        }
        this.setOperation()
      })
      var that = this
      window.onresize = () => {
        that.desktopStyle.width = document.documentElement.clientWidth + 'px'
        that.desktopStyle.height = document.documentElement.clientHeight + 'px'
        if (this.plchioce === 'line') {
          this.operationLineUl()
        } else if (this.plchioce === 'column') {
          this.operationColumnUl()
        }
        this.setOperation()
      }
    },
    updated () {
      this.desktopLi.width = window.getComputedStyle(this.$refs.iconLi[0]).width
      this.desktopLi.height = window.getComputedStyle(this.$refs.iconLi[0]).height
    },
    methods: {
      showDrag: function (activeName, url) {
        // this.src加time的作用：给ser加随机参数，drag页面进行比较
        this.src = url + '?time=' + Math.random()
        this.dragNum += 1
        this.whetherShow = 0
        this.redu_max = true
        this.activeName = activeName
      },
      hideSecondPopup: function () {
        this.src = this.src
        this.dragNum += 1
        this.whetherShow = 1
      },
//      设置ul的高度--纵向排列
      operationLineUl: function () {
//        一列可放的li数量
        let lineNumber = Math.floor(parseInt(this.desktopStyle.height) / parseInt(Number(this.desktopLi.height.split('p')[0]) + 15))
//        页内显示的li的列数
        let columnNumber = Math.floor(this.$refs.iconLi.length / lineNumber)
        this.operationLi(this.$refs.iconLi, lineNumber, columnNumber, 'line')
      },
//      设置ul的高度--横向排列
      operationColumnUl: function () {
//        一行可放的li数量
        let columnNumber = Math.floor((Number(this.desktopStyle.width.split('p')[0]) + 10) / (Number(this.desktopLi.width.split('p')[0]) + 20))
//        页内显示的li的行数
        let lineNumber = Math.floor(this.$refs.iconLi.width / columnNumber)

        this.operationLi(this.$refs.iconLi, lineNumber, columnNumber, 'column')
      },
//      设置li的定位
      operationLi: function (li, lineNumber, columnNumber, state) {
        let lineCount = 0
        let iLineNum = 1
        if (state === 'line') {
          for (let i = 0; i < li.length; i++) {
            Math.floor(i / lineNumber) < 1 ? iLineNum = 1 : iLineNum = 2
//            数量/一列li数 取整 =当前模块的left值
            li[i].style.left = (parseInt(this.desktopLi.width.split('p')[0]) + parseInt(10) + 2) * Math.floor(i / lineNumber) + (10 * iLineNum) + 'px'
            li[i].style.top = (lineCount === 0 ? 15 + 'px' : ((parseInt(this.desktopLi.height.split('p')[0]) + 2 + 15) * lineCount + 15 + 'px'))
            lineCount >= lineNumber - 1 ? lineCount = 0 : lineCount++
          }
        } else if (state === 'column') {
          for (let i = 0; i < li.length; i++) {
//            数量/一列li数 取整 =当前模块的left值
            li[i].style.left = lineCount === 0 ? 10 + 'px' : ((parseInt(this.desktopLi.width) + 22) * lineCount) + 'px'
            li[i].style.top = Math.floor(i / columnNumber) < 1 ? 15 + 'px' : (parseInt(this.desktopLi.height.split('p')[0]) + 2 + 15) * Math.floor(i / columnNumber) + 15 + 'px'
            lineCount >= columnNumber - 1 ? lineCount = 0 : lineCount++
          }
        }
      },
      chageline: function () {
        this.plchioce = 'line'
        this.operationLineUl()
      },
      chagecolumn: function () {
        this.plchioce = 'column'
        this.operationColumnUl()
      },
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
      recovery: function () {
        if (this.ifMin === 0) {
          this.showDrag(this.activeName, this.emitSrc)
        } else {
          this.hideSecondPopup()
        }
      },
      setOperation: function () {
        let bodyWidth = document.documentElement.clientWidth
        let operationWidth = this.$refs.operation.offsetWidth
        this.operationStyle.left = (bodyWidth - operationWidth) / 2 + 'px'
      },
      myAppClose: function () {
        $('.myApp').removeClass('displayBlock').addClass('displayNone')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .myDesktop
    position relative
    overflow hidden
    background-image url("/static/img/background.png")
    background-size cover
    background-position 0 0
    background-repeat no-repeat
    .iconList
      height 100%
      & > ul
        height 100%
        position relative
      .active
        background-color rgba(255,255,255,0.5)
        border 1px solid #ffffff
      & > ul.iconSize > li
        width 68px
        height 92px
      & > ul > li
        list-style none
        overflow hidden
        cursor pointer
        text-align center
        position absolute
        transition .3s all ease-in-out
        border 1px solid transparent
        &:hover
          background-color rgba(255,255,255,0.5)
          border 1px solid #ffffff
        & > div
          width 70px
          height 50px
        & > span
          width 60px
          display block
          margin-left 5px
          font-size 12px
          text-align center
          color #fff
          margin-top 10px
    .operation
      width auto
      height 40px
      position fixed
      bottom 30px
      z-index 100
      left 0
      font-size: 0
      border-left: 1px solid rgba(255, 255, 255, 0.2)
      & > span
        display block
        float left
        width 94px
        height 38px
        line-height 38px
        text-align center
        border 1px solid rgba(255, 255, 255, 0.2)
        border-left 0 !important
        font-size 14px
        color rgba(255, 255, 255, 0.2)
        cursor pointer
        &:hover:before
          content ''
      .line:before
        content '纵向'
        background none
      .line:hover
        width 94px
        height 38px
        background url("/static/img/line.png") 0 0 no-repeat
      .column:hover
        width 94px
        height 38px
        background url("/static/img/column.png") 0 0 no-repeat
      .column:before
        content '横向'
        background none
      .close:before
        content '关闭'
      .close:hover
        background url("/static/img/colse.png") 0 0 no-repeat
</style>

