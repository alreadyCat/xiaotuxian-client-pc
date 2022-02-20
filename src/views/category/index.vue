<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition mode="out-in" name="fade-right">
          <XtxBreadItem :key="topCategory">{{ topCategory.name }}</XtxBreadItem>
        </transition>

      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list" v-if="topCategory">
        <h3>全部分类</h3>
        <ul>
          <li v-for="i in topCategory.children" :key="i">
            <a href="javascript:;">
              <img :src="i.picture" />
              <p>空调</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id" >
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">{{item.desc}}</p>
          <XtxMore />
        </div>
        <div class="body">
          <goods-item v-for="good in item.goods" :key="good.id" :info='good'></goods-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue-demi'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import goodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  components: { goodsItem },
  name: 'TopCategory',
  setup () {
    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // 全部分类
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      return store.state.category.list.find(item => item.id === route.params.id)
    })

    // 不同分类商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(res => {
        subList.value = res.result.children
      }, err => {
        console.log(err, '获取不同分类商品失败')
      })
    }

    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/${newVal}` === route.path) { newVal && getSubList() }
    }, {
      immediate: true
    })
    return { sliders, topCategory, subList, getSubList }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
