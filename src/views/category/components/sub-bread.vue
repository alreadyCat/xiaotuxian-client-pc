<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="cateInfo.L1" :to="`/category/${cateInfo.L1.id}`">{{cateInfo.L1.name}}</XtxBreadItem>

    <transition name="fade-right" mode="out-in">
        <XtxBreadItem v-if="cateInfo.L2" :to="`/category/sub/${cateInfo.L2.id}`"  :key="cateInfo.L2.id">{{cateInfo.L2.name}}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>
<script>
import { ref, watch } from 'vue-demi'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',

  setup () {
    const store = useStore()
    const route = useRoute()
    const cateInfo = ref({})
    watch(() => route.params.id, () => {
      store.state.category.list.forEach(L1 => {
        if (L1) {
          const findL2 = L1.children.find(L2 => L2.id === route.params.id)
          if (findL2) {
            cateInfo.value = {
              L1: {
                name: L1.name,
                id: L1.id
              },
              L2: {
                name: findL2.name,
                id: findL2.id
              }
            }
          }
        }
      })
    }, { immediate: true })

    return {
      cateInfo
    }
  }
}
</script>
<style scoped lang="less"></style>
