<template>
  <div class="home-container">
    <div class="header">
      <h1>XHL AI Agent</h1>
      <p class="subtitle">选择您想要使用的AI应用</p>
    </div>
    <div class="app-grid">
      <div class="app-card" @click="goToLoveApp">
        <div class="app-icon">💕</div>
        <h2>AI 恋爱大师</h2>
        <p>专业的恋爱咨询助手，为您提供情感建议</p>
      </div>
      <div class="app-card" @click="goToManusApp">
        <div class="app-icon">🤖</div>
        <h2>AI 超级智能体</h2>
        <p>强大的AI助手，帮您解决各种问题</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLoveApp = () => {
  router.push('/love-app')
}

const goToManusApp = () => {
  router.push('/manus')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 800px;
  width: 100%;
}

.app-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.app-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.app-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.app-card h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.app-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
</style>

