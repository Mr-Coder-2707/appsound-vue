<template>
  <div class="app" :class="{ 'playing': currentSong }">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          موسيقى
        </h1>
        <div class="header-actions">
          <button @click="showUploadModal = true" class="btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            رفع ملفات
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Playlists Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>قوائم التشغيل</h2>
          <button @click="createPlaylist" class="btn-icon" title="قائمة جديدة">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
        <div class="playlists-list">
          <div 
            v-for="playlist in playlists" 
            :key="playlist.id"
            @click="selectPlaylist(playlist)"
            :class="['playlist-item', { active: selectedPlaylist?.id === playlist.id }]"
          >
            <svg class="playlist-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
            <span class="playlist-name">{{ playlist.name }}</span>
            <span class="playlist-count">{{ playlist.songs?.length || 0 }}</span>
          </div>
        </div>
      </aside>

      <!-- Songs Grid -->
      <section class="content">
        <div v-if="!selectedPlaylist" class="welcome">
          <svg class="welcome-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <h2>مرحباً بك في مشغل الموسيقى العربية</h2>
          <p>قم بإنشاء قائمة تشغيل أو إضافة أغاني للبدء</p>
        </div>

        <div v-else class="playlist-view">
          <div class="playlist-header">
            <div class="playlist-title-section">
              <h2>{{ selectedPlaylist.name }}</h2>
              <p class="playlist-info">{{ selectedPlaylist.songs?.length || 0 }} أغنية</p>
            </div>
            <div class="playlist-actions">
              <div class="search-box">
                <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="بحث في الأغاني..."
                  class="search-input"
                >
              </div>
              <button @click="showUploadModal = true" class="btn-secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                إضافة
              </button>
            </div>
          </div>

          <div v-if="selectedPlaylist.songs?.length === 0" class="empty-state">
            <p>لا توجد أغاني في هذه القائمة</p>
          </div>

          <div v-else class="songs-table">
            <div class="table-header">
              <div class="col-number">#</div>
              <div class="col-title">العنوان</div>
              <div class="col-duration">المدة</div>
              <div class="col-actions"></div>
            </div>
            <div 
              v-for="(song, index) in filteredSongs" 
              :key="song.id"
              @click="playSong(song)"
              :class="['song-row', { playing: currentSong?.id === song.id }]"
            >
              <div class="col-number">
                <span v-if="currentSong?.id !== song.id" class="track-number">{{ index + 1 }}</span>
                <svg v-if="currentSong?.id === song.id" class="playing-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-if="currentSong?.id !== song.id" class="play-on-hover" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div class="col-title">
                <div class="song-info">
                  <div class="song-title">{{ song.title }}</div>
                  <div class="song-artist">{{ song.artist || 'فنان غير معروف' }}</div>
                </div>
              </div>
              <div class="col-duration">{{ formatDuration(song.duration) }}</div>
              <div class="col-actions">
                <button @click.stop="removeSong(song)" class="btn-icon-small" title="حذف">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Player -->
    <footer v-if="currentSong" class="player">
      <div class="player-content">
        <!-- Song Info -->
        <div class="player-song-info">
          <div class="song-title">{{ currentSong.title }}</div>
          <div class="song-artist">{{ currentSong.artist || 'فنان غير معروف' }}</div>
        </div>

        <!-- Controls -->
        <div class="player-controls">
          <div class="control-buttons">
            <button 
              @click="toggleShuffle" 
              :class="['btn-control', { active: isShuffled }]" 
              title="تشغيل عشوائي"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>
            <button @click="previousSong" class="btn-control" title="السابق">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            <button @click="togglePlay" class="btn-play">
              <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            <button @click="nextSong" class="btn-control" title="التالي">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            <button 
              @click="toggleRepeat" 
              :class="['btn-control', { active: repeatMode !== 'off' }]" 
              :title="repeatMode === 'one' ? 'تكرار الأغنية' : repeatMode === 'all' ? 'تكرار القائمة' : 'تكرار متوقف'"
            >
              <svg v-if="repeatMode === 'one'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            </button>
          </div>
          
          <!-- Progress Bar -->
          <div class="progress-container">
            <span class="time">{{ formatDuration(currentTime) }}</span>
            <div class="progress-bar" @click="seek">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <span class="time">{{ formatDuration(currentSong.duration) }}</span>
          </div>
        </div>

        <!-- Volume -->
        <div class="player-volume">
          <button @click="toggleMute" class="btn-control">
            <svg v-if="volume > 0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="volume" 
            @input="updateVolume"
            class="volume-slider"
          >
          <button 
            @click="showQueue = !showQueue" 
            :class="['btn-control', { active: showQueue }]"
            title="قائمة التشغيل"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>

    <!-- Queue Panel -->
    <div v-if="showQueue && currentSong" class="queue-panel">
      <div class="queue-header">
        <h3>قائمة التشغيل الحالية</h3>
        <button @click="showQueue = false" class="btn-close">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="queue-content">
        <div class="queue-now-playing">
          <p class="queue-label">يتم التشغيل الآن</p>
          <div class="queue-song active">
            <div class="queue-song-info">
              <div class="queue-song-title">{{ currentSong.title }}</div>
              <div class="queue-song-artist">{{ currentSong.artist || 'فنان غير معروف' }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedPlaylist?.songs?.length > 1" class="queue-next">
          <p class="queue-label">التالي</p>
          <div 
            v-for="song in selectedPlaylist.songs.filter(s => s.id !== currentSong.id)" 
            :key="song.id"
            @click="playSong(song)"
            class="queue-song"
          >
            <div class="queue-song-info">
              <div class="queue-song-title">{{ song.title }}</div>
              <div class="queue-song-artist">{{ song.artist || 'فنان غير معروف' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click="showUploadModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>إضافة أغاني جديدة</h3>
          <button @click="showUploadModal = false" class="btn-close">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
            <svg class="upload-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <p>اسحب وأفلت ملفات MP3 هنا</p>
            <p class="upload-hint">أو انقر لاختيار الملفات</p>
            <input 
              ref="fileInput" 
              type="file" 
              accept="audio/mp3,audio/mpeg" 
              multiple 
              @change="handleFileSelect"
              style="display: none"
            >
          </div>
          
          <div v-if="selectedPlaylist" class="playlist-selector">
            <label>إضافة إلى:</label>
            <select v-model="targetPlaylistId">
              <option :value="selectedPlaylist.id">{{ selectedPlaylist.name }}</option>
              <option v-for="pl in playlists.filter(p => p.id !== selectedPlaylist.id)" :key="pl.id" :value="pl.id">
                {{ pl.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Element -->
    <audio 
      ref="audio" 
      @timeupdate="updateTime" 
      @ended="nextSong"
      @loadedmetadata="updateDuration"
    ></audio>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { db } from './db'

export default {
  name: 'App',
  setup() {
    const playlists = ref([])
    const selectedPlaylist = ref(null)
    const currentSong = ref(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const volume = ref(80)
    const showUploadModal = ref(false)
    const targetPlaylistId = ref(null)
    const audio = ref(null)
    const fileInput = ref(null)
    const isShuffled = ref(false)
    const repeatMode = ref('off') // 'off', 'all', 'one'
    const searchQuery = ref('')
    const queue = ref([])
    const showQueue = ref(false)

    const progressPercent = computed(() => {
      if (!currentSong.value || !currentSong.value.duration) return 0
      return (currentTime.value / currentSong.value.duration) * 100
    })

    const filteredSongs = computed(() => {
      if (!selectedPlaylist.value?.songs) return []
      if (!searchQuery.value) return selectedPlaylist.value.songs
      
      const query = searchQuery.value.toLowerCase()
      return selectedPlaylist.value.songs.filter(song => 
        song.title.toLowerCase().includes(query) ||
        (song.artist && song.artist.toLowerCase().includes(query))
      )
    })

    const shuffleArray = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const toggleShuffle = () => {
      isShuffled.value = !isShuffled.value
    }

    const toggleRepeat = () => {
      const modes = ['off', 'all', 'one']
      const currentIndex = modes.indexOf(repeatMode.value)
      repeatMode.value = modes[(currentIndex + 1) % modes.length]
    }

    // Load playlists from IndexedDB
    const loadPlaylists = async () => {
      playlists.value = await db.playlists.toArray()
      if (playlists.value.length === 0) {
        await createDefaultPlaylist()
      }
    }

    const createDefaultPlaylist = async () => {
      const id = await db.playlists.add({
        name: 'المفضلة',
        songs: [],
        createdAt: new Date()
      })
      await loadPlaylists()
      selectedPlaylist.value = playlists.value[0]
    }

    const createPlaylist = async () => {
      const name = prompt('اسم قائمة التشغيل:')
      if (name && name.trim()) {
        await db.playlists.add({
          name: name.trim(),
          songs: [],
          createdAt: new Date()
        })
        await loadPlaylists()
      }
    }

    const selectPlaylist = (playlist) => {
      selectedPlaylist.value = playlist
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = async (event) => {
      const files = Array.from(event.target.files)
      await processFiles(files)
    }

    const handleDrop = async (event) => {
      const files = Array.from(event.dataTransfer.files).filter(f => f.type.includes('audio'))
      await processFiles(files)
    }

    const processFiles = async (files) => {
      const playlistId = targetPlaylistId.value || selectedPlaylist.value?.id || playlists.value[0]?.id
      if (!playlistId) return

      for (const file of files) {
        const song = {
          title: file.name.replace(/\.(mp3|mpeg)$/i, ''),
          artist: 'فنان غير معروف',
          duration: 0,
          file: file,
          addedAt: new Date()
        }

        // Get duration
        const audioEl = document.createElement('audio')
        audioEl.src = URL.createObjectURL(file)
        await new Promise(resolve => {
          audioEl.addEventListener('loadedmetadata', () => {
            song.duration = audioEl.duration
            URL.revokeObjectURL(audioEl.src)
            resolve()
          })
        })

        // Add to database
        const songId = await db.songs.add(song)
        
        // Update playlist
        const playlist = await db.playlists.get(playlistId)
        playlist.songs = playlist.songs || []
        playlist.songs.push(songId)
        await db.playlists.put(playlist)
      }

      await loadPlaylists()
      const updated = playlists.value.find(p => p.id === playlistId)
      selectedPlaylist.value = updated
      showUploadModal.value = false
    }

    const playSong = async (song) => {
      if (currentSong.value?.id === song.id && isPlaying.value) {
        audio.value.pause()
        isPlaying.value = false
        return
      }

      currentSong.value = song
      const songData = await db.songs.get(song.id)
      const url = URL.createObjectURL(songData.file)
      audio.value.src = url
      audio.value.volume = volume.value / 100
      await audio.value.play()
      isPlaying.value = true

      // Update Media Session
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist || 'فنان غير معروف',
          album: selectedPlaylist.value?.name || 'قائمة التشغيل'
        })

        navigator.mediaSession.setActionHandler('play', () => togglePlay())
        navigator.mediaSession.setActionHandler('pause', () => togglePlay())
        navigator.mediaSession.setActionHandler('previoustrack', () => previousSong())
        navigator.mediaSession.setActionHandler('nexttrack', () => nextSong())
      }
    }

    const togglePlay = () => {
      if (isPlaying.value) {
        audio.value.pause()
      } else {
        audio.value.play()
      }
      isPlaying.value = !isPlaying.value
    }

    const nextSong = () => {
      if (!selectedPlaylist.value?.songs || selectedPlaylist.value.songs.length === 0) return
      
      // If repeat one, play the same song
      if (repeatMode.value === 'one') {
        audio.value.currentTime = 0
        audio.value.play()
        return
      }

      const songs = isShuffled.value 
        ? shuffleArray(selectedPlaylist.value.songs)
        : selectedPlaylist.value.songs

      const currentIndex = songs.findIndex(s => s.id === currentSong.value?.id)
      const nextIndex = (currentIndex + 1) % songs.length
      
      // If we're at the end and repeat is off, stop
      if (nextIndex === 0 && repeatMode.value === 'off' && currentIndex === songs.length - 1) {
        isPlaying.value = false
        return
      }
      
      playSong(songs[nextIndex])
    }

    const previousSong = () => {
      if (!selectedPlaylist.value?.songs) return
      
      // If more than 3 seconds played, restart current song
      if (currentTime.value > 3) {
        audio.value.currentTime = 0
        return
      }

      const songs = isShuffled.value 
        ? shuffleArray(selectedPlaylist.value.songs)
        : selectedPlaylist.value.songs

      const currentIndex = songs.findIndex(s => s.id === currentSong.value?.id)
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1
      playSong(songs[prevIndex])
    }

    const removeSong = async (song) => {
      if (confirm('هل تريد حذف هذه الأغنية؟')) {
        await db.songs.delete(song.id)
        selectedPlaylist.value.songs = selectedPlaylist.value.songs.filter(s => s.id !== song.id)
        await db.playlists.put(selectedPlaylist.value)
        await loadPlaylists()
      }
    }

    const updateTime = () => {
      currentTime.value = audio.value.currentTime
    }

    const updateDuration = () => {
      if (currentSong.value) {
        currentSong.value.duration = audio.value.duration
      }
    }

    const seek = (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const percent = x / rect.width
      audio.value.currentTime = percent * currentSong.value.duration
    }

    const updateVolume = () => {
      audio.value.volume = volume.value / 100
    }

    const toggleMute = () => {
      volume.value = volume.value > 0 ? 0 : 80
      updateVolume()
    }

    const formatDuration = (seconds) => {
      if (!seconds || isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    onMounted(async () => {
      await loadPlaylists()
      if (playlists.value.length > 0) {
        // Load songs for each playlist
        for (const playlist of playlists.value) {
          if (playlist.songs && Array.isArray(playlist.songs)) {
            const songs = await Promise.all(
              playlist.songs.map(id => db.songs.get(id))
            )
            playlist.songs = songs.filter(s => s)
          }
        }
        selectedPlaylist.value = playlists.value[0]
        targetPlaylistId.value = playlists.value[0].id
      }

      // Keyboard shortcuts
      window.addEventListener('keydown', handleKeyPress)
    })

    const handleKeyPress = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch(e.code) {
        case 'Space':
          e.preventDefault()
          if (currentSong.value) togglePlay()
          break
        case 'ArrowRight':
          e.preventDefault()
          if (currentSong.value && audio.value) {
            audio.value.currentTime = Math.min(audio.value.currentTime + 5, audio.value.duration)
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (currentSong.value && audio.value) {
            audio.value.currentTime = Math.max(audio.value.currentTime - 5, 0)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          volume.value = Math.min(volume.value + 10, 100)
          updateVolume()
          break
        case 'ArrowDown':
          e.preventDefault()
          volume.value = Math.max(volume.value - 10, 0)
          updateVolume()
          break
        case 'KeyN':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            nextSong()
          }
          break
        case 'KeyP':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            previousSong()
          }
          break
        case 'KeyS':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleShuffle()
          }
          break
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleRepeat()
          }
          break
        case 'KeyQ':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            showQueue.value = !showQueue.value
          }
          break
      }
    }

    return {
      playlists,
      selectedPlaylist,
      currentSong,
      isPlaying,
      currentTime,
      volume,
      showUploadModal,
      targetPlaylistId,
      audio,
      fileInput,
      isShuffled,
      repeatMode,
      searchQuery,
      queue,
      showQueue,
      progressPercent,
      filteredSongs,
      loadPlaylists,
      createPlaylist,
      selectPlaylist,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      playSong,
      togglePlay,
      nextSong,
      previousSong,
      removeSong,
      updateTime,
      updateDuration,
      seek,
      updateVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      formatDuration
    }
  }
}
</script>
