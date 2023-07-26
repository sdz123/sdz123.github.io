
import { createApp } from 'vue'
import App from './App.vue'
import {createRouter,createWebHashHistory} from 'vue-router';
import Home from '@/pages/home.vue';
const routes = [
    { path: '/', component: Home },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
const app = createApp(App)
app.use(router)
app.mount('#app')
