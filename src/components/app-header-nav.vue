<template>
  <ul class="navs">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <li v-for="(item,) in catList" :key="item.id"  @mousemove="show(item)" @mouseleave="hide(item)">
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{ item.name }}</router-link>
      <div class="layer" :class="{active:item.open}">
        <ul>
          <li v-for="pic in item.children" :key="pic.id">
            <router-link :to="`/category/sub/${pic.id}`"  @click="hide(item)" >
              <img :src="pic.picture" alt="" />
              <p>{{ pic.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  setup () {
    const store = useStore()
    const catList = computed(() => store.state.category.list)

    const show = (item) => {
      store.commit('category/show', item.id)
    }
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return {
      catList, show, hide
    }
  }
}
</script>

<style lang='less' scoped>
.active {
  color: @xtxColor;
  border-bottom: 1px solid @xtxColor;
}
.navs {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 100;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
}
// 二级类目弹层
.layer {
  &.active{
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
