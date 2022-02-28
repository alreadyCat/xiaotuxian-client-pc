<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{(showAddress.fullLocation +  showAddress.address).replace(/ /g,'')}}</li>
      </ul>
      <a  @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
    <xtx-dialog title="切换收货地址" v-model:visible="visibleDialog">
      <div class="max">
        <div class="text item" :class="{active:selectedAddress&&selectedAddress.id===item.id}" @click="selectedAddress=item" v-for="item in userAddress" :key="item.id">
          <ul>
            <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
            <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2')}}</li>
            <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
          </ul>
        </div>
      </div>
      <template v-slot:footer>
        <XtxButton type="gray" style="margin-right:20px" @click="visibleDialog = false">取消</XtxButton>
        <XtxButton type="primary" @click="confirmAddress">确认</XtxButton>
      </template>
    </xtx-dialog>
    <!-- 添加收获地址 -->
    <address-edit @on-success='successHandler' ref="addressEditRef"></address-edit>
  </div>

</template>
<script>
import { ref } from 'vue-demi'
import addressEdit from './address-edit.vue'
export default {
  components: { addressEdit },
  name: 'CheckoutAddress',
  props: {
    userAddress: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    const showAddress = ref(null)
    const defaultAddress = props.userAddress.find(item => item.isDefault === 0)

    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.userAddress.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.userAddress[0]
      }
    }

    emit('change', showAddress.value && showAddress.value.id)

    const visibleDialog = ref(false)

    const selectedAddress = ref(null)

    const confirmAddress = () => {
      showAddress.value = selectedAddress.value
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
    }

    const openDialog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }

    const addressEditRef = ref(null)
    const openAddressEdit = (address) => {
      addressEditRef.value.open(address)
    }

    const successHandler = (formData) => {
      const address = props.userAddress.find(item => item.id === formData.id)
      if (address) {
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.userAddress.unshift(JSON.parse(jsonStr))
      }
    }
    return {
      showAddress,
      defaultAddress,
      visibleDialog,
      selectedAddress,
      confirmAddress,
      openDialog,
      openAddressEdit,
      addressEditRef,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;

    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
  .xtx-dialog {
    .max{
      max-height: 600px;
      overflow: auto;
    }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
}
</style>
