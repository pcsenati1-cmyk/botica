import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

import('./stores/tema').then(({ useTemaStore }) => {
  const temaStore = useTemaStore()
  temaStore.initTema()
})