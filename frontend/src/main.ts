// Composables
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

// Plugins
import router from './routes'
import store from './store'

// Components
import App from './App.vue'

const app = createApp(App)

app
  .use(router)
  .use(store)
  .use(Antd)
  .mount('#app')
