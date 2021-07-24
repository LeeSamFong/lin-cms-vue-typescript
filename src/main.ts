import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locale from 'element-plus/lib/locale/lang/zh-cn'

import App from '@/App.vue'
import router from '@/router'
import store, { storeKey } from '@/store'

import '@/assets/style/index.scss'
import 'element-plus/lib/theme-chalk/index.css'
import '@/assets/style/realize/element-variable.scss'

const app = createApp(App)

app
  .use(store, storeKey)
  .use(router)

app.use(ElementPlus, { locale })

app.mount('#app')
