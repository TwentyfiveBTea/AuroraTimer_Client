import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setStorage, getStorage, removeStorage } from '@/utils'
import { authAPI, mockAPI } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const token = ref(getStorage('auth_token', null))
  const isLoading = ref(false)
  const error = ref(null)
  
  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.name || '用户')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar)
  const userStudentId = computed(() => user.value?.studentId || '暂无学号')
  const userLevel = computed(() => user.value?.level || 1)
  const totalHours = computed(() => user.value?.totalHours || 0)
  
  // 登录
  async function login(credentials) {
    isLoading.value = true
    error.value = null
    
    try {
      // 使用模拟 API 进行开发测试
      // 真实环境切换为: const response = await authAPI.login(credentials)
      const response = await mockAPI.mockLogin(credentials)
      
      if (response.code === 200) {
        token.value = response.data.token
        user.value = response.data.user
        setStorage('auth_token', token.value)
        return { success: true }
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }
  
  // 注册
  async function register(userData) {
    isLoading.value = true
    error.value = null
    
    try {
      // 使用模拟 API 进行开发测试
      // 真实环境切换为: const response = await authAPI.register(userData)
      const response = await mockAPI.mockRegister(userData)
      
      if (response.code === 200) {
        token.value = response.data.token
        user.value = response.data.user
        setStorage('auth_token', token.value)
        return { success: true }
      } else {
        throw new Error(response.message || '注册失败')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }
  
  // 退出登录
  async function logout() {
    try {
      // 真实环境: await authAPI.logout()
    } finally {
      token.value = null
      user.value = null
      removeStorage('auth_token')
    }
  }
  
  // 获取用户信息
  async function fetchUser() {
    if (!token.value) return
    
    isLoading.value = true
    try {
      // 真实环境: const response = await authAPI.getCurrentUser()
      // 模拟数据
      const response = {
        code: 200,
        data: {
          id: 1,
          name: '测试用户',
          studentId: '20230001',
          email: userEmail.value || 'test@example.com',
          avatar: null,
          totalHours: 365.5,
            level: 5,
            currentWeekTime: 0 // 本周累计工时（秒）
        }
      }
      
      if (response.code === 200) {
        user.value = response.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
  
  // 更新用户资料
  async function updateProfile(data) {
    isLoading.value = true
    error.value = null
    
    try {
      // 真实环境: await userAPI.updateProfile(data)
      // 模拟
      user.value = { ...user.value, ...data }
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    userName,
    userEmail,
    userAvatar,
    userStudentId,
    userLevel,
    totalHours,
    login,
    register,
    logout,
    fetchUser,
    updateProfile
  }
})
