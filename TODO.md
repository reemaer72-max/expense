# TODO - Application Fixes

## Phase 1: Plan

- [x] Scan client & server code for routes, API endpoints, and DB save logic
- [x] Identify errors: missing routes, incorrect auth state handling, and client/server mismatches

## Phase 2: Fixes to implement

- [ ] Update App.js routes to include missing pages referenced by Header (Profile/About)
- [ ] Fix react-router navigation for protected routes (redirect to / if no user)
- [ ] Fix Login useEffect logic to avoid double navigation/incorrect dependency
- [ ] Ensure Logout works: remove extra “Login” link shown when logged out; clear localStorage
- [ ] Fix Redux logout thunk path/type and reducer field mismatches
- [ ] Ensure Profile route exists and income input updates correctly (handle numeric input)
- [ ] Add basic error handling in axios thunks/components for smoother UX

## Phase 3: Verification

- [ ] Run client build/start and verify navigation between pages
- [ ] Run server and verify API endpoints (register/login/updateIncome/expenses/posts)
