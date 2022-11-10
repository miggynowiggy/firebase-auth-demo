// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'
import router from './routes'
import store from './store'

// Components
import App from './App.vue'

const app = createApp(App)

registerPlugins(app)

app.use(router).use(store).use(vuetify).mount('#app')
