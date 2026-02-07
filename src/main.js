import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

// 导入全局样式
import './styles/main.css'
import './styles/variables.css'

const app = createApp(App)

// 使用 Pinia 状态管理
const pinia = createPinia()
app.use(pinia)

// 使用 Vue Router
app.use(router)

// 应用挂载后初始化用户状态
app.mount('#app').$nextTick(() => {
  // 如果 localStorage 中有 token，尝试获取用户信息
  const authStore = useAuthStore()
  if (authStore.token) {
    authStore.fetchUser()
  }
})
