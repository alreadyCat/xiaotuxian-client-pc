<template>
  <div class='sub-sort'>
    <div class="sort">
      <a href="javascript:;" @click="sortParams.sortField = null" :class="{active:sortParams.sortField === null}">默认排序</a>
      <a href="javascript:;" @click="sortParams.sortField = 'publishTime'" :class="{active:sortParams.sortField === 'publishTime'}">最新商品</a>
      <a href="javascript:;" @click="sortParams.sortField = 'orderNum'" :class="{active:sortParams.sortField === 'orderNum'}">最高人气</a>
      <a href="javascript:;" @click="sortParams.sortField = 'evaluateNum'" :class="{active:sortParams.sortField === 'evaluateNum'}">评论最多</a>
      <a href="javascript:;" @click="sortPrice" >
        价格排序
        <i class="arrow up" @click="sortParams.sortMethod = 'asc'" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}"/>
        <i class="arrow down" @click="sortParams.sortMethod = 'desc'" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}"/>
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive, watch } from 'vue-demi'
import { useRoute } from 'vue-router'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    const route = useRoute()
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })
    // 价格排序  升序|降序
    const sortPrice = () => {
      sortParams.sortField = 'price'
      sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
    }
    // 监听路由发生改变，重置排序信息
    watch(() => route.params.id, () => {
      sortParams.sortField = null
      sortParams.sortMethod = 'desc'
    })

    // 监听排序条件改变，重新获取数据
    watch(() => sortParams, () => {
      emit('sortChange', sortParams)
    }, { deep: true })
    return {
      sortParams,
      sortPrice
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
