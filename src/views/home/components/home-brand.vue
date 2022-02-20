<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a href="javascript:;" :class="{disabled:page===0}"  class="iconfont icon-angle-left prev" @click="change(-1)"></a>
      <a href="javascript:;" :class="{disabled:page===1}"  class="iconfont icon-angle-right next" @click="change(1)"></a>
    </template>
    <div class="box" ref="target">
      <transition name="fade">
        <ul class="list" :style="{transform:`translateX(${-1240*page}px)`}" v-if="brandList.length">
            <li v-for="i in brandList" :key="i.id">
            <RouterLink to="/">
                <img :src="i.picture" alt="">
            </RouterLink>
            </li>
        </ul>
        <div v-else class="skeleton">
            <xtx-skeleton class="item" v-for="(i,index) in brandList.length" :key="index" animated bg="#e4e4e4" width="240px" height="305px"></xtx-skeleton>
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from './home-panel'
import { getBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
import { ref } from 'vue-demi'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    //  获取数据
    const target = ref(null)
    const brandList = useLazyData(target, () => getBrand(10))
    // const brandList = ref([])
    // getBrand(10).then(res => {
    //   brandList.value = res.result
    // })

    // 切换页码,要求只有两页 0 1
    const page = ref(0)
    const change = (p) => {
      if (page.value === 0 && p === 1) {
        page.value++
      } else if (page.value === 1 && p === -1) {
        page.value--
      }
    }

    return {
      brandList,
      page,
      change,
      target
    }
  }
}
</script>

<style scoped lang='less'>
.skeleton {
width: 100%;
display: flex;
.item {
    margin-right: 10px;
    &:nth-child(5n) {
    margin-right: 0;
    }
}
}
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
