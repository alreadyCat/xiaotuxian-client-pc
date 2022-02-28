<template>
  <div class="member-order">
    <xtx-tabs v-model="activeName" @tab-click='tabClick'>
      <xtx-tabs-panel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></xtx-tabs-panel>
    </xtx-tabs>
    <!-- 订单列表 -->
      <div class="order-list">
        <div v-if="loading" class="loading"></div>
        <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
        <order-item v-for="item in orderList" :key="item.id" :order="item" @on-cancel="handlerCancel" @on-logistics='handlerLogistics' @on-delete='onDelete' @on-confirm='handlerConfirm'></order-item>
      </div>
      <!-- 分页 -->
      <xtx-pagination v-if="total>0" :currPage='reqParams.page' :total='total' @currentChange='reqParams.page = event'></xtx-pagination>
      <!-- 取消原因组件 -->
      <order-cancel ref="orderCancelCom"></order-cancel>
    <!-- 查看物流组件 -->
      <order-logistics  ref="orderLogisticsCom" ></order-logistics>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue-demi'
import { orderStatus } from '@/api/constant'
import orderItem from './component/order-item.vue'
import { confirmOrder, delteOrder, findOrderList } from '@/api/order'
import OrderCancel from './component/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './component/order-logistics.vue'
export default {
  components: { orderItem, OrderCancel, OrderLogistics },
  name: 'MemberOrder',
  setup () {
    const activeName = ref('all')
    const loading = ref(false)

    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      orderStatus: 0
    })
    const orderList = ref([])
    const total = ref(0)
    const getOrderList = () => {
      findOrderList(reqParams).then(res => {
        orderList.value = res.result.items
        total.value = res.result.counts
        loading.value = false
      })
    }
    watch(reqParams, () => {
      loading.value = true
      getOrderList()
    }, { immediate: true })

    const tabClick = ({ name, index }) => {
      reqParams.page = 1
      reqParams.orderStatus = index
    }

    const onDelete = (order) => {
      Confirm({ text: '确认删除？' }).then(() => {
        delteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除成功' })
          getOrderList()
        })
      }).catch(() => {})
    }

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      ...useCancel(),
      onDelete,
      ...useConfirm(),
      ...useLogisticsOrder()
    }
  }
}
// 取消订单逻辑
const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }

  return { handlerCancel, orderCancelCom }
}
// 确认收货
const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '确认收货？' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '确认收货成功' })
        order.orderState = 4
      })
    }).catch(e => {})
  }

  return {
    handlerConfirm
  }
}
// 查看物流
const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const handlerLogistics = (item) => {
    logisticsOrderCom.value.open(item)
  }
  return { handlerLogistics, logisticsOrderCom }
}
</script>

<style lang='less' scoped>
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
