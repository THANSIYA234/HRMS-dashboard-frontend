# HRMS Foundation + Security + Architecture

## Context

The HRMS (React 19 frontend at `/home/thansiya/hrms-dashboard/`, Express 5 backend at `/home/thansiya/hrms_backend/`) ships at tutorial grade. This plan turns it into a portfolio-grade baseline by executing Phases P0–P3 from `hrms-dashboard/PROJECT_PLAN.md`: bug-fix sweep, security baseline, reliability, and architecture cleanup. Out of scope (separate plans): payroll, holidays, MFA, real-time WebSocket, audit log, AI features, MFA, performance reviews, ATS. End state: a tested, hardened, well-structured MERN app with no critical bugs, no console leakage, security headers + rate limits + zod validation + httpOnly cookies + refresh-token hashing + CSRF + upload hardening + global error handling + structured logging + a clean services layer + indexed MongoDB + skeletons + global toast + error boundary + dark mode + unified AppShell + Vitest tests + CI on every push.

Implementation order is dependency-driven: rename → bug fixes → security → reliability → architecture → tests/CI. Each step is independently verifiable; failing tests at any step means the implementer re-reads the relevant file before proceeding.

## Approach

### Phase A — Repo hygiene (safe, low-risk changes first)

**Step A1. Repo-wide rename `attendence → attendance`** (backend + frontend)
- Backend files to rename: `hrms_backend/models/attendence.js` → `models/attendance.js`, `hrms_backend/controllers/attendence.controller.js` → `controllers/attendance.controller.js`, `hrms_backend/routes/attendenceRoutes.js` → `routes/attendanceRoutes.js`. Inside each: rename `Attendence` model/identifier → `Attendance`, function names `getTodayAttendence` → `getTodayAttendance`, `getAttendenceHistory` → `getAttendanceHistory`, `createPunchIn/Out` unchanged, `getAttendendenceById` → `getAttendanceById` (typo), `updateAttendence` → `updateAttendance`, `deleteAttendenceById` → `deleteAttendanceById`.
- Update all imports: `hrms_backend/server.js:8,31`, `hrms_backend/controllers/admin.controller.js:2`, `hrms_backend/routes/attendenceRoutes.js:1-7,11-23`. Model field stays `employee` (singular ObjectId ref).
- Frontend files: `src/services/employee/attendance.service.js` (already correct), `src/services/admin/attendance.service.js`, `src/queries/employee/attendance.query.js`, `src/queries/admin/attendance.query.js`, `src/pages/employee/attendance/attendance.jsx`, `src/pages/employee/attendance/attendance-table.jsx`, `src/pages/employee/dashboard/dashboard.jsx`, `src/pages/admin/dashboard-admin/dashboard.jsx`, `src/pages/admin/dashboard-admin/attendence-chart.jsx` → `attendance-chart.jsx`. Rename in file: `data?.attendence` → `data?.attendance` (response field), `attendence` local variable → `attendance`. Import path on dashboard.jsx line 20.
- Backend response shape changes: every `{ message: "Attendence ...", attendence: ... }` becomes `{ message: "Attendance ...", attendance: ... }`. Frontend consumers must update: `pages/employee/attendance/attendance-table.jsx:17` reads `data?.attendence`, `pages/employee/attendance/attendance.jsx:17` reads `data?.attendence`, `pages/employee/dashboard/dashboard.jsx:17,31,42` reads `data?.attendence`. Update all to `data?.attendance`.
- Mongo collection name: Mongoose derives `Attendance` → collection `attendances` (was `attendences`). For an existing dataset this is breaking — see Assumptions A1.

**Step A2. Delete dead code**
- Delete: `hrms-dashboard/src/auth/protected-route.jsx` (zero importers), `hrms-dashboard/src/data/mock-employee.js` (zero importers), `hrms_backend/uploads.js` (zero bytes, zero importers).
- Delete dead exports: in `hrms-dashboard/src/services/admin/attendance.service.js` remove `getAttendanceByFilters`; in `hrms-dashboard/src/services/admin/department.service.js` remove `assignEmployeeToDepartment`; in `hrms-dashboard/src/queries/admin/department.query.js` remove `useAssignEmployeeToDepartment` (was mis-wired to `assignHeadToDepartment`); in `hrms-dashboard/src/queries/admin/attendance.query.js` remove `useTodayAttendanceSnapshot` (the unreachable `keepPreviousData: true` after `return`); delete `hrms-dashboard/src/components/common/action-button/index.js` (self re-export).
- Grep `import.*protected-route|mock-employee|useAssignEmployeeToDepartment|useTodayAttendanceSnapshot|getAttendanceByFilters|assignEmployeeToDepartment` after deletion to confirm zero remaining references.

**Step A3. Strip console.* from production code**
- Delete every `console.log` and `console.error` line identified in the audit (14 frontend + 6 backend sites). For ones inside `catch`, leave the `catch` block empty or replace with the actual error surfacing (this is replaced later by global error handler in Phase D).
- Add ESLint rule to `hrms-dashboard/eslint.config.js`: `'no-console': ['error', { allow: ['warn', 'error'] }]`.
- Add equivalent ESLint config for backend (new `hrms_backend/eslint.config.js` flat config: js.configs.recommended + globals.node + same no-console rule).

**Step A4. Add `.env.example` and remove live secrets from repos**
- Create `hrms-dashboard/.env.example`: `VITE_API_BASE=http://localhost:5000/api`. Replace existing `hrms-dashboard/.env` values with placeholders (or delete `.env` once example is in place; implementer deletes).
- Create `hrms_backend/.env.example`: `PORT=5000`, `MONGO_URI=<mongodb-connection-string>`, `JWT_SECRET=<openssl-rand-base64-32>`, `REFRESH_SECRET=<openssl-rand-base64-32>`, `CORS_ORIGINS=http://localhost:5173,https://hrmsdashboardfrontend.netlify.app`. Delete `hrms_backend/.env` after the developer copies to a fresh `.env`.
- Rotate the leaked JWT_SECRET and REFRESH_SECRET values before deleting (print `openssl rand -base64 32` twice); document the rotation in CHANGELOG.md.
- Fix `hrms-dashboard/README.md`: change `VITE_API_URL=https://hrms-dashboard-backend-production.up.railway.app/api` to `VITE_API_BASE=http://localhost:5000/api`. Remove the demo-admin password line; replace with "demo credentials are auto-seeded on first run — see seed script output".

### Phase B — Backend bug fixes (logic correctness)

**Step B1. Fix `getAttendendenceById` dangling populate** (`hrms_backend/controllers/admin.controller.js:77-91`)
- Chain `.populate(...)` onto the `find()` and await the result: replace the free-standing `populate({...}).sort({date:-1})` block with `await Attendence.find({employee:id}).populate({path:"employee", select:"name email department", populate:{path:"department", select:"name"}}).sort({date:-1})`.
- Rename function `getAttendendenceById` → `getAttendanceById`; update import in `hrms_backend/routes/attendenceRoutes.js:15` and the route registration.

