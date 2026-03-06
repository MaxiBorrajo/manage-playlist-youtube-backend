# Next Steps - Ordenado por prioridad

## Prerequisito: Modelo de datos

- [ ] Crear entidad `PlaylistItem` (tabla pivote con position, status, notes) - reemplaza el M2M directo Playlist<->Video
- [ ] Agregar campo `tags` a Playlist

---

## Prioridad 1 - Flujo core (chat -> playlist guardada)

### Endpoints

- [ ] `sendMessage(chatId, content)` - mutation para continuar conversacion con la IA (Curar mejor el hecho que recuerde que fui eligiendo videos)
- [ ] `createPlaylist(name, description, tags)` - crear playlist manualmente (sin IA)
- [ ] `addVideoToPlaylist(playlistId, videoId, position?)` - agregar video a playlist
- [ ] `removeVideoFromPlaylist(playlistId, videoId)` - quitar video de playlist

### Tools

- [ ] `create_playlist` - la IA crea la playlist con los videos seleccionados y la persiste en DB
- [ ] `validate_video_oembed` - validar existencia de video antes de guardarlo
- [ ] `add_videos_to_playlist` - la IA agrega videos a una playlist existente

---

## Prioridad 2 - Gestion completa de playlists

### Endpoints

- [ ] `updatePlaylist(id, name, description, tags, thumbnail)` - editar metadata
- [ ] `removePlaylist(id)` - eliminar playlist
- [ ] `reorderPlaylistItems(playlistId, items[])` - reordenar videos (drag & drop)
- [ ] `updatePlaylistItem(playlistItemId, status, notes)` - marcar estado (pending/watching/completed) y notas
- [ ] `searchPlaylists(query, tags)` - buscar/filtrar playlists propias

### Tools

- [ ] `search_my_playlists` - la IA busca en playlists del usuario para evitar duplicados o agregar a existente
- [ ] `remove_video_from_playlist` - el usuario pide quitar un video desde el chat
- [ ] `reorder_videos_in_playlist` - el usuario pide reordenar desde el chat

---

## Prioridad 3 - Paginacion y UX

### Endpoints

- [ ] `messages(chatId, cursor, limit)` - cursor pagination sobre mensajes de un chat
- [ ] `duplicatePlaylist(id)` - duplicar una playlist

---

## Prioridad 4 - Busqueda enriquecida

### Tools

- [ ] `add_playlist_to_playlist` - importar videos de una playlist de YouTube de terceros
- [ ] `search_videos_vectordb` - busqueda semantica en pgvector sobre videos cacheados
- [ ] Agregar scraper alternativo (YouTube API, yt-dlp, o SerpAPI para playlists)

---

## Prioridad 5 - Sugerencias en background (post-MVP)

### Modelo de datos

- [ ] Crear entidad `Suggestion` (userId, playlistId, videoId, reason, status)

### Endpoints

- [ ] `suggestions(playlistId?)` - ver sugerencias pendientes
- [ ] `respondSuggestion(id, action: accept|dismiss)` - aceptar/descartar

### Tools

- [ ] `generate_suggestions` - worker analiza playlists y genera recomendaciones
