# Product specification: Wedding Invitation

**Status:** product direction — invitation UI, admin, RSVP + boarding, hardening complete for authorized slices — see `current-phase.md`

**Last reviewed:** 2026-08-12

Este documento define qué producto se quiere construir. No autoriza por sí mismo la implementación de todas sus secciones. El alcance actualmente permitido está únicamente en `docs/current-phase.md`, y las decisiones técnicas aprobadas están en `docs/architecture.md`.

### Estado de implementación (2026-08)

| Capacidad | Estado |
|-----------|--------|
| Invitación pública (Figma + polish) | Implementada — ver **`docs/invitation-ui.md`** |
| Saludo de portada | 1 / 2 / 3+ invitados; Querido/Querida según género |
| Inspiración de vestimenta | `/inspiracion/ellos` · `/inspiracion/ellas` |
| Zona horaria de etiquetas | `America/Bogota` (`event-timezone.ts`) |
| Nombres de pareja | **Nychol** & **Miguel** (`weddingConfig` + `events`) |
| Lugar / cómo llegar | Embed de mapa + Google Maps / Waze / Apple Maps (solo Apple) |
| Música de fondo | Tras gesto “Ver Invitación”; mute flotante; requiere asset |
| RSVP embebido | Asistencia por invitado, dietas, contacto (teléfono obligatorio) |
| Transporte (bus) | Opt-in + **punto de embarque obligatorio** (`modelia` / `villa_sonia`); copy: gratuito |
| Admin | Login, resumen, analytics, invitados, familias (nombre + **género**), enlaces |
| Visual admin | Alineado con brand de invitación |
| Edge auth (Next.js 16) | `src/proxy.ts` (antes middleware) |
| Tests unitarios (Vitest) | RSVP Zod, transport, slugs, cover greeting, TZ, guest media — `pnpm test` |
| Admin family create/update | RPC transaccionales (+ géneros) + `serverLog` |
| Rate limit + logging | In-memory RSVP/lookup gates + JSON logs sin PII |
| Checklist go-live | `docs/go-live-checklist.md` |
| Export Excel (admin) | Implementado (`/api/admin/export`) |
| Guest media uploads | Implementado (`/i/[slug]/fotos`, `/fotos?code=`, `/admin/photos`, Storage privado) |
| Email / settings UI | No implementado |

Config de copy y rutas de medios: **`src/config/wedding.ts`**. Ids de puntos de bus: **`src/config/transport.ts`**. Storage invitados: **`docs/guest-media-storage.md`**.

Pendiente a nivel producto (salvo autorización en `current-phase.md`): email (Resend), editor de settings en admin, galería pública colaborativa, horarios de salida del bus hacia Subachoque si aún “por confirmar”.

## 1. Propósito del proyecto

Estamos construyendo una invitación web moderna, elegante, personalizada y responsive para un matrimonio de aproximadamente 90 invitados.

La aplicación debe servir como invitación digital y como sistema de gestión de confirmaciones de asistencia.

El objetivo principal es que cada familia o grupo de invitados reciba un enlace personalizado, pueda consultar la información del evento y confirmar quiénes asistirán.

La aplicación también tendrá un panel administrativo privado para gestionar familias, invitados, respuestas, restricciones alimentarias y exportaciones.

La solución debe ser:

- Elegante.
- Mobile-first.
- Rápida.
- Segura.
- Fácil de compartir por WhatsApp.
- Económica.
- Reutilizable.
- Bien estructurada.
- Desplegable en Vercel.
- Integrada con Supabase.
- Mantenible desde un único repositorio.

No se construirá un backend Java separado.

Todo el proyecto será una aplicación full stack en Next.js.

---

# 2. Estado actual del entorno

El entorno de desarrollo ya está preparado.

## Sistema

- macOS 26.3.
- Arquitectura Apple Silicon ARM64.
- Shell Zsh.
- Oh My Zsh.
- Powerlevel10k.

## IDE

El proyecto se desarrollará principalmente en:

- WebStorm.

También está disponible:

- IntelliJ IDEA Ultimate.

