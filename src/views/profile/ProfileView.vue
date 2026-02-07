<template>
  <div class="profile-page">
    <!-- Main Content -->
    <div class="profile-page__content">
      <!-- Main Area -->
      <main class="profile-page__main">
        <!-- Header Spacer -->
        <div class="profile-page__header-spacer"></div>
        
        <!-- Content Area -->
        <div class="profile-page__page-content">
          <!-- Main Grid -->
          <div class="profile-page__grid">
            <!-- Left Profile Card -->
            <div class="profile-page__card profile-page__card--left">
              <!-- Page Title -->
              <div class="profile-page__title-area">
                <h2 class="profile-page__title">个人资料</h2>
                <p class="profile-page__subtitle">管理你的个人信息</p>
              </div>

              <!-- Avatar -->
              <div class="profile-page__avatar-container">
                <div class="profile-page__avatar">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuABV_yUC3McLtLuSxjjIG4WdcuQcMmDt5BtwVF4mKSCylby9tfA_xe4OQ9NX0tPcEm7W7KtUgFr8DvYmDylT7ATCBEY_aJwV9xAqWMLtj9DjxjiU9bUqIQDt3JQ_8R1Lkq7xpeMGG7VxfsOxA4pwV4xgVRdeEDibuteEVT_9mXfFsVWMRp0pRjVcps8-sJrQ2DhgUXNjEVSu-_HgiDLPNYsawQmKbkHnpnUslzbtcbaxjH_aeXm-7GvhPmBbdb5b-0IUUcUb32TmCD7" 
                    alt="User Avatar"
                    class="profile-page__avatar-img"
                  />
                  <div class="profile-page__avatar-overlay">
                    <span class="material-symbols-outlined">photo_camera</span>
                  </div>
                  <div class="profile-page__avatar-edit">
                    <span class="material-symbols-outlined">edit</span>
                  </div>
                </div>
              </div>
              
              <!-- Name -->
              <h3 class="profile-page__name">张三</h3>
              
              <!-- Direction -->
              <p class="profile-page__direction">前端开发</p>
              
              <!-- Divider -->
              <div class="profile-page__divider"></div>
              
              <!-- Info List -->
              <div class="profile-page__info-list">
                <div class="profile-page__info-item">
                  <span class="profile-page__info-label">学号</span>
                  <span class="profile-page__info-value">20230001</span>
                </div>
                <div class="profile-page__info-item">
                  <span class="profile-page__info-label">职位</span>
                  <span class="profile-page__info-value">成员</span>
                </div>
                <div class="profile-page__info-item">
                  <span class="profile-page__info-label">注册时间</span>
                  <span class="profile-page__info-value">2023-01-15</span>
                </div>
              </div>
            </div>
            
            <!-- Right Edit Form -->
            <div class="profile-page__card profile-page__card--right">
              <div class="profile-page__form-container">
                <!-- Direction and Position Row -->
                <div class="profile-page__change-row">
                  <!-- Change Direction Section -->
                  <section class="profile-page__section profile-page__section--half">
                    <div class="profile-page__section-header">
                      <span class="material-symbols-outlined section-icon">category</span>
                      <h4 class="profile-page__section-title">方向变更</h4>
                    </div>
                    
                    <div class="form-group form-group--full">
                      <label class="form-label">专业方向</label>
                      <div class="input-wrapper">
                        <select v-model="form.direction" class="form-input form-input--select">
                          <option value="" disabled>请选择方向</option>
                          <option v-for="option in directionOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                          </option>
                        </select>
                        <span class="material-symbols-outlined select-icon select-icon--direction">arrow_drop_down</span>
                      </div>
                    </div>
                  </section>
                  
                  <!-- Change Position Section -->
                  <section class="profile-page__section profile-page__section--half">
                    <div class="profile-page__section-header">
                      <span class="material-symbols-outlined section-icon">badge</span>
                      <h4 class="profile-page__section-title">职位变更</h4>
                    </div>
                    
                    <div class="form-group form-group--full">
                      <label class="form-label">当前职位</label>
                      <div class="input-wrapper">
                        <select v-model="form.position" class="form-input form-input--select">
                          <option value="" disabled>请选择职位</option>
                          <option v-for="option in positionOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                          </option>
                        </select>
                        <span class="material-symbols-outlined select-icon select-icon--position">arrow_drop_down</span>
                      </div>
                    </div>
                  </section>
                </div>
                
                <!-- Divider -->
                <div class="profile-page__divider profile-page__divider--large"></div>
                
                <!-- Change Email Section -->
                <section class="profile-page__section">
                  <div class="profile-page__section-header">
                    <span class="material-symbols-outlined section-icon">mail</span>
                    <h4 class="profile-page__section-title">修改邮箱</h4>
                  </div>
                  
                  <div class="form-group form-group--full">
                    <label class="form-label">邮箱地址</label>
                    <div class="input-wrapper input-wrapper--full">
                      <span class="material-symbols-outlined input-icon">mail</span>
                      <input 
                        v-model="form.email"
                        type="email"
                        class="form-input form-input--with-icon"
                        :class="{ 'form-input--error': errors.email }"
                        placeholder="请输入新邮箱地址"
                        @blur="validateEmail"
                        @input="validateEmail"
                      />
                    </div>
                    <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
                  </div>
                </section>
                
                <!-- Divider -->
                <div class="profile-page__divider profile-page__divider--large"></div>
                
                <!-- Password Section -->
                <section class="profile-page__section">
                  <div class="profile-page__section-header">
                    <span class="material-symbols-outlined section-icon">lock_reset</span>
                    <h4 class="profile-page__section-title">修改密码</h4>
                  </div>
                  
                  <div class="profile-page__password-form">
                    <div class="form-group">
                      <label class="form-label">当前密码</label>
                      <div class="input-wrapper input-wrapper--password">
                        <input 
                          v-model="form.currentPassword"
                          :type="showCurrentPassword ? 'text' : 'password'"
                          class="form-input form-input--full-width"
                        />
                        <button 
                          type="button" 
                          class="password-toggle"
                          @click="toggleShowPassword('current')"
                        >
                          <span class="material-symbols-outlined">
                            {{ showCurrentPassword ? 'visibility_off' : 'visibility' }}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div class="profile-page__password-row">
                      <div class="form-group">
                        <label class="form-label">新密码</label>
                        <div class="input-wrapper input-wrapper--password">
                          <input 
                            v-model="form.newPassword"
                            :type="showNewPassword ? 'text' : 'password'"
                            class="form-input"
                            :class="{ 'form-input--error': errors.password }"
                            @blur="validatePassword"
                            @input="validatePassword"
                          />
                          <button 
                            type="button" 
                            class="password-toggle"
                            @click="toggleShowPassword('new')"
                          >
                            <span class="material-symbols-outlined">
                              {{ showNewPassword ? 'visibility_off' : 'visibility' }}
                            </span>
                          </button>
                        </div>
                        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
                      </div>
                      <div class="form-group">
                        <label class="form-label">确认新密码</label>
                        <div class="input-wrapper input-wrapper--password">
                          <input 
                            v-model="form.confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="form-input"
                            :class="{ 'form-input--error': errors.confirmPassword }"
                            @blur="validateConfirmPassword"
                            @input="validateConfirmPassword"
                          />
                          <button 
                            type="button" 
                            class="password-toggle"
                            @click="toggleShowPassword('confirm')"
                          >
                            <span class="material-symbols-outlined">
                              {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                            </span>
                          </button>
                        </div>
                        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
                      </div>
                    </div>
                    <div class="password-hint">
                      <span class="material-symbols-outlined hint-icon">info</span>
                      <p class="hint-text">密码长度至少为 8 位，且包含字母和数字。</p>
                    </div>
                  </div>
                </section>
                
                <!-- Footer Actions -->
                <div class="profile-page__footer">
                  <button 
                    class="profile-page__btn profile-page__btn--primary"
                    :disabled="!isFormValid"
                  >
                    <span class="material-symbols-outlined btn-icon">save</span>
                    保存修改
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const form = reactive({
  email: '',
  direction: '',
  position: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 密码显示切换状态
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleShowPassword = (field) => {
  if (field === 'current') {
    showCurrentPassword.value = !showCurrentPassword.value
  } else if (field === 'new') {
    showNewPassword.value = !showNewPassword.value
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}

const directionOptions = [
  { value: 'frontend', label: '前端' },
  { value: 'backend', label: '后端' },
  { value: 'design', label: '设计' },
  { value: 'algorithm', label: '算法' },
  { value: 'embedded', label: '嵌入式' },
  { value: 'data_analysis', label: '数据分析' },
  { value: 'cybersecurity', label: '网络安全' }
]

const positionOptions = [
  { value: 'leader', label: '负责人' },
  { value: 'deputy_leader', label: '副负责人' },
  { value: 'frontend_leader', label: '前端组长' },
  { value: 'backend_leader', label: '后端组长' },
  { value: 'design_leader', label: '设计组长' },
  { value: 'algorithm_leader', label: '算法组长' },
  { value: 'embedded_leader', label: '嵌入式组长' },
  { value: 'data_analysis_leader', label: '数据分析组长' },
  { value: 'cybersecurity_leader', label: '网络安全组长' },
  { value: 'member', label: '正式成员' },
  { value: 'probation', label: '考核成员' }
]

// Email validation
function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = ''
  } else if (!emailRegex.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
  } else {
    errors.email = ''
  }
}

// Password validation
function validatePassword() {
  const password = form.newPassword
  if (!password) {
    errors.password = ''
  } else if (password.length < 8) {
    errors.password = '密码长度至少为 8 位'
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = '密码必须包含字母和数字'
  } else {
    errors.password = ''
  }
}

// Confirm password validation
function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = ''
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
  } else {
    errors.confirmPassword = ''
  }
}

