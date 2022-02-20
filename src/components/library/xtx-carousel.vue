<template>
  <div class='xtx-carousel' @mouseenter="pause" @mouseleave="start">
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(pic,index) in sliders" :key="index" :class="{fade:currentInd === index}">
        <RouterLink to="/">
          <img :src="pic.imgUrl" alt="">
        </RouterLink>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="prev"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:;" class="carousel-btn next" @click="next"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <!-- active---激活类名 -->
      <span v-for="(i,index) in sliders" :key="index" :class="{active:currentInd === index}" @click="change(index)"></span>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { onUnmounted } from '@vue/runtime-core'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  setup (props) {
    const currentInd = ref(0)

    let timer = null

    // 开始
    const start = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        next()
      }, props.duration)
    }
    start()

    const next = () => {
      currentInd.value = currentInd.value >= props.sliders.length - 1 ? 0 : currentInd.value + 1
    }
    const prev = () => {
      currentInd.value = currentInd.value === 0 ? props.sliders.length - 1 : currentInd.value - 1
    }

    const change = (index) => {
      currentInd.value = index
    }

    // 暂停
    const pause = () => {
      clearInterval(timer)
    }

    onUnmounted(() => {
      timer = null
    })

    return {
      currentInd,
      next,
      prev,
      timer,
      change,
      pause,
      start
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
