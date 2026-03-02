<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  
  <!-- 全局 Toast 提示组件 -->
  <Toast />
</template>

<script setup>
// 应用根组件
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useTimerStore } from '@/stores/timer'
import Toast from '@/components/Toast.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const timerStore = useTimerStore()

onMounted(async () => {
  // 初始化主题
  themeStore.initTheme()
  // 初始化字体
  themeStore.initFont()

  // 验证用户是否有效（如果用户在服务器上已被删除，会清除本地数据并跳转登录）
  if (authStore.token) {
    console.log('[App] 检测到 token，验证用户有效性...')
    await authStore.fetchUser()
    // 如果 fetchUser 验证失败（用户被删除），会清除数据并跳转到登录页
    // 如果验证成功，isAuthenticated 仍然为 true，继续执行
    if (!authStore.token) {
      console.log('[App] 用户验证失败，已清除本地数据')
      return // 停止后续初始化
    }
  }

  // 全局计时器初始化 - 只在用户已登录时执行
  // 完全从服务器获取状态，不再依赖本地缓存
  if (authStore.isAuthenticated && authStore.user?.userId) {
    console.log('[App] 用户已登录，从服务器获取计时状态...')
    await timerStore.fetchTimerStatus()

    // 只有在服务器状态显示正在计时时，才恢复计时器
    // 这样确保：数据库删除用户后，即使本地有缓存，也不会恢复错误的计时状态
    if (timerStore.serverStatus.isTiming || timerStore.serverStatus.status === 'RUNNING') {
      console.log('[App] 服务器显示正在计时，恢复计时器...')
      timerStore.restoreTimerState(true)
    } else {
      console.log('[App] 服务器未在计时，不自动恢复')
      // 清除可能的本地计时状态
      timerStore.resetTimerState()
    }
  }

  // 监听用户登录状态变化
  authStore.$subscribe(async (mutation, state) => {
    if (state.isAuthenticated && state.user?.userId) {
      console.log('[App] 用户登录成功，从服务器获取计时状态...')
      await timerStore.fetchTimerStatus()

      // 只有服务器显示正在计时才恢复
      if (timerStore.serverStatus.isTiming || timerStore.serverStatus.status === 'RUNNING') {
        timerStore.restoreTimerState(true)
      } else {
        timerStore.resetTimerState()
      }
    }
  })
})
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
