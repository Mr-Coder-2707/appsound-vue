# 🛠️ دليل التطوير والتخصيص

## 📁 هيكل المشروع

```
Progressive Web Apps - PWA/
├── 📄 index.html          # الصفحة الرئيسية
├── 📄 vite.config.js      # إعدادات Vite و PWA
├── 📄 package.json        # المكتبات والاعتمادات
│
├── 📁 src/
│   ├── 📄 App.vue         # المكون الرئيسي (425 سطر)
│   ├── 📄 main.js         # نقطة الدخول
│   ├── 📄 db.js           # إعدادات IndexedDB
│   ├── 📄 style.css       # التنسيقات الأساسية (800+ سطر)
│   ├── 📄 enhancements.css # التحسينات البصرية
│   └── 📄 features.css    # أنماط الميزات المتقدمة
│
├── 📁 public/             # الملفات الثابتة والأيقونات
│
└── 📁 Documentation/
    ├── 📄 README.md           # التوثيق الكامل (عربي)
    ├── 📄 README.en.md        # التوثيق الكامل (إنجليزي)
    ├── 📄 FEATURES.md         # شرح الميزات المتقدمة
    ├── 📄 QUICK_START.md      # دليل البدء السريع
    ├── 📄 SPOTIFY_DESIGN.md   # تفاصيل التصميم
    └── 📄 SUMMARY.md          # ملخص الميزات
```

---

## 🎨 نظام الألوان

### الألوان الأساسية
```css
--primary: #1DB954        /* أخضر Spotify */
--primary-dark: #1aa34a   /* أخضر داكن */
--primary-light: #1ed760  /* أخضر فاتح */
```

### الخلفيات
```css
--bg-dark: #000000        /* أسود نقي */
--bg-base: #121212        /* أسود رمادي */
--bg-elevated: #1a1a1a    /* رمادي داكن */
--bg-highlight: #282828   /* رمادي */
--bg-press: #3e3e3e       /* رمادي فاتح */
```

### النصوص
```css
--text-primary: #ffffff   /* أبيض */
--text-secondary: #a7a7a7 /* رمادي فاتح */
--text-subdued: #6a6a6a   /* رمادي داكن */
```

---

## 🧩 المكونات الرئيسية

### 1. App.vue
**الوظيفة:** المكون الرئيسي للتطبيق

**الحالة (State):**
- `playlists` - قوائم التشغيل
- `selectedPlaylist` - القائمة المختارة
- `currentSong` - الأغنية الحالية
- `isPlaying` - حالة التشغيل
- `isShuffled` - وضع التشغيل العشوائي
- `repeatMode` - وضع التكرار
- `searchQuery` - استعلام البحث
- `showQueue` - عرض قائمة الانتظار

**الوظائف الرئيسية:**
```javascript
playSong(song)          // تشغيل أغنية
togglePlay()            // تشغيل/إيقاف
nextSong()              // الأغنية التالية
previousSong()          // الأغنية السابقة
toggleShuffle()         // تبديل التشغيل العشوائي
toggleRepeat()          // تبديل التكرار
```

### 2. db.js
**الوظيفة:** إدارة قاعدة البيانات المحلية

```javascript
import Dexie from 'dexie'

export const db = new Dexie('ArabicMusicPlayer')

db.version(1).stores({
  playlists: '++id, name, createdAt',
  songs: '++id, title, artist, addedAt'
})
```

### 3. style.css
**الوظيفة:** التنسيقات الأساسية

**الأقسام:**
- الألوان والمتغيرات
- الهيدر والتخطيط
- القائمة الجانبية
- قائمة الأغاني
- المشغل السفلي
- النوافذ المنبثقة

---

## 🎛️ تخصيص التطبيق

### تغيير الألوان

في `src/style.css`:
```css
:root {
  --primary: #YOUR_COLOR;  /* غيّر اللون الأساسي */
}
```

### إضافة ميزات جديدة

1. **إضافة وظيفة في App.vue:**
```javascript
const myNewFeature = () => {
  // الكود هنا
}
```

2. **إضافة زر في الواجهة:**
```html
<button @click="myNewFeature">
  الميزة الجديدة
</button>
```

3. **إضافة تنسيقات:**
```css
.my-new-feature {
  /* التنسيقات */
}
```

