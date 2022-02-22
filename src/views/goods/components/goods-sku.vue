<template>
  <div class="goods-sku">
    <dl v-for="(item,index) in goods.specs" :key="index" >
        <dt>{{item.name}}</dt>
        <dd>
            <template v-for="(i,ind) in item.values" :key="ind">
                <img v-if="i.picture" :src='i.picture' :title="i.name" :class="{selected:i.selected,disabled:i.disabled}" @click="select(item,i)">
                <span v-else :class="{selected:i.selected,disabled:i.disabled}" @click="select(item,i)">{{i.name}}</span>
            </template>
        </dd>
    </dl>
  </div>
</template>
<script>

// 得到一个路径字典
// 1.得到所有的sku的集合 从接口拿
// 2.从所有sku集合种筛选出有效的sku
// 3.根据有效的sku使用power-sku得到子集
// 4.根据子集往路径字典对象中存储key-value
import PowerSet from '@/vender/power-set'
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory) {
      const optionalArr = sku.specs.map(val => val.valueName) // 得到有效sku
      const subset = PowerSet(optionalArr) // 得到有效sku的子集
      subset.forEach(arr => { // 得到路径字典
        const key = arr.join('&')
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 更新按钮是否能用
const updatePropDisabledStatus = (specs, pathMap) => {
  const selectedValue = getSelectedValue(specs)
  specs.forEach((item, i) => {
    item.values.forEach(val => {
      if (val.selected) return
      selectedValue[i] = val.name
      const key = selectedValue.filter(value => value).join('&')
      val.disabled = !pathMap[key]
    })
  })
}

// 获取已点属性的值
const getSelectedValue = (specs) => {
  const arr = []
  specs.forEach(spec => {
    const val = spec.values.find(item => item.selected)

    arr.push(val ? val.name : undefined)
  })
  return arr
}

// 页面刷新初始化已选择的属性
const initProps = (goods, skuId) => {
  // let skuInfo = []
  // goods.skus.forEach(sku => {
  //   if (sku.id === skuId)skuInfo = sku.specs
  // })
  const skuInfo = goods.skus.find(sku => sku.id === skuId)

  goods.specs.forEach((spec, i) => {
    const prop = spec.values.find(val => val.name === skuInfo.specs[i].valueName)
    prop.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    updatePropDisabledStatus(props.goods.specs, pathMap)
    props.goods.specs.forEach(item => { // 添加商品属性按钮是否可用属性进行样式判断
      item.values.forEach(prop => {
        prop.selected = false
      })
    })
    if (props.skuId)initProps(props.goods, props.skuId)

    // 选中属性
    const select = (item, prop) => {
      if (prop.disabled) return
      if (prop.selected) {
        prop.selected = false
      } else {
        item.values.forEach(i => (i.selected = false))
        prop.selected = true
      }
      const validSelectedArr = getSelectedValue(props.goods.specs).filter(v => v)
      if (validSelectedArr.length === props.goods.specs.length) {
        const skuId = pathMap[validSelectedArr.join('&')]
        const sku = props.goods.skus.find(item => item.id === skuId[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
        })
      } else {
        emit('change', {})
      }
    }

    return { select }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 5px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
