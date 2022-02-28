import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入自己的ui库
import UI from '@/components/library'

import '@/mock'
// 重置 样式
import 'normalize.css'
// 公共样式
import '@/assets/styles/common.less'
createApp(App).use(store).use(router).use(UI).mount('#app')
