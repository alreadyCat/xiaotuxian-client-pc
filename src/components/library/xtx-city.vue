<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{active:visible}">
      <span class="placeholder">{{fullLocation===''?tag:fullLocation}}</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="(area) in newAreaList" :key="area.code" @click="showArea(area)">{{area.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)
    const areaList = ref([])
    // 城市组件显示与隐藏,获取城市信息
    const show = () => {
      visible.value = true
      loading.value = true
      getArea().then(res => {
        areaList.value = res
        loading.value = false
        showArea(null)
      })
    }

    const hide = () => {
      visible.value = false
    }

    const toggle = () => {
      visible.value ? hide() : show()
    }

    const target = ref(null)
    onClickOutside(target, (e) => {
      hide()
    })

    // 选择城市
    const newAreaList = ref([])
    const address = ref([])
    const tag = ref('请选择配送地址')
    const showArea = (area) => {
      if (area === null) {
        address.value = []
        newAreaList.value = areaList.value
      } else if (area.areaList) {
        address.value.push(area)
        newAreaList.value = area.areaList
      } else if (!area.areaList) {
        address.value.push(area)
        tag.value = `${address.value[0].name} ${address.value[1].name} ${address.value[2].name} `
        emit('change', address.value)
        visible.value = false
      }
    }

    return { visible, toggle, target, loading, showArea, newAreaList, tag }
  }
}

const getArea = () => {
  return new Promise((resolve, reject) => {
    if (window.areaData) {
      resolve(window.areaData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.areaData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
