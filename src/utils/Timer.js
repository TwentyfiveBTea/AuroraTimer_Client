/**
 * Timer Web Worker
 * 独立于渲染主线程的计时器，确保窗口最小化时计时依然精准
 */

// 计时器状态
let timerId = null
let elapsedSeconds = 0

/**
 * 启动计时器
 * @param {number} interval - 计时间隔（毫秒），默认 1000ms
 */
function startTimer(interval = 1000) {
  // 如果已有计时器，先停止
  if (timerId) {
    clearInterval(timerId)
  }
  
  elapsedSeconds = 0
  
  // 立即发送初始消息
  self.postMessage({
    type: 'tick',
    elapsed: elapsedSeconds,
    timestamp: Date.now()
  })
  
  // 启动计时器
  timerId = setInterval(() => {
    elapsedSeconds++
    
    self.postMessage({
      type: 'tick',
      elapsed: elapsedSeconds,
      timestamp: Date.now()
    })
  }, interval)
}

/**
 * 停止计时器
 * @returns {number} 已计时的秒数
 */
function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  
  const finalElapsed = elapsedSeconds
  elapsedSeconds = 0
  
  self.postMessage({
    type: 'stop',
    elapsed: finalElapsed
  })
  
  return finalElapsed
}

/**
 * 暂停计时器（不重置 elapsed）
 */
function pauseTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  
  self.postMessage({
    type: 'pause',
    elapsed: elapsedSeconds
  })
}

/**
 * 继续计时器
 * @param {number} interval - 计时间隔（毫秒），默认 1000ms
 */
function resumeTimer(interval = 1000) {
  if (timerId) {
    return // 已经在运行
  }
  
  timerId = setInterval(() => {
    elapsedSeconds++
    
    self.postMessage({
      type: 'tick',
      elapsed: elapsedSeconds,
      timestamp: Date.now()
    })
  }, interval)
  
  self.postMessage({
    type: 'resume',
    elapsed: elapsedSeconds
  })
}

/**
 * 获取当前已计时的秒数
 * @returns {number}
 */
function getElapsed() {
  return elapsedSeconds
}

/**
 * 重置计时器
 */
function resetTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  
  elapsedSeconds = 0
  
  self.postMessage({
    type: 'reset',
    elapsed: 0
  })
}

// 监听主线程消息
self.onmessage = function(event) {
  const { command, payload } = event.data
  
  switch (command) {
    case 'start':
      startTimer(payload?.interval || 1000)
      break
    
    case 'stop':
      stopTimer()
      break
    
    case 'pause':
      pauseTimer()
      break
    
    case 'resume':
      resumeTimer(payload?.interval || 1000)
      break
    
    case 'reset':
      resetTimer()
      break
    
    case 'getElapsed':
      self.postMessage({
        type: 'elapsed',
        elapsed: getElapsed()
      })
      break
    
    default:
      console.warn('Unknown timer command:', command)
  }
}
