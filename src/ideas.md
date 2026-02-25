3. Tracker de backlog de juegos

Conectás con APIs abiertas (IGDB/RAWG) que no tienen las limitaciones de YouTube
IA para recomendar basado en tu historial, mood, tiempo disponible
Social features: compartir listas, reviews
GraphQL ideal para las relaciones entre juegos/plataformas/géneros/tags
Competencia: Backloggd existe web pero no hay buena app mobile

7. Planner de workouts/fitness personalizado

IA genera rutinas adaptadas a tu equipo disponible, tiempo, objetivos
Tracking de progreso, PRs, volumen semanal
GraphQL perfecto: ejercicios > músculos > rutinas > sesiones > progreso
Docker: API + worker de IA + servicio de notificaciones
Mercado enorme, la gente paga por esto

9. Segundo cerebro / bookmark manager

Guardás links, notas, screenshots desde el celular
IA los tagea, categoriza y los hace buscables semánticamente
"¿Dónde guardé ese artículo sobre event sourcing?"
Vector DB (pgvector) para búsqueda semántica, buen caso de uso de Docker
Competencia débil: Pocket está abandonado, Raindrop no tiene IA

13. Diario personal con IA terapeuta

Journaling diario, la IA detecta patrones emocionales a lo largo del tiempo
Visualización de mood over time, triggers, mejoras
Búsqueda semántica sobre tus propias entradas
Privacidad como feature principal (encryption e2e)
Mercado creciente, apps como Rosebud facturan bien

16. Marketplace de servicios locales (tipo TaskRabbit AR)

Conectás gente que necesita algo con gente que lo hace (electricista, fletero, etc)
IA para matching, estimación de precios, detección de fraude
Reviews, chat integrado, pagos
No existe bien resuelto en AR
Docker justificado: API + chat service + payment service + matching engine

25. App de presupuestos para freelancers

Armás presupuestos, trackéas proyectos, facturás
IA estima tiempos basado en tu historial, sugiere pricing
Dashboard de ingresos, clientes, proyectos activos
GraphQL: clientes > proyectos > presupuestos > facturas > pagos
Falta una buena app mobile para esto en LATAM

30. Wiki personal / knowledge base

Tipo Obsidian pero mobile-first con sync
IA linkea notas relacionadas automáticamente, genera índices
Búsqueda semántica con embeddings (pgvector)
Markdown editor, tags, grafos de conexiones
GraphQL subscriptions para sync real-time entre devices
Obsidian mobile es mediocre, hay espacio

45. Tracker de aprendizaje / skill tree personal

Mapeás tecnologías/skills que sabés y las que querés aprender
IA sugiere learning path óptimo basado en tu stack actual y objetivos
Trackéas progreso: cursos, libros, proyectos completados
Visualización tipo árbol de habilidades de RPG (te engancha con lo de juegos)
Compartís tu skill tree como portfolio público
GraphQL: skills > categorías > recursos > progreso > dependencias

52. Habit RPG serio (gamificación de vida real)

Tus hábitos, workouts, lecturas, side projects dan XP
Skill tree real (conecta con el 45), achievements, levels
IA ajusta dificultad y recompensas para mantener engagement
Combina tracking de todo (fitness, estudio, código) en un solo sistema gamificado
Habitica existe pero es feo y no usa IA
Social: guilds, challenges entre amigos