**Step B2. Fix `filterAttendenceByDate` dangling populate** (`hrms_backend/controllers/admin.controller.js:107-122`)
- Same fix as B1: chain `.populate({...}).sort({date:-1})` to `Attendence.find({date:{$gte:start,$lte:end}})` and await.
- Rename function `filterAttendenceByDate` → `filterAttendanceByDate`; update import in `hrms_backend/routes/attendenceRoutes.js:12`.

**Step B3. Fix `updateLeave` undefined `status`** (`hrms_backend/controllers/leave.controller.js:170-176`)
- `updateLeave` is the employee self-service edit endpoint. It does not change status (only admin does). Delete the `Notification.create({...title:\`Leave ${status}\`...})` block entirely. Admins fire the notification from `updateStatus` (which is correct).

**Step B4. Fix `getBalanceLeave` lowercase `"approved"`** (`hrms_backend/controllers/leave.controller.js:227`)
- Change `status: "approved"` to `status: "Approved"`.

**Step B5. Fix `getAttendanceStats` field + case** (`hrms_backend/controllers/admin.controller.js:355-376`)
- Replace `attendanceMap.set(a.employeeId.toString(), a.status)` with `attendanceMap.set(a.employee.toString(), a.status)`.
- Replace string compares: `status === "present"` → `status === "Present"`; `status === "leave"` → `status === "On Leave"`.

**Step B6. Fix `changePassword` save-before-respond** (`hrms_backend/controllers/employee.controller.js:188-194`)
- Move `res.status(200).json(...)` after `await user.save()`. Wrap `user.save()` in `try { await user.save() } catch(e) { return res.status(500).json({message:"Failed to update password"}) }` so save failures don't 200.

**Step B7. Add ownership check to `markAsRead`** (`hrms_backend/controllers/notification.controller.js:36-44`)
- Replace `Notification.findById` with `Notification.findOneAndUpdate({_id:notificationId, $or:[{user:req.user.employeeId},{role:req.user.role},{role:"all"}]}, {isRead:true}, {new:true})`. Return 404 if null.

**Step B8. Constrain `getAttendenceHistory` to 7 days at DB level** (`hrms_backend/controllers/attendence.controller.js:107-127`)
- Replace `Attendence.find({employee: employeeId})` with `Attendence.find({employee: employeeId, date: {$gte: sevenDaysAgo}}).lean()` where `sevenDaysAgo = getLastNDates(7)[0]` (already returned by `getLastNDates`).

**Step B8b. Reconcile attendance status enum and `calculateStatus`**
- `hrms_backend/utils/calculate-status.js` returns only `Present | Half-Day | Late`. `models/attendence.js` enum is `["Present","Half-Day","Completed","Absent","On Leave","Late"]`. Update the file `attendence.controller.js` `createPunchIn` so the persisted status matches what `calculateStatus` returns (it already does — keep). Remove the orphaned `"Completed"` and `"Absent"` writes if any. Document the canonical enum in the model: add inline comment that runtime values are a subset.

### Phase C — Frontend bug fixes (logic correctness)

**Step C1. Fix hooks-rule violation `useDeleteLeave(selectedId)`** (`hrms-dashboard/src/pages/employee/leave/leave-table.jsx:50`)
- Change `const deleteLeaveMutation = useDeleteLeave(selectedId);` to `const deleteLeaveMutation = useDeleteLeave();`. Change the call site to `deleteLeaveMutation.mutate(selectedId)` (the hook already accepts `id` via mutationFn argument).

**Step C2. Fix `useGetLeaveById(id, options)` ignored options** (`hrms-dashboard/src/queries/employee/leave.query.js:29-34`)
- Update signature to `export const useGetLeaveById = (id, options = {}) => useQuery({queryKey:["leave",id], queryFn:()=>getLeaveById(id), enabled:!!id, ...options})`. Caller already passes `{enabled:!!selectedId}` — now respected.

**Step C3. Fix `AdminProfile` destructuring** (`hrms-dashboard/src/pages/admin/profile/admin-profile.jsx:14`)
- Change `const { data, loading, error } = useAdminProfile();` to `const { data, isLoading, isError, error } = useAdminProfile();`. Replace `if (loading)` with `if (isLoading)`; replace `if (error)` with `if (isError)`. Add a fallback `useAdminProfile` query in `src/queries/admin/profile.queryjs` (also rename file to `.query.js` — see Step G7) returning `useQuery({queryKey:["adminProfile"], queryFn:getAdminProfile})`.

**Step C4. Fix hardcoded `localhost:5000` in `employee-details.jsx`** (`hrms-dashboard/src/pages/admin/employee/employee-details.jsx:91-94`)
- Replace literal `http://localhost:5000/${employee.profileImage}` with the shared helper from Step G2 (`getAvatarUrl(employee.profileImage)`).

**Step C5. Fix `statCard.jsx` sx prop** (`hrms-dashboard/src/components/common/statCard.jsx:14`)
- Replace `sx={{ mb: 0.5, fontSize: { xs: 12, md: 14, color: "white" } }}` with `sx={{ mb: 0.5, fontSize: { xs: 12, md: 14 }, color: "white" }}`.

**Step C6. Add 404 page and refactor `App.jsx`**
- Create `hrms-dashboard/src/pages/NotFoundPage.jsx` — minimal MUI `<Typography variant="h4">Page not found</Typography>` + `<Link to="/">Go home</Link>`.
- Edit `hrms-dashboard/src/App.jsx`: replace the order so `<Route path="/*" element={<AdminRoutes />} />` becomes `<Route path="/admin/*" element={<AdminRoutes />} />`, and add `<Route path="*" element={<NotFoundPage />} />` as the last route. The `AdminRoutes` and `EmployeeRoutes` already use absolute paths inside (e.g. `/admin`, `/employee`); they continue to work.
- Add `hrms-dashboard/src/pages/admin/reports.jsx` stub so the existing `/admin/reports` quick-action no longer 404s. Content: a `<Typography variant="h5">Reports — Coming soon</Typography>` placeholder.

### Phase D — Backend security baseline

**Step D1. Install security deps**
- Add to `hrms_backend/package.json` dependencies: `helmet` (^8), `express-rate-limit` (^7), `compression` (^1), `cookie-parser` already present, `express-mongo-sanitize` (^2), `hpp` (^1), `zod` (^3), `bcrypt` already present, `crypto` (node built-in), `pino` (^9), `pino-http` (^10), `cors` already present. Dev: `pino-pretty` (^11).

