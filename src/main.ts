import '@/assets/styles/css/tailwind.css'
import '@/assets/styles/css/main.css'
import 'vue-sonner/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { registerRouter } from '@/lib/router-instance'
import router from './router'

const app = createApp(App)

registerRouter(router)
app.use(createPinia())
app.use(router)

await router.isReady()
app.mount('#app')
