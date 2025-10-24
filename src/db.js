import Dexie from 'dexie'

export const db = new Dexie('ArabicMusicPlayer')

db.version(1).stores({
  playlists: '++id, name, createdAt',
  songs: '++id, title, artist, addedAt'
})
