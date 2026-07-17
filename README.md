# Wedding Invitation

Aplicación web full stack para una invitación de matrimonio personalizada y la gestión de confirmaciones de aproximadamente 90 invitados.

Cada familia recibirá un enlace privado para consultar la información del evento y confirmar la asistencia de sus integrantes. La aplicación incluirá posteriormente un panel administrativo privado, restricciones alimentarias y exportación CSV.

## Estado actual

El proyecto se encuentra en la fase **Project Foundation**. La aplicación fue creada con Next.js, pero todavía conserva la portada inicial y no tiene un flujo RSVP real, autenticación, migraciones del dominio ni panel administrativo.

El alcance autorizado y su checklist se encuentran en [`docs/current-phase.md`](docs/current-phase.md).

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
pnpm typecheck # TypeScript; se añadirá en la fase actual
pnpm build     # build de producción
```

Comandos locales de Supabase:

```bash
supabase start
supabase status
supabase stop
supabase db reset
```

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
