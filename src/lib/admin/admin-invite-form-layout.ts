/**
 * Invite email + submit stay stacked until `lg`, matching `admin.btnSecondary`
 * (`w-full` until `lg:w-auto`). An earlier `sm:flex-row` crushed the email field
 * on phones in landscape and tablets in portrait.
 */
export const adminInviteFieldsRowClass =
    "flex flex-col gap-3 lg:flex-row lg:items-stretch";
