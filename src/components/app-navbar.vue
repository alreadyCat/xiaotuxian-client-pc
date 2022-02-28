<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li><router-link to='/member'><i class="iconfont icon-user"></i>{{profile.nickname}}</router-link></li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li>
            <router-link to="/login">请先登录</router-link>
            <!-- <a href="javascript:;">请先登录</a> -->
          </li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed, getCurrentInstance } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup () {
    const store = useStore()
    const router = useRouter()
    const profile = computed(() => store.state.user.profile)
    const { proxy } = getCurrentInstance()
    const logout = () => {
      store.commit('user/setProfile', {})
      const currentPath = encodeURIComponent(router.currentRoute.value.fullPath)
      store.commit('cart/setCart', [])
      router.push(`/login?redirectUrl=${currentPath}`)
      proxy.$message({ type: 'success', text: '退出成功' })
    }
    return { profile, logout }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
    //   less ~选择器： 选择当前元素后的所有兄弟元素
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
