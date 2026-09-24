import { describe, expect, it } from "vitest";
import { getUsersSchema } from "./get-users.validation";

describe("getUsersSchema", () => {
  it("applies safe defaults for pagination and sorting", () => {
    expect(getUsersSchema.parse({})).toEqual({
      page: 1,
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("coerces query strings and trims search input", () => {
    expect(
      getUsersSchema.parse({
        search: "  sarah  ",
        status: "ACTIVE",
        role: "USER",
        page: "2",
        limit: "5",
        sortBy: "name",
        sortOrder: "asc",
      }),
    ).toEqual({
      search: "sarah",
      status: "ACTIVE",
      role: "USER",
      page: 2,
      limit: 5,
      sortBy: "name",
      sortOrder: "asc",
    });
  });

  it("rejects unsupported limits and sort fields", () => {
    expect(() =>
      getUsersSchema.parse({
        limit: "101",
        sortBy: "passwordHash",
      }),
    ).toThrow();
  });
});