// Form validation status
const isFormValid = computed(() => {
  const emailValid = form.email && !errors.email
  const directionValid = !!form.direction
  const passwordValid = !form.newPassword || 
    (form.newPassword.length >= 8 && 
     /[a-zA-Z]/.test(form.newPassword) && 
     /[0-9]/.test(form.newPassword))
  const confirmValid = !form.newPassword || form.newPassword === form.confirmPassword
  
  return emailValid && directionValid && passwordValid && confirmValid
})

function handleSave() {
  console.log('Saving profile:', form)
}
</script>

<style scoped>
/* Page Container */
.profile-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg-base);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* Main Content */
.profile-page__content {
  display: flex;
  flex: 1;
  height: 100%;
}

/* Main Area */
.profile-page__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  height: 100%;
}

.profile-page__header-spacer {
  height: 0;
  flex-shrink: 0;
}

/* Page Content */
.profile-page__page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 var(--spacing-md) 0 0;
  min-height: 0;
}

/* Title Area in Left Card */
.profile-page__title-area {
  margin-bottom: var(--spacing-lg);
  text-align: left;
  width: 100%;
}

.profile-page__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 var(--spacing-xs);
}

.profile-page__subtitle {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Main Grid */
.profile-page__grid {
  display: flex;
  gap: var(--spacing-lg);
  flex: 1;
  min-height: 0;
  height: 100%;
}

/* Cards */
.profile-page__card {
  background-color: var(--color-bg-panel);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

/* Left Card */
.profile-page__card--left {
  width: 280px;
  flex-shrink: 0;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  min-height: 0;
}

/* Avatar */
.profile-page__avatar-container {
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.profile-page__avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.profile-page__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-page__avatar-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.profile-page__avatar:hover .profile-page__avatar-overlay {
  opacity: 1;
}

.profile-page__avatar-overlay .material-symbols-outlined {
  font-size: 28px;
  color: white;
}

.profile-page__avatar-edit {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  color: var(--color-text-secondary);
}

.profile-page__avatar-edit .material-symbols-outlined {
  font-size: 16px;
}

/* Name */
.profile-page__name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 var(--spacing-xs);
  text-align: center;
}

/* Direction */
.profile-page__direction {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0 0 var(--spacing-lg);
  text-align: center;
}

/* Divider */
.profile-page__divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-sm) 0;
}

