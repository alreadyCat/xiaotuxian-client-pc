<template>
  <div class="goods-image">
    <div class="large" :style="[{backgroundImage:`url(${images[currIndex]})`},{backgroundPositionX: `${largePosition.x}`},{backgroundPositionY: `${largePosition.y}`}]" v-show="showMask"></div>
    <div class="middle" @mousemove="move" @mouseenter="showMask = true" @mouseleave="showMask = false" ref="target">
        <img :src="images[currIndex]" alt="">
        <div class="layer" v-show="showMask" :style="[maskPosition]"></div>
    </div>
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)

    // 放大镜
    const showMask = ref(false)
    const target = ref(null)
    const { elementX, elementY } = useMouseInElement(target)

    const maskPosition = ref({
      top: '',
      left: ''
    })

    const largePosition = ref({ x: '', y: '' })

    const move = () => {
      let x = 0
      let y = 0
      if (elementX.value <= 100)x = 0
      else if (elementX.value >= 300)x = 200
      else x = elementX.value - 100

      if (elementY.value <= 100)y = 0
      else if (elementY.value >= 300)y = 200
      else y = elementY.value - 100

      maskPosition.value = {
        top: y + 'px',
        left: x + 'px'
      }
      largePosition.value = {
        x: -x * 2 + 'px',
        y: -y * 2 + 'px'
      }
    }
    return { currIndex, showMask, target, maskPosition, move, largePosition }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
 .large {
   position: absolute;
   top: 0;
   left: 412px;
   width: 400px;
   height: 400px;
   box-shadow: 0 0 10px rgba(0,0,0,0.1);
   background-repeat: no-repeat;
   background-size: 800px 800px;
   background-color: #f8f8f8;
 }

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
