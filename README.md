# Wedding Invitation

Aplicación web full stack para la invitación de matrimonio de **Nychol y Miguel** y la gestión de confirmaciones de aproximadamente 90 invitados.

Cada familia recibe un enlace privado (`/i/[slug]`) para ver la invitación y confirmar la asistencia de sus integrantes (incluyendo cupos de bus y punto de embarque). Incluye un panel administrativo privado con la misma identidad visual de la invitación.

## Estado actual

| Área | Estado |
|------|--------|
| Invitación pública | Implementada y alineada con Figma + polish ([`docs/invitation-ui.md`](docs/invitation-ui.md)) |
| Nombres | Nychol & Miguel (`weddingConfig` + `events` vía migración) |
| Cómo llegar | Embed Google Maps + enlaces Google / Waze / Apple Maps (Apple) |
| Música | Tras “Ver Invitación”; mute flotante; archivo en `public/invitation/soundtrack.mp3` |
| RSVP | Formulario embebido: asistencia, bus, **punto de encuentro**, dietas, contacto |
| Admin `/admin` | Login, resumen, analytics (incluido bus por punto), invitados, familias |
| Visual admin | Misma paleta/tipografía que la invitación (`admin-ui.ts`) |
| Auth edge | Next.js 16 `src/proxy.ts` (gate `/admin`) |
| Automated tests | Vitest (`pnpm test`): RSVP, transport, slugs, rate limit, logs |
| Admin family create/update | Transactional RPCs + structured admin logs |
| Rate limit / logs | RSVP + invitation lookup; JSON logs without PII |
| Export CSV / email | Pendientes de fase futura |

El alcance autorizado se define solo en [`docs/current-phase.md`](docs/current-phase.md). Checklist operativo: [`docs/go-live-checklist.md`](docs/go-live-checklist.md).

### Enlaces locales útiles

- Invitación (slugs de seed): ver abajo
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Usuario administrador (local o cloud)

1. Crea en Supabase **Authentication → Users** las cuentas con email:
   - `migueangel97@hotmail.com`
   - `nycholpg@gmail.com`
   (ambos están siempre en la allowlist de `src/config/admin.ts`).
2. Abre `/admin/login` en local o en tu dominio.

Opcional: emails adicionales con `ADMIN_EMAIL` / `ADMIN_EMAILS` en el entorno.

### Assets de invitación

Medios en:

```text
public/invitation/
```

Rutas enlazadas desde `src/config/wedding.ts` (`assets`). Inventario y reglas de diseño: [`docs/invitation-ui.md`](docs/invitation-ui.md).

Principales archivos:

```text
Portada.jpg          # portada
Nychol & Migue.png   # cierre
Boda 3.jpg           # hero
Boda 19.jpg          # banda de lugar
Boda 21.jpg          # (no carrusel; dimensiones distintas)
Imagen recortada.png # foto pareja
chiva.png            # transporte
cabezas.png          # código de vestimenta
paleta sugerida.png / paleta colores.png
Boda 1–23.jpg        # galería (excluye 3, 8, 10, 15, 19, 21, 22; ver wedding.ts)
Ideas outfit hombre.png / Ideas outfit mujer.png  # /inspiracion/ellos|ellas
soundtrack.mp3       # música (opcional; path en assets.music)
```

### Cómo llegar

Configurado en `weddingConfig.ceremony` (valores reales en el repo para Hacienda Montecano):

- `mapsEmbedUrl` — iframe en la sección Lugar
- `mapsUrl` / `wazeUrl` / `appleMapsUrl` — enlaces externos (Apple Maps solo se muestra en iOS/macOS Safari-like UA)

### Música

- Flag: `features.music`
- Archivo: `assets.music` → `/invitation/soundtrack.mp3`
- Arranca al tocar **Ver Invitación** (gesto de usuario); control mute en `/invitacion`

### Transporte y RSVP

Puntos de encuentro (ids estables en config y DB):

| Id | Dirección (copy actual) |
|----|-------------------------|
| `modelia` | Calle 23B bis #75-48 Modelia |
| `villa_sonia` | Calle 38B sur #50A-53 Villa Sonia |

Si un invitado confirma bus, el formulario **exige** elegir un punto. Admin/analytics agrupan cupos por punto.

Helpers: `src/config/transport.ts`. Migración: `supabase/migrations/20260808120000_couple_names_and_transport_boarding.sql`.

## Stack

- Next.js con App Router.
- React y TypeScript estricto.
- Tailwind CSS.
- Supabase: PostgreSQL, Auth y Row Level Security.
- pnpm.
- Vercel y Cloudflare DNS para producción.

## Requisitos locales

