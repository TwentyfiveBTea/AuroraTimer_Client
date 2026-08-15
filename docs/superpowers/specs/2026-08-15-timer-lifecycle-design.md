# Timer Lifecycle Design

## Context

AuroraTimer currently allows the authentication store, app shell, dashboard, and login view to initialize the timer independently. This produces three observable failures: a restored Worker can run while `isRunning` remains false; AFK pause can therefore be skipped while synchronization continues; and the first login can expose only the abbreviated login response in the profile page. Authentication initialization is also duplicated, which creates races during login, logout, and restart.

## Goals

- Keep the server-side timer session running when the EXE is closed without logging out, and restore it on the next launch.
- Stop the server-side and local timer session when the user explicitly logs out.
- Keep the timer state label, Worker, synchronization, and AFK handling consistent.
- Load complete user information before the first authenticated view uses it.
- Make startup and login initialization idempotent.

## State Ownership

`authStore` owns authentication and user profile data. It performs one startup token validation, fetches complete profile data after login, and stops the timer before clearing local authentication state during logout.

`timerStore` owns the timer state machine. The meaningful states are:

- `RUNNING`: `isRunning=true`, `isPaused=false`, Worker active, synchronization and AFK checks enabled.
- `AFK_PAUSED`: `isRunning=true`, `isPaused=true`, `isAFK=true`, Worker paused, synchronization stopped, recovery action available.
- `STOPPED`: `isRunning=false`, Worker inactive, server session stopped.

The server status is checked first during automatic startup. A server `RUNNING` session is restored directly. If the server no longer reports it as running, a persisted-token launch may restart only a locally saved active session that belongs to the same user. Explicit logout removes that saved intent. A manual login starts a new session when the server is stopped, or restores the existing one when it is already running.

## Data Flow

1. App startup creates the auth store. Its single initialization reads cached credentials, restores cached profile data for continuity, validates the token once, and marks `authReady` after completion.
2. The app shell waits for `authReady` before rendering authenticated routes and performs the one automatic timer-status synchronization.
3. Manual login stores the token, fetches the full profile, then starts or restores the timer. The dashboard only fetches display data; it does not start or restore timers.
4. Restoring a running server session sets all local running flags before starting the Worker and AFK detection. Closing the EXE does not call logout, so the server session remains eligible for the next launch.
5. AFK detection sets the paused state before sending the notification. The Worker message handler remains attached for later recovery; clicking recovery sends a heartbeat, clears AFK state, and resumes the Worker.
6. Logout stops the server session and Worker, resets timer state, clears authentication storage, and navigates to login.

## Error and Concurrency Rules

- A failed or stopped status response must not revive an unscoped local Worker state; restart intent is accepted only when it is active and belongs to the authenticated user.
- Start, restore, resume, and stop operations must be idempotent and must not create multiple Workers or overlapping startup calls.
- A failed notification permission request must not prevent the persistent in-app recovery control from appearing.
- Profile data returned by a later full-profile request replaces abbreviated login data.
- Existing user changes in the working tree are preserved while applying this design.

## Verification

Add Node built-in tests for timer restoration, AFK pause/resume, profile completion after login, and logout-versus-restart semantics. Run `npm test` and `npm run build`. The implementation is complete only when the tests pass and the production build succeeds.