**Step D2. Rewrite `hrms_backend/server.js`**
- Add imports: helmet, compression, rate-limit, mongo-sanitize, hpp, pino-http, routes/health.js.
- After `dotenv.config()`: create `const logger = pino({level: process.env.LOG_LEVEL || "info"})`.
- Replace `app.use(express.json())` with `app.use(express.json({limit:"100kb"})); app.use(express.urlencoded({extended:true, limit:"100kb"}))`.
- Add `app.use(helmet())`.
- Add `app.use(compression())`.
- Add `app.use(mongoSanitize())` and `app.use(hpp())`.
- Add `app.use(pinoHttp({logger, customLogLevel: (req, res, err) => err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info"}))`.
- Replace static mount `app.use("/uploads", express.static("uploads"))` and `app.use("/uploads/profilePics", express.static("uploads/profilePics"))` with one: `app.use("/api/files", authMiddleware, fileProxyRouter)` where `fileProxyRouter` is a new router (Step D6) that serves files only to authenticated users.
- Add `app.use("/healthz", healthRouter)` (Step D4).
- Add global error handler as last `app.use` (Step D5).
- Add `process.on("unhandledRejection", err => logger.error({err}, "unhandledRejection"))` and `process.on("uncaughtException", err => { logger.error({err}, "uncaughtException"); process.exit(1) })`.
- Replace `await connectDB()` with an `async function bootstrap() { await connectDB(); server = app.listen(PORT, ...) }` pattern with graceful shutdown (Step D7).
- CORS: read `process.env.CORS_ORIGINS.split(",")` instead of hardcoded list.

**Step D3. Add zod validation middleware**
- Create `hrms_backend/middleware/validate.js` exporting `(schema, source="body") => (req, res, next) => { const result = schema.safeParse(req[source]); if (!result.success) return res.status(400).json({error:{code:"VALIDATION_ERROR", details: result.error.flatten()}}); req[source] = result.data; next(); }`.
- Create `hrms_backend/validators/auth.schemas.js`: `registerSchema = z.object({name:z.string().min(1).max(80), email:z.string().email().toLowerCase().trim(), password:z.string().min(8).max(128), role:z.enum(["employee","admin"]).optional()})`; `loginSchema = z.object({email:z.string().email().toLowerCase().trim(), password:z.string().min(1)})`.
- Create `hrms_backend/validators/employee.schemas.js`: `createEmployeeSchema`, `updateEmployeeSchema`, `changePasswordSchema = z.object({oldPassword:z.string().min(1), newPassword:z.string().min(8).max(128)})`.
- Create `hrms_backend/validators/leave.schemas.js`: `applyLeaveSchema`, `updateLeaveSchema`, `updateStatusSchema = z.object({status:z.enum(["Pending","Approved","Rejected"])})`.
- Create `hrms_backend/validators/attendance.schemas.js`: `punchInSchema = z.object({}).strict()`, `filterSchema = z.object({start:z.coerce.date(), end:z.coerce.date(), page:z.coerce.number().int().min(1).default(1), limit:z.coerce.number().int().min(1).max(100).default(10)})`.
- Create `hrms_backend/validators/notification.schemas.js`: `markAsReadSchema = z.object({notificationId:z.string().regex(/^[0-9a-fA-F]{24}$/)})`.
- Wire validate middleware into `hrms_backend/routes/authRoutes.js`, `employeeRoutes.js`, `leaveRoutes.js`, `attendenceRoutes.js` (renamed `attendanceRoutes.js`), `notificationRoutes.js`. For route params (`:id`) create `idParamSchema = z.object({id:z.string().regex(/^[0-9a-fA-F]{24}$/)})`.

**Step D4. Add `/healthz` and `/readyz`**
- Create `hrms_backend/routes/health.js` with two handlers: `GET /healthz` returns `200 {status:"ok", uptime: process.uptime()}`; `GET /readyz` pings mongoose with `await mongoose.connection.db.admin().command({ping:1})`, returns `200 {db:"ok"}` or `503 {db:"error"}`.

**Step D5. Add global error handler + express-async-errors**
- Install `express-async-errors` (^3). Import as side-effect import at top of `server.js` after `import express from "express"`.
- Add `hrms_backend/middleware/errorHandler.js`: `(err, req, res, next) => { req.log?.error({err}, "request error"); if (err.name === "ZodError") return res.status(400).json({error:{code:"VALIDATION_ERROR", details:err.flatten()}}); if (err.name === "ValidationError") return res.status(400).json({error:{code:"DB_VALIDATION", details:err.errors}}); if (err.name === "CastError") return res.status(400).json({error:{code:"BAD_ID"}}); if (err.code === 11000) return res.status(409).json({error:{code:"DUPLICATE_KEY", keyValue:err.keyValue}}); res.status(err.status || 500).json({error:{code:err.code || "INTERNAL_ERROR", message: process.env.NODE_ENV === "production" ? "Internal error" : err.message}}) }`. Add as last `app.use` in `server.js`.

**Step D6. Authenticated file proxy replacing public `/uploads`**
- Create `hrms_backend/routes/files.js` with `router.get("/profilePics/:filename", authMiddleware, (req, res) => { const safe = path.basename(req.params.filename); if (!/^[a-f0-9-]{36}\.(jpg|jpeg|png)$/i.test(safe)) return res.status(400).json({error:{code:"BAD_FILENAME"}}); res.sendFile(path.resolve("uploads/profilePics", safe)); })`.
- Replace `hrms-dashboard/src/pages/admin/employee/employee-details.jsx:91-94` (C4) with `getAvatarUrl` (Step G2). All other files using `localhost:5000/uploads` get migrated to the helper in Step G2. The frontend URL becomes `${VITE_API_BASE.replace(/\/api$/,"")}/api/files/profilePics/${filename}`.

**Step D7. Upload hardening**
- Edit `hrms_backend/middleware/upload.js`: add `limits:{fileSize: 2*1024*1024, files:1}` to multer options. Replace `filename: (req, file, cb) => cb(null, Date.now()+path.extname(file.originalname))` with `filename: (req, file, cb) => { const ext = (path.extname(file.originalname)||".jpg").toLowerCase(); if (![".jpg",".jpeg",".png"].includes(ext)) return cb(new Error("Bad extension")); cb(null, `${crypto.randomUUID()}${ext}`); }`. Keep mimetype filter as defense in depth. Add a `fileFilter` that sniffs the first 4 bytes against JPEG/PNG signatures (`Buffer.isBuffer(file.buffer)` — for `diskStorage` change to `memoryStorage` first, sniff, then write to disk; OR accept mimetype+ext and document magic-byte sniffing as TODO with note that a separate middleware will be added in a follow-up). Acceptable scope decision: keep diskStorage, add ext+size, add a clear comment that magic-byte sniffing is deferred.

