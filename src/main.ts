import { createApp } from 'vue'
import './style.css'

import { createPinia } from 'pinia'
import App from './App.vue'

import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from "./routers/router.ts";

const app = createApp(App)

app.use(createPinia())

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    // timeout: 3000,
    // closeOnClick: false,
})

app.use(router)

app.mount('#app')
