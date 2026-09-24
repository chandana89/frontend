# Passkeys

Signed-in users can register a passkey from the **Passkey** link in the top nav (`/passkey`, implemented in [`src/pages/passkey/index.tsx`](../src/pages/passkey/index.tsx)). Passkeys are WebAuthn credentials that let users sign in with touch, facial recognition, a device password or a PIN instead of a password and two-factor code.

The browser side uses [`@simplewebauthn/browser`](https://simplewebauthn.dev/docs/packages/browser); the backend is expected to use a compatible WebAuthn server library (e.g. `@simplewebauthn/server`).

## Registration flow

1. The user clicks **Add Passkey**.
2. `api.GetPasskeyRegistrationOptions(userName)` ([`src/api.ts`](../src/api.ts)) calls `POST {VITE_API_HOST}/passkey` with `{ userName }` and returns the registration options JSON.
3. `startRegistration({ optionsJSON })` prompts the user to create the credential on their device.
4. `api.VerifyPasskeyRegistration(userName, authResp)` calls `POST {VITE_API_HOST}/passkey/verify` with `{ userName, authResp }` so the backend can verify and store the credential.

## Sign-in flow

Once a passkey is registered, the user can sign in with it from the login page (`src/pages/login/index.tsx`). The button only appears when the browser supports WebAuthn.

1. The user enters their email and clicks **Sign in with passkey**.
2. `api.GetPasskeyLoginOptions(userName)` calls `POST {VITE_API_HOST}/passkey/login` with `{ userName }`. The backend returns authentication options that list the account's passkeys and stores a one-time challenge.
3. `startAuthentication({ optionsJSON })` prompts the user to confirm with their device.
4. `api.VerifyPasskeyLogin(userName, authResp)` calls `POST {VITE_API_HOST}/passkey/login/verify`. The backend checks the signature against the stored public key, updates the passkey's counter, clears the challenge and returns `{ user }`, the same shape as password login.
5. The user is stored in the session and redirected, exactly as after password login.

## Backend endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/passkey` | `{ userName }` | WebAuthn `PublicKeyCredentialCreationOptionsJSON` |
| `POST` | `/passkey/verify` | `{ userName, authResp }` | `{ verified: true }` |
| `POST` | `/passkey/login` | `{ userName }` | WebAuthn `PublicKeyCredentialRequestOptionsJSON` |
| `POST` | `/passkey/login/verify` | `{ userName, authResp }` | `{ user }` (the account email) |

Failures return `400` (bad request, e.g. no passkey registered) or `401` (verification failed) with a readable `message`, which the page shows to the user.

## Requirements

- `VITE_API_HOST` must point at the backend.
- WebAuthn only works in a secure context: HTTPS, or `localhost` during development.
- The backend's relying party ID must match the domain the frontend is served from.

## Troubleshooting

- **"Internal server error" under the button**: something unexpected failed in the backend; check its logs for the stack trace.
- **"No passkey registered for this account"**: register one from `/passkey` first, while signed in with a password.
- **`SecurityError` / "The operation is insecure"**: the page is not being served over HTTPS (or `localhost`), or the relying party ID doesn't match the current domain.
- **`InvalidStateError`**: a passkey for this account already exists on the authenticator (the backend excluded it via `excludeCredentials`).
- **`NotAllowedError`**: the user cancelled the prompt or it timed out.