**Step D8. Move JWT to httpOnly cookie + hash refresh tokens server-side**
- Edit `hrms_backend/controllers/auth.controller.js`:
  - `loginUser`: generate `accessToken` (15m, JWT_SECRET) and `refreshToken` (7d, REFRESH_SECRET). Store `refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")` in `User.refreshToken` (rename field to `refreshTokenHash`). Set `res.cookie("refreshToken", refreshToken, {httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"strict", path:"/api/auth", maxAge:7*24*60*60*1000})`. Do NOT return `accessToken` in JSON — instead set `res.cookie("accessToken", accessToken, {httpOnly:true, secure:..., sameSite:"strict", path:"/api", maxAge:15*60*1000})`. Response body: `{user:{...no tokens...}}`. Single generic error: `if (!user || !await bcrypt.compare(password, user?.password || DUMMY_HASH)) return res.status(401).json({error:{code:"INVALID_CREDENTIALS"}})`. Define `const DUMMY_HASH = "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";` at module top.
  - `refreshToken`: read `req.cookies.refreshToken`. Verify JWT. `User.findOne({refreshTokenHash: sha256(cookie)})`. If user exists and JWT valid: rotate — generate new refreshToken, update DB, set new cookie (clearing the old by overwriting). Generate new accessToken, set access cookie. Return `{user:{...}}`.
  - `logoutUser`: clear both cookies; set `user.refreshTokenHash = null`; save.
  - `getAdminProfile`: no change beyond selecting `-refreshTokenHash` instead of `-refreshToken`.
- Edit `hrms_backend/middleware/authMiddleware.js`: replace header check with cookie read. `const token = req.cookies?.accessToken; if (!token) return res.status(401).json({error:{code:"NO_TOKEN"}}); try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = {id:decoded.id, role:decoded.role, employeeId:decoded.employeeId}; next(); } catch { return res.status(401).json({error:{code:"INVALID_TOKEN"}}); }`. Do NOT do `User.findById` on every request — use the decoded payload; if a fresh user lookup is needed, attach it lazily in the controllers that require it.
- Update CORS to allow credentials (already `credentials: true`).
- Add CSRF: create `hrms_backend/middleware/csrf.js` implementing double-submit cookie. On login response, set non-httpOnly cookie `XSRF-TOKEN=<random>`. Validate state-changing requests (`!["GET","HEAD","OPTIONS"].includes(req.method)`) have matching `X-CSRF-Token` header. Add `app.use(csrf)` after cookie-parser.

**Step D9. Add rate limiting**
- Create `hrms_backend/middleware/rateLimiters.js` exporting `authLimiter = rateLimit({windowMs: 15*60*1000, max: 20, standardHeaders:true, legacyHeaders:false, message:{error:{code:"RATE_LIMIT"}}})` and `generalLimiter = rateLimit({windowMs: 60*1000, max: 200, ...})`.
- Wire `authLimiter` on `routes/authRoutes.js` router (`router.use(authLimiter)`). Wire `generalLimiter` globally in `server.js` before routes.

**Step D10. Account lockout + strip `role` from self-service body**
- Add `failedLoginAttempts: {type:Number, default:0}` and `lockUntil: {type:Date, default:null}` to `hrms_backend/models/user.js`.
- In `loginUser`, on failed `bcrypt.compare`: increment `failedLoginAttempts`, set `lockUntil` to `now + 15min` if attempts ≥ 5, return `423 Locked` if currently locked.
- In `registerUser`, whitelist: `const {name, email, password} = req.body` (drop `role`); only the admin-created branch (`/admin/employees` POST) accepts `role`.

**Step D11. Drop `role` from public register + admin uses explicit whitelist**
- Edit `routes/authRoutes.js`: `router.post("/register", authMiddleware, authorizeRole("admin"), validate(registerSchema), registerUser)`. Inside `registerUser`, only accept `role` if the caller is admin and the value is in `["employee","admin"]`; otherwise default to `"employee"`.

### Phase E — Frontend security + refresh interceptor

