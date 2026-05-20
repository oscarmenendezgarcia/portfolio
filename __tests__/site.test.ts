// Structural smoke tests for lib/site.ts.
// These tests verify shape and integrity, not specific content values.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { site, experience, projects, education } from "../lib/site.ts";

describe("experience data", () => {
  it("all entries have non-empty responsibilities", () => {
    for (const role of experience) {
      assert.ok(role.responsibilities.length > 0, `Role "${role.id}" has no responsibilities`);
    }
  });

  it("all entries have non-empty stack", () => {
    for (const role of experience) {
      assert.ok(role.stack.length > 0, `Role "${role.id}" has no stack`);
    }
  });

  it("all entries have a non-empty dateRange", () => {
    for (const role of experience) {
      assert.ok(role.dateRange.length > 0, `Role "${role.id}" has no dateRange`);
    }
  });

  it("exactly one entry has status 'current'", () => {
    const current = experience.filter((r) => r.status === "current");
    assert.strictEqual(current.length, 1, "Expected exactly one current role");
  });

  it("current role has endDate === null", () => {
    const current = experience.find((r) => r.status === "current");
    assert.strictEqual(current?.endDate, null);
  });
});

describe("projects data", () => {
  it("every project has a non-empty href", () => {
    for (const p of projects) {
      assert.ok(p.href.length > 0, `Project "${p.title}" has no href`);
    }
  });

  it("every project has a non-empty stack", () => {
    for (const p of projects) {
      assert.ok(p.stack.length > 0, `Project "${p.title}" has no stack`);
    }
  });

  it("every project has a valid status", () => {
    const valid = new Set(["in-progress", "launched", "archived"]);
    for (const p of projects) {
      assert.ok(valid.has(p.status), `Project "${p.title}" has invalid status "${p.status}"`);
    }
  });
});

describe("site object", () => {
  it("bio is a non-empty string", () => {
    assert.ok(typeof site.bio === "string" && site.bio.length > 0);
  });

  it("tagline is a non-empty string", () => {
    assert.ok(typeof site.tagline === "string" && site.tagline.length > 0);
  });

  it("socials has GitHub, LinkedIn and Email entries", () => {
    const labels = site.socials.map((s) => s.label);
    assert.ok(labels.includes("GitHub"), "Missing GitHub social");
    assert.ok(labels.includes("LinkedIn"), "Missing LinkedIn social");
    assert.ok(labels.includes("Email"), "Missing Email social");
  });

  it("all socials have non-empty hrefs", () => {
    for (const s of site.socials) {
      assert.ok(s.href.length > 0, `Social "${s.label}" has empty href`);
    }
  });
});

describe("education data", () => {
  it("has at least 1 entry", () => {
    assert.ok(education.length >= 1);
  });

  it("all entries have institution and degree", () => {
    for (const e of education) {
      assert.ok(e.institution.length > 0, "Education entry missing institution");
      assert.ok(e.degree.length > 0, "Education entry missing degree");
    }
  });
});
