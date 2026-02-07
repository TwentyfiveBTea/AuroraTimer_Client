import { defineStore } from 'pinia'
import { ref } from 'vue'
import { leaderboardAPI, mockAPI } from '@/api'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  // 状态
  const rankings = ref([])
  const myRank = ref(null)
  const isLoading = ref(false)
  const timeRange = ref('week') // week, month, all
  
  // 时间范围选项
  const timeRanges = [
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'all', label: '全部' }
  ]
  
  // 获取排行榜数据
  async function fetchLeaderboard() {
    isLoading.value = true
    
    try {
      // 真实环境: const response = await leaderboardAPI.getLeaderboard({ range: timeRange.value })
      const response = await mockAPI.mockLeaderboard()
      
      if (response.code === 200) {
        rankings.value = response.data
        
        // 计算我的排名（模拟）
        const mockMyRank = {
          rank: 15,
          name: '我',
          hours: 28.5,
          projects: 6
        }
        myRank.value = mockMyRank
      }
    } catch (error) {
      console.error('获取排行榜失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 切换时间范围
  async function setTimeRange(range) {
    timeRange.value = range
    await fetchLeaderboard()
  }
  
  // 获取排名徽章样式
  function getRankBadgeStyle(rank) {
    if (rank === 1) return { bg: '#FFD700', color: '#FFF' } // 金色
    if (rank === 2) return { bg: '#C0C0C0', color: '#000' } // 银色
    if (rank === 3) return { bg: '#CD7F32', color: '#FFF' } // 铜色
    return { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }
  }
  
  return {
    rankings,
    myRank,
    isLoading,
    timeRange,
    timeRanges,
    fetchLeaderboard,
    setTimeRange,
    getRankBadgeStyle
  }
})
