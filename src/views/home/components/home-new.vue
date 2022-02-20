<template>
  <div class="home-new" ref="target">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template v-slot:right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <transition name="fade">
        <ul class="goods-list" v-if="newList.length">
          <li v-for="item in newList" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>

        <home-skeleton bg='#f0f9f4' v-else></home-skeleton>
      </transition>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from '@/views/home/components/home-panel'
import homeSkeleton from '@/views/home/components/home-skeleton'
import { findNew } from '@/api/home'
import { ref } from '@vue/reactivity'
import { useLazyData } from '@/hooks'

export default {
  components: { HomePanel, homeSkeleton },
  setup () {
    // const newList = ref([])
    // findNew().then(
    //   (res) => {
    //     console.log(res)
    //     newList.value = res.result
    //   },
    //   (err) => {
    //     console.log(err, '获取人新品推荐失败')
    //   }
    // )
    const target = ref(null)
    const newList = useLazyData(target, findNew)
    return {
      newList,
      target
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
