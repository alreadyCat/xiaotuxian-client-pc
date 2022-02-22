<template>
  <div class="goods-tabs">
    <nav>
      <a  href="javascript:;" :class="{active:whichComponent==='detail'}" @click="activate('detail')">商品详情</a  >
      <a href="javascript:;" :class="{active:whichComponent==='comment'}" @click="activate('comment')">商品评价<span>({{goods.commentCount}}+)</span></a>
    </nav>
    <!-- 这个位置显示对应的组件 GoodsDetail 或者 GoodsComment -->
    <keep-alive>
        <component :is='whichComponent'></component>
    </keep-alive>

  </div>
</template>
<script>
import { inject, ref } from 'vue-demi'
import GoodsComment from '@/views/goods/components/goods-comment'
import GoodsDetail from '@/views/goods/components/goods-detail'
export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail, GoodsComment
  },
  setup () {
    const whichComponent = ref('GoodsDetail')
    const activate = (name) => {
      whichComponent.value = name === 'detail' ? 'GoodsDetail' : 'GoodsComment'
    }
    const goods = inject('goods')
    return {
      whichComponent,
      activate,
      goods
    }
  }
}
</script>
<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
