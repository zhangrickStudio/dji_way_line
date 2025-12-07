import { createApp } from 'vue'
import VueCesium from 'vue-cesium'
import Antd from 'ant-design-vue'
import 'vue-cesium/dist/index.css'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueCesium)
app.use(Antd)
app.mount('#app')
