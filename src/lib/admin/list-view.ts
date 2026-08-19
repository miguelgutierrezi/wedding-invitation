export const ADMIN_PAGE_SIZE = 25;

export type AdminSortDir = "asc" | "desc";

export type PaginatedList<T> = {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  items: T[];
};

function compareUnknown(left: unknown, right: unknown): number {
  if (left == null && right == null) {
    return 0;
  }
  if (left == null) {
    return 1;
  }
  if (right == null) {
    return -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), "es", {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortItems<T>(
  items: T[],
  getValue: (item: T) => unknown,
  dir: AdminSortDir,
): T[] {
  const direction = dir === "desc" ? -1 : 1;

  return [...items].sort((left, right) => {
    return compareUnknown(getValue(left), getValue(right)) * direction;
  });
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = ADMIN_PAGE_SIZE,
): PaginatedList<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    page: safePage,
    totalPages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
    items: items.slice(start, start + pageSize),
  };
}

export function nextSortDir(
  currentSort: string,
  currentDir: AdminSortDir,
  column: string,
): AdminSortDir {
  if (currentSort === column && currentDir === "asc") {
    return "desc";
  }
  return "asc";
}
