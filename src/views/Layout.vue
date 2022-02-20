<template>
    <!-- 顶部导航 -->
    <appNavbar></appNavbar>
    <!-- 吸顶 -->
    <app-header-sticky></app-header-sticky>
    <!-- 头部 -->
    <app-header></app-header>
    <!-- 二级路由容器 -->
    <main class="main">
        <router-view></router-view>
    </main>
    <!-- 底部 -->
    <app-footer></app-footer>
</template>

<script>
import appNavbar from '@/components/app-navbar'
import appHeader from '@/components/app-header.vue'
import appFooter from '@/components/app-footer'
import appHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    appNavbar,
    appHeader,
    appFooter,
    appHeaderSticky
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang='less'>
.main{
    min-height: 600px;
}
</style>
