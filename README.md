# popup
用vue实现弹出层
第一层全屏，里面放图片和按钮列表
第二层刚打开时width 600 height 400,可以全屏 缩小，可以拖动

问题：
1、桌面显示后，官网首页滚动条消失-----$('#nv_portal').css('overflow', 'hidden')
   关闭后：$('#nv_portal').css('overflow', 'visible')
2、最大化窗口，搞定
