<template>
  <div class="notifications-page">
    <!-- Page Container -->
    <div class="notifications-page__container">
      <!-- Main Content -->
      <main class="notifications-page__main">
        <!-- Header -->
        <header class="notifications-page__header">
          <div class="notifications-page__header-info">
            <h2 class="notifications-page__title">通知中心</h2>
            <p class="notifications-page__subtitle">随时了解工作室最新公告。</p>
          </div>
          
          <div class="notifications-page__header-actions">
            <button class="header-action">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="header-divider"></div>
            <button class="header-btn" @click="markAllAsRead">全部已读</button>
          </div>
        </header>
        
        <!-- Content Area -->
        <div class="notifications-page__content">
          <!-- Notifications List -->
          <div class="notifications-list">
            <!-- Dynamic Sections by Date -->
            <div 
              v-for="(notifications, dateKey) in groupedNotifications" 
              :key="dateKey"
              class="notifications-section"
            >
              <div class="notifications-section__header">
                <span class="notifications-section__label">{{ formatSectionDate(dateKey) }}</span>
                <div class="notifications-section__divider"></div>
              </div>
              
              <!-- Notification Items -->
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
              >
                <div class="notification-item__meta">
                  <span class="notification-item__time">{{ formatTime(notification.time) }}</span>
                </div>
                <div class="notification-item__content">
                  <div 
                    class="notification-item__icon" 
                    :class="getIconClass(notification.type)"
                  >
                    <NotificationIcons 
                      :type="notification.type" 
                      :size="24" 
                      :color="getIconColor(notification.type)"
                    />
                  </div>
                  <div class="notification-item__body">
                    <h3 class="notification-item__title">{{ notification.title }}</h3>
                    <p class="notification-item__message" v-html="notification.message"></p>
                    <div class="notification-item__tags">
                      <span 
                        class="notification-tag" 
                        :class="`notification-tag--${notification.type}`"
                      >
                        {{ getTypeLabel(notification.type) }}
                      </span>
                    </div>
                    <div 
                      v-if="notification.meetingInfo" 
                      class="notification-item__meeting"
                    >
                      <span class="material-symbols-outlined">location_on</span>
                      <span>{{ notification.meetingInfo.location }}</span>
                      <span class="meeting-divider">|</span>
                      <span class="material-symbols-outlined">schedule</span>
                      <span>{{ notification.meetingInfo.time }}</span>
                    </div>
                    <div 
                      v-if="notification.cleaningInfo" 
                      class="notification-item__cleaning"
                    >
                      <span class="material-symbols-outlined">schedule</span>
                      <span>{{ notification.cleaningInfo.time }}</span>
                      <span class="cleaning-divider">|</span>
                      <span class="material-symbols-outlined">person</span>
                      <span>{{ notification.cleaningInfo.assigned }}</span>
                    </div>
                    <div 
                      v-if="notification.actions" 
                      class="notification-item__actions"
                    >
                      <button 
                        v-for="action in notification.actions" 
                        :key="action.label"
                        class="notification-btn"
                        :class="{ 'notification-btn--secondary': action.secondary }"
                        @click="handleAction(action)"
                      >
                        {{ action.label }}
                      </button>
                      <div v-if="notification.participants" class="notification-participants">
                        <div 
                          v-for="(avatar, index) in notification.participants.slice(0, 3)" 
                          :key="index"
                          class="participant-avatar"
                          :style="{ backgroundImage: `url(${avatar})` }"
                        ></div>
                        <span v-if="notification.participants.length > 3" class="participant-more">
                          +{{ notification.participants.length - 3 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Sidebar - Leaderboard -->
          <aside class="notifications-page__leaderboard">
            <div class="leaderboard-header">
              <div class="leaderboard-header__title">
                <span class="material-symbols-outlined leaderboard-header__icon">gavel</span>
                <h3>处刑榜</h3>
              </div>
              <span class="leaderboard-header__badge">上周</span>
            </div>
            
            <div class="leaderboard-list">
              <!-- Leaderboard Item 1 -->
              <div class="leaderboard-item">
                <div class="leaderboard-item__avatar">
                  <div 
                    class="leaderboard-item__avatar-image" 
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnvBnOwNv71ZezHWZy6aWcIRBCTqFnkjesapwbSb8kxoTZmQQuZx6Z-m2g90oRLxSA5eWXn_RRUS-Wk-txjj0SSZOMioV2O08F9u4XQQrmZn3057tg1mIYWUXZkCRoHKeGNWMK6ZyIHo_2CpIenySKm9eSnBwH8GoYIbJi4_MkWJHORIOvx2LYkDZYqcJwsoi08cKmFRGCHhFBxPRancZcxANpKUygvPPyrV9suIbxbf-RLGh3Hu1iyfDjtcP-dZDFuGQBg29bUF_k')"
                  ></div>
                  <div class="leaderboard-item__status leaderboard-item__status--danger">
                    <span class="material-symbols-outlined">timer_off</span>
                  </div>
                </div>
                <div class="leaderboard-item__info">
                  <h4 class="leaderboard-item__name">Michael Scott</h4>
                  <p class="leaderboard-item__hours">上周打卡: 32h</p>
                </div>
              </div>
              
              <!-- Leaderboard Item 2 -->
              <div class="leaderboard-item">
                <div class="leaderboard-item__avatar">
                  <div 
                    class="leaderboard-item__avatar-image" 
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8t2uhQ1iwT2b9AWL0ClblmNdN9aIDVDpRu7YKp4-WeyAUmxvlnH-PXBNQnZipTPxSLO2iLtj-qYfLoFQ87KR8lWDgH9DRq_uHsSL6hET9-TNoweJWzRlbkZI18JinqUcTlOgKZhMuDN8r8f6TLdkf6Gai9vzFdJU2h7rSO8Yerf7IPtlEcoLmuKYdRLykfrijwUH_CyNruTsjyDrvmzWN1T1ybntnuDifbPO7KLb8wnRySf0LRHWNk6VMWx1wzxGLNSQpPcHzW4eb')"
                  ></div>
                  <div class="leaderboard-item__status leaderboard-item__status--warning">
                    <span class="material-symbols-outlined">hourglass_empty</span>
                  </div>
                </div>
                <div class="leaderboard-item__info">
                  <h4 class="leaderboard-item__name">Pam Beesly</h4>
                  <p class="leaderboard-item__hours">上周打卡: 28h</p>
                </div>
              </div>
              
              <!-- Leaderboard Item 3 -->
              <div class="leaderboard-item">
                <div class="leaderboard-item__avatar">
                  <div 
                    class="leaderboard-item__avatar-image leaderboard-item__avatar-image--grayscale" 
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-RA-crptscEZ16ZNMYic2EHojP_EyvXP5T6yK4tbqPlEoLZwXnWZ7EFGVD-AhcVLbrNGjBJva1NORr0zmdEScYgkwr14nggnK29by2f3je7QRSy56lJclUm5UVrclkh81iiC7DKvVATNLkzLA4szPZ5GtU5hHkYnSIusQYuwZOFnS5BsZmMVlM5FhCxKuRptMV-44OuDOSBAfM-jatidv6YxB4lRaMRKk_GkrvsxPIO3RFsLke8tY7sNfSeQwpG2cx6g_iptue0e2')"
                  ></div>
                  <div class="leaderboard-item__status leaderboard-item__status--disabled">
                    <span class="material-symbols-outlined">block</span>
                  </div>
                </div>
                <div class="leaderboard-item__info">
                  <h4 class="leaderboard-item__name">Ryan Howard</h4>
                  <p class="leaderboard-item__hours">上周打卡: 15h</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NotificationIcons from '@/components/NotificationIcons.vue'

// 通知数据 - 使用ISO日期时间格式
const notifications = ref([
  {
    id: 1,
    type: 'system',
    title: '系统维护计划',
    message: '服务器将于本周五凌晨 2:00 (UTC) 进行例行维护。请在此之前保存并同步您的工作。',
    time: '2025-02-07T02:00:00',
    read: false,
    dateKey: '2025-02-07'
  },
  {
    id: 2,
    type: 'meeting',
    title: '每周设计评审',
    message: '每周设计同步即将开始。我们将评审新的 <strong>移动端仪表盘</strong> 方案。',
    time: '2025-02-07T10:30:00',
    read: false,
    dateKey: '2025-02-07',
    meetingInfo: {
      location: '会议室 A',
      time: '14:00'
    },
    actions: [
      { label: '加入会议', action: 'join' },
      { label: '详情', action: 'details', secondary: true }
    ],
    participants: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4KPiGgTxPTsbxUfCRZtsABfPZW3yfkB9zNTFJi25S7W4jhLJgfx0GtVHAE272Yv1pQwV0ykxVwaly5PA7fwrcD3uveUTFZAZhVMHuiYAvZDktE_5uuP-0D-KOKgQZxSuVVjwMWZqjsL3kLgy0IsEkxnKADQ62uDKoq6K-Mqa3utLeTbZjbgUFm9JEkwWYI35AuSX6_H3967_FXwUqYZgHBRXcqWmYOrL_uqK3-hcMoqAV9kmT2qJwBZznVAHe_VgZUYmIIijZY642',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDv8SL2ecOrHf4tp4GF2cbR4lBJSe1e75lGh3WR-e1XteIT6klyK2iiR8cYukzzkP_JeQncdaqt4NhXiZvmfM1R1IR7iDpwRc5ToREbj-nNEeOIOBZ4Bq_Je4F4g9oyQMA2QgYvRykT0MDXrMf3DLKk3oVIq6SasKvWzG979yCBEh52BQxYbBw47TeSCu7sd6eiKQyFZWI8qbsQIp4xJeWaXinkWIIhklCjGTQE6wm4oZcxBz7mSzWmvEv94Q4lITgAHKhyjnuKgPhw'
    ]
  },
  {
    id: 3,
    type: 'event',
    title: '工作室周年庆活动',
    message: '为庆祝工作室成立五周年，我们将举办特别庆祝活动，欢迎所有成员参加！',
    time: '2025-02-07T14:00:00',
    read: false,
    dateKey: '2025-02-07',
    actions: [
      { label: '报名参加', action: 'join' },
      { label: '了解更多', action: 'details', secondary: true }
    ]
  },
  {
    id: 4,
    type: 'cleaning',
    title: '本周值日安排',
    message: '本周工作室值日安排已发布，请各位同事按时完成清洁工作。',
    time: '2025-02-06T09:00:00',
    read: false,
    dateKey: '2025-02-06',
    cleaningInfo: {
      time: '周一至周五 18:00-19:00',
      assigned: '第一组: 张三、李四'
    }
  },
  {
    id: 5,
    type: 'other',
    title: '工作室订阅续费提醒',
    message: '您的创意云订阅将于 2025-02-10 到期，请及时续费以继续使用全部功能。',
    time: '2025-02-05T12:00:00',
    read: true,
    dateKey: '2025-02-05'
  },
  {
    id: 6,
    type: 'meeting',
    title: '项目进度汇报会议',
    message: '请各部门负责人准备本周进度汇报材料，准时参加项目会议。',
    time: '2025-02-04T08:00:00',
    read: true,
    dateKey: '2025-02-04',
    meetingInfo: {
      location: '线上会议',
      time: '10:00'
    }
  },
  {
    id: 7,
    type: 'system',
    title: '新功能上线通知',
    message: '全新的 <strong>团队协作面板</strong> 功能现已上线，帮助您更好地管理团队任务。',
    time: '2025-02-03T10:00:00',
    read: true,
    dateKey: '2025-02-03'
  },
  {
    id: 8,
    type: 'cleaning',
    title: '周末清洁检查结果',
    message: '上周值日工作检查完成，整体卫生状况良好继续保持！',
    time: '2025-02-02T14:00:00',
    read: true,
    dateKey: '2025-02-02'
  },
  {
    id: 9,
    type: 'event',
    title: '技术分享会报名',
    message: '本周五将举办前端性能优化技术分享会，名额有限，先到先得！',
    time: '2025-02-01T09:00:00',
    read: true,
    dateKey: '2025-02-01'
  }
])

// 按日期分组通知
const groupedNotifications = computed(() => {
  const groups = {}
  notifications.value.forEach(notification => {
    const dateKey = notification.dateKey
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(notification)
  })
  return groups
})

// 格式化日期显示
function formatSectionDate(dateKey) {
  const today = new Date()
  const targetDate = new Date(dateKey + 'T00:00:00')
  
  // 格式化日期为 yyyy-mm-dd
  const formattedDate = formatDate(targetDate)
  
  // 判断是否为今天或昨天
  const todayStr = formatDate(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = formatDate(yesterday)
  
  if (dateKey === todayStr) {
    return `今天 ${formattedDate}`
  } else if (dateKey === yesterdayStr) {
    return `昨天 ${formattedDate}`
  }
  
  return formattedDate
}

// 格式化时间为 hh:mm:ss
function formatTime(timeString) {
  if (!timeString) return ''
  const date = new Date(timeString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// 格式化日期为 yyyy-mm-dd
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取图标颜色
function getIconColor(type) {
  const colorMap = {
    'system': '#3B82F6',      // 蓝色 - 系统
    'event': '#F97316',      // 橙色 - 活动
    'meeting': '#10B981',    // 绿色 - 会议
    'cleaning': '#06B6D4',   // 青色 - 值日
    'other': '#6B7280'       // 灰色 - 其他
  }
  return colorMap[type] || '#6B7280'
}

// 获取图标背景类
function getIconClass(type) {
  const classMap = {
    'system': 'notification-item__icon--blue',
    'event': 'notification-item__icon--orange',
    'meeting': 'notification-item__icon--green',
    'cleaning': 'notification-item__icon--cyan',
    'other': 'notification-item__icon--gray'
  }
  return classMap[type] || 'notification-item__icon--gray'
}

// 获取类型标签
function getTypeLabel(type) {
  const labelMap = {
    'system': '系统',
    'event': '活动',
    'meeting': '会议',
    'cleaning': '值日',
    'other': '其他'
  }
  return labelMap[type] || '通知'
}

// 处理操作
function handleAction(action) {
  console.log('Action triggered:', action.action)
}

function markAllAsRead() {
  console.log('Mark all as read')
}
</script>

<style scoped>
/* Page Container */
.notifications-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notifications-page__container {
  display: flex;
  flex: 1;
  gap: var(--spacing-md);
  overflow: hidden;
}

/* Window Controls */
.window-controls {
  position: fixed;
  top: 16px;
  left: 24px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

.window-control {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.window-control--red {
  background-color: #FF5F57;
}

.window-control--yellow {
  background-color: #FEBC2E;
}

.window-control--green {
  background-color: #28C840;
}

/* Sidebar Navigation */
.notifications-page__sidebar {
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-lg) 0;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-height: 400px;
}

.sidebar-nav__top,
.sidebar-nav__bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.sidebar-nav__item {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.sidebar-nav__item:hover {
  background-color: rgba(0, 0, 0, 0.03);
  color: var(--color-primary);
}

.sidebar-nav__item--active {
  background-color: var(--color-primary);
  color: var(--color-bg-panel);
  box-shadow: 0 4px 12px rgba(223, 164, 115, 0.3);
}

.sidebar-nav__icon {
  font-size: 24px;
}

/* Main Content */
.notifications-page__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.notifications-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.notifications-page__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 2px;
}

.notifications-page__subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.notifications-page__header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-action {
  padding: var(--spacing-xs);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.header-action:hover {
  color: var(--color-primary);
}

.header-action .material-symbols-outlined {
  font-size: 20px;
}

.header-divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
}

.header-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.header-btn:hover {
  color: var(--color-primary-dark);
}

/* Content Area */
.notifications-page__content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Notifications List */
.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
  padding-right: var(--spacing-md);
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* Notifications Section */
.notifications-section {
  margin-bottom: var(--spacing-lg);
}

.notifications-section__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.notifications-section__label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.notifications-section__divider {
  flex: 1;
  height: 1px;
  background-color: var(--color-border-light);
}

/* Notification Item */
.notification-item {
  background-color: var(--color-bg-card);
  border-radius: 16px;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
  border: 1px solid transparent;
}

.notification-item:hover {
  background-color: var(--color-bg-panel);
  border-color: var(--color-border-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.notification-item__meta {
  margin-bottom: var(--spacing-sm);
}

.notification-item__time {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: var(--font-family-main);
}

.notification-item__content {
  display: flex;
  gap: var(--spacing-md);
}

.notification-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-item__icon .material-symbols-outlined {
  font-size: 24px;
}

.notification-item__icon--blue {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.notification-item__icon--orange {
  background-color: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.notification-item__icon--green {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.notification-item__icon--cyan {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06B6D4;
}

.notification-item__icon--gray {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.notification-item__body {
  flex: 1;
  min-width: 0;
}

.notification-item__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 var(--spacing-xs);
}

.notification-item__message {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0 0 var(--spacing-sm);
}

.notification-item__message strong {
  font-weight: 600;
  color: var(--color-text-main);
}

.notification-item__tags {
  display: flex;
  gap: var(--spacing-xs);
}

.notification-tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.notification-tag--system {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.notification-tag--event {
  background-color: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.notification-tag--meeting {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.notification-tag--cleaning {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06B6D4;
}

.notification-tag--other {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.notification-item__meeting,
.notification-item__cleaning {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.notification-item__meeting .material-symbols-outlined,
.notification-item__cleaning .material-symbols-outlined {
  font-size: 16px;
}

.meeting-divider,
.cleaning-divider {
  color: var(--color-border);
}

.notification-item__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.notification-btn {
  padding: 6px 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.notification-btn:hover {
  background-color: var(--color-primary-dark);
}

.notification-btn--secondary {
  background-color: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.notification-btn--secondary:hover {
  background-color: rgba(0, 0, 0, 0.02);
  color: var(--color-text-main);
}

.notification-participants {
  display: flex;
  align-items: center;
}

.participant-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  background-size: cover;
  background-position: center;
  margin-left: -8px;
}

.participant-avatar:first-child {
  margin-left: 0;
}

.participant-more {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 700;
  color: var(--color-text-muted);
  margin-left: -8px;
}

/* Right Sidebar - Leaderboard */
.notifications-page__leaderboard {
  width: 320px;
  border-left: 1px solid var(--color-border-light);
  background-color: rgba(0, 0, 0, 0.02);
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex-shrink: 0;
}

.notifications-page__leaderboard::-webkit-scrollbar {
  width: 4px;
}

.notifications-page__leaderboard::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-page__leaderboard::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.leaderboard-header__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.leaderboard-header__icon {
  color: #EF4444;
  font-size: 20px;
}

.leaderboard-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
}

.leaderboard-header__badge {
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-panel);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.leaderboard-item__avatar {
  position: relative;
  flex-shrink: 0;
}

.leaderboard-item__avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.leaderboard-item__avatar-image--grayscale {
  filter: grayscale(100%);
}

.leaderboard-item__status {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.leaderboard-item__status .material-symbols-outlined {
  font-size: 12px;
}

.leaderboard-item__status--danger {
  background-color: #FEE2E2;
  color: #DC2626;
}

.leaderboard-item__status--warning {
  background-color: #FEF3C7;
  color: #D97706;
}

.leaderboard-item__status--disabled {
  background-color: #F3F4F6;
  color: #6B7280;
}

.leaderboard-item__info {
  flex: 1;
  min-width: 0;
}

.leaderboard-item__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.leaderboard-item__hours {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive */
@media (max-width: 1024px) {
  .notifications-page__leaderboard {
    display: none;
  }
}

@media (max-width: 768px) {
  .window-controls {
    display: none;
  }
  
  .notifications-page__sidebar {
    display: none;
  }
  
  .notifications-page__header {
    padding: var(--spacing-md);
  }
  
  .notifications-list {
    padding: var(--spacing-md);
  }
}
</style>
