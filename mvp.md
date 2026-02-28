1. Docker Compose: NestJS + PostgreSQL + pgvector + Redis
2. Auth con Google (OAuth, JWT)
3. Esquema de DB: User, Playlist, PlaylistItem, Video, ChatSession
4. Integración Claude API: servicio base con streaming + tool use
5. Integración Serper.dev: búsqueda + validación oEmbed + cache en Redis + persistencia en pgvector
6. Flujo de chat completo: el usuario habla, la IA busca, presenta resultados, el usuario selecciona, se crea la playlist
7. Queries y mutations de GraphQL para playlists (CRUD, reordenar, estados)
8. Player embebido con YouTube iframe
9. (Opcional para MVP) Importar playlists del usuario via YouTube API

Es un estándar que permite obtener metadata básica de un contenido (video, imagen, artículo) a partir de su URL, sin necesidad de API key ni autenticación.

En el caso de YouTube, hacés un GET a:

```
https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json
```

Y te devuelve: título, autor, thumbnail, dimensiones del embed. Si el video no existe o fue borrado, te devuelve un 404.

**Para qué lo usás en tu proyecto:**
Cuando Serper.dev te devuelve URLs de videos, no tenés garantía de que esos videos sigan activos. Con oEmbed verificás que existan y de paso te traés metadata básica, todo gratis y sin quota.

Es tu validador barato antes de guardar un video en la base de datos.