- Node.js 24 LTS.
- pnpm.
- Docker Desktop.
- Supabase CLI.

## Instalación

```bash
pnpm install
cp .env.example .env.local
supabase start
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000). Los valores locales de Supabase se obtienen con:

```bash
supabase status
```

Tras clonar o cambiar migraciones:

```bash
supabase db reset   # aplica migraciones + seed (local)
```

No se deben compartir ni subir a Git los valores reales de `.env.local`.

## Variables de entorno

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
ADMIN_EMAIL=
ADMIN_EMAILS=
```

`SUPABASE_SERVICE_ROLE_KEY` es exclusivamente para código de servidor. Resend está previsto para una fase futura; la aplicación debe funcionar sin correo en desarrollo.

## Comandos

```bash
pnpm dev       # servidor de desarrollo
pnpm lint      # ESLint
pnpm typecheck # TypeScript sin emitir archivos
pnpm test      # Vitest (unitarios)
pnpm build     # build de producción
```

Comandos locales de Supabase:

```bash
supabase start
supabase status
supabase stop
supabase db reset   # aplica migraciones + seed.sql
```

### CI (GitHub Actions)

| Workflow | Cuándo | Qué hace |
|----------|--------|----------|
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Todo push y PR a `main` | `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` |
| [`.github/workflows/supabase-migrate.yml`](.github/workflows/supabase-migrate.yml) | Push a `main` si cambian migraciones, o manual | `supabase db push --db-url …` al proyecto cloud |

Migraciones **no** corren en cada push de UI: solo cuando tocas `supabase/migrations/**` (o *Run workflow*).

El workflow de migraciones **no usa** `supabase link`. Secrets típicos: `SUPABASE_PROJECT_REF` + `SUPABASE_DB_PASSWORD`, o `SUPABASE_DB_URL`.

### Enlaces de desarrollo (seed local)

```text
familia-ejemplo  →  http://localhost:3000/i/familia-ejemplo
familia-demo     →  http://localhost:3000/i/familia-demo
```

Cuerpo completo de la invitación:

```text
http://localhost:3000/i/familia-ejemplo/invitacion
```

Copia las claves de `supabase status` a `.env.local` antes de probar el RSVP. Con `db reset`, también se aplican los nombres del evento y la columna de punto de embarque.

## Arquitectura y documentación

- [`AGENTS.md`](AGENTS.md): reglas permanentes para agentes de código.
- [`docs/current-phase.md`](docs/current-phase.md): alcance autorizado actual y estado del repo.
- [`docs/go-live-checklist.md`](docs/go-live-checklist.md): checklist operativo antes de compartir enlaces.
- [`docs/invitation-ui.md`](docs/invitation-ui.md): diseño Figma, tokens, assets, mapas, música, RSVP boarding, admin brand.
- [`docs/product-spec.md`](docs/product-spec.md): requisitos y visión del producto.
- [`docs/architecture.md`](docs/architecture.md): arquitectura y límites técnicos (incluye `src/proxy.ts`).

La aplicación es un único proyecto Next.js full stack. Server Components por defecto; Client Components solo para interacción en el navegador (countdown, galería, formulario RSVP, música, enlaces de mapa por plataforma).

## Flujo de trabajo

Antes de implementar, leer `AGENTS.md` y `docs/current-phase.md`. No implementar fases futuras sin autorización en `current-phase.md` o petición explícita del usuario.

Para cambios de copy, media o layout de invitación, preferir `wedding.ts` + `docs/invitation-ui.md`. Nuevos puntos de bus requieren migración SQL + `transport.ts`.

Antes de declarar una tarea terminada, ejecutar los checks relevantes y reportar cuáles se ejecutaron.

## Datos del matrimonio

Ya confirmados o configurados en producto / seed:

- Novios: **Nychol** y **Miguel**
- Fecha: 24 de octubre de 2026
- Lugar (copy actual): Hacienda Montecano, vía Subachoque–El Rosal
- Mapas de ceremonia: Google Maps, Waze, Apple Maps + embed
- RSVP deadline (config/DB): 15 de septiembre de 2026
- Dos puntos de bus en Bogotá (Modelia y Villa Sonia)

Pendientes o vacíos hasta que se indiquen (no inventar):

- Enlaces de inspiración de vestimenta
- Horas de salida del bus hacia Subachoque (“por confirmar”)
- Archivo `soundtrack.mp3` si no está en el deploy

No inventar datos sensibles ni secretos.

## Despliegue

Destino: Vercel + Supabase remoto + Cloudflare DNS. El checklist de go-live de producción se autoriza por fase en `docs/current-phase.md`. Asegura que la migración de boarding point y nombres esté aplicada en el Supabase de producción antes de confiar en RSVPs con bus.
