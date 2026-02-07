import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationAPI, mockAPI } from '@/api'

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  
  // 获取通知列表
  async function fetchNotifications() {
    isLoading.value = true
    
    try {
      // 真实环境: const response = await notificationAPI.getNotifications()
      const response = await mockAPI.mockNotifications()
      
      if (response.code === 200) {
        notifications.value = response.data
        unreadCount.value = response.data.filter(n => !n.read).length
      }
    } catch (error) {
      console.error('获取通知失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 标记单个通知已读
  async function markAsRead(notificationId) {
    try {
      // 真实环境: await notificationAPI.markAsRead(notificationId)
      
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }
  
  // 标记所有通知已读
  async function markAllAsRead() {
    try {
      // 真实环境: await notificationAPI.markAllAsRead()
      
      notifications.value.forEach(n => {
        n.read = true
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('标记全部已读失败:', error)
    }
  }
  
  // 删除通知
  async function deleteNotification(notificationId) {
    try {
      // 真实环境: await notificationAPI.deleteNotification(notificationId)
      
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        const notification = notifications.value[index]
        if (!notification.read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        notifications.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除通知失败:', error)
    }
  }
  
  // 添加新通知（本地）
  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      time: '刚刚',
      ...notification
    })
    unreadCount.value++
  }
  
  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  }
})
