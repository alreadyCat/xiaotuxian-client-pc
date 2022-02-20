<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <home-banner></home-banner>
      </div>
    </div>
    <!-- 新鲜好物 -->
    <home-new></home-new>
    <!-- 人气爆款 -->
    <home-hot></home-hot>
    <!-- 热门品牌 -->
    <home-brand></home-brand>
    <!-- 商品区域 -->
    <home-product></home-product>
    <!-- 最新专题 -->
    <home-special></home-special>
  </div>
</template>
<script>
import HomeCategory from './components/home-category'
import homeBanner from '@/views/home/components/home-banner'
import HomeNew from './components/home-new.vue'
import homeHot from '@/views/home/components/home-hot'
import homeBrand from '@/views/home/components/home-brand'
import HomeProduct from './components/home-product.vue'
import homeSpecial from '@/views/home/components/home-special'
export default {
  name: 'PageHome',
  components: { HomeCategory, homeBanner, HomeNew, homeHot, homeBrand, HomeProduct, homeSpecial }
}
</script>
<style scoped lang="less">

</style>
