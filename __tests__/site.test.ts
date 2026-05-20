// Smoke tests for lib/site.ts — verifies real CV data is correctly wired.
// Run with: node --experimental-strip-types --test __tests__/site.test.ts

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { site, experience, projects, education } from "../lib/site.ts";

describe("experience data", () => {
  it("has exactly 4 entries", () => {
    assert.strictEqual(experience.length, 4);
  });

  it("first entry is the current role (endDate === null)", () => {
    assert.strictEqual(experience[0].endDate, null);
  });

  it("first entry id is empathy-senior-2023", () => {
    assert.strictEqual(experience[0].id, "empathy-senior-2023");
  });

  it("all entries have non-empty responsibilities", () => {
    for (const role of experience) {
      assert.ok(
        role.responsibilities.length > 0,
        `Role "${role.id}" has no responsibilities`
      );
    }
  });

  it("all entries have non-empty stack", () => {
    for (const role of experience) {
      assert.ok(role.stack.length > 0, `Role "${role.id}" has no stack`);
    }
  });

  it("all entries have a non-empty dateRange", () => {
    for (const role of experience) {
      assert.ok(
        role.dateRange.length > 0,
        `Role "${role.id}" has no dateRange`
      );
    }
  });
});

describe("projects data", () => {
  it("has at least 2 entries", () => {
    assert.ok(projects.length >= 2, `Expected at least 2 projects, got ${projects.length}`);
  });

  it("includes OPTCG Search as first entry", () => {
    assert.ok(
      projects[0].title.includes("OPTCG"),
      `Expected first project to include 'OPTCG', got '${projects[0].title}'`
    );
  });

  it("includes Prism as an entry", () => {
    const prism = projects.find((p) => p.title.startsWith("Prism"));
    assert.ok(prism, "Expected a Prism project entry");
  });

  it("does not include placeholder projects", () => {
    const placeholders = [
      "AI Research Platform",
      "Design System Library",
      "Data Visualization Tool",
    ];
    for (const title of placeholders) {
      const found = projects.some((p) => p.title === title);
      assert.ok(!found, `Placeholder project "${title}" still present`);
    }
  });
});

describe("site object", () => {
  it("role is correct", () => {
    assert.strictEqual(site.role, "Senior Backend Engineer @ empathy.co");
  });

  it("location is Gijón, Spain", () => {
    assert.strictEqual(site.location, "Gijón, Spain");
  });

  it("bio is a non-empty string", () => {
    assert.ok(typeof site.bio === "string" && site.bio.length > 0);
  });

  it("tagline is a non-empty string", () => {
    assert.ok(typeof site.tagline === "string" && site.tagline.length > 0);
  });

  it("socials has exactly 3 entries (GitHub, LinkedIn, Email)", () => {
    assert.strictEqual(site.socials.length, 3);
    const labels = site.socials.map((s) => s.label);
    assert.ok(labels.includes("GitHub"), "Missing GitHub social");
    assert.ok(labels.includes("LinkedIn"), "Missing LinkedIn social");
    assert.ok(labels.includes("Email"), "Missing Email social");
  });

  it("socials does not include X (x.com link removed)", () => {
    const hasX = site.socials.some((s) => s.href.includes("x.com"));
    assert.ok(!hasX, "socials should not include any x.com link");
  });
});

describe("education data", () => {
  it("has at least 1 entry", () => {
    assert.ok(education.length >= 1);
  });

  it("first entry is Universidad de Oviedo B.Sc.", () => {
    assert.strictEqual(education[0].institution, "Universidad de Oviedo");
    assert.strictEqual(education[0].degree, "B.Sc. in Informatics Engineering");
  });
});
