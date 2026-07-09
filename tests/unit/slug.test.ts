import { describe, it, expect } from "vitest";
import { isReservedSlug } from "@/lib/slug/reserved";
import { generateSlug, isValidSlugFormat, normalizeSlug } from "@/lib/slug/generator";
import { normalizeUrl } from "@/lib/security/sanitize";

describe("Slug Generator", () => {
  it("generates valid slugs", () => {
    const slug = generateSlug();
    expect(slug.length).toBe(7);
    expect(isValidSlugFormat(slug)).toBe(true);
  });

  it("normalizes slugs to lowercase", () => {
    expect(normalizeSlug("My-Link")).toBe("my-link");
  });

  it("detects reserved slugs", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("mylink")).toBe(false);
  });
});

describe("URL Sanitizer", () => {
  it("adds https protocol", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("rejects invalid protocols", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow();
  });
});
