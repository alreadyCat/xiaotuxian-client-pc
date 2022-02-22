<template>
  <div class="goods-hot" v-if="list">
    <h3>{{title}}</h3>
    <goods-item v-for="item in list" :key="item.id" :info='item'></goods-item>
  </div>
</template>
<script>
import GoodsItem from '@/views/category/components/goods-item'
import { findHotGoods } from '@/api/product'
import { ref } from 'vue-demi'
import { useRoute } from 'vue-router'
export default {
  name: 'GoodsHot',
  components: {
    GoodsItem
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const list = ref(null)
    const route = useRoute()
    findHotGoods({
      id: route.params.id,
      type: props.type
    }).then(({ result }) => {
      list.value = result
    })

    return { list }
  }
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
