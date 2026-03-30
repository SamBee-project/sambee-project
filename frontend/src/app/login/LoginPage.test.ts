import { describe, it, expect } from "vitest";
import { loginSchema } from "../../schemas/auth.schema";

describe("Auth validations", () => {
  it("should fail if login is too short", () => {
    const result = loginSchema.safeParse({ login: "an", password: "123" });
    expect(result.success).toBe(false);
  });

  it("should fail if password is too short", () => {
    const result = loginSchema.safeParse({ login: "an", password: "123" });
    expect(result.success).toBe(false);
  });

  it("should pass with valid data", () => {
    const result = loginSchema.safeParse({
      login: "Taras",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});
