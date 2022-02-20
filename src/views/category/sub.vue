<template>
  <div class="sub-filter"></div>
  <div class="container">
    <!-- 面包屑 -->
    <sub-bread></sub-bread>
    <!-- 筛选区 -->
    <sub-filter @brandIsChange='brandIsChange' @propIsChange='propIsChange'></sub-filter>
    <!-- 排序 -->
    <div class="goods-list">
      <!-- 排序 -->
      <sub-sort @sortChange='sortChange'></sub-sort>
      <!-- 列表 -->
      <ul>
        <li v-for="item in goods" :key="item.id">
          <GoodsItem :info="item" />
        </li>
      </ul>
      <xtx-infinite @infinite="getData" :loading="loading" :finished="finished" :key="Math.random()"></xtx-infinite>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from '@/views/category/components/sub-sort'
import GoodsItem from '@/views/category/components/goods-item'
import { ref, watch } from 'vue-demi'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup (props, { emit }) {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    let reqParams = {
      page: 1,
      pageSize: 10
    }
    const goods = ref([])

    // 无限加载数据
    const getData = () => {
      // 加载数据
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(res => {
        if (res.result.items.length) {
          goods.value.push(...res.result.items)
          reqParams.page++
        } else {
          // 没有数据了
          finished.value = true
        }

        loading.value = false
      }, err => {
        console.log(err, 'findSubCategoryGoods接口有误')
      })
    }

    // 路由变化，请求参数都要以及无限加载条件都要变化
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        loading.value = false
        reqParams = {
          page: 1,
          pageSize: 10
        }
        goods.value = []
      }
    })

    // 排序条件改变，重新获取数据
    const sortChange = (params) => {
      finished.value = false
      reqParams = { ...reqParams, ...params, page: 1 }
      goods.value = []
    }

    // 改变品牌，重新获取数据
    const brandIsChange = params => {
      finished.value = false
      reqParams = { ...reqParams, ...params, page: 1 }
      goods.value = []
    }

    // 改变属性
    const propIsChange = attrs => {
      finished.value = false
      console.log(attrs)
      reqParams = { ...reqParams, ...attrs, page: 1 }
      goods.value = []
    }
    return {
      getData,
      loading,
      finished,
      goods,
      sortChange,
      brandIsChange,
      propIsChange
    }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
