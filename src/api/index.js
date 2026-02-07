/**
 * API 请求层
 * 封装所有后端接口调用，支持未来接入真实后端
 */

// 创建 axios 实例
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          console.error('无权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

// ============ 认证相关 API ============

export const authAPI = {
  // 登录
  login(credentials) {
    return request.post('/auth/login', credentials)
  },
  
  // 注册
  register(userData) {
    return request.post('/auth/register', userData)
  },
  
  // 忘记密码
  forgotPassword(email) {
    return request.post('/auth/forgot-password', { email })
  },
  
  // 重置密码
  resetPassword(data) {
    return request.post('/auth/reset-password', data)
  },
  
  // 获取当前用户信息
  getCurrentUser() {
    return request.get('/auth/me')
  },
  
  // 退出登录
  logout() {
    return request.post('/auth/logout')
  }
}

// ============ 用户相关 API ============

export const userAPI = {
  // 获取用户资料
  getProfile(userId) {
    return request.get(`/users/${userId}`)
  },
  
  // 更新用户资料
  updateProfile(data) {
    return request.put('/users/profile', data)
  },
  
  // 更新密码
  updatePassword(data) {
    return request.put('/users/password', data)
  },
  
  // 上传头像
  uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return request.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // 同步工时到服务器（每5秒调用一次）
  addTime(data) {
    return request.post('/users/time/add', data)
  }
}

// ============ 计时器相关 API ============

export const timerAPI = {
  // 获取当前计时状态
  getCurrentTimer() {
    return request.get('/timer/current')
  },
  
  // 开始计时
  startTimer(data) {
    return request.post('/timer/start', data)
  },
  
  // 暂停计时
  pauseTimer(timerId) {
    return request.post(`/timer/${timerId}/pause`)
  },
  
  // 继续计时
  resumeTimer(timerId) {
    return request.post(`/timer/${timerId}/resume`)
  },
  
  // 停止计时
  stopTimer(timerId) {
    return request.post(`/timer/${timerId}/stop`)
  },
  
  // 获取计时记录
  getTimerRecords(params) {
    return request.get('/timer/records', { params })
  },
  
  // 获取统计信息
  getStatistics(params) {
    return request.get('/timer/statistics', { params })
  }
}

// ============ 任务相关 API ============

export const taskAPI = {
  // 获取任务列表
  getTasks(params) {
    return request.get('/tasks', { params })
  },
  
  // 获取单个任务
  getTask(taskId) {
    return request.get(`/tasks/${taskId}`)
  },
  
  // 创建任务
  createTask(data) {
    return request.post('/tasks', data)
  },
  
  // 更新任务
  updateTask(taskId, data) {
    return request.put(`/tasks/${taskId}`, data)
  },
  
  // 删除任务
  deleteTask(taskId) {
    return request.delete(`/tasks/${taskId}`)
  }
}

// ============ 通知相关 API ============

export const notificationAPI = {
  // 获取通知列表
  getNotifications(params) {
    return request.get('/notifications', { params })
  },
  
  // 获取未读通知数量
  getUnreadCount() {
    return request.get('/notifications/unread-count')
  },
  
  // 标记通知已读
  markAsRead(notificationId) {
    return request.put(`/notifications/${notificationId}/read`)
  },
  
  // 标记所有通知已读
  markAllAsRead() {
    return request.put('/notifications/read-all')
  },
  
  // 删除通知
  deleteNotification(notificationId) {
    return request.delete(`/notifications/${notificationId}`)
  }
}

// ============ 排行榜相关 API ============

export const leaderboardAPI = {
  // 获取排行榜
  getLeaderboard(params) {
    return request.get('/leaderboard', { params })
  },
  
  // 获取我的排名
  getMyRank() {
    return request.get('/leaderboard/my-rank')
  }
}

// ============ 设置相关 API ============

export const settingsAPI = {
  // 获取用户设置
  getSettings() {
    return request.get('/settings')
  },
  
  // 更新用户设置
  updateSettings(data) {
    return request.put('/settings', data)
  },
  
  // 获取主题列表
  getThemes() {
    return request.get('/settings/themes')
  },
  
  // 更新主题
  updateTheme(themeId) {
    return request.put('/settings/theme', { themeId })
  }
}

// ============ 模拟数据（开发阶段使用）===========

/**
 * 开发模式下的模拟 API
 * 未来接入真实后端时，这些函数将被上面的真实 API 替代
 */
export const mockAPI = {
  // 模拟登录
  async mockLogin(credentials) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (credentials.email && credentials.password) {
      return {
        code: 200,
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: 1,
            name: '测试用户',
            email: credentials.email,
            avatar: null,
            totalHours: 0,
            level: 1,
            currentWeekTime: 0 // 本周累计工时（秒）
          }
        },
        message: '登录成功'
      }
    }
    throw new Error('邮箱或密码错误')
  },
  
  // 模拟注册
  async mockRegister(data) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      code: 200,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          name: data.name,
          email: data.email,
          avatar: null,
          totalHours: 0,
          level: 1,
          currentWeekTime: 0 // 本周累计工时（秒）
        }
      },
      message: '注册成功'
    }
  },
  
  // 模拟统计数据
  async mockStatistics() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      code: 200,
      data: {
        todayHours: 4.5,
        weekHours: 28.5,
        monthHours: 112.0,
        totalHours: 365.5,
        projects: 5,
        tasks: 23,
        streak: 7
      }
    }
  },
  
  // 模拟排行榜数据
  async mockLeaderboard() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      code: 200,
      data: [
        { rank: 1, name: '张伟', avatar: null, hours: 45.5, projects: 12 },
        { rank: 2, name: '李娜', avatar: null, hours: 42.0, projects: 10 },
        { rank: 3, name: '王芳', avatar: null, hours: 38.5, projects: 9 },
        { rank: 4, name: '刘洋', avatar: null, hours: 35.0, projects: 8 },
        { rank: 5, name: '陈明', avatar: null, hours: 32.5, projects: 7 }
      ]
    }
  },
  
  // 模拟通知列表
  async mockNotifications() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      code: 200,
      data: [
        {
          id: 1,
          type: 'achievement',
          title: '获得成就「连续工作7天」',
          description: '你已经连续工作7天了，继续保持！',
          time: '2小时前',
          read: false
        },
        {
          id: 2,
          type: 'reminder',
          title: '任务提醒',
          description: '「项目文档」任务即将到期',
          time: '5小时前',
          read: false
        },
        {
          id: 3,
          type: 'system',
          title: '系统更新',
          description: 'Aurora Timer v1.1.0 已发布',
          time: '1天前',
          read: true
        }
      ]
    }
  }
}

export default request
