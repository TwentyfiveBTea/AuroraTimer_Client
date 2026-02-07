import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { timerAPI, mockAPI, userAPI } from '@/api'
import { formatTime } from '@/utils'
import { useAuthStore } from './auth'

// Web Worker 实例
let timerWorker = null

/**
 * 获取 Timer Worker 实例
 * @returns {Worker}
 */
function getTimerWorker() {
  if (!timerWorker) {
    timerWorker = new Worker(new URL('../utils/Timer.js', import.meta.url).href, {
      type: 'module'
    })
  }
  return timerWorker
}

export const useTimerStore = defineStore('timer', () => {
  const authStore = useAuthStore()
  
  // ============ 基础计时状态 ============
  const isRunning = ref(false)
  const isPaused = ref(false)
  const isAFK = ref(false) // 是否处于挂机状态
  const currentTime = ref(0) // 本次会话已计时秒数
  const todayDuration = ref(0) // 今日时长（秒）
  const timerInterval = ref(null)
  
  // ============ 同步相关配置 ============
  const SYNC_INTERVAL = 1 // 同步间隔（秒）- 每秒同步到服务器
  const AFK_CHECK_INTERVAL = 1200 // 挂机检测间隔（秒）- 20分钟
  
  // ============ 挂机检测状态 ============
  const lastMousePoint = ref({ x: 0, y: 0 })
  const afkNotification = ref(null)
  
  // ============ 计算属性 ============
  
  // 格式化时间显示
  const formattedTime = computed(() => formatTime(currentTime.value))
  
  // 翻页钟时间（环形进度）
  const pageClockTime = computed(() => {
    const hours = Math.floor(currentTime.value / 3600)
    const minutes = Math.floor((currentTime.value % 3600) / 60)
    const seconds = currentTime.value % 60
    return { hours, minutes, seconds }
  })
  
  // 计时器相关统计
  const statistics = ref({
    todayHours: 7.5,
    weekHours: 42.0,
    monthHours: 168.0,
    totalHours: 365.5,
    projects: 5,
    tasks: 23,
    streak: 7
  })
  
  // ============ 计时器相关方法 ============
  
  /**
   * 启动计时器（使用 Web Worker）
   * 自动初始化挂机检测
   */
  function startTimer() {
    if (isRunning.value) return
    
    isRunning.value = true
    isPaused.value = false
    isAFK.value = false
    
    // 初始化挂机检测（非阻塞）
    initAFKDetection()
    
    const worker = getTimerWorker()
    
    // 设置 Worker 消息处理
    worker.onmessage = handleWorkerMessage
    
    // 启动 Worker 计时
    worker.postMessage({ command: 'start', payload: { interval: 1000 } })
  }
  
  /**
   * Worker 消息处理
   * @param {MessageEvent} event
   */
  function handleWorkerMessage(event) {
    const { type, elapsed, timestamp } = event.data
    
    if (type === 'tick') {
      currentTime.value = elapsed
      
      // 实时累加 todayDuration（用于周进度计算）
      if (authStore.user?.currentWeekTime !== undefined) {
        authStore.user.currentWeekTime += 1
      }
      
      // ============ 1秒同步策略 ============
      // 每 1 秒同步一次数据到服务器
      if (elapsed % SYNC_INTERVAL === 0 && elapsed > 0) {
        syncToServer()
  }
  
      // ============ 挂机检测（每 1200 秒 / 20 分钟） ============
      if (elapsed % AFK_CHECK_INTERVAL === 0 && elapsed > 0) {
        checkAFK()
      }
    }
  }
  
  /**
   * 暂停计时器
   */
  function pauseTimer() {
    if (!isRunning.value || isPaused.value) return
    
    isPaused.value = true
    
    const worker = getTimerWorker()
    worker.postMessage({ command: 'pause' })
    
    // 移除 Worker 消息处理，避免继续计时
    worker.onmessage = null
  }
  
  /**
   * 继续计时器
   */
  function resumeTimer() {
    if (!isRunning.value || !isPaused.value) return
    
    isPaused.value = false
    isAFK.value = false
    
    const worker = getTimerWorker()
    worker.onmessage = handleWorkerMessage
    worker.postMessage({ command: 'resume', payload: { interval: 1000 } })
  }
  
  /**
   * 停止计时器
   */
  function stopTimer() {
    if (!isRunning.value) return
    
    isRunning.value = false
    isPaused.value = false
    isAFK.value = false
    
    const worker = getTimerWorker()
    worker.postMessage({ command: 'stop' })
    worker.onmessage = null
    
    // 保存记录
    saveTimerRecord()
  }
  
  /**
   * 重置计时器
   */
  function resetTimer() {
    stopTimer()
    currentTime.value = 0
  }
  
  // ============ 同步相关方法 ============
  
  /**
   * 同步数据到服务器（每5秒调用一次）
   */
  async function syncToServer() {
    try {
      const userId = authStore.user?.id
      if (!userId) return
      
      // 调用 API 同步时间
      await userAPI.addTime({
        userId,
        seconds: SYNC_INTERVAL
      })
      
      console.log(`[Timer] 已同步 ${SYNC_INTERVAL} 秒到服务器`)
    } catch (error) {
      console.error('[Timer] 同步失败:', error)
    }
  }
  
  /**
   * 保存计时记录
   */
  async function saveTimerRecord() {
    try {
      console.log('计时记录已保存:', {
        duration: currentTime.value,
        todayTotal: todayDuration.value
      })
    } catch (error) {
      console.error('保存计时记录失败:', error)
    }
  }
  
  // ============ 挂机检测相关方法 ============
  
  /**
   * 检测鼠标位置（挂机检测）
   */
  async function checkAFK() {
    if (!window.electronAPI || isAFK.value) return
    
    try {
      // 获取当前鼠标位置
      const point = await window.electronAPI.getMousePoint()
      
      // 对比上次位置
      const hasMoved = lastMousePoint.value.x !== point.x || 
                       lastMousePoint.value.y !== point.y
      
      if (!hasMoved) {
        // 鼠标无移动，触发挂机状态
        triggerAFK()
      } else {
        // 鼠标有移动，更新记录位置
        lastMousePoint.value = { x: point.x, y: point.y }
      }
    } catch (error) {
      console.error('[Timer] 获取鼠标位置失败:', error)
    }
  }
  
  /**
   * 触发挂机状态
   */
  function triggerAFK() {
    isAFK.value = true
    pauseTimer()
    
    // 显示系统通知
    showAFKNotification()
  }
  
  /**
   * 显示挂机通知
   */
  function showAFKNotification() {
    // 清除旧通知
    if (afkNotification.value) {
      afkNotification.value.close()
    }
    
    // 检查通知权限
    if (Notification.permission === 'granted') {
      afkNotification.value = new Notification('检测到您已离开', {
        body: '点击恢复计时',
        icon: '/vite.svg',
        requireInteraction: true
      })
      
      // 监听通知点击事件
      afkNotification.value.onclick = () => {
        resumeTimer()
        afkNotification.value.close()
        afkNotification.value = null
        
        // 聚焦窗口
        if (window.electronAPI?.windowFocus) {
          window.electronAPI.windowFocus()
        }
      }
    } else if (Notification.permission !== 'denied') {
      // 请求权限
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showAFKNotification()
        }
      })
    }
  }
  
  /**
   * 初始化挂机检测
   * 在开始计时前调用，记录初始鼠标位置
   */
  async function initAFKDetection() {
    if (!window.electronAPI) return
    
    try {
      const point = await window.electronAPI.getMousePoint()
      lastMousePoint.value = { x: point.x, y: point.y }
    } catch (error) {
      console.error('[Timer] 初始化挂机检测失败:', error)
    }
  }
  
  // ============ 进度计算方法 ============
  
  /**
   * 计算进度条数值
   * @param {number} currentWeekTime - 当前周累计时间（秒）
   * @returns {object} big, middle, little 三个层级进度 (0-100)
   */
  function getTimerProgress(currentWeekTime) {
    // 864秒 = 24小时
    const percentage = Number((currentWeekTime / 864).toFixed(2))
    
    return {
      // 0-24小时档位
      big: percentage > 100 ? 100 : percentage,
      // 24-48小时档位
      middle: percentage - 100 < 0 ? 0 : (percentage - 100 > 100 ? 100 : percentage - 100),
      // 48-72小时档位
      little: percentage - 200 < 0 ? 0 : (percentage - 200 > 100 ? 100 : percentage - 200)
    }
  }
  
  /**
   * 计算今日进度百分比
   * @param {number} targetHours - 目标工时（默认 8 小时）
   * @returns {number} 0-100 百分比
   */
  function getTodayProgress(targetHours = 8) {
    const targetSeconds = targetHours * 3600
    const progress = (todayDuration.value / targetSeconds) * 100
    return Math.min(progress, 100)
  }
  
  // ============ 数据获取方法 ============
  
  /**
   * 获取统计数据
   */
  async function fetchStatistics() {
    try {
      const response = await mockAPI.mockStatistics()
      
      if (response.code === 200) {
        statistics.value = response.data
        todayDuration.value = Math.floor(response.data.todayHours * 3600)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }
  
  // ============ 清理方法 ============
  
  /**
   * 组件销毁时清理
   */
  function cleanup() {
    const worker = getTimerWorker()
    worker.postMessage({ command: 'stop' })
    worker.onmessage = null
    
    if (afkNotification.value) {
      afkNotification.value.close()
    }
  }
  
  return {
    // 状态
    isRunning,
    isPaused,
    isAFK,
    currentTime,
    todayDuration,
    lastMousePoint,
    SYNC_INTERVAL,
    AFK_CHECK_INTERVAL,
    
    // 计算属性
    formattedTime,
    pageClockTime,
    statistics,
    
    // 计时器方法
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    
    // 同步方法
    syncToServer,
    
    // 挂机检测方法
    initAFKDetection,
    checkAFK,
    triggerAFK,
    
    // 进度计算方法
    getTimerProgress,
    getTodayProgress,
    
    // 数据获取方法
    fetchStatistics,
    
    // 清理方法
    cleanup
  }
})
