<template>
    <!-- 筛选区 -->
    <div class="sub-filter" v-if="data && !isLoading">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a href="javascript:;" v-for="brand in data.brands" :key="brand.id" :class="{active:data.brands.selected === brand.id}" @click="changeBrand(brand.id)">{{brand.name}}</a>
       </div>
     </div>
     <div class="item" v-for="saleProp in data.saleProperties" :key="saleProp.id">
       <div class="head">{{saleProp.name}}</div>
       <div class="body">
         <a href="javascript:;" v-for="prop in saleProp.properties" :key="prop.id" :class="{active:saleProp.selected === prop.id}" @click="changeProp(saleProp,prop)">{{prop.name}}</a>
       </div>
     </div>
   </div>
   <!-- 骨架 -->
    <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue-demi'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const data = ref(null)
    const isLoading = ref(false)

    // 监听路由变化，是否在当前二级路由中进行跳转，是就重新获取该分类的属性信息
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        isLoading.value = true
        findSubCategoryFilter(route.params.id).then(res => {
          res.result.brands.selected = null
          res.result.brands.unshift({
            id: null,
            name: '全部'
          })
          res.result.saleProperties.forEach(saleProp => {
            saleProp.selected = null
            saleProp.properties.unshift({
              id: null,
              name: '全部'
            })
          })
          data.value = res.result
        }, err => {
          console.log(err, '获取2级分类过滤失败，接口findSubCategoryFilter')
        })
        isLoading.value = false
      }
    }, { immediate: true })

    // 计算选择的销售属性
    const getSelectedProp = () => {
      const obj = { brandId: data.value.brands.selected, attrs: [] }

      data.value.saleProperties.forEach(saleProp => {
        saleProp.properties.find(prop => {
          if (saleProp.selected && prop.id === saleProp.selected) {
            obj.attrs.push({
              groupName: saleProp.name,
              propertyName: prop.name
            })
          }
        })
      })

      if (obj.attrs.length)obj.attrs = null
      return obj
    }
    // 改变品牌
    const changeBrand = id => {
      if (data.value.brands.selected !== id) {
        data.value.brands.selected = id
        emit('brandIsChange', getSelectedProp())
      }
    }
    // 改变属性
    const changeProp = (saleProp, prop) => {
      if (saleProp.selected !== prop.id) {
        saleProp.selected = prop.id
        emit('propIsChange', getSelectedProp())
      }
    }
    return {
      data,
      isLoading,
      changeBrand,
      changeProp
    }
  }
}
</script>
<style scoped lang='less'>
   .xtx-skeleton {
      padding: 10px 0;
    }
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
</style>
