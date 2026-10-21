import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..", "..");
const src = join(root, "src");

const readSrc = (rel) => readFileSync(join(src, rel), "utf8");

// T1: B9 regression — useDeleteLeave must be called with zero args
describe("B9: useDeleteLeave hook call site", () => {
  it("is invoked without arguments (no Rules-of-Hooks violation)", () => {
    const src1 = readSrc("pages/employee/leave/leave-table.jsx");
    expect(src1).toMatch(/useDeleteLeave\(\s*\)/);
    expect(src1).not.toMatch(/useDeleteLeave\(\s*selectedId/);
  });
});

// T2: B10 regression — useGetLeaveById must accept and forward options
describe("B10: useGetLeaveById hook", () => {
  it("accepts a second `options` argument and spreads it into useQuery", () => {
    const src1 = readSrc("queries/employee/leave.query.js");
    expect(src1).toMatch(/useGetLeaveById\s*=\s*\(id,\s*options\)/);
    expect(src1).toMatch(/\.\.\.options/);
  });
});

// T3: B11 regression — App.jsx mounts admin under /admin/* and has a catch-all 404
describe("B11: routing", () => {
  it("App.jsx mounts AdminRoutes at /admin/* and EmployeeRoutes at /employee/*", () => {
    const app = readSrc("App.jsx");
    expect(app).toMatch(/path="\/admin\/\*"/);
    expect(app).toMatch(/path="\/employee\/\*"/);
  });
  it("App.jsx has a catch-all NotFound route", () => {
    const app = readSrc("App.jsx");
    expect(app).toMatch(/path="\*"/);
    expect(app).toMatch(/NotFound/);
  });
  it("NotFound page exists at src/pages/common/not-found.jsx", () => {
    expect(existsSync(join(src, "pages/common/not-found.jsx"))).toBe(true);
    const page = readSrc("pages/common/not-found.jsx");
    expect(page).toMatch(/export default NotFound/);
  });
});

// T4: B12 regression — AdminProfile destructures isLoading/isError (React Query v5)
describe("B12: AdminProfile uses React Query v5 field names", () => {
  it("uses isLoading and isError, not loading and error", () => {
    const page = readSrc("pages/admin/profile/admin-profile.jsx");
    expect(page).toMatch(/isLoading/);
    expect(page).toMatch(/isError/);
    expect(page).not.toMatch(/const\s*\{\s*data,\s*loading,\s*error\s*\}/);
  });
});

// T5: B13 regression — no hardcoded localhost:5000 anywhere in src/
describe("B13: no hardcoded localhost:5000", () => {
  it("does not appear in any .js/.jsx file under src/", () => {
    const walk = (dir, acc = []) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) {
          // skip the test directory — the test file itself contains the
          // literal pattern as part of its assertions
          if (full === join(src, "test")) continue;
          walk(full, acc);
        } else if (/\.(js|jsx)$/.test(entry)) acc.push(full);
      }
      return acc;
    };
    const files = walk(src);
    const offenders = files.filter((f) => /localhost:5000/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});

// T6: rename — no "attendence" or "Attendence" anywhere in src/
describe("rename: no misspelled attendence remains in src/", () => {
  it("does not appear in any .js/.jsx file under src/", () => {
    const walk = (dir, acc = []) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) {
          if (full === join(src, "test")) continue;
          walk(full, acc);
        } else if (/\.(js|jsx)$/.test(entry)) acc.push(full);
      }
      return acc;
    };
    const files = walk(src);
    const offenders = files.filter((f) => /(attendence|Attendence)/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});

// T7: dead files — protected-route.jsx, mock-employee.js must be gone
describe("dead-file purge", () => {
  it("src/auth/protected-route.jsx does not exist", () => {
    expect(existsSync(join(src, "auth/protected-route.jsx"))).toBe(false);
  });
  it("src/data/mock-employee.js does not exist", () => {
    expect(existsSync(join(src, "data/mock-employee.js"))).toBe(false);
  });
});

// T8: ESLint — no-console rule configured to warn (not error)
describe("eslint: no-console rule configured", () => {
  it("eslint.config.js declares 'no-console' with allow: ['warn','error']", () => {
    const cfg = readFileSync(join(root, "eslint.config.js"), "utf8");
    expect(cfg).toMatch(/['"]no-console['"]/);
    expect(cfg).toMatch(/allow:\s*\[\s*['"]warn['"]\s*,\s*['"]error['"]\s*\]/);
  });
});