# Flujo de creación de playlists con Claude

## Resumen

El usuario interactúa con Claude a través de un chat para buscar, seleccionar y organizar videos de YouTube en playlists personalizadas. Claude usa tools para ejecutar acciones y el backend mantiene el estado.

---

## Arquitectura de datos

### pg_vector
- Almacena embeddings de videos buscados (tanto de Serper como de búsquedas previas)
- Permite búsqueda semántica antes de recurrir a APIs externas
- Se enriquece con cada búsqueda nueva

### PostgreSQL
- Videos: metadata (videoId, title, channel, duration, url) asociada al vector
- Videos seleccionados: relación temporal entre chat y videos elegidos por el usuario (se elimina al crear la playlist)
- Playlist: nombre, videos ordenados, referencia al chat de origen

---

## Tools de Claude

| Tool | Descripción |
|------|-------------|
| `search_videos` | Busca videos. El backend decide el origen: primero pg_vector, si no hay suficientes resultados complementa con Serper.dev. Los resultados de Serper se guardan en pg_vector para futuras búsquedas. |
| `add_select_videos` | Agrega videos a la selección temporal del chat. Recibe un array de videoIds. |
| `remove_select_videos` | Quita videos de la selección temporal. Recibe un array de videoIds. |
| `create_playlist` | Crea la playlist final con nombre + videos seleccionados en orden. Limpia la selección temporal del chat. |

---

## Flujo completo

### 1. Búsqueda de videos
- El usuario describe qué quiere aprender/ver
- Claude evalúa si tiene contexto suficiente (nivel, duración, idioma, enfoque)
  - Si faltan datos: hace 1-2 preguntas máximo
  - Si tiene suficiente: llama a `search_videos` con 2-4 queries
- El backend busca primero en pg_vector, complementa con Serper si es necesario
- Los resultados nuevos de Serper se persisten en pg_vector + tabla de videos

### 2. Selección de videos
- Claude presenta los videos curados al usuario
- El usuario elige: "me quedo con el 1, 3 y 5"
- Claude llama a `add_select_videos` con los videoIds elegidos
- El backend guarda la relación temporal chat ↔ videos seleccionados
- Los videos seleccionados se inyectan en el contexto de cada request (system prompt o mensaje de sistema), no requieren una tool para consultarlos

### 3. Iteración (opcional)
- El usuario puede pedir más videos → nueva búsqueda con `search_videos`
- Puede quitar videos → Claude llama a `remove_select_videos`
- Puede seguir agregando → Claude llama a `add_select_videos`
- En cada interacción, Claude ve la lista actualizada de videos seleccionados en su contexto

### 4. Creación de la playlist
- El usuario pide crear la playlist
- Claude pide un nombre o lo infiere de la conversación
- Claude llama a `create_playlist` con el nombre y los videos en orden
- El backend:
  - Crea la playlist en PostgreSQL con referencia al chat de origen
  - Asocia los videos en el orden definido
  - Elimina la selección temporal del chat

---

## Contexto inyectado a Claude

En cada request, el backend debe incluir como contexto adicional (fuera del historial de mensajes):

```
Videos seleccionados hasta ahora:
1. [título] - [canal] (videoId: xxx)
2. [título] - [canal] (videoId: xxx)
...
```

Esto le permite a Claude tener siempre la visión actual de la playlist en construcción sin depender de parsear el historial.

---

## Modelo de datos (relaciones)

```
Chat ──── tiene muchos ──── Messages
  │
  ├──── tiene muchos ──── SelectedVideos (temporal)
  │
  └──── origina ──── Playlist
                        │
                        └──── tiene muchos ──── PlaylistVideos (ordenados)

Video (tabla central, alimentada por pg_vector + Serper)
  │
  ├──── referenciado por ──── SelectedVideos
  └──── referenciado por ──── PlaylistVideos
```

---

## Consideraciones

- **Límite de playlist**: máximo 15 videos por defecto, salvo que el usuario pida más
- **Idioma**: Claude responde en el idioma que use el usuario
- **Queries en paralelo**: cuando Claude busca videos, lanza todas las queries en paralelo
- **Preferencia del usuario**: si el usuario dice que no haga preguntas y busque directo, Claude obedece
