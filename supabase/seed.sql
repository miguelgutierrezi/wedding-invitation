-- Fictional placeholder seed data for local development only.
-- Known development invitation tokens (never use in production):
--   Familia Ejemplo  -> dev-family-ejemplo
--   Familia Demo     -> dev-family-demo

insert into public.events (
  id,
  slug,
  name,
  partner_one_name,
  partner_two_name,
  event_date,
  timezone,
  rsvp_deadline,
  ceremony_name,
  ceremony_address,
  ceremony_time,
  reception_name,
  reception_address,
  reception_time,
  dress_code_title,
  dress_code_description,
  gift_message,
  is_rsvp_open
)
values (
  '11111111-1111-4111-8111-111111111111',
  'nombre-1-nombre-2',
  'Matrimonio Nombre 1 & Nombre 2',
  'Nombre 1',
  'Nombre 2',
  '2027-01-01T16:00:00-05:00',
  'America/Bogota',
  '2026-12-01T23:59:59-05:00',
  'Lugar de la ceremonia',
  'Lugar por definir',
  '16:00',
  'Lugar de la recepción',
  'Lugar por definir',
  '18:00',
  'Formal',
  'Detalles del código de vestimenta por definir.',
  'Tu presencia es nuestro mejor regalo.',
  true
);

insert into public.families (
  id,
  event_id,
  display_name,
  invitation_token_hash,
  invitation_token_preview,
  maximum_guests,
  custom_message,
  status,
  is_enabled
)
values
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111111',
    'Familia Ejemplo',
    encode(extensions.digest('dev-family-ejemplo', 'sha256'), 'hex'),
    'empl',
    3,
    'Nos emociona mucho compartir este día con ustedes.',
    'responded',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'Familia Demo',
    encode(extensions.digest('dev-family-demo', 'sha256'), 'hex'),
    'demo',
    2,
    'Hemos reservado lugares para su familia.',
    'pending',
    true
  );

insert into public.guests (
  id,
  family_id,
  full_name,
  is_primary_contact,
  email,
  phone,
  attendance_status,
  dietary_restrictions
)
values
  (
    '33333333-3333-4333-8333-333333333331',
    '22222222-2222-4222-8222-222222222221',
    'Invitado Ejemplo Uno',
    true,
    'ejemplo.uno@example.com',
    '+570000000001',
    'attending',
    'Sin restricciones'
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '22222222-2222-4222-8222-222222222221',
    'Invitado Ejemplo Dos',
    false,
    null,
    null,
    'attending',
    'Vegetariano'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222221',
    'Invitado Ejemplo Tres',
    false,
    null,
    null,
    'not_attending',
    null
  ),
  (
    '33333333-3333-4333-8333-333333333334',
    '22222222-2222-4222-8222-222222222222',
    'Invitado Demo Uno',
    true,
    'demo.uno@example.com',
    null,
    'pending',
    null
  ),
  (
    '33333333-3333-4333-8333-333333333335',
    '22222222-2222-4222-8222-222222222222',
    'Invitado Demo Dos',
    false,
    null,
    null,
    'pending',
    null
  );

insert into public.rsvp_responses (
  id,
  family_id,
  will_attend,
  confirmed_guest_count,
  contact_email,
  contact_phone,
  message
)
values (
  '44444444-4444-4444-8444-444444444441',
  '22222222-2222-4222-8222-222222222221',
  true,
  2,
  'ejemplo.uno@example.com',
  '+570000000001',
  '¡Allí estaremos!'
);

insert into public.rsvp_response_guests (
  rsvp_response_id,
  guest_id,
  will_attend,
  dietary_restrictions
)
values
  (
    '44444444-4444-4444-8444-444444444441',
    '33333333-3333-4333-8333-333333333331',
    true,
    'Sin restricciones'
  ),
  (
    '44444444-4444-4444-8444-444444444441',
    '33333333-3333-4333-8333-333333333332',
    true,
    'Vegetariano'
  ),
  (
    '44444444-4444-4444-8444-444444444441',
    '33333333-3333-4333-8333-333333333333',
    false,
    null
  );

insert into public.audit_events (event_id, family_id, action, metadata)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222221',
    'invitation_opened',
    '{"source": "seed"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222221',
    'rsvp_submitted',
    '{"confirmed_guest_count": 2, "source": "seed"}'::jsonb
  );
