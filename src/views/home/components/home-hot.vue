<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过" ref="target">
      <transition name="fade">
        <ul ref="pannel" class="goods-list" v-if="hotList.length" >
            <li v-for="item in hotList" :key="item.id">
                <RouterLink to="/">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
                </RouterLink>
            </li>
        </ul>
        <home-skeleton v-else></home-skeleton>
      </transition>
  </HomePanel>
</template>

<script>
import HomePanel from '@/views/home/components/home-panel'
import homeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { ref } from '@vue/reactivity'
import { useLazyData } from '@/hooks'
export default {
  components: {
    HomePanel,
    homeSkeleton
  },
  setup () {
    // const hotList = ref([])
    // findHot().then(
    //   (res) => {
    //     hotList.value = res.result
    //   },
    //   (err) => {
    //     console.log(err, '获取人气爆款失败')
    //   }
    // )
    const target = ref(null)
    const hotList = useLazyData(target, findHot)
    return {
      target,
      hotList
    }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
