<template>
  <myform  ref="formCom" :validation-schema='mySchema' v-slot="{errors}"  class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <field v-model="form.mobile" :class="{err:errors.mobile}" name='mobile' class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <field v-model="form.code" :class="{err:errors.code}" name='code' class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send">{{time===0?'发送验证码':time+'秒后发送'}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </myform>
</template>

<script>
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue-demi'
import QC from 'qc'
import { useIntervalFn } from '@vueuse/shared'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindMobile } from '@/api/user'
import { Field as field, Form as myform } from 'vee-validate'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: {
    field, myform
  },
  props: {
    unionId: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }

    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

    // 发送短信验证码
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const formCom = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      if (time.value <= 0)pause()
      else time.value--
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来
    const { proxy } = getCurrentInstance()
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
        // 没有倒计时才可以发送
          const log = await userQQBindCode(form.mobile)
          console.log(log)
          proxy.$message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        const data = {
          code: form.code,
          mobile: form.mobile,
          unionId: props.unionId
        }
        try {
          const { id, account, avatar, mobile, nickname, token } = await userQQBindMobile(data)
          store.commit('user/setProfile', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl)
            proxy.$message({ type: 'success', text: '绑定成功' })
          })
        } catch (error) {
          proxy.$message({ type: 'error', text: '绑定失败' })
        }
      }
    }
    return {
      nickname,
      avatar,
      send,
      mySchema,
      formCom,
      form,
      time,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>
