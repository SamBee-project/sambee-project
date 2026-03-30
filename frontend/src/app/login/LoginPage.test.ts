import { describe, it, expect } from "vitest";
import { loginSchema, registrationSchema } from "../../schemas/authSchema";

describe("Auth validations", () => {
  it("should skip with valid data", () => {
    const validData = { email: "galkisak@gmail.com", password: "123123123" };
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should throw an error if the email is invalid", () => {
    const invalidData = { email: "invalidEmail", password: "123123123" };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Registration Schema", () => {
  it("should throw an error if the passwords do not match", () => {
    const mismatchedData = {
      name: "Andrii",
      email: "agalkisak@gmail.com",
      password: "Password123",
      confirmPassword: "Different123",
      acceptTerms: true,
    };

    const result = registrationSchema.safeParse(mismatchedData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword");
    }
  });

  it("should fail if password has no uppercase letter", () => {
    const noUppercase = {
      name: "Andrii",
      email: "agalkisak@gmail.com",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    };

    const result = registrationSchema.safeParse(noUppercase);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toContain("uppercase letter");
    }
  });
  it("should fail if terms are not accepted", () => {
    const noTerms = {
      name: "Andrii",
      email: "agalkisak@gmail.com",
      password: "Password123",
      confirmPassword: "Password123",
      acceptTerms: false,
    };

    const result = registrationSchema.safeParse(noTerms);
    expect(result.success).toBe(false);
  });
});
