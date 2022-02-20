<template>
  <div class="home-banner">
    <XtxCarousel :sliders="sliders" :duration="2000" :autoPlay="true"/>
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { ref } from '@vue/reactivity'
export default {
  name: 'HomeBanner',
  setup () {
    const sliders = ref([])
    findBanner().then(res => {
      sliders.value = res.result
    })

    return {
      sliders
    }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  /deep/ .xtx-carousel {
    .prev {
      left: 270px;
    }
    .carousel-indicator {
    padding-left: 250px;
  }
  }
}
</style>
