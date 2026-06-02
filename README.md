# Trello-style Task Manager

Aplicacion web de gestion de tareas con tableros, listas, tarjetas, realtime, JWT, Redis cache y notificaciones por WhatsApp mock.

## Stack

- Frontend: React + Vite + dnd-kit + socket.io-client
- Backend: Node.js + Express + Sequelize + MySQL + Socket.io + Redis
- Infra: Docker Compose (frontend, backend, mysql, redis, nginx, whatsapp)

## Variables de entorno

Copia y ajusta las variables de `.env.example` segun sea necesario.

## Levantar el proyecto

```bash
docker compose up --build
```

Si tu entorno usa la variante legacy, puedes usar `docker-compose up --build`.

Servicios:

- App (frontend estatico servido por Nginx): http://localhost
- Frontend dev server (opcional): http://localhost:5173
- API: http://localhost/api
- Health backend: http://localhost/api/health
- WhatsApp mock webhook: http://localhost:4000/webhook/send

## Credenciales de ejemplo (seeder)

- Usuario 1: `demo1@example.com` / `Password123!`
- Usuario 2: `demo2@example.com` / `Password123!`

## Migraciones y seeders

El backend ejecuta automaticamente al iniciar:

1. `sequelize-cli db:migrate`
2. `sequelize-cli db:seed:all`

## Flujo CQRS liviano

- Comandos (POST/PUT/DELETE): escriben en MySQL e invalidan cache Redis
- Queries (GET board): primero Redis, si no existe consulta MySQL y cachea 30s
- Eventos de tablero: se publican por Redis Pub/Sub en canal `board-events`

## WhatsApp mock

El servicio `whatsapp` expone un webhook interno para simular envio de mensajes. El backend lo usa para:

- Asignacion de tarjeta
- Recordatorio cuando faltan menos de 24h para vencimiento

Para API real, reemplaza la implementacion en `whatsapp/src/server.js`.
