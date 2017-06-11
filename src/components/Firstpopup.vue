<template>
  <div id="firstPopup" :style="firstPopupStyle">
    <div class="iconList" id="iconList">
      <ul id="iconUl" :class="iconsize" class="iconUl" ref="iconUl">
        <li v-for="(appli, index) in appliList" class="iconLi" ref="iconLi" @click="showSecondPopup(appli.url)">
          <div>
            <img :src="appli.icon"/>
          </div>
          <span>{{appli.name}}</span>
        </li>
      </ul>
    </div>
    <div class="pailie" :class="plchioce">
      <a v-show="isAshow" @click="recovery">我是最小化</a>
      <span @click="chagecolumn">横向排列</span>
      <em @click="chageline">纵向排列</em>
    </div>
    <v-drag :src="src" :tNum="tNum" :ifShow="ifShow" @change-isAshow="changeIsAshow"></v-drag>
  </div>
</template>

<script type="text/ecmascript-6">
  import drag from './Drag'
  export default {
    name: 'firstPopup',
    data () {
      return {
        isAshow: false,
        ifMin: '', // 是否最小化
        src: '',
        tNum: {
          type: Number,
          value: 0
        },
        ifShow: 0, // 0表示显示，1表示不显示
        appliList: [],
        iconsize: 'smallSize',
        firstPopupStyle: {
          height: document.documentElement.clientHeight + 'px',
          width: document.documentElement.clientWidth + 'px'
        },
        firstPopupLi: {
          width: '',
          height: ''
        },
        plchioce: 'line',
        emitSrc: '' // 子组件传过来的src
      }
    },
    components: {
      'v-drag': drag
    },
    mounted () {
      this.$http.get('/api/application').then((response) => {
        this.appliList = response.body.data
        this.$nextTick(() => {
          if (this.plchioce === 'line') {
            this.operationLineUl()
          } else if (this.plchioce === 'column') {
            this.operationColumnUl()
          }
        })
      })
      var that = this
      window.onresize = () => {
        that.firstPopupStyle.width = document.documentElement.clientWidth + 'px'
        that.firstPopupStyle.height = document.documentElement.clientHeight + 'px'
        if (this.plchioce === 'line') {
          this.operationLineUl()
        } else if (this.plchioce === 'column') {
          this.operationColumnUl()
        }
      }
    },
    updated () {
      this.firstPopupLi.width = window.getComputedStyle(this.$refs.iconLi[0]).width
      this.firstPopupLi.height = window.getComputedStyle(this.$refs.iconLi[0]).height
    },
    methods: {
      showSecondPopup: function (url) {
        this.src = url + '?time=' + Math.random()
        this.tNum += 1
        this.ifShow = 0
        this.isAshow = true
      },
      hideSecondPopup: function () {
        this.src = this.src
        this.tNum += 1
        this.ifShow = 1
      },
//      设置ul的高度--纵向排列
      operationLineUl: function () {
//        一列可放的li数量
        let lineNumber = Math.floor(parseInt(this.firstPopupStyle.height) / parseInt(Number(this.firstPopupLi.height.split('p')[0]) + Number(15)))
//        页内显示的li的列数
        let columnNumber = Math.floor(this.$refs.iconLi.length / lineNumber)
        this.operationLi(this.$refs.iconLi, lineNumber, columnNumber, 'line')
      },
//      设置ul的高度--横向排列
      operationColumnUl: function () {
//        一行可放的li数量
        let columnNumber = Math.floor((Number(this.firstPopupStyle.width.split('p')[0]) + 10) / (Number(this.firstPopupLi.width.split('p')[0]) + 20))
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
            li[i].style.left = (parseInt(this.firstPopupLi.width.split('p')[0]) + parseInt(10) + 2) * Math.floor(i / lineNumber) + (10 * iLineNum) + 'px'
            li[i].style.top = (lineCount === 0 ? 15 + 'px' : ((parseInt(this.firstPopupLi.height.split('p')[0]) + 2 + parseInt(15)) * lineCount + 15 + 'px'))
            lineCount >= lineNumber - 1 ? lineCount = 0 : lineCount++
          }
        } else if (state === 'column') {
          for (let i = 0; i < li.length; i++) {
//            数量/一列li数 取整 =当前模块的left值
            li[i].style.left = lineCount === 0 ? 10 + 'px' : ((parseInt(this.firstPopupLi.width) + 22) * lineCount) + 'px'
      //      console.log(lineCount)
            console.log(Math.floor(i / columnNumber))
            li[i].style.top = Math.floor(i / columnNumber) < 1 ? 15 + 'px' : (parseInt(this.firstPopupLi.height.split('p')[0]) + 2 + 15) * Math.floor(i / columnNumber) + 15 + 'px'
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
      changeIsAshow: function (data) {
        this.ifMin = data[2]
        this.isAshow = data[0]
        if (data[1]) {
          this.emitSrc = data[1]
        }
      },
      recovery: function () {
        if (this.ifMin === 0) {
          this.showSecondPopup(this.emitSrc)
        } else {
          this.hideSecondPopup()
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  #firstPopup
    position relative
    overflow hidden
    background-image url("/static/img/background.png")
    background-size cover
    background-position 0 0
    background-repeat no-repeat
    .pailie
      right 0
      bottom 0
      position absolute
      border 1px #eee solid
      display block
      em
      span
      a
        padding 5px
        font-style normal
        display inline-block
        cursor pointer
      &.column
        span
          background-color #E4393C
          color white
      &.line
        em
          background-color #E4393C
          color white
    .iconList
      height 100%
      & > ul
        height 100%
        position relative
      & > ul.smallSize > li
        width 73px
        height 88px
      & > ul.middleSize > li
        width 85px
        height 85px
      & > ul.bigSize > li
        width 100px
        height 100px
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
        & > div > img
          width 50px
          height 50px
        & > span
          width 60px
          display block
          margin-left 5px
          font-size 12px
          text-align center
          color #fff
</style>

