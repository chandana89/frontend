# Passkeys

Users can register a passkey and then use it instead of their password to sign in. A passkey is a WebAuthn credential that the user unlocks with touch, facial recognition, a device password or a PIN.

| Side | Code | Library |
| --- | --- | --- |
| Frontend | [`src/pages/passkey/index.tsx`](../src/pages/passkey/index.tsx) (register), [`src/pages/login/index.tsx`](../src/pages/login/index.tsx) (sign in), [`src/api.ts`](../src/api.ts) | [`@simplewebauthn/browser`](https://simplewebauthn.dev/docs/packages/browser) v13 |
| Backend (NestJS, separate `backend` repo) | `src/modules/passkey/` (controller, service, module), `src/entities/passkey.entity.ts`, `src/entities/user.entity.ts` | [`@simplewebauthn/server`](https://simplewebauthn.dev/docs/packages/server) v13 |

Both registration and sign-in take two requests. The first returns options with a fresh challenge. The second sends back the browser's signed response for the backend to verify. Accounts are identified by `userName`, which is the user's email.

## Registration flow

Signed-in users start from the **Passkey** link in the top nav (`/passkey`).

1. The user clicks **Add Passkey**.
2. `api.GetPasskeyRegistrationOptions(userName)` calls `POST /passkey`. The backend:
   - looks up the user by email (`400 Invalid user` if not found);
   - generates registration options and lists the user's existing passkeys in `excludeCredentials`, so the same authenticator can't be registered twice;
   - saves the challenge in `user.currentChallenge`.
3. `startRegistration({ optionsJSON })` asks the device to create the credential.
4. `api.VerifyPasskeyRegistration(userName, authResp)` calls `POST /passkey/verify`. The backend checks the response against the saved challenge, `ORIGIN` and `RP_ID`. It then saves a `Passkey` row, clears the challenge and returns `{ verified: true }`.

Registration options the backend uses:

| Option | Value | Effect |
| --- | --- | --- |
| `authenticatorAttachment` | `platform` | Only the device's built-in authenticator (Touch ID, Face ID, Windows Hello, Android screen lock). You can't use security keys or a phone scanned by QR code. |
| `residentKey` | `preferred` | The device may, but doesn't have to, store a passkey that works without typing an email. That's why sign-in asks for the email. |
| `userVerification` | `preferred` | The device asks for a biometric or PIN when it can. |
| `attestationType` | `none` | No attestation certificate is requested or checked. |

## Sign-in flow

The login page shows **Sign in with passkey** only when the browser supports WebAuthn.

1. The user enters their email and clicks **Sign in with passkey**.
2. `api.GetPasskeyLoginOptions(userName)` calls `POST /passkey/login`. The backend lists the user's passkeys in `allowCredentials` and saves the challenge in `user.currentChallenge`. An unknown email and an account without passkeys both get `400 No passkey registered for this account`.
3. `startAuthentication({ optionsJSON })` asks the device to sign the challenge.
4. `api.VerifyPasskeyLogin(userName, authResp)` calls `POST /passkey/login/verify`. The backend:
   - finds the passkey whose credential ID matches `authResp.id`, among this user's passkeys only;
   - verifies the signature with the stored public key, and the challenge, `ORIGIN` and `RP_ID`;
   - clears the challenge whether or not verification succeeded;
   - saves the new signature counter and returns `{ user }` (the email), the same response as password login.
5. The frontend stores the user in session storage and redirects, exactly as after password login.

## Endpoints

All four are `POST` requests with a JSON body, served from `VITE_API_HOST` (currently `http://localhost:8001`).

| Path | Body | Success | Errors |
| --- | --- | --- | --- |
| `/passkey` | `{ userName }` | Registration options (`PublicKeyCredentialCreationOptionsJSON`) | `400 Invalid user` |
| `/passkey/verify` | `{ userName, authResp }` | `{ verified: true }` | `400 No registration in progress`, `400 Registration verification failed`, `500` (see [Known limitations](#known-limitations)) |
| `/passkey/login` | `{ userName }` | Sign-in options (`PublicKeyCredentialRequestOptionsJSON`) | `400 No passkey registered for this account` |
| `/passkey/login/verify` | `{ userName, authResp }` | `{ user }` | `401 No sign-in in progress`, `401 Passkey not recognised for this account`, `401` with the library's verification error |

The frontend shows each error's `message` to the user.

## Data model

**`passkey` table** (`Passkey` entity). Each user can have many rows.

| Column | Type | Contents |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `credential_id` | bytea | The base64url credential ID, stored as UTF-8 bytes. A column transformer converts it back, so code always sees a string. |
| `public_key` | bytea | COSE public key used to verify sign-in signatures |
| `counter` | integer, nullable | Signature counter, updated after each sign-in. Many platform passkeys always report `0`. |
| `transports` | text[], nullable | How the browser can reach the authenticator (e.g. `internal`, `hybrid`). Sent back as a hint. |
| `user_id` | uuid, FK to `user` | Owner |

**`user.currentChallenge`** (varchar, nullable) holds the pending challenge. Registration and sign-in share this column, so starting one replaces a challenge left over from the other. It is cleared after a successful registration and after every sign-in attempt.

The schema is created by TypeORM `synchronize: true`; there are no migrations.

## Configuration

Backend `.env`:

| Variable | Current value | Meaning |
| --- | --- | --- |
| `RP_NAME` | `SimpleWebAuthn Example` | Name shown in the browser's passkey prompt. Still the library's example value. |
| `RP_ID` | `localhost` | Domain passkeys are bound to. Must be the frontend's host (or a parent domain of it). |
| `ORIGIN` | `http://localhost:5173` | Exact frontend origin, including scheme and port. Must match where the frontend is served. |

If any of these is unset, the service falls back to an empty string, and every registration and sign-in fails.

Frontend `.env`: `VITE_API_HOST` must point at the backend.

WebAuthn only works in a secure context: HTTPS, or `localhost` during development.

## Known limitations

- **Anyone can register a passkey for any email.** `POST /passkey` and `/passkey/verify` trust the `userName` in the request body. The backend has no session or token to confirm who is calling, and password login only returns the email. So someone who knows a user's email can register their own passkey on that account and then sign in as that user. Registration must be tied to an authenticated session before this goes to production.
- **Registration verification errors return 500.** `verifyRegistrationResponse` throws on a mismatched challenge, origin or RP ID. `/passkey/verify` doesn't catch this, so the user sees "Internal server error". Sign-in catches the same kind of error and returns a `401`.
- **An email is required to sign in** (see `residentKey` above).
- **Only built-in authenticators** (see `authenticatorAttachment` above).
- **Debug logging:** the controller logs `authResp` and the service logs the full verification result on every registration.
- **Error messages reveal accounts:** registration's `Invalid user` tells a caller whether an email has an account.

## Troubleshooting

- **"Internal server error" when adding a passkey**: registration verification failed; usually `ORIGIN` or `RP_ID` doesn't match the frontend URL. The backend logs have the real error.
- **"No passkey registered for this account"**: register one from `/passkey` first, while signed in with a password. Also check the email is typed exactly as registered.
- **"No sign-in in progress" / "No registration in progress"**: the challenge was already used or replaced (for example, another tab started a passkey request). Try again.
- **`SecurityError` / "The operation is insecure"**: the page isn't served over HTTPS or `localhost`, or `RP_ID` doesn't match the current domain.
- **`InvalidStateError` when registering**: this device already has a passkey for the account.
- **`NotAllowedError`**: the user cancelled the prompt or it timed out.
