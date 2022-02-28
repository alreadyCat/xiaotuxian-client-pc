<template>
  <Form ref="formCom" :validation-schema="mySchema" v-slot="{errors}" class="xtx-form">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.accout}" name='account' v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name='mobile' v-model="form.mobile"  class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field  :class="{err:errors.code}" name='code' v-model="form.code"  class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">{{time===0?'发送验证码':time+'秒后发送'}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field  :class="{err:errors.password}" name='password'  v-model="form.password"  class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field  :class="{err:errors.repassword}" name='repassword' v-model="form.repassword"  class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.repassword" class="error">{{errors.repassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click='submit'>立即提交</a>
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue-demi'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQBingLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/shared'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: {
    Field, Form
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const form = reactive({
      account: '',
      mobile: '',
      code: '',
      password: '',
      repassword: ''
    })

    const mySchema = {
      account: schema.uniqueAccount,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password
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
    // 13911111111
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
          const log = await userQQPatchCode(form.mobile)
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
    // 绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        const data = {
          code: form.code,
          mobile: form.mobile,
          unionId: props.unionId,
          password: form.password,
          account: form.account
        }
        try {
          const { id, account, avatar, mobile, nickname, token } = await userQQBingLogin(data)
          store.commit('user/setProfile', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl)
            proxy.$message({ type: 'success', text: '操作成功' })
          })
        } catch (error) {
          proxy.$message({ type: 'error', text: '操作失败' })
        }
      }
    }
    return { form, mySchema, send, formCom, time, submit }
  }
}
</script>

<style scoped lang='less'>
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
