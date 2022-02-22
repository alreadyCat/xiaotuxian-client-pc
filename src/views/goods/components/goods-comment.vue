<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: buttonActiveIndex === index }"
            v-for="(tag, index) in commentInfo.tags"
            :key="index"
            @click="activateButton(index)"
            >{{ `${tag.title} (${tag.tagCount})` }}</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" @click="reqParams.sortField = null" :class="{active:reqParams.sortField === null}">默认</a>
      <a href="javascript:;" @click="reqParams.sortField = 'createTime'" :class="{active:reqParams.sortField === 'createTime'}">最新</a>
      <a href="javascript:;" @click="reqParams.sortField = 'praiseCount'" :class="{active:reqParams.sortField === 'praiseCount'}">最热</a>
    </div>
    <div class="list">
      <!-- 列表 -->
      <div class="list">
        <div class="item" v-for="comment in commentList" :key="comment.id">
          <div class="user">
            <img
              :src="comment.member.avatar"
              alt=""
            />
            <span>{{formatNickname(comment.member.nickname)}}</span>
          </div>
          <div class="body">
            <div class="score">
              <i class="iconfont icon-wjx01" v-for="(star,index) in comment.score" :key="index"></i>
              <i class="iconfont icon-wjx02" v-for="(graystar,index) in 5-comment.score" :key="index"></i>
              <span class="attr">{{formatOrderProp(comment.orderInfo.specs)}}</span>
            </div>
            <div class="text">
              {{comment.content}}
            </div>
            <!-- 评论图片组件 -->
            <GoodsCommentImage v-if="comment.pictures.length" :pictures="comment.pictures"></GoodsCommentImage>
            <div class="time">
              <span>{{comment.orderInfo.createTime}}</span>
              <span class="zan"><i class="iconfont icon-dianzan"></i>{{comment.praiseCount}}</span>
            </div>
          </div>
        </div>
        <xtx-pagination v-if="commentNum" :total="commentNum.counts" :currPage="commentNum.page -0" :pageSize="10" :button="5" @currentChange="currentChange"></xtx-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue-demi'
import { useRoute } from 'vue-router'
import { findCommentInfoByGoods, findCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  components: { GoodsCommentImage },
  name: 'GoodsComment',
  setup () {
    const route = useRoute()
    const commentInfo = ref(null)
    const buttonActiveIndex = ref(0)
    findCommentInfoByGoods(route.params.id).then(
      (res) => {
        console.log(res)
        res.result.tags.unshift({
          title: '有图',
          tagCount: res.result.hasPictureCount
        })
        res.result.tags.unshift({
          title: '全部评价',
          tagCount: res.result.evaluateCount
        })
        commentInfo.value = res.result
      },
      (err) => {
        console.log(err, 'findCommentInfoByGoods接口错误')
      }
    )

    // 评论功能
    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })

    // 激活button
    const activateButton = (index) => {
      if (index === 0) {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (index === 1) {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.tag = commentInfo.value.tags[index]
      }
      buttonActiveIndex.value = index
    }

    const commentList = ref(null)
    const commentNum = ref(null)
    watch(reqParams, (newVal) => {
      findCommentList(route.params.id, newVal).then(({ result }) => {
        // // 处理评论订单参数
        // result.items.forEach(item => {
        //   let attr = ''
        //   item.orderInfo.specs.forEach(prop => {
        //     attr += `${prop.name}: ${prop.nameValue} `
        //   })
        //   item.attr = attr
        // })
        // // 处理昵称
        // result.items.forEach(item => {
        //   const nickname = item.member.nickname.substr(0, 1) + '****' + item.member.nickname.substr(-1)
        //   item.member.nickname = nickname
        // })
        commentList.value = result.items
        commentNum.value = result
        console.log(result)
      }, err => { console.log(err, 'findCommentList接口错误') })
    }, { immediate: true })

    const formatNickname = (name) => {
      const nickname = name.substr(0, 1) + '***' + name.substr(-1)
      return nickname
    }
    const formatOrderProp = (arr) => {
      let str = ''
      arr.forEach(item => {
        str += `${item.name}: ${item.nameValue}  `
      })
      return str
    }

    // 分页器
    const currentChange = (index) => {
      console.log(index)
      reqParams.page = index
    }
    return {
      commentInfo,
      buttonActiveIndex,
      activateButton,
      reqParams,
      commentList,
      formatNickname,
      formatOrderProp,
      commentNum,
      currentChange
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