.profile-page__divider--large {
  margin: var(--spacing-sm) 0;
}

/* Info List */
.profile-page__info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.profile-page__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-page__info-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.profile-page__info-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-main);
  font-family: var(--font-family-main);
}

/* Right Card */
.profile-page__card--right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  height: 100%;
}

.profile-page__form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--spacing-lg);
  min-height: 0;
}

/* Sections */
.profile-page__section {
  margin-bottom: var(--spacing-sm);
  box-sizing: border-box;
}

.profile-page__section--half {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
}

.profile-page__change-row {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  box-sizing: border-box;
}

.profile-page__section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.section-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.profile-page__section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
}

/* Form Grid */
.profile-page__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.form-group--full {
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-main);
  margin-bottom: var(--spacing-sm);
}

.form-input {
  height: 52px;
  padding: 0 var(--spacing-lg);
  padding-right: 44px;
  background-color: var(--color-bg-base);
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 15px;
  color: var(--color-text-main);
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
  width: 100%;
}

.form-input:focus {
  border-color: var(--color-primary);
  background-color: var(--color-bg-panel);
  box-shadow: 0 0 0 3px rgba(223, 164, 115, 0.1);
}

.form-input::placeholder {
  color: var(--color-text-secondary);
}

/* Input with Icon */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.input-wrapper--full {
  max-width: 600px;
}

