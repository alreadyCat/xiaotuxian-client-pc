<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/" v-if="goods">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <GoodsName :goods="goods"></GoodsName>
          <GoodsSku :goods="goods" @change="changeSpu"></GoodsSku>
          <xtx-numbox
            v-model="count"
            :max="goods.inventory"
            title="数量"
          ></xtx-numbox>
          <xtx-button type="primary">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant v-if="goods" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs></GoodsTabs>
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <goods-waring></goods-waring>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot title="24小时热榜" :type="1"></GoodsHot>
          <GoodsHot title="周热销榜" :type="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue-demi'
import GoodsRelevant from './components/goods-relevant'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from '@/views/goods/components/goods-sku'
import GoodsTabs from '@/views/goods/components/goods-tabs'
import GoodsHot from '@/views/goods/components/goods-hot'
import goodsWaring from '@/views/goods/components/goods-waring'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    goodsWaring
  },
  setup () {
    const goods = getGoods()
    // 子组件sku组件选择完了属性，返回给此显示
    const changeSpu = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }

    // 选择的数量
    const count = ref(0)

    // 给后代组件提供数据
    provide('goods', goods)
    return {
      goods,
      changeSpu,
      count
    }
  }
}
const getGoods = () => {
  const route = useRoute()
  const goods = ref(null)
  watch(
    () => route.params.id,
    (newId) => {
      if (newId && `/product/${newId}` === route.path) {
        goods.value = null
        nextTick(() => {
          findGoods(route.params.id).then((res) => {
            goods.value = res.result

            console.log(goods.value)
          })
        })
      }
    },
    { immediate: true }
  )

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
    .xtx-button {
      margin-top: 20px;
    }
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
