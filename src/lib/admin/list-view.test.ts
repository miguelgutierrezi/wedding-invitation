import { describe, expect, it } from "vitest";

import {
  nextSortDir,
  paginateItems,
  sortItems,
} from "@/lib/admin/list-view";

describe("sortItems", () => {
  it("sorts strings and keeps nulls last", () => {
    const rows = [{ name: "Carlos" }, { name: null }, { name: "Ana" }];

    expect(sortItems(rows, (row) => row.name, "asc").map((row) => row.name)).toEqual([
      "Ana",
      "Carlos",
      null,
    ]);
  });
});

describe("paginateItems", () => {
  it("clamps the page and slices the window", () => {
    const items = [1, 2, 3, 4, 5];
    const page = paginateItems(items, 9, 2);

    expect(page.page).toBe(3);
    expect(page.totalPages).toBe(3);
    expect(page.items).toEqual([5]);
    expect(page.from).toBe(5);
    expect(page.to).toBe(5);
  });
});

describe("nextSortDir", () => {
  it("toggles desc after a second click on the same column", () => {
    expect(nextSortDir("name", "asc", "name")).toBe("desc");
    expect(nextSortDir("name", "desc", "name")).toBe("asc");
    expect(nextSortDir("name", "desc", "other")).toBe("asc");
  });
});
