# Passkeys

Signed-in users can register a passkey from the **Passkey** link in the top nav (`/passkey`, implemented in [`src/pages/passkey/index.tsx`](../src/pages/passkey/index.tsx)). Passkeys are WebAuthn credentials that let users sign in with touch, facial recognition, a device password or a PIN instead of a password and two-factor code.

The browser side uses [`@simplewebauthn/browser`](https://simplewebauthn.dev/docs/packages/browser); the backend is expected to use a compatible WebAuthn server library (e.g. `@simplewebauthn/server`).

## Registration flow

1. The user clicks **Add Passkey**.
2. `api.GetPasskeyRegistrationOptions(userName)` ([`src/api.ts`](../src/api.ts)) calls `POST {VITE_API_HOST}/passkey` with `{ userName }` and returns the registration options JSON.
3. `startRegistration({ optionsJSON })` prompts the user to create the credential on their device.
4. `api.VerifyPasskeyRegistration(userName, authResp)` calls `POST {VITE_API_HOST}/passkey/verify` with `{ userName, authResp }` so the backend can verify and store the credential.

## Backend endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/passkey` | `{ userName }` | WebAuthn `PublicKeyCredentialCreationOptionsJSON` |
| `POST` | `/passkey/verify` | `{ userName, authResp }` | Verification result |

## Requirements

- `VITE_API_HOST` must point at the backend.
- WebAuthn only works in a secure context: HTTPS, or `localhost` during development.
- The backend's relying party ID must match the domain the frontend is served from.

## Troubleshooting

- **"Internal server error" under the button**: the backend threw while handling `/passkey` or `/passkey/verify`. Its services throw plain `Error`s, which NestJS reports as a generic 500, so check the backend logs for the real message (e.g. `Invalid user`).
- **`SecurityError` / "The operation is insecure"**: the page is not being served over HTTPS (or `localhost`), or the relying party ID doesn't match the current domain.
- **`InvalidStateError`**: a passkey for this account already exists on the authenticator (the backend excluded it via `excludeCredentials`).
- **`NotAllowedError`**: the user cancelled the prompt or it timed out.