**Step E1. Strip JWT from localStorage**
- Edit `hrms-dashboard/src/services/auth.service.js`: remove all `localStorage.setItem("accessToken", ...)`. `loginUser` becomes `const res = await axiosInstance.post("/auth/login", data); return res.data;` (cookies are set by server; client doesn't see them).
- Edit `hrms-dashboard/src/auth/login.jsx:30-46`: remove `localStorage.setItem("user"...)` and `localStorage.setItem("token"...)`. On success call `setUser(res.user)` from `useAuth()`, then `navigate(...)`.
- Edit `hrms-dashboard/src/context/auth-context.jsx`: change init from `localStorage.getItem("user")` to `const storedUser = null` (we'll fetch from `/auth/me` instead — Step E3). Remove `localStorage` writes inside `setUser`/`setToken`. `clearAuth` becomes a no-op locally (server clears via logout endpoint).
- Edit `hrms-dashboard/src/utils/auth.js`: `getToken` returns `null`; `clearAuth` is a no-op; keep `getUser` for backwards compat but mark unused and delete its callers in Step G7.
- The axios interceptor (Step E2) handles sending cookies automatically via `withCredentials: true`.

**Step E2. Single-flight refresh interceptor** (`hrms-dashboard/src/api/axios.js`)
- Module-level `let refreshingPromise = null;`.
- Request interceptor: keep `withCredentials: true`; remove the `Authorization: Bearer ...` header attach (cookies handle it).
- Response interceptor on `error.response?.status === 401`:
  - If `error.config?.url?.includes("/auth/")` (login/refresh/logout), reject — do not retry.
  - If `!refreshingPromise`, set `refreshingPromise = axiosInstance.post("/auth/refresh").then(r => r.data).finally(() => { refreshingPromise = null; })`.
  - `await refreshingPromise` (or join the existing one).
  - Retry `originalRequest` once with `originalRequest._retry = true`.
  - On refresh failure: call `useAuth().logout()` (which calls `/auth/logout` then clears in-memory user and navigates via `<Navigate>` in `AdminRoute`/`EmployeeRoute`).

**Step E3. Add `/auth/me` endpoint + frontend hook**
- Backend: add `getMe` controller returning `{user: req.user}` (no DB hit since payload is in JWT). Wire `router.get("/me", authMiddleware, getMe)`.
- Frontend: create `hrms-dashboard/src/queries/auth.query.js` exporting `useMe = () => useQuery({queryKey:["me"], queryFn: async () => (await axiosInstance.get("/auth/me")).data.user, staleTime: 5*60*1000})`.
- Edit `hrms-dashboard/src/context/auth-context.jsx`: on mount, call `useMe()` (or move init into `AuthProvider` body using `useQuery`); populate `user` from the result; set `loading=false` when query settles. The `useAuth().setUser` mutation is no longer needed from `login.jsx` (server-side cookie sets it) but keep the API for parity.

### Phase F — Backend reliability + observability

**Step F1. Graceful shutdown**
- Edit `hrms_backend/server.js`: replace `await connectDB(); app.listen(...)` with:
  ```
  let server;
  async function bootstrap() { await connectDB(); server = app.listen(PORT, () => logger.info({port:PORT}, "server started")); }
  bootstrap();
  const shutdown = async (signal) => { logger.info({signal}, "shutting down"); server?.close(() => mongoose.connection.close().then(() => process.exit(0))); setTimeout(() => process.exit(1), 10000).unref(); };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  ```

**Step F2. DB retry/options**
- Edit `hrms_backend/config/db.js`: `await mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS: 5000, maxPoolSize: 20, retryWrites: true});`. Log structured event on connect/disconnect/error using `logger`.

### Phase G — Backend architecture

**Step G1. Mongoose indexes**
- `hrms_backend/models/attendance.js`: add `attendenceSchema.index({employee:1, date:-1}, {unique:true})` (after rename to attendance.js, the schema var is `attendanceSchema`).
- `hrms_backend/models/leave.js`: add `leaveSchema.index({employee:1, startDate:-1})`, `leaveSchema.index({status:1, startDate:-1})`.
- `hrms_backend/models/notification.js`: add `notificationSchema.index({user:1, isRead:1, createdAt:-1})`, `notificationSchema.index({role:1, isRead:1})`.
- `hrms_backend/models/user.js`: add `userSchema.index({refreshTokenHash:1}, {sparse:true})`, change `email` schema to `{type:String, required:true, unique:true, lowercase:true, trim:true, match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/}`.
- `hrms_backend/models/employee.js`: change `phone: {type:Number, required:false}` → `phone: {type:String, required:false, match:/^\+?[\d\s-]{7,20}$/}`; add `min:0` on `salary`; lowercase+trim+match on email.
- Add `mongoose-delete` plugin for soft-delete on `Employee`, `Leave`, `Department` schemas (`schema.plugin(mongooseDelete, {deletedAt:true, overrideMethods:"all"})`).

**Step G2. Add `.lean()` and rewrite hot endpoints as aggregations**
- `hrms_backend/controllers/employee.controller.js → getEmployees`: `.lean()`.
- `hrms_backend/controllers/leave.controller.js → getAllLeaves`: `.lean()`.
- `hrms_backend/controllers/attendence.controller.js → getAttendenceHistory`: `.lean()` (already added in B8).
- `hrms_backend/controllers/admin.controller.js → getAttendanceTrend` (lines 389-422): replace JS grouping with aggregation: `Attendence.aggregate([{$match:{date:{$gte:thirtyDaysAgo,$lte:today}}}, {$group:{_id:{$dateToString:{format:"%Y-%m-%d", date:"$date"}}, count:{$sum:1}}}, {$sort:{_id:1}}])`.
- `hrms_backend/controllers/admin.controller.js → getDepartment`: replace N+1 `countDocuments` with single `Department.aggregate([{$lookup:{from:"employees", localField:"_id", foreignField:"department", as:"employees"}}, {$project:{name:1, description:1, head:1, employeeCount:{$size:"$employees"}}}])`.
- `hrms_backend/controllers/admin.controller.js → getAllAttendance` and `getTodayAttendanceSnapshot`: paginate at DB level (use `$facet` to return `{records:[$skip,$limit], total:[$count]}`); fix the `fromDate/toDate` → `startDate/endDate` field name bug (B5).
- `hrms_backend/controllers/admin.controller.js → getTotalWorkHours*`: replace `find().reduce` with `$group { _id:..., total:{$sum:"$workHours"} }`.

**Step G3. Services layer extraction (controllers thin)**
- Create `hrms_backend/services/auth.service.js`: `login(email,password)`, `registerAdminEmployee({name,email,password,role})`, `refresh(req)`, `logout(req)`, `getMe(userId)`. Move bcrypt/JWT logic, lockout, and refresh-token-hash logic here. Keep controllers as thin adapters: parse req → call service → send res.
- Create `hrms_backend/services/employee.service.js`: `createEmployee`, `listEmployees({page,limit,search,department})`, `getById`, `update`, `delete`, `getProfile`, `updateProfile`, `changePassword`. Use `withTransaction` for `createEmployee` (creates both User and Employee).
- Create `hrms_backend/services/leave.service.js`: `applyLeave`, `listLeaves`, `listMyLeaves`, `getById`, `updatePendingLeave` (no notification side-effect — admin does it), `deletePending`, `updateStatus` (creates notification + invalidates cache via a future event bus; for now, inline), `getBalance`.
- Create `hrms_backend/services/attendance.service.js`: `punchIn`, `punchOut`, `getToday`, `getMyHistory`, `adminList`, `adminGetByEmployeeId`, `adminFilter`, `adminUpdate`, `adminDelete`, `adminStats`, `adminTrend`, `adminSnapshot`, `totalWorkHours*`.
- Create `hrms_backend/services/notification.service.js`.
- Controllers reduce to 5–15 lines each: parse, call service, send.

**Step G4. Phone normalization on create/update**
- When `phone` provided, store E.164-normalized string (`"+CC..."`) via `libphonenumber-js` (install). Validate `isValidPhoneNumber`.

### Phase H — Frontend architecture

**Step H1. Install + wire MUI ThemeProvider + dark mode**
- Add deps: `notistack` (^3).
- Create `hrms-dashboard/src/context/color-mode-context.jsx`:
  ```
  const ColorModeContext = createContext({mode:"light", toggle:()=>{}});
  export const ColorModeProvider = ({children}) => {
    const [mode, setMode] = useState(() => localStorage.getItem("colorMode") || "light");
    useEffect(() => { localStorage.setItem("colorMode", mode); }, [mode]);
    const theme = useMemo(() => createTheme({palette:{mode}, ...customPalette[mode]}), [mode]);
    return <ColorModeContext.Provider value={{mode, toggle:()=>setMode(m=>m==="light"?"dark":"light")}}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>;
  };
  export const useColorMode = () => useContext(ColorModeContext);
  ```
- Edit `hrms-dashboard/src/themes/theme.js` to export two palettes (light, dark) and primary/secondary/font defaults that match current visual identity.
- Edit `hrms-dashboard/src/main.jsx`: wrap `<App />` in `<ColorModeProvider><SnackbarProvider><QueryClientProvider>...</QueryClientProvider></SnackbarProvider></ColorModeProvider>` (after Step H4).
- Add a dark-mode toggle to `src/components/common/navbar.jsx` (sun/moon icon button).

**Step H2. `getAvatarUrl` helper**
- Create `hrms-dashboard/src/utils/avatar.js`: `export const getAvatarUrl = (imagePath) => imagePath ? \`${import.meta.env.VITE_API_BASE.replace(/\/api$/, "")}/api/files/profilePics/${imagePath}\` : null;`. Update every site: `pages/admin/employee/employee-details.jsx:91-94`, `pages/admin/employee/employee-table.jsx:80-85`, `pages/admin/attendance/attendance-table.jsx:81-86`, `pages/admin/leaves/leave-table.jsx:68-73`, `pages/employee/profile/profile.jsx:114-118`, `pages/employee/profile/profile-edit-page.jsx:115-119`. All use `src={getAvatarUrl(employee.profileImage) || undefined}` with `<Avatar>`.

**Step H3. Unified `AppShell` (collapse admin/employee layouts + sidebars)**
- Create `hrms-dashboard/src/components/common/AppShell.jsx` exporting `<AppShell menuItems>{children}</AppShell>`. Internally renders sidebar (parameterized `menuItems` + role color), `<Navbar>`, `<Outlet/>`-equivalent `children`. Add `aria-current="page"` on active nav item via `useLocation().pathname`.
- Create `hrms-dashboard/src/components/common/Sidebar.jsx` consuming the menuItems prop (extracted from current admin-sidebar.jsx + employee-sidebar.jsx).
- Delete `src/layouts/admin-layout.jsx` and `src/layouts/employee-layout.jsx`; delete `src/components/admin/admin-sidebar.jsx` and `src/components/employee/employee-sidebar.jsx`.
- Update `src/routes/admin/admin-routes.jsx` to use `<AppShell menuItems={adminMenuItems}><Outlet/></AppShell>` (similarly employee routes). Define `adminMenuItems` and `employeeMenuItems` in a new `src/components/common/menuItems.js`.

**Step H4. Global toast (notistack)**
- Edit `src/main.jsx` to wrap in `<SnackbarProvider maxSnack={3} anchorOrigin={{vertical:"bottom",horizontal:"right"}}>`.
- Create `src/utils/notify.js`: `export const notify = (message, severity="success") => enqueueSnackbar(message, {severity, autoHideDuration:4000});`.
- Edit `src/context/auth-context.jsx` to also export `useAuth()`-aware `notify` wrapper if desired.
- Replace all `alert(...)` calls with `notify(...)` (5 sites in `create-employee.jsx`, `attendance.jsx`, `leave-request.jsx`, `leave-table.jsx`, `profile-edit-page.jsx`).
- Replace all `window.confirm(...)` with a `<ConfirmDialog>` MUI component (create `src/components/common/ConfirmDialog.jsx`) used as `<ConfirmDialog open={...} onConfirm={...} onCancel={...} title="..." message="..." />`.

**Step H5. Error boundary + skeletons**
- Create `src/components/common/ErrorBoundary.jsx` class component with `getDerivedStateFromError` and `componentDidCatch` (logs to console.error in dev, calls a placeholder `reportError` function). Wrap `<Outlet/>` in `AppShell` with `<ErrorBoundary>`.
- Create `src/components/common/skeletons/TableSkeleton.jsx` (MUI `<Skeleton>` rows), `CardSkeleton.jsx`. Replace `null`/`<CircularProgress/>`/literal "Loading…" branches in `admin-route.jsx`, `employee-route.jsx`, `employee-table.jsx`, `employee-details.jsx`, `admin-profile.jsx`, `leave-request-stats.jsx`, `profile.jsx`, `change-password.jsx`.

**Step H6. React Query hardening**
- Edit `src/main.jsx`: `const queryClient = new QueryClient({defaultOptions:{queries:{staleTime:30_000, gcTime:5*60_000, retry:1, refetchOnWindowFocus:false}}, queryCache: new QueryCache({onError:(err,q)=>notify(err.response?.data?.error?.message || "Request failed","error")})});`.
- Namespace query keys by role:
  - `queries/employee/attendance.query.js`: keys `["attendance","employee","today"]`, `["attendance","employee","history"]`.
  - `queries/admin/attendance.query.js`: keys `["attendance","admin",{page,limit,filters}]`, `["attendance","admin","stats"]`, `["attendance","admin","trends"]`.
  - `queries/employee/leave.query.js`: keys `["leave","employee","list"]`, `["leave","employee",id]`, `["leave","employee","balance"]`.
  - `queries/admin/leave.query.js`: keys `["leave","admin",{page,...filters}]`.
  - `queries/admin/employee.query.js`: keys `["employee","admin",{page,limit,filters}]`, `["employee","admin",id]`.
  - `queries/admin/profile.query.js` (renamed from `.queryjs`): keys `["adminProfile"]`. Migrate `queries/employee/profile.query.js` to also use `["me"]` (it currently hits `/employee/profile`; replace with `/auth/me`).
- Update `invalidateQueries` calls to match new keys.

**Step H7. Cleanup remnants**
- Delete `src/utils/auth.js` after E1 (functions now unused). Replace any straggler `getToken/getUser/clearAuth` calls with `useAuth()`.
- Rename `src/queries/admin/profile.queryjs` → `src/queries/admin/profile.query.js` and update import in `pages/admin/profile/admin-profile.jsx`.
- Drop unused imports: `React from 'react'` in `App.jsx`, `attendance-chart.jsx`, etc. (run eslint --fix).
- Drop `date-fns` if still imported: `src/components/common/table-filter-bar.jsx` switches from `AdapterDateFns` to `AdapterDayjs`; remove `date-fns` from `package.json` dependencies.
- Drop `@mui/x-date-pickers-pro` from `package.json` dependencies (the `DateRangePicker` import in `table-filter-bar.jsx` is removed in the same edit). Keep `@mui/x-date-pickers`.

### Phase I — Tests + CI + Husky

**Step I1. Frontend Vitest setup**
- Add dev deps: `vitest` (^2), `@testing-library/react` (^16), `@testing-library/jest-dom` (^6), `@testing-library/user-event` (^14), `jsdom` (^25), `whatwg-fetch` (^3). Add `"test": "vitest run"`, `"test:watch": "vitest"`, `"coverage": "vitest run --coverage"` to `package.json scripts`.
- Create `hrms-dashboard/vitest.config.js`: `import {defineConfig} from "vitest/config"; import react from "@vitejs/plugin-react"; export default defineConfig({plugins:[react()], test:{environment:"jsdom", setupFiles:["./src/test/setup.js"], globals:true}})`.
- Create `hrms-dashboard/src/test/setup.js`: `import "@testing-library/jest-dom";`.
- Create `src/test/utils.jsx`: wraps render in `<QueryClientProvider>` + `<MemoryRouter>` + `<ColorModeProvider>`.

**Step I2. Frontend starter tests**
- `src/auth/login.test.jsx`: renders form; typing email/password + mocking `loginUser` → assert `setUser` called + navigate called with `/admin/dashboard` for admin role.
- `src/context/auth-context.test.jsx`: mounts provider with stubbed `useMe`; asserts `loading` transitions to `false`, `isAuthenticated` becomes true.
- `src/routes/admin/admin-route.test.jsx`: with no user, renders `<Navigate to="/">`; with `role:"employee"`, redirects to `/employee/dashboard`; with `role:"admin"`, renders `<Outlet/>`.
- `src/components/common/statCard.test.jsx`: renders title and value; snap test for sx prop correctness (regression for Step C5).
- `src/queries/employee/leave.query.test.js`: with mock `getLeaveById`, asserts `useGetLeaveById(null,{enabled:false})` does NOT call queryFn (regression for Step C2).
- `src/pages/employee/leave/leave-table.test.jsx`: clicking delete calls `useDeleteLeave` with `selectedId` arg (regression for Step C1).
- `src/utils/avatar.test.js`: asserts `getAvatarUrl("abc.jpg")` returns the URL built from `VITE_API_BASE`.
- `src/api/axios.test.js`: with `fetch` mocked for `/auth/refresh`, triggers two concurrent 401s, asserts `/auth/refresh` is called once and both requests retry (regression for Step E2).

**Step I3. Backend Vitest + Supertest**
- Add dev deps: `vitest`, `supertest` (^7), `mongodb-memory-server` (^10) (for isolated test DB).
- Add `"test": "vitest run"` to `package.json scripts`.
- Create `hrms_backend/vitest.config.js`: `defineConfig({test:{environment:"node", globals:true, setupFiles:["./test/setup.js"]}})`.
- Create `hrms_backend/test/setup.js`: starts `mongodb-memory-server`, sets `process.env.MONGO_URI` to its URL, sets `process.env.JWT_SECRET` and `REFRESH_SECRET` to test values.
- Create `hrms_backend/test/helpers.js`: `makeAgent(app)` returns a supertest agent; `seedUser({role})` creates User + Employee.

**Step I4. Backend starter tests**
- `test/controllers/auth.test.js`: login with valid creds → expect 200 + cookies set + body has no `accessToken`; login with wrong password → 401 single generic message; rate-limit kicks in after 20 attempts in 15 min (mock timer or lower max).
- `test/controllers/attendance.test.js`: punch-in twice same day → second returns 400 (regression + DB unique index); `getAttendenceHistory` returns 7 days only (regression for B8).
- `test/controllers/leave.test.js`: apply leave → admin updateStatus → employee sees notification (regression for B3/B7); `getBalanceLeave` returns non-zero used (regression for B4); `markAsRead` by wrong user → 404 (regression for B7).
- `test/middleware/authMiddleware.test.js`: missing cookie → 401; expired token → 401; valid token → req.user populated.
- `test/middleware/upload.test.js`: file >2MB → 400; bad extension → 400.

**Step I5. GitHub Actions + Husky**
- Create `.github/workflows/ci.yml` with two jobs: `frontend` (Node 20, 22 matrix) runs `npm ci && npm run lint && npm run test && npm run build`; `backend` (Node 20, 22 matrix) runs `npm ci && npm run lint && npm run test`. Triggers: push, pull_request.
- Husky: `npm i -D husky lint-staged`; `npx husky init`; create `.husky/pre-commit` running `npx lint-staged`. In `package.json` (both repos): `"lint-staged": {"*.{js,jsx}":["eslint --fix","vitest related --run"]}`. Add `"prepare": "husky"` so install wires hooks.
- Add CHANGELOG.md with v0.1.0 entry summarizing the rename + bug fixes + security baseline.

## Critical files & anchors

- `hrms_backend/server.js` — Phases D2, F1; rewrites middleware chain (helmet, compression, rate-limit, mongo-sanitize, hpp, pino-http, static proxy removal, error handler, health routes, graceful shutdown).
- `hrms_backend/controllers/auth.controller.js` — Phase D8 (cookie-based auth, generic error, lockout, hash refresh tokens). `loginUser`, `refreshToken`, `logoutUser` rewritten; cookie flags change to `sameSite:"strict"`.
- `hrms-dashboard/src/api/axios.js` — Phase E2 single-flight refresh; entire file is the load-bearing refresh path.
- `hrms-dashboard/src/context/auth-context.jsx` — Phases E1, E3; in-memory user, drops localStorage, wires `useMe`.
- `hrms_backend/models/attendance.js` (renamed from `attendence.js`) — Phase G1; compound unique index, soft-delete plugin.
- `hrms-dashboard/src/components/common/AppShell.jsx` (new) + deletion of admin/employee layouts and sidebars — Phase H3; collapses ~95% duplicated code.

## Verification

End-to-end proof per phase. Each step's verification is local; final gate at the end.

**Phase A verification**
- `git grep -nE "attendence|Attendence|ATTENDENCE" -- ':!*.md'` returns 0 matches outside `PROJECT_PLAN.md`.
- `git grep -nE "console\.(log|error)" src/` returns 0 matches.
- `ls src/auth/protected-route.jsx src/data/mock-employee.js hrms_backend/uploads.js` returns "No such file" for all three.
- `.env.example` exists in both repos; `.env` either deleted or contains placeholders only (manual check).
- Backend builds: `cd hrms_backend && npm run dev` exits 0 when `MONGO_URI` is unset (DB connect failure is logged, not crash).

**Phase B verification**
- Backend integration: log in as employee, navigate to admin stats dashboard. The "Present today" count is non-zero for any punched-in employee (regression for B5).
- `curl -i -X POST localhost:5000/api/employee/leave -b cookies.txt -d '{"status":"Approved"}'` (admin route) → 200 and the response includes `notification` (regression for B3 — no throw).
- DB query `db.leaves.find({status:"Approved"})` after admin approving 2 leaves: `getBalanceLeave` API returns `used: 5` for a 5-day approved leave (regression for B4).
- DB query `db.attendances.find({})` after same-day double punch-in: only 1 record (regression for B8 — though not yet index-enforced; manual app logic holds).
- `curl -X PUT /api/employee/change-password -d '{"oldPassword":"x","newPassword":"valid12345"}'` → 200; force a save error (mocked) → 500 (regression for B6).
- `curl -X PATCH /api/notifications/<otherUserNotificationId>/read` as user A → 404 (regression for B7).

**Phase C verification**
- Frontend unit tests (Phase I2) cover C1–C5. Run `npm test` and assert all pass.
- Visit `/admin/reports` → renders placeholder (regression for C6).
- Visit `/unknown-route` → renders NotFoundPage (regression for C6).
- Manual: open employee dashboard, stat cards render with correct color and font sizes (regression for C5).

**Phase D verification**
- `curl -i -X POST localhost:5000/api/auth/login -d '{"email":"demo-user@gmail.com","password":"demouser"}' -H 'Content-Type: application/json'` → response is `200`; `Set-Cookie` headers include `refreshToken` and `accessToken` with `HttpOnly`, `SameSite=Strict`; body does NOT contain `accessToken` (regression for D8).
- Same call with wrong password → `401` body `{error:{code:"INVALID_CREDENTIALS"}}` — no leak of which field is wrong (regression for D8).
- Login 21 times in 15 minutes → 21st returns 429 (rate-limit, D9).
- `curl -X POST localhost:5000/api/employee -d '{"email":"bad","salary":"x"}' -H "X-CSRF-Token: $CSRF" -b cookies.txt` → 400 with `error.code:"VALIDATION_ERROR"` (D3).
- `curl -X POST -b cookies.txt` to a state-changing endpoint without `X-CSRF-Token` header → 403 (D8 CSRF).
- Upload 3MB file → 400; upload `evil.php` with mimetype `image/png` → 400 (bad extension); upload real PNG with sanitized UUID filename in `uploads/profilePics/` (D7).
- `curl localhost:5000/uploads/profilePics/abc.jpg` → 404 (no public mount); `curl localhost:5000/api/files/profilePics/abc.jpg -b cookies.txt` → 200 (D6).
- `curl localhost:5000/healthz` → 200; `curl localhost:5000/readyz` → 200 (D4).

**Phase E verification**
- Open DevTools → Application → Local Storage: no `accessToken` or `user` keys after login (regression for E1).
- Open DevTools → Network: `/auth/refresh` request has `Cookie:` header but no `Authorization` header (E1).
- Force 5 concurrent requests to fail 401, observe one `/auth/refresh` request (E2 single-flight).
- Refresh page while logged in → no flicker (E3 `useMe` cached for 5 min).

**Phase F verification**
- `kill -SIGTERM <pid>` while serving requests → server logs "shutting down", closes DB, exits 0 within 10s (F1).
- Mongo unavailable at boot → server logs error, exits 1 (F2).

**Phase G verification**
- Integration test: 100 employees + 365 days attendance → admin stats endpoint returns within 200ms (G2 aggregation).
- `db.attendances.getIndexes()` shows `{employee:1, date:-1}` with `unique:true` (G1).
- `db.users.findOne({email:"DEMO@X.COM"})` after register with `email:"demo@x.com"` → succeeds (lowercase enforced, G1).
- `npm test` (backend) — services-layer tests cover the moved logic (G3).

**Phase H verification**
- `npm run lint` passes (no-console enforced, no dead imports).
- Toggle dark mode in navbar → entire app re-themes; reload page → mode persists (H1).
- All avatar URLs in tables/profile use `getAvatarUrl`; the helper unit test passes (H2).
- `git grep -nE "admin-sidebar|employee-sidebar|admin-layout|employee-layout" src/` returns 0 matches (H3).
- Trigger a mutation → snackbar appears bottom-right (H4).
- Throw inside an `<ErrorBoundary>` child → fallback renders (H5).
- Trigger 11 failed requests within staleTime window → only the first refetches (H6 staleTime).
- Admin invalidates `["attendance","admin",...]` → employee queries are NOT refetched (H6 key namespacing).
- `git grep -nE "from.*utils/auth|from.*protected-route"` returns 0 matches (H7).

**Phase I verification**
- `npm test` (frontend) — 8 tests pass (I2).
- `npm test` (backend) — 5+ tests pass (I4).
- Push to branch → GitHub Actions CI green on Node 20 and Node 22 (I5).
- `git commit` (after husky install) → pre-commit runs lint + relevant tests (I5).

**Final end-to-end gate**
- `cd hrms-dashboard && npm ci && npm run lint && npm run test && npm run build` exits 0.
- `cd hrms_backend && npm ci && npm run lint && npm run test` exits 0.
- Manual smoke: register a new admin, log in, create an employee, employee logs in, punches in, applies for leave, admin approves, employee sees notification in real time (or refresh — depends on whether realtime is in scope; here refresh is enough). All actions trigger snackbars; console is silent; no broken links; dark mode toggles cleanly.

## Assumptions & contingencies

- **A1. Mongo collection rename**: renaming the `Attendence` model to `Attendance` changes the Mongo collection from `attendences` to `attendances`. **Default**: accept the rename (no data migration) — this is a portfolio project, no production data. **Fallback** if the user has seed data they want to preserve: add `mongoose.model("Attendance", attendanceSchema, "attendences")` to keep the existing collection name.
- **A2. CORS for cookies**: moving to `sameSite:"strict"` cookies means cross-site admin panel use is not possible (e.g. opening admin from an email link to a different origin). Acceptable since both dev and prod are same-origin to the API. **Fallback** if a future need arises: switch back to `sameSite:"lax"` and document the tradeoff.
- **A3. Access-token lifetime**: kept at 15 minutes. **Fallback** if reviewers object: bump to 30m.
- **A4. Refresh-token hash**: SHA-256 without per-user secret. Acceptable because the DB and the cookie-issuing server share the same secret pool; the attacker needs both DB read and cookie theft. **Fallback** for stricter security: HMAC-SHA-256 with `process.env.REFRESH_HASH_SECRET`.
- **A5. Soft-delete with `mongoose-delete`**: this overrides `find`/`findOne` etc. to exclude deleted docs by default. **Fallback** if it breaks existing list endpoints: add `{includeSoftDeleted: true}` query option override and adjust list endpoints that need to show deleted items to admins.
- **A6. Magic-byte file sniffing**: deferred (D7 accepts ext + mimetype + size). **Fallback** if a reviewer flags it: switch multer to `memoryStorage`, sniff first 4 bytes, then write to disk manually.
- **A7. CSRF double-submit**: assumes SPA is same-origin (it is). **Fallback** for future cross-origin: switch to `sameSite:"lax"` + origin-check middleware.
- **A8. Vitest for backend**: chosen over Jest for ESM compatibility (project is `"type":"module"`). **Fallback**: switch to `node --test` if Vitest setup fights ESM.
- **A9. i18n and PWA**: listed as items in PROJECT_PLAN but **out of scope** of this plan — they are in P3 in PROJECT_PLAN, but excluded here to keep this plan decision-complete in one PR cycle. They go in a separate plan.
- **A10. Payroll, holidays, MFA, audit log, real-time WebSocket, AI features**: out of scope; each needs its own decision-complete plan (see PROJECT_PLAN.md §5).
- **A11. Demo seed credentials**: README currently publishes `demo@admin.com / Demo@2026!`. The plan removes them from README and adds a `scripts/seed.js` that creates the demo admin with a random password printed once. **Fallback** if the user wants the demo creds preserved (so reviewers can log in instantly): keep them in README with a banner "rotate before deploying".