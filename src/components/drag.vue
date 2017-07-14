<template>
  <div class="myDragCon" :dragIndex="dragIndex" :dataSrc="src" ref="myDragCon" :class="{displayBlock: showIndex.indexOf(dragIndex)!==-1, displayNone: showIndex.indexOf(dragIndex)===-1}">
    <div class="myDrag" ref="drag" :style="dragStyle">
      <div class="dragTitle" onslectstart="return false">
        <a href="javascript:;" title='关闭' class="close" @click.stop="closeDrag">
          <img src="../common/img/close.png"/>
        </a>
        <a href="javascript:;" title='最大化' class="maximization" @click="maximization" v-if="redu_max===true">
          <img src="../common/img/maximization.png"/>
        </a>
        <a href="javascript:;" title='还原' class="maximization" @click="remaximi" v-else="redu_max===false">
          <img src="../common/img/reduction.png"/>
        </a>
        <a href="javascript:;" title='最小化' class="minimize" @click="minimize">
          <img src="../common/img/minimize.png"/>
        </a>
      </div>
      <div class="dragContent" ref="dragContent">
        <iframe v-if="showIndex.indexOf(dragIndex)!==-1"  name="myIframe"
                :src="src" :width="dragConW" :height="dragConH"></iframe>
        <iframe v-else  name="myIframe"
                 :src="dataSrc" :width="dragConW" :height="dragConH"></iframe>
        <div class="dragCon-mask" id="mask" v-show="isShowBac" onslectstart="return false"></div>
      </div>
    </div>
    <div class="drag-mask" v-show="isShowBac" onslectstart="return false" onmousemove="event.returnValue=false;"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import Velocity from 'velocity-animate'

  export default {
    props: ['src', 'dragNum', 'whetherShow', 'activeName', 'dragIndex', 'showIndex'],
    data () {
      return {
        isShow: false,
        mouseOffsetX: 0,   // 鼠标偏移量
        mouseOffsetY: 0,
        isDraging: false,  // 是否可拖动
        isShowBac: false,  // 是否显示ragCon-mask和drag-mask，防止鼠标选中
        redu_max: true,
        dragStyle: {
          width: 800 + 'px',
          height: 428 + 'px',
          left: 0,
          top: 0
        },
        emitData: [],
        dragConW: 800, // 悬浮层content的width
        dragConH: 400,  // 悬浮层content的height
        dataSrc: ''
      }
    },
    watch: {
      // 监控dragNum的变化，触发下列操作
      'dragNum': function (val, oldValue) {
        if (this.whetherShow === 0) {
          this.isShow = true
          this.$nextTick(() => {
            this.setStyle()
            this.emitData.length = 0
            this.emitData.push(true)
            this.emitData.push(this.src)
            this.emitData.push(1)
            this.emitData.push(this.activeName)
            this.$emit('is_max_redu', this.emitData)
          })
        } else {
          this.isShow = false
          this.emitData.length = 0
          this.emitData.push(true)
          this.emitData.push(this.src)
          this.emitData.push(0)
          this.$emit('is_max_redu', this.emitData)
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.drapMousedown()
      })
    },
    methods: {
      closeDrag: function () {
//        document.getElementById('myIframe').src = ''
        let spliceIndex = this.showIndex.indexOf(this.dragIndex)
        console.log(this.showIndex)
        console.log(this.showIndex.length)
        console.log(this.showIndex[1])
        this.showIndex.splice(spliceIndex, 1)
        this.isShow = false
        this.redu_max = true
        let drSwidth = 800 + 'px'
        let drSheight = 428 + 'px'
        let bodyW = document.documentElement.clientWidth
        let bodyH = document.documentElement.clientHeight
        let drSleft = (bodyW - 800) / 2 + 'px'
        let drStop = (bodyH - 428) / 2 + 'px'
        let drCw = 800
        let drCh = 400
        Velocity($('.myDrag'), {width: drSwidth, height: drSheight, left: drSleft, top: drStop}, 500)
        Velocity($('.myIframe'), {width: drCw, height: drCh}, 500)
        this.emitData.length = 0
        this.emitData.push(false)
        this.emitData.push('')
        this.emitData.push(1)
        this.emitData.push('')
        this.$emit('is_max_redu', this.emitData)
        this.dragStyle.width = 800 + 'px'
        this.dragStyle.height = 428 + 'px'
        this.dragStyle.left = 0
        this.dragStyle.top = 0
        this.dragConW = 800
        this.dragConH = 400
//        this.emitData.length = 0
//        this.emitData.push(false)
//        this.emitData.push('')
//        this.emitData.push(1)
//        this.emitData.push('')
        this.$emit('is_max_redu', this.emitData)
        this.$emit('newShowIndex', this.showIndex)
      },
      setStyle: function () {
        let bodyW = document.documentElement.clientWidth
        let bodyH = document.documentElement.clientHeight
        let dragW = this.$refs.drag.offsetWidth
        let dragH = this.$refs.drag.offsetHeight
        this.dragStyle.left = (bodyW - dragW) / 2 + 'px'
        this.dragStyle.top = (bodyH - dragH) / 2 + 'px'
      },
      drapMousedown: function () {
        this.$refs.drag.addEventListener('mousedown', (e) => {
          this.isShowBac = true
          let ee = e || window.event
          this.mouseOffsetX = ee.pageX - this.$refs.drag.offsetLeft
          this.mouseOffsetY = ee.pageY - this.$refs.drag.offsetTop
          this.isDraging = true
          //  鼠标事件2 － 鼠标移动时（要检测，元素是否可标记为移动，如果是，则更新元素的位置，到当前鼠标的位置［ps：要减去第一步中获得的偏移］）
          document.onmousemove = (e) => {
            let ee = e || window.event
            let mouseX = ee.pageX   // 鼠标当前的位置
            let mouseY = ee.pageY

            let moveX = 0  //  浮层元素的新位置
            let moveY = 0
            if (this.isDraging === true) {
              moveX = mouseX - this.mouseOffsetX
              moveY = mouseY - this.mouseOffsetY
              let pageWidth = document.documentElement.clientWidth
              let pageHeight = document.documentElement.clientHeight

              let dialogWidth = this.$refs.drag.offsetWidth
              let dialogHeight = this.$refs.drag.offsetHeight

              let maxX = pageWidth - dialogWidth
              let maxY = pageHeight - dialogHeight

              moveX = Math.min(maxX, Math.max(0, moveX))
              moveY = Math.min(maxY, Math.max(0, moveY))
              this.dragStyle.left = moveX + 'px'
              this.dragStyle.top = moveY + 'px'
            }
          }
          //  鼠标事件3 － 鼠标松开的时候（标记元素为不可拖动即可）
          document.onmouseup = () => {
            this.isDraging = false
            this.isShowBac = false
          }
        })
      },
      maximization: function () {
        let drSwidth = document.documentElement.clientWidth + 'px'
        let drSheight = document.documentElement.clientHeight + 'px'
        let drSleft = 0
        let drStop = 0
        let drCw = document.documentElement.clientWidth - 6
        let drCh = document.documentElement.clientHeight - 30
        Velocity($('.myDrag'), {width: drSwidth, height: drSheight, left: drSleft, top: drStop}, 500)
        Velocity($('.myIframe'), {width: drCw, height: drCh}, 500)
        this.redu_max = false
      },
      minimize: function () {
        this.isShow = false
        this.emitData.length = 0
        this.emitData.push(true)
        this.emitData.push(this.src)
        this.emitData.push(0)
        this.emitData.push(this.activeName)
        this.$emit('is_max_redu', this.emitData)
//        document.getElementById('myIframe').src = ''
      },
      remaximi: function () {
        let drSwidth = 800 + 'px'
        let drSheight = 428 + 'px'
        let bodyW = document.documentElement.clientWidth
        let bodyH = document.documentElement.clientHeight
        let dragW = 800
        let dragH = 428
        let drSleft = (bodyW - dragW) / 2 + 'px'
        let drStop = (bodyH - dragH) / 2 + 'px'
        let drCw = 800
        let drCh = 400
        Velocity($('.myDrag'), {width: drSwidth, height: drSheight, left: drSleft, top: drStop}, 500)
        Velocity($('.myIframe'), {width: drCw, height: drCh}, 500)
        this.redu_max = true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .myDrag
    position absolute
    top 0
    left 0
    z-index 9000
    background #fff
    &.displayBlock
      display: block
    &.displayNone
      display: none
    .dragTitle
      width 100%
      height 30px
      background-color #467cd4
      float left
      cursor move
      & > a
        width 20px
        height 30px
        line-height 30px
        float right
        display block
        margin 0 5px
        color #fff
        cursor pointer
        text-decoration none
      & > a:hover
        background-color #5989d8
      .minimize > img
        margin-bottom 5px
    .dragContent
      position relative
      float left
      .myIframe
        border none !important
      .dragCon-mask
        width 100%
        height 100%
        background: #fff
        opacity: 0
        filter: Alpha(opacity=0)
        position: absolute
        top: 0
        left: 0
        z-index: 8000
  .drag-mask
    width 100%
    height 100%
    background: #fff
    opacity: 0
    filter: Alpha(opacity=0)
    position: absolute
    top: 0
    left: 0
    z-index: 7000
</style>