### إضافة حقول جديدة للأغاني

في `src/db.js`:
```javascript
db.version(2).stores({
  songs: '++id, title, artist, album, year, genre'
})
```

---

## 🔧 نصائح التطوير

### Hot Module Replacement (HMR)
التطبيق يدعم HMR - التغييرات تظهر فوراً بدون إعادة تحميل:
- تعديلات CSS → تحديث فوري
- تعديلات Vue → تحديث المكون
- تعديلات JS → إعادة تحميل

### التطوير المحلي
```bash
npm run dev    # تشغيل خادم التطوير
```
الخادم يعمل على: http://localhost:5173

### البناء للإنتاج
```bash
npm run build  # بناء للإنتاج
npm run preview # معاينة البناء
```

### التصحيح (Debugging)

**في المتصفح:**
1. افتح Developer Tools (F12)
2. تبويب Console للأخطاء
3. تبويب Application → IndexedDB للبيانات
4. تبويب Network للشبكة

**في VS Code:**
- استخدم Vue DevTools Extension
- ضع Breakpoints في الكود
- استخدم console.log للتتبع

---

## 📦 إضافة مكتبات جديدة

### مثال: إضافة مكتبة
```bash
npm install library-name
```

### استيراد في الكود:
```javascript
import Something from 'library-name'
```

---

## 🎵 إضافة ميزات صوتية

### مثال: إضافة Equalizer
```javascript
// في App.vue
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
const source = audioContext.createMediaElementSource(audio.value)

source.connect(analyser)
analyser.connect(audioContext.destination)
```

### إضافة تأثيرات صوتية:
```javascript
const bassBoost = audioContext.createBiquadFilter()
bassBoost.type = 'lowshelf'
bassBoost.frequency.value = 200
bassBoost.gain.value = 10
```

---

## 🔐 الأمان وأفضل الممارسات

### التحقق من الملفات
```javascript
const isValidAudio = (file) => {
  return file.type.includes('audio')
}
```

### تنظيف الموارد
```javascript
onUnmounted(() => {
  URL.revokeObjectURL(audioUrl)
  window.removeEventListener('keydown', handleKeyPress)
})
```

### التعامل مع الأخطاء
```javascript
try {
  await db.songs.add(song)
} catch (error) {
  console.error('خطأ في حفظ الأغنية:', error)
}
```

---

## 📱 تحسين الأداء

### Lazy Loading للصور
```javascript
<img loading="lazy" src="album-cover.jpg">
```

### تحسين IndexedDB
```javascript
// استخدام indexes للبحث السريع
db.version(2).stores({
  songs: '++id, title, *artist'
})
```

### تقليل Re-renders
```javascript
const memoizedSongs = computed(() => {
  return expensiveCalculation(songs.value)
})
```

---

## 🌐 إضافة لغات جديدة

### إنشاء ملف ترجمة
```javascript
// locales/en.js
export default {
  play: 'Play',
  pause: 'Pause',
  next: 'Next'
}
```

### استخدام الترجمة
```javascript
const { t } = useI18n()
<button>{{ t('play') }}</button>
```

---

## 🚀 النشر (Deployment)

### على Vercel
```bash
npm install -g vercel
vercel
```

### على Netlify
```bash
npm run build
# رفع مجلد dist/
```

### على GitHub Pages
```bash
npm run build
# نسخ محتوى dist/ إلى gh-pages
```

---

## 🧪 الاختبار

### اختبار يدوي
- ✅ رفع ملفات MP3
- ✅ التشغيل والإيقاف
- ✅ البحث
- ✅ Shuffle و Repeat
- ✅ قائمة الانتظار

### اختبار المتصفحات
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

### اختبار الأجهزة
- Desktop ✅
- Tablet ✅
- Mobile ✅

---

## 📞 الدعم والمساعدة

إذا واجهت مشاكل:
1. راجع الأخطاء في Console
2. تحقق من IndexedDB
3. امسح Cache المتصفح
4. أعد تشغيل خادم التطوير

**موارد مفيدة:**
- Vue.js Docs: https://vuejs.org
- Vite Docs: https://vitejs.dev
- Dexie Docs: https://dexie.org

---

**استمتع بالتطوير! 💻🎵**
