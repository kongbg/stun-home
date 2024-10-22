import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import { ElMessage, ElNotification } from 'element-plus'
import 'element-plus/dist/index.css'

import './style/reset.css'
import './style/base.css'
import './style/index.css'

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.$Model = ElMessage
app.config.globalProperties.$Notif = ElNotification

app.use(ElementPlus)

app.mount('#app')
