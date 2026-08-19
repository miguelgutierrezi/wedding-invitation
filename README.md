# Wedding Invitation

Aplicación web full stack para la invitación de matrimonio de **Nychol y Miguel** y la gestión de confirmaciones de aproximadamente 90 invitados.

Cada familia recibe un enlace privado (`/i/[slug]`) para ver la invitación y confirmar la asistencia de sus integrantes (incluyendo cupos de bus y punto de embarque). Incluye un panel administrativo privado con la misma identidad visual de la invitación.

## Estado actual

| Área | Estado |
|------|--------|
| Invitación pública | Implementada y alineada con Figma + polish ([`docs/invitation-ui.md`](docs/invitation-ui.md)) |
| Portada personalizada | 1 → Querido/Querida; 2 → Queridos A y B; 3+ → Querida Familia… |
| Nombres | Nychol & Miguel (`weddingConfig` + `events` vía migración) |
| Zona horaria | Etiquetas en `America/Bogota` (`event-timezone.ts`) |
| Cómo llegar | Embed Google Maps + enlaces Google / Waze / Apple Maps (Apple) |
| Música | Tras “Ver Invitación”; mute flotante; archivo en `public/invitation/soundtrack.mp3` |
| Inspiración outfit | `/inspiracion/ellos` · `/inspiracion/ellas` (boards móvil + desktop) |
| RSVP | Formulario embebido: asistencia, bus, **punto de encuentro**, dietas, contacto |
| Admin `/admin` | Login, resumen, estadísticas, invitados, familias, fotos, Excel. En móvil/tablet vertical: menú hamburguesa, **+** nueva familia, listados en tarjetas |
| Visual admin | Misma paleta/tipografía que la invitación (`admin-ui.ts`) |
| Auth edge | Next.js 16 `src/proxy.ts` (gate `/admin` + `/api/admin`) |
| Automated tests | Vitest (`pnpm test`): RSVP, transport, slugs, cover greeting, TZ, guest media |
| Admin family create/update | Transactional RPCs (+ géneros) + structured admin logs |
| Rate limit / logs | RSVP + invitation lookup + media authorize; JSON logs without PII |
| Guest media uploads | `/i/[slug]/fotos`, `/fotos?code=`, Storage privado, `/admin/photos` |
| Email (Resend) | Pendiente de fase futura |

El alcance autorizado se define solo en [`docs/current-phase.md`](docs/current-phase.md). Checklist operativo: [`docs/go-live-checklist.md`](docs/go-live-checklist.md). Storage de invitados: [`docs/guest-media-storage.md`](docs/guest-media-storage.md).

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
Boda 3.jpg           # hero
Boda 19.jpg          # cierre (footer); también usada en banda de lugar
Boda 21.jpg          # (no carrusel; dimensiones distintas)
Imagen recortada.png # foto pareja
chiva.png            # transporte
cabezas.png          # código de vestimenta
Lluvia de sobres.png # mesa de regalos
paleta sugerida.png / paleta colores.png
Boda 1–23.jpg        # galería (excluye 3, 8, 10, 15, 19, 21, 22; ver wedding.ts)
Ideas outfit hombre.png / Ideas outfit hombre desktop.png
Ideas outfit mujer.png / Ideas outfit mujer desktop.png
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

Si un invitado confirma bus, el formulario **exige** elegir un punto. Admin/analytics agrupan cupos por punto. El copy actual indica transporte **gratuito**.

Helpers: `src/config/transport.ts`. Migración: `supabase/migrations/20260808120000_couple_names_and_transport_boarding.sql`.

### Portada y género de invitados

Al crear/editar una familia en admin, cada invitado lleva **nombre + género** (Hombre, Mujer o Sin género). Eso alimenta el saludo de `/i/[slug]`:

| Invitados | Saludo |
|-----------|--------|
| 1 | Querido / Querida / Hola + nombre |
| 2 | Queridos Nombre1 y Nombre2 |
| 3+ | Querida + nombre de familia |

Si el segundo invitado se llama “Acompañante” (o similar), el RSVP pide el nombre real. Siguen contando en analytics.

Migraciones: `20260815100000_guest_gender.sql`, `20260816100000_guest_gender_unspecified.sql`, `20260816110000_placeholder_companion_names.sql`.

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
GUEST_MEDIA_STORAGE_QUOTA_BYTES=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
ADMIN_EMAIL=
ADMIN_EMAILS=
```

`SUPABASE_SERVICE_ROLE_KEY` es exclusivamente para código de servidor. `GUEST_MEDIA_STORAGE_QUOTA_BYTES` es el presupuesto blando para alertas del panel de fotos (no el límite duro de Supabase). Resend está previsto para una fase futura; la aplicación debe funcionar sin correo en desarrollo.

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
- [`docs/invitation-ui.md`](docs/invitation-ui.md): diseño Figma, tokens, assets, mapas, música, saludo de portada, RSVP boarding, admin brand.
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
- Fecha: 24 de octubre de 2026 (zona `America/Bogota`)
- Lugar (copy actual): Hacienda Montecano, vía Subachoque–El Rosal
- Mapas de ceremonia: Google Maps, Waze, Apple Maps + embed
- RSVP deadline (config/DB): 15 de septiembre de 2026
- Dos puntos de bus en Bogotá (Modelia y Villa Sonia); transporte gratuito en copy
- Inspiración de vestimenta: rutas `/inspiracion/ellos` y `/inspiracion/ellas`

Pendientes o vacíos hasta que se indiquen (no inventar):

- Horas de salida del bus hacia Subachoque (“por confirmar”)
- Archivo `soundtrack.mp3` si no está en el deploy
- Género en familias creadas antes de la migración `guest_gender` (rellenar en admin)

No inventar datos sensibles ni secretos.

## Despliegue

Destino: Vercel + Supabase remoto + Cloudflare DNS. El checklist de go-live de producción se autoriza por fase en `docs/current-phase.md`. Asegura que las migraciones de boarding, nombres, guest media y **género de invitados** estén aplicadas en el Supabase de producción antes de compartir enlaces ampliamente.
