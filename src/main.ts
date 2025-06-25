import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import './style.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

// Toastify
import 'toastify-js/src/toastify.css'

// Pinia
import { createPinia } from 'pinia'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Cargar usuario del localStorage antes de montar la app
const userStore = useUserStore()
userStore.loadUserFromLocalStorage()

app.mount('#app')
