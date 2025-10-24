import { createApp } from 'vue'
import './style.css'
import './enhancements.css'
import './features.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('يتوفر تحديث جديد. هل تريد التحديث الآن؟')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('التطبيق جاهز للعمل بدون اتصال')
  },
})

createApp(App).mount('#app')
