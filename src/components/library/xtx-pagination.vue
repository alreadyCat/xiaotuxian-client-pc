<template>
  <div class="xtx-pagination">
    <a href="javascript:;" :class="{disabled:currentPage === 1}" @click="nextAndprev(-1)">上一页</a>
    <span v-if="!pager.showPageArray.includes(1)">...</span>
    <a href="javascript:;" :class="{active:page === currentPage}" v-for="(page,index) in pager.showPageArray" :key="index" @click="pageJump(page)">{{page}}</a>
    <span v-if="!pager.showPageArray.includes(pager.pageTotal)">...</span>
    <a href="javascript:;" :class="{disabled:currentPage === pager.pageTotal}" @click="nextAndprev(1)">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue-demi'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currPage: {
      default: 1,
      type: Number
    },
    button: {
      default: 5,
      type: Number
    }
  },
  setup (props, { emit }) {
    // 需要数据
    /**
     *  1：按钮的个数
     *  2：当前页码
     *  3：多少页
     *
     *
     */
    const buttons = ref(5)
    const currentPage = ref(3)
    const total = ref(53)
    const pageSize = ref(10)

    const pager = computed(() => {
      const pageTotal = Math.ceil(total.value / pageSize.value)
      const showPageArray = []

      if (pageTotal <= buttons.value) {
        for (let i = 0; i < pageTotal; i++) {
          showPageArray[i] = i + 1
        }
      } else {
        if (currentPage.value <= Math.ceil(buttons.value / 2)) {
          for (let i = 0; i < pageTotal && i < buttons.value; i++) {
            showPageArray[i] = i + 1
          }
        } else if (currentPage.value > pageTotal - Math.ceil(buttons.value / 2)) {
          for (let i = 0; i < pageTotal && i < buttons.value; i++) {
            showPageArray[i] = pageTotal - (buttons.value - 1) + i
          }
        } else {
          for (let i = 0; i < pageTotal && i < buttons.value; i++) {
            showPageArray[i] = currentPage.value + i - Math.ceil(buttons.value / 2)
          }
        }
      }
      return {
        pageTotal,
        showPageArray
      }
    })

    const nextAndprev = (n) => {
      // console.log(currentPage.value)
      if (currentPage.value + n < 1 || currentPage.value + n > pager.value.pageTotal) return

      currentPage.value = currentPage.value + n
    }

    const pageJump = (n) => {
      if (currentPage.value === n) return
      currentPage.value = n
    }

    watch(props, () => {
      currentPage.value = props.currPage
      total.value = props.total
      buttons.value = props.button
      pageSize.value = props.pageSize
    }, { immediate: true })

    watch(currentPage, () => {
      emit('currentChange', currentPage.value)
    })
    return {
      buttons,
      pager,
      currentPage,
      nextAndprev,
      pageJump
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
