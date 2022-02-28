<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- <div class="form"> -->
        <Form ref="loginForm" class="form" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name='account' v-model="form.account" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}"  name='password' v-model="form.password"  type="password" placeholder="请输入密码"/>
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name='mobile' v-model="form.mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field  name='code'  v-model="form.code" type="password" placeholder="请输入验证码"/>
            <span class="code" @click="send">{{time===0?'发送验证码':time+'秒后发送'}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field name=isAgree as='XtxCheckbox' v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>

          <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
      <!-- </div> -->
    </Form>
    <div class="action">
        <!-- <span id="qqLoginBtn"></span> -->
        <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"><img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt=""></a>

      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, reactive, ref, watch } from 'vue-demi'
import { Form, Field } from 'vee-validate'
import veeSchema from '@/utils/vee-validate-schema'
import { userAccountLogin, userMobileLoginGetCode, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/shared'
// import QC from 'qc'
export default {
  components: {
    Form, Field
  },
  setup () {
    const isMsgLogin = ref(false)
    const loginForm = ref(null)
    const form = reactive({
      isAgree: false,
      password: null,
      mobile: null,
      account: null,
      code: null
    })
    const schema = veeSchema

    watch(isMsgLogin, () => {
      form.value = {
        isAgree: false,
        password: null,
        mobile: null,
        account: null,
        code: null
      }
      loginForm.value.resetForm()
    })

    const { proxy } = getCurrentInstance()
    // 整体表单校验
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      const valid = await loginForm.value.validate()
      if (valid) {
        let data = null
        try {
          if (isMsgLogin.value) {
            // 验证码登录
            console.log(form.mobile, form.code)
            data = await userMobileLogin(form.mobile, form.code)
            console.log(data)
          } else {
            // 用户名登录
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }

          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setProfile', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(route.query.redirectUrl || '/')
            proxy.$message({ type: 'success', text: '登录成功' })
          })
        } catch (error) {
          if (error) {
            proxy.$message({ type: 'error', text: '登录失败' })
          }
        }
      }
    }
    const time = ref(0)

    const { pause, resume } = useIntervalFn(() => {
      if (time.value <= 0)pause()
      else time.value--
    }, 1000, false)

    // 发送验证码
    const send = async () => {
      const valid = schema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          try {
            await userMobileLoginGetCode(form.mobile)
          } catch (error) {
            if (error)proxy.$message({ type: 'error', text: '验证码发送太频繁，请稍后重试' })
          }
          proxy.$message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        loginForm.value.setFieldError('mobile', valid)
      }
    }

    // qq登录
    // onMounted(() => {
    //   // 组件渲染完毕，使用QC生成QQ登录按钮
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    return {
      isMsgLogin,
      form,
      schema,
      loginForm,
      login,
      send,
      time
    }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