/* Password Toggle Button */
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
  z-index: 1;
}

.password-toggle:hover {
  color: var(--color-text-main);
}

.password-toggle .material-symbols-outlined {
  font-size: 22px;
}

/* 确保密码输入框正确继承宽度 */
.form-input--full-width {
  width: 100%;
  box-sizing: border-box;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: var(--color-text-secondary);
  z-index: 1;
}

.form-input--with-icon {
  padding-left: 48px;
}

/* Select */
.form-input--select {
  width: 100%;
  padding-right: 48px;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
}

.form-input--full-width {
  width: 100%;
  max-width: none;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: var(--color-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.select-icon--direction {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: var(--color-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.select-icon--position {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: var(--color-text-secondary);
  pointer-events: none;
  z-index: 1;
}

/* Textarea */
.form-input--textarea {
  height: auto;
  padding: var(--spacing-md);
  resize: none;
}

/* Password Form */
.profile-page__password-form {
  max-width: 480px;
}

.profile-page__password-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-sm);
}

/* Password Hint */
.password-hint {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
  padding-top: var(--spacing-xs);
}

.hint-icon {
  font-size: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.hint-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Error Message */
.error-message {
  font-size: 12px;
  color: #dc3545;
  margin: 6px 0 0 0;
  font-weight: 500;
}

/* Form Input Error State */
.form-input--error {
  border-color: #dc3545 !important;
}

/* Footer */
.profile-page__footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-md) var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  flex-shrink: 0;
  margin-top: auto;
  background-color: transparent;
  border-radius: 0 0 var(--radius-xl) 0;
}

.profile-page__btn {
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.profile-page__btn--secondary {
  background-color: var(--color-bg-base);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.profile-page__btn--secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: var(--color-text-secondary);
}

.profile-page__btn--primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(223, 164, 115, 0.3);
}

.profile-page__btn--primary:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.profile-page__btn--primary:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 18px;
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-page__grid {
    flex-direction: column;
  }
  
  .profile-page__card--left {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
  }
  
  .profile-page__avatar-container {
    margin-bottom: 0;
  }
  
  .profile-page__divider {
    width: 1px;
    height: 100%;
    margin: 0 var(--spacing-lg);
  }
  
  .profile-page__info-list {
    flex: 1;
  }
  
  .profile-page__card--right {
    min-height: 600px;
  }
}

@media (max-width: 768px) {
  .profile-page__form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group--full {
    grid-column: span 1;
  }
  
  .profile-page__password-row {
    grid-template-columns: 1fr;
  }
}
</style>