Se eligió WebStorm porque el proyecto será completamente JavaScript/TypeScript, React y Next.js.

## Herramientas instaladas

- Git.
- Homebrew.
- NVM.
- Node.js 24 LTS.
- npm.
- pnpm.
- Docker Desktop.
- Docker Compose.
- Supabase CLI.
- WebStorm.
- IntelliJ IDEA.

## Herramientas que pueden instalarse posteriormente

- Vercel CLI.
- GitHub CLI.
- Resend SDK.

No es necesario instalarlas para continuar con la primera fase.

---

# 3. Estado actual del proyecto

El proyecto ya fue creado localmente.

Ruta aproximada:

```text
~/Documents/Projects/wedding-invitation
```

El proyecto fue creado con `create-next-app`.

Configuración seleccionada:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
Use src directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: @/*
React Compiler: No
```

Package manager:

```text
pnpm
```

El proyecto ya puede arrancar con:

```bash
pnpm dev
```

Supabase local también fue inicializado y arrancado mediante Docker.

Los comandos disponibles son:

```bash
supabase start
supabase status
supabase stop
```

El directorio `supabase/` debe permanecer dentro del repositorio.

La estructura actual debería incluir aproximadamente:

```text
wedding-invitation/
├── public/
├── src/
│   └── app/
├── supabase/
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── .gitignore
└── README.md
```

El repositorio Git local debe inicializarse o ya puede estar inicializado por Next.js.

El repositorio remoto debe crearse en GitHub como privado.

Nombre recomendado:

```text
wedding-invitation
```

El repositorio debe permanecer privado durante el desarrollo.

---

# 4. Arquitectura general

La solución será una aplicación full stack en un único repositorio.

Arquitectura:

```text
Invitado
   │
   ▼
Dominio personalizado
   │
   ▼
Cloudflare DNS
   │
   ▼
Vercel
   │
   ▼
Next.js full stack
   ├── Server Components
   ├── Client Components
   ├── Server Actions
   ├── Route Handlers
   ├── Página pública
   ├── Invitación personalizada
   ├── RSVP
   └── Panel administrativo
   │
   ▼
Supabase
   ├── PostgreSQL
   ├── Auth
   ├── RLS
   ├── Storage opcional
   └── Studio
```

Durante desarrollo:

```text
Next.js
└── Ejecutado directamente en macOS con pnpm dev

Supabase local
└── Ejecutado con Docker mediante Supabase CLI
```

No se ejecutará Next.js dentro de Docker durante el desarrollo.

Docker se utilizará principalmente para Supabase local.

---

# 5. Stack tecnológico definitivo

## Frontend y backend

- Next.js.
- App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Server Components.
- Client Components solo cuando se necesite interacción.
- Server Actions.
- Route Handlers cuando sean necesarios.

## Formularios y validaciones

- Zod.
- React Hook Form.
- `@hookform/resolvers`.

## UI y utilidades

- Tailwind CSS.
- `clsx`.
- `tailwind-merge`.
- `class-variance-authority`.
- `lucide-react`.
- `date-fns`.

## Base de datos

- PostgreSQL mediante Supabase.
- Supabase Auth.
- Supabase Row Level Security.
- Supabase Studio.
- Supabase migrations.
- Supabase seed.

## Hosting

- Vercel Hobby.
- Cloudflare para dominio y DNS.
- GitHub como repositorio privado.

## Correos

- Resend, pero no debe implementarse todavía.
- La aplicación debe funcionar sin Resend.

## Testing

- Vitest o Jest para pruebas unitarias.
- Playwright para pruebas end-to-end.

Preferencia inicial:

```text
Vitest + Testing Library + Playwright
```

---

# 6. Dependencias recomendadas

Instalar, si todavía no están instaladas:

```bash
pnpm add @supabase/supabase-js
pnpm add @supabase/ssr
pnpm add zod
pnpm add react-hook-form
pnpm add @hookform/resolvers
pnpm add clsx
pnpm add tailwind-merge
pnpm add class-variance-authority
pnpm add lucide-react
pnpm add date-fns
```

Dependencias de desarrollo:

```bash
pnpm add -D prettier
pnpm add -D prettier-plugin-tailwindcss
```

No instalar todavía librerías pesadas o innecesarias.

No instalar Redux.

No instalar un ORM inicialmente.

No instalar Prisma en la primera versión.

La comunicación con la base de datos se hará mediante Supabase.

---

# 7. Usuarios del sistema

La aplicación tendrá dos tipos de usuarios.

## Invitados

No necesitan crear una cuenta.

Cada familia tendrá un enlace privado parecido a:

```text
https://dominio.com/i/7xKp92LmQf4R
```

Al abrirlo podrán:

- Ver una bienvenida personalizada.
- Ver cuántos cupos tienen reservados.
- Ver la información del matrimonio.
- Confirmar asistencia.
- Indicar quiénes asistirán.
- Indicar quiénes no asistirán.
- Registrar restricciones alimentarias.
- Dejar un mensaje.
- Modificar la respuesta si aún está permitido.

## Administradores

Los administradores sí deben autenticarse.

Inicialmente habrá un solo administrador.

El administrador podrá:

- Crear familias.
- Crear invitados (nombre + género).
- Definir cupos.
- Generar enlaces.
- Copiar enlaces.
- Ver confirmaciones.
- Ver pendientes.
- Ver no asistentes.
- Consultar restricciones alimentarias.
- Editar familias.
- Editar invitados (incluido género).
- Cerrar RSVP.
- Exportar CSV.
- Ver métricas básicas.

---

# 8. Experiencia pública

La página pública debe tener una experiencia visual fluida y elegante.

## Secciones esperadas

### Hero

Debe incluir:

- Nombres de los novios.
- Fecha.
- Fotografía principal.
- Frase corta.
- Animación ligera.
- Indicador de scroll.

### Bienvenida personalizada

La portada (`/i/[slug]`) muestra un saludo según la cantidad de invitados de la familia:

| Invitados | Ejemplo |
|-----------|---------|
| 1 | `Querido Luis` / `Querida Ana` / `Hola Alex` (según `guests.gender`) |
| 2 | `Queridos Ana y Luis` |
| 3+ | `Querida Familia Gutiérrez` (`families.display_name`) |

El subtítulo de portada y el resto del cuerpo de la invitación viven en `weddingConfig`.

### Cuenta regresiva

Mostrar:

- Días.
- Horas.
- Minutos.
- Segundos.

Debe utilizar correctamente la zona horaria del matrimonio.

### Ceremonia

Mostrar:

- Nombre del lugar.
- Dirección.
- Fecha.
- Hora.
- Botón de Google Maps.
- Botón de Waze.

### Recepción

Mostrar:

- Lugar.
- Dirección.
- Hora.
- Botones de mapas.

Puede ser el mismo lugar de la ceremonia o uno diferente.

### Itinerario

Ejemplo:

```text
Llegada de invitados
Ceremonia
Cóctel
Cena
Fiesta
Cierre
```

### Código de vestimenta

Mostrar:

- Tipo de vestimenta.
- Recomendaciones.
- Colores reservados.
- Referencias: páginas `/inspiracion/ellos` y `/inspiracion/ellas` (boards teléfono + desktop).

### Regalos

Debe ser configurable.

Posibles opciones:

- Lluvia de sobres (implementado: ilustración + copy en sección Mesa de regalos).
- Lista de regalos.
- Transferencia.
- Mensaje personalizado.

### Preguntas frecuentes

Preguntas sugeridas:

- ¿Puedo llevar acompañante?
- ¿Pueden asistir niños?
- ¿Hay estacionamiento?
- ¿Hasta cuándo puedo confirmar?
- ¿Puedo cambiar mi respuesta?
- ¿Ceremonia y recepción son en el mismo lugar?

### RSVP

Formulario de confirmación embebido en la invitación (no solo un botón aislado). Incluye:

- Asistencia a nivel familia e invitado.
- Opt-in de transporte (bus) por invitado que asiste.
- **Punto de encuentro del bus** (obligatorio si usa transporte).
- Restricciones alimentarias.
- Contacto y mensaje opcional.

### Cierre

Debe incluir:

- Mensaje de agradecimiento.
- Firma de los novios.
- Fotografía o elemento decorativo.

---

# 9. RSVP

El formulario RSVP es una de las partes más importantes.

Debe permitir:

- Confirmar asistencia de la familia.
- Rechazar asistencia.
- Seleccionar invitados individualmente.
- Respetar el límite de cupos.
- Registrar restricciones alimentarias por persona.
- Registrar si cada asistente usará el bus de la invitación.
- Si usará el bus, registrar **desde qué punto de encuentro** arranca (solo puntos definidos en config/producto).
- Registrar teléfono opcional.
- Registrar correo opcional.
- Dejar un mensaje.
- Guardar fecha de respuesta.
- Modificar respuesta si está permitido.

## Validaciones

Las validaciones deben ejecutarse en cliente y servidor.

Nunca confiar solo en el navegador.

Validaciones necesarias:

- El token/slug debe existir.
- La familia debe estar habilitada.
- El RSVP debe estar abierto.
- La fecha límite no debe haber vencido.
- El número de asistentes no puede superar los cupos.
- Los invitados deben pertenecer a la familia.
- Los datos deben validarse con Zod.
- No se deben aceptar estados inválidos.
- El transporte solo aplica a invitados que asisten.
- Si un invitado usa transporte, el punto de embarque debe ser uno de los ids permitidos.
- Se deben evitar envíos duplicados accidentales.

## Resultado esperado

Después de guardar:

- Mostrar confirmación visual.
- Mostrar resumen.
- Permitir editar si está habilitado.
- Registrar evento de auditoría.
- Opcionalmente enviar correo más adelante.

---

# 10. Modelo de datos

## Tabla `events`

Campos sugeridos:

```text
id
slug
name
partner_one_name
partner_two_name
event_date
timezone
rsvp_deadline
ceremony_name
ceremony_address
ceremony_maps_url
ceremony_waze_url
ceremony_time
reception_name
reception_address
reception_maps_url
reception_waze_url
reception_time
dress_code_title
dress_code_description
gift_message
is_rsvp_open
created_at
updated_at
```

## Tabla `families`

```text
id
event_id
display_name
invitation_token_hash
invitation_token_preview
invitation_slug
maximum_guests
custom_message
status
is_enabled
last_opened_at
created_at
updated_at
```

## Tabla `guests`

```text
id
family_id
full_name
gender
needs_name_confirmation
is_primary_contact
email
phone
attendance_status
dietary_restrictions
menu_option
needs_transport
transport_boarding_point
created_at
updated_at
```

`gender`: `male` \| `female` \| `unspecified` (nullable for legacy rows). Required when creating/updating families in admin. Used for the singular cover greeting (`Querido` / `Querida` / `Hola`).

`needs_name_confirmation`: true for plus-ones stored as “Acompañante” (or similar). The RSVP form requires a real name; they still count in analytics totals.

`transport_boarding_point`: nullable; values in use: `modelia`, `villa_sonia`. Required when `needs_transport` is true for an attending guest (enforced in RPC + Zod).

Estados:

```text
pending
attending
not_attending
```

## Tabla `rsvp_responses`

```text
id
family_id
will_attend
confirmed_guest_count
contact_email
contact_phone
message
submitted_at
updated_at
```

## Tabla `rsvp_response_guests`

```text
id
rsvp_response_id
guest_id
will_attend
dietary_restrictions
menu_option
needs_transport
transport_boarding_point
created_at
updated_at
```

## Tabla `audit_events`

```text
id
event_id
family_id
action
metadata
created_at
```

Acciones sugeridas:

```text
invitation_opened
rsvp_submitted
rsvp_updated
invitation_disabled
guest_limit_updated
```

---

# 11. Tokens de invitación

Los tokens deben ser:

- Aleatorios.
- Largos.
- No secuenciales.
- Difíciles de adivinar.
- Generados criptográficamente.

No se deben usar IDs de base de datos como tokens.

Idealmente:

- Generar token con `crypto.randomBytes`.
- Enviar el token al invitado.
- Guardar solo su hash.
- Guardar una vista previa pequeña para administración.

Ejemplo:

```text
Token real:
7xKp92LmQf4RQ1nZ8aV5wB3t

Hash:
SHA-256
```

La búsqueda debe realizarse comparando el hash.

---

# 12. Seguridad

Implementar:

- Row Level Security.
- Validación Zod.
- Tokens seguros.
- Claves privadas solo en servidor.
- `service_role` solo en servidor.
- Autenticación administrativa.
- Rate limiting.
- Honeypot.
- Sanitización de texto.
- Evitar enumeración de invitaciones.
- No exponer IDs internos.
- No almacenar documentos de identidad.
- No almacenar datos sensibles innecesarios.

Encabezados a considerar:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

No implementar CAPTCHA en la primera fase.

Solo añadir CAPTCHA si existe abuso real.

---

# 13. Supabase

Supabase ya está iniciado localmente.

La estructura debe mantenerse así:

```text
supabase/
├── config.toml
├── migrations/
└── seed.sql
```

Comandos principales:

```bash
supabase start
supabase status
supabase stop
supabase db reset
supabase migration new nombre_migracion
```

El desarrollo debe ser migration-first.

No crear tablas manualmente únicamente desde Supabase Studio sin crear la migración correspondiente.

Todas las tablas, políticas, funciones e índices deben quedar versionados en SQL.

---

# 14. Clientes Supabase

Crear:

```text
src/lib/supabase/
├── client.ts
├── server.ts
└── admin.ts
```

## `client.ts`

Solo para componentes de cliente.

Debe usar:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## `server.ts`

Para Server Components, Server Actions y Route Handlers.

Debe manejar cookies correctamente usando `@supabase/ssr`.

## `admin.ts`

Debe utilizar:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Este cliente:

- Nunca debe importarse desde Client Components.
- Nunca debe formar parte del bundle del navegador.
- Solo debe usarse para tareas administrativas seguras.

---

# 15. Variables de entorno

Crear `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

Crear `.env.local` con los valores reales locales.

`.env.local` nunca debe subirse a Git.

Confirmar que `.gitignore` contenga:

```text
.env
.env.local
.env.*.local
node_modules
.next
```

---

# 16. Configuración central del matrimonio

Crear:

```text
src/config/wedding.ts
```

Debe contener datos de ejemplo tipados.

Ejemplo de estructura (ilustrativo; la fuente real del repo es el archivo):

```ts
export const weddingConfig = {
  couple: {
    partnerOne: "Nychol",
    partnerTwo: "Miguel",
  },
  event: {
    date: "2026-10-24T16:00:00-05:00",
    timezone: "America/Bogota",
    rsvpDeadline: "2026-09-15T23:59:59-05:00",
  },
  ceremony: {
    name: "Hacienda Montecano",
    address: "km 2.5 a 3 de la vía Subachoque - El Rosal",
    mapsUrl: "https://maps.app.goo.gl/…",
    wazeUrl: "https://ul.waze.com/ul?…",
    appleMapsUrl: "https://maps.apple/p/…",
    mapsEmbedUrl: "https://www.google.com/maps/embed?…",
  },
  reception: {
    name: "Lugar de la recepción",
    address: "Lugar por definir",
    mapsUrl: "",
    wazeUrl: "",
    appleMapsUrl: "",
    mapsEmbedUrl: "",
  },
  transport: {
    meetingPoints: [
      {
        id: "modelia",
        title: "Punto de Encuentro #1 y Salida",
        place: "Calle 23B bis #75-48 Modelia",
      },
      {
        id: "villa_sonia",
        title: "Punto de Encuentro #2 y Salida",
        place: "Calle 38B sur #50A-53 Villa Sonia",
      },
    ],
  },
  dressCode: {
    title: "FORMAL ELEGANTE",
    description: "",
  },
  gifts: {
    title: "Mesa de regalos",
    description: "",
  },
  features: {
    countdown: true,
    timeline: false,
    gifts: true,
    faq: false,
    music: true,
  },
  assets: {
    music: "/invitation/soundtrack.mp3",
  },
} as const;
```

Los **ids** de `meetingPoints` son contrato con Zod, RPC y constraints SQL. No dispersar textos del evento en múltiples componentes.

---

# 17. Estructura objetivo

La estructura deseada es:

```text
src/
├── actions/
│   ├── admin/
│   └── rsvp/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── i/
│   │       └── [token]/
│   │           └── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   ├── families/
│   │   ├── guests/
│   │   ├── responses/
│   │   └── settings/
│   ├── api/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── components/
│   ├── admin/
│   ├── invitation/
│   ├── rsvp/
│   └── ui/
├── config/
│   └── wedding.ts
├── hooks/
├── lib/
│   ├── auth/
│   ├── email/
│   ├── security/
│   ├── supabase/
│   └── validation/
├── services/
│   ├── families/
│   ├── guests/
│   └── rsvp/
├── styles/
├── types/
└── utils/

public/
├── images/
├── icons/
└── fonts/

supabase/
├── migrations/
└── seed.sql
```

La estructura puede ajustarse si existe una razón técnica clara, pero debe mantenerse simple.

---

# 18. Componentes iniciales

Crear posteriormente:

```text
HeroSection
PersonalGreeting
CountdownSection
LocationSection
TimelineSection
DressCodeSection
GiftSection
FaqSection
RsvpSection
FooterSection
```

Los componentes deben:

- Ser pequeños.
- Ser reutilizables.
- Tener responsabilidades claras.
- Recibir datos mediante props.
- Evitar datos hardcodeados.
- Ser Server Components por defecto.

Solo usar `"use client"` cuando sea necesario.

Ejemplos de Client Components:

- Countdown.
- Formularios.
- Carruseles.
- Botones interactivos.
- Música.

---

# 19. Responsive

El diseño debe ser mobile-first.

Dispositivos disponibles para pruebas:

- iPhone Air.
- iPhone 17 Pro Max.
- Samsung Galaxy S25.
- Samsung Galaxy S24 Ultra.
- Mac.
- Windows.

Navegadores:

- Safari.
- Chrome.
- Edge.
- Navegador embebido de WhatsApp.

Considerar:

- Notch.
- Dynamic Island.
- Safe areas.
- Barra inferior de Safari.
- Teclado móvil.
- Orientación horizontal.
- Orientación vertical.
- Pantallas pequeñas.

Aplicar cuando sea necesario:

```css
padding-top: env(safe-area-inset-top);
padding-right: env(safe-area-inset-right);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
```

Botones táctiles:

```text
Mínimo 44 x 44 px
```

---

# 20. Imágenes

Las imágenes serán importantes.

Usar:

- `next/image`.
- WebP.
- AVIF.
- `sizes`.
- Lazy loading.
- Priority solo en hero.
- Dimensiones explícitas.
- Blur placeholders cuando aporten valor.

Evitar:

- Imágenes originales de 10 MB.
- Cargar todas las fotos al inicio.
- Galerías pesadas en la primera versión.
- Videos de fondo pesados.

---

# 21. Música

La música será opcional.

No usar autoplay con sonido.

Si se implementa:

- Mostrar botón de reproducción.
- Mostrar botón para silenciar.
- Recordar la selección durante la sesión.
- Respetar las restricciones de iOS.
- No bloquear la navegación.

No implementar en la primera fase.

---

# 22. Metadata

Configurar:

- Título.
- Descripción.
- Open Graph.
- Twitter metadata.
- Ícono.
- Imagen para WhatsApp.

No incluir información privada de familias en Open Graph.

Los servicios externos pueden almacenar metadata en caché.

---

# 23. Panel administrativo

Rutas esperadas:

```text
/admin/login
/admin
/admin/analytics
/admin/guests
/admin/families
/admin/families/new
/admin/families/[id]
/admin/responses   (roadmap; guests + analytics cover much of this today)
/admin/settings    (roadmap; not implemented)
```

Dashboard / analytics:

- Total de invitados.
- Cupos asignados.
- Confirmados.
- No asistentes.
- Pendientes.
- Familias respondidas.
- Familias pendientes.
- Restricciones alimentarias.
- Cupos de bus.
- **Desglose de cupos de bus por punto de encuentro.**
- Tasa de respuesta de familias e invitados.
- Fecha límite.

Tabla de familias:

- Nombre.
- Cupos.
- Confirmados.
- Estado.
- Última apertura.
- Fecha de respuesta.
- Copiar enlace.
- Editar.
- Deshabilitar.

Exportación CSV:

- Familia.
- Invitado.
- Estado.
- Restricción alimentaria.
- Teléfono.
- Correo.
- Mensaje.
- Fecha de confirmación.

No construir todavía el panel completo.

---

# 24. Diseño visual

El diseño debe ser:

- Romántico.
- Elegante.
- Moderno.
- Limpio.
- Atemporal.
- Sin exceso de elementos.
- Sin apariencia genérica de plantilla.

Crear un sistema de diseño con:

- Colores.
- Tipografías.
- Espaciados.
- Radios.
- Sombras.
- Botones.
- Tarjetas.
- Inputs.
- Estados.
- Alertas.
- Modales.

Las animaciones deben ser suaves.

Respetar:

```text
prefers-reduced-motion
```

---

# 25. Git

El repositorio debe ser privado.

Flujo recomendado:

```text
main
├── feature/project-foundation
├── feature/design-system
├── feature/supabase-schema
├── feature/rsvp
├── feature/admin
└── feature/emails
```

Commits sugeridos:

```text
chore: initialize Next.js project
chore: configure prettier and project structure
feat: add wedding configuration
feat: add Supabase clients
feat: add initial database schema
feat: add invitation landing page
feat: add RSVP flow
feat: add admin dashboard
```

No subir:

- `.env.local`.
- Credenciales.
- Service role key.
- Archivos de build.
- `node_modules`.

---

# 26. Despliegue

Producción:

- GitHub.
- Vercel.
- Supabase remoto.
- Cloudflare.
- Dominio personalizado.

Flujo:

```text
Desarrollo local
   │
   ▼
Feature branch
   │
   ▼
Push a GitHub
   │
   ▼
Vercel Preview
   │
   ▼
Pruebas en celulares
   │
   ▼
Merge a main
   │
   ▼
Producción
```

No desplegar todavía.

Primero construir la base local.

---

# 27. Costos

Objetivo:

```text
Vercel Hobby: USD 0
Supabase Free: USD 0
GitHub privado: USD 0
Cloudflare DNS: USD 0
Resend Free: USD 0
HTTPS: USD 0
Dominio: único costo obligatorio
```

No añadir servicios pagos sin justificación.

---

# 28. Alcance de la primera versión

Debe incluir:

- Proyecto Next.js.
- TypeScript.
- Tailwind.
- Supabase.
- Invitación pública.
- Invitación por token.
- RSVP.
- Panel administrativo básico.
- Exportación CSV.
- Seguridad básica.
- Responsive.
- Metadata.
- Pruebas esenciales.
- README.
- Despliegue.

No debe incluir inicialmente:

- Flutter.
- Dart.
- Backend Java.
- Microservicios.
- Kubernetes.
- Pagos.
- Códigos QR.
- Chat.
- Notificaciones push.
- CMS externo.
- Galería colaborativa.
- Aplicación móvil.
- Múltiples eventos.
- Editor visual complejo.

---

# 29. Handoff histórico: Project Foundation

> Esta sección y las secciones 30–31 se conservan como contexto histórico del handoff inicial. Pueden estar desactualizadas y no deben usarse como checklist operativo. La fuente vigente y verificable es `docs/current-phase.md`; las reglas permanentes están en `AGENTS.md`. El UI de la invitación se documenta en `docs/invitation-ui.md`.

El entorno ya está listo.

El proyecto Next.js ya existe.

Supabase local ya está arrancado.

El siguiente trabajo debe ser preparar la base técnica del repositorio.

## Siguiente fase: Project Foundation

Implementar ahora, en este orden:

### Paso 1

Revisar el proyecto existente.

No recrear el proyecto.

No ejecutar nuevamente `create-next-app`.

### Paso 2

Verificar:

```bash
pnpm dev
pnpm lint
```

Agregar un script para TypeScript si no existe:

```json
"typecheck": "tsc --noEmit"
```

### Paso 3

Instalar dependencias base.

### Paso 4

Crear estructura de carpetas.

### Paso 5

Configurar Prettier.

Crear:

```text
.prettierrc
.prettierignore
```

Configuración sugerida:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

### Paso 6

Crear:

```text
.env.example
```

No modificar ni compartir credenciales reales.

### Paso 7

Crear:

```text
src/config/wedding.ts
```

Usar datos de ejemplo claramente marcados.

### Paso 8

Crear clientes Supabase:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

### Paso 9

Crear utilidades:

```text
src/lib/utils.ts
```

Debe incluir una función `cn`.

### Paso 10

Crear tipos base:

```text
src/types/event.ts
src/types/family.ts
src/types/guest.ts
src/types/rsvp.ts
```

### Paso 11

Crear una página inicial visualmente limpia pero sencilla.

No diseñar todavía toda la invitación.

Debe incluir:

- Nombre temporal de la pareja.
- Fecha temporal.
- Mensaje de que el proyecto está en construcción.
- Responsive.
- Buen uso de Tailwind.
- Metadata básica.

### Paso 12

Crear ruta:

```text
/i/[token]
```

Por ahora debe usar un mock.

Debe mostrar:

- Nombre de una familia de ejemplo.
- Cupos asignados.
- Mensaje personalizado.
- Token recibido.

No consultar todavía la base de datos real.

### Paso 13

Crear README con:

- Requisitos.
- Instalación.
- Variables.
- Inicio de Next.js.
- Inicio de Supabase.
- Comandos.
- Arquitectura.
- Próximos pasos.

### Paso 14

Ejecutar:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Corregir todos los errores antes de terminar.

---

# 30. Resultado esperado de la siguiente ejecución del agente

Al finalizar, el agente debe entregar:

- Lista de archivos creados.
- Lista de archivos modificados.
- Dependencias añadidas.
- Decisiones técnicas.
- Comandos ejecutados.
- Resultado de lint.
- Resultado de TypeScript.
- Resultado de build.
- Instrucciones para probar.
- Próximo paso recomendado.

No avanzar todavía con:

- Migraciones completas.
- Autenticación.
- RSVP real.
- Panel administrativo completo.
- Correos.
- Despliegue.

Primero debe quedar una base técnica limpia, ejecutable y documentada.

---

# 31. Forma de trabajo esperada para Copilot, Cursor o Codex

Actúa como un senior full stack engineer.

Antes de modificar:

1. Inspecciona el repositorio.
2. Revisa `package.json`.
3. Revisa la estructura existente.
4. Revisa `.gitignore`.
5. Revisa configuración de Tailwind.
6. Revisa el estado de Git.

Durante el trabajo:

1. Realiza cambios incrementales.
2. No elimines código sin motivo.
3. No agregues dependencias innecesarias.
4. Mantén TypeScript estricto.
5. Mantén Server Components por defecto.
6. Evita `"use client"` salvo necesidad.
7. No expongas secretos.
8. No uses service role en cliente.
9. Mantén el proyecto ejecutable.
10. Ejecuta validaciones al final.

No inventes datos reales del matrimonio más allá de lo ya confirmado en el repositorio.

Confirmado en producto:

```text
Nychol
Miguel
```

Para datos aún no definidos (horarios de bus, URLs de mapas, etc.), usa placeholders como:

```text
por confirmar
Lugar por definir
```

(URL vacía deshabilita el CTA; no inventar links.)

Cuando encuentres una decisión no definida:

- Escoge la opción más sencilla.
- Documenta la decisión.
- Déjala fácil de cambiar.

No sobrearquitectes.

La aplicación es para aproximadamente 90 invitados.

La solución debe sentirse profesional, pero no empresarial ni innecesariamente compleja.
