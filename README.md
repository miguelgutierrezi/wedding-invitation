# Wedding Invitation

Aplicación web full stack para una invitación de matrimonio personalizada y la gestión de confirmaciones de aproximadamente 90 invitados.

Cada familia recibirá un enlace privado para consultar la información del evento y confirmar la asistencia de sus integrantes. La aplicación incluirá posteriormente un panel administrativo privado, restricciones alimentarias y exportación CSV.

## Estado actual

El proyecto está en la fase **Admin panel**. Hay invitación pública en `/i/[token]`, RSVP, schema Supabase y despliegue cloud. El panel `/admin` gestiona familias e invitaciones (login Supabase Auth).

El alcance autorizado y su checklist se encuentran en [`docs/current-phase.md`](docs/current-phase.md).

### Usuario administrador (local o cloud)

1. Crea en Supabase **Authentication → Users** las cuentas con email:
   - `migueangel97@hotmail.com`
   - `nycholpg@gmail.com`
   (ambos están siempre en la allowlist de `src/config/admin.ts`).
2. Abre [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (o tu dominio + `/admin/login`).

Assets de invitación (cuando los exportes):

```text
public/invitation/
```

Rutas esperadas documentadas en `public/invitation/` y enlazadas desde `src/config/wedding.ts` (`assets`).

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

No se deben compartir ni subir a Git los valores reales de `.env.local`.

## Variables de entorno

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` es exclusivamente para código de servidor. Resend está previsto para una fase futura y la aplicación debe funcionar sin correo durante el desarrollo inicial.

## Comandos

```bash
pnpm dev       # servidor de desarrollo
pnpm lint      # ESLint
pnpm typecheck # TypeScript sin emitir archivos
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
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Todo push y PR a `main` | `pnpm lint`, `pnpm typecheck`, `pnpm build` |
| [`.github/workflows/supabase-migrate.yml`](.github/workflows/supabase-migrate.yml) | Push a `main` si cambian migraciones, o manual | `supabase db push` al proyecto cloud |

Migraciones **no** corren en cada push de UI: solo cuando tocas `supabase/migrations/**` (o *Run workflow*). Así no intentas `db push` en cada cambio de componente.

Secrets de migraciones: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`.

Vercel despliega la app; no aplica SQL. El seed local (`seed.sql`) no se ejecuta en CI.

Tokens de desarrollo del seed (solo local):

```text
dev-family-ejemplo  →  http://localhost:3000/i/dev-family-ejemplo
dev-family-demo     →  http://localhost:3000/i/dev-family-demo
```

El hash SHA-256 de esos tokens es lo que queda guardado en `families.invitation_token_hash`. Recuerda copiar las claves de `supabase status` a `.env.local` antes de probar el RSVP.

## Arquitectura y documentación

- [`AGENTS.md`](AGENTS.md): reglas permanentes para agentes de código.
- [`docs/current-phase.md`](docs/current-phase.md): único alcance autorizado en este momento.
- [`docs/product-spec.md`](docs/product-spec.md): requisitos y visión del producto.
- [`docs/architecture.md`](docs/architecture.md): arquitectura y límites técnicos.

La aplicación es un único proyecto Next.js full stack. Next.js corre directamente mediante pnpm y Supabase corre localmente en Docker a través de Supabase CLI. Los Server Components son la opción predeterminada; los Client Components se reservan para interacción en el navegador.

## Flujo de trabajo

Antes de implementar, leer `AGENTS.md` y `docs/current-phase.md`. No se deben implementar fases futuras sin autorización explícita.

Antes de declarar una tarea terminada, ejecutar los checks relevantes y reportar cuáles se ejecutaron. Nunca afirmar que un check pasó si no fue ejecutado.

## Datos del matrimonio

Los datos reales aún no están definidos ni deben inventarse. Durante la fase actual se utilizan placeholders claramente identificados, por ejemplo:

```text
Nombre 1
Nombre 2
Fecha por definir
Lugar por definir
```

## Despliegue

El destino previsto es Vercel con Supabase remoto y Cloudflare DNS. El despliegue a producción no forma parte de la fase actual.
