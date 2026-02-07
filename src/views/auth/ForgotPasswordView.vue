<template>
  <div class="forgot-password-page">
    <!-- Background Blobs -->
    <div class="forgot-password-page__blobs">
      <div class="forgot-password-page__blob forgot-password-page__blob--1"></div>
      <div class="forgot-password-page__blob forgot-password-page__blob--2"></div>
    </div>
    
    <!-- Card Container -->
    <div class="forgot-password-card">
      <!-- Logo and Brand -->
      <div class="forgot-password-card__header">
        <h1 class="forgot-password-card__brand">
          <span class="forgot-password-card__logo">
            <span class="material-symbols-outlined">hourglass_bottom</span>
          </span>
          Aurora
        </h1>
        <p class="forgot-password-card__tagline">Studio Community</p>
      </div>
      
      <!-- Reset Form -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="!showSuccess" key="reset-form" class="forgot-password-card__body">
          <div class="forgot-password-card__title-area">
            <h2 class="forgot-password-card__title">忘记密码？</h2>
            <p class="forgot-password-card__subtitle">
              别担心，我们都有忘记的时候。<br/>
              请输入您的学号，我们将为您重置密码。
            </p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="forgot-password-form">
            <div class="form-group">
              <label class="form-label">输入学号</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">badge</span>
                <input 
                  v-model="form.studentId"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
              <p class="form-hint">
                <span class="material-symbols-outlined">info</span>
                您的密码将被重置为 123456
              </p>
            </div>
            
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
            >
              <span>重置密码</span>
            </button>
          </form>
          
          <div class="back-link">
            <router-link to="/login">
              <span class="material-symbols-outlined">arrow_back</span>
              返回登录
            </router-link>
          </div>
        </div>
        
        <!-- Success View -->
        <div v-else key="success-view" class="forgot-password-card__body">
          <div class="success-view">
            <div class="success-card">
              <div class="success-icon">
                <span class="material-symbols-outlined">check</span>
              </div>
              <h3 class="success-title">密码已重置！</h3>
              <p class="success-message">您的新密码为:</p>
              <div class="password-display">
                <span>123456</span>
              </div>
              <p class="success-hint">请登录后及时修改。</p>
            </div>
            
            <button class="back-btn" @click="goToLogin">
              返回登录
            </button>
          </div>
        </div>
      </transition>
      
      <!-- Footer Links -->
      <!-- Support & Privacy links removed for Electron app -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(false)
const showSuccess = ref(false)

const form = reactive({
  studentId: ''
})

async function handleSubmit() {
  if (!form.studentId.trim()) return
  
  isLoading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isLoading.value = false
  showSuccess.value = true
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
/* Page Container */
.forgot-password-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-bg-base);
  position: relative;
  overflow: hidden;
}

/* Background Blobs */
.forgot-password-page__blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.forgot-password-page__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.forgot-password-page__blob--1 {
  top: 15%;
  left: 25%;
  width: 600px;
  height: 600px;
  background-color: var(--color-primary);
  opacity: 0.08;
}

/* Card Container */
.forgot-password-card {
  width: 100%;
  max-width: 440px;
  background-color: var(--color-bg-panel);
  border-radius: 40px;
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 10;
  transition: all var(--transition-normal);
}

.forgot-password-card__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.forgot-password-card__brand {
  font-family: var(--font-family-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 var(--spacing-xs);
}

.forgot-password-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--color-primary);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.3);
}

.forgot-password-card__logo .material-symbols-outlined {
  font-size: 24px;
}

.forgot-password-card__tagline {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-weight: 600;
  margin: 0;
}

/* Card Body */
.forgot-password-card__body {
  transition: all var(--transition-normal);
}

.forgot-password-card__title-area {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.forgot-password-card__title {
  font-family: var(--font-family-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 var(--spacing-sm);
}

.forgot-password-card__subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Form Styles */
.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  text-align: left;
}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 52px;
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: var(--color-text-main);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all var(--transition-fast);
  outline: none;
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

.form-input:focus {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02), 0 0 0 3px rgba(212, 163, 115, 0.2);
}

.form-input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: var(--color-primary);
}

.form-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-left: 4px;
  font-size: 12px;
  color: var(--color-primary);
  opacity: 0.9;
}

.form-hint .material-symbols-outlined {
  font-size: 14px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px rgba(212, 163, 115, 0.25);
  transform: scale(1);
}

.submit-btn:hover:not(:disabled) {
  background-color: #C09060;
  transform: scale(1.02);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: scale(1);
}

/* Back Link */
.back-link {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.back-link a:hover {
  color: var(--color-primary);
}

.back-link .material-symbols-outlined {
  font-size: 16px;
  transition: transform var(--transition-fast);
}

.back-link a:hover .material-symbols-outlined {
  transform: translateX(-2px);
}

/* Success View */
.success-view {
  text-align: center;
}

.success-card {
  background-color: var(--color-success);
  background-color: rgba(204, 213, 174, 0.4);
  border: 1px solid rgba(204, 213, 174, 0.6);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: var(--spacing-lg);
}

.success-icon {
  width: 48px;
  height: 48px;
  background-color: #8B9D77;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.success-icon .material-symbols-outlined {
  font-size: 24px;
}

.success-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 var(--spacing-xs);
}

.success-message {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-sm);
}

.password-display {
  display: inline-block;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  margin-bottom: var(--spacing-sm);
}

.password-display span {
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.1em;
}

.success-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.back-btn {
  width: 100%;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-text-secondary);
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.back-btn:active {
  transform: scale(0.98);
}

/* Footer - removed */

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .forgot-password-card {
    margin: var(--spacing-md);
    max-width: calc(100% - 32px);
  }
  
  .forgot-password-page__blob {
    display: none;
  }
}
</style>
