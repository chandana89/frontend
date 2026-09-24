import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { api } from "../../api";
import { useStore } from "../../store";

/**
 * Lets a signed-in user register a passkey (WebAuthn credential) for their account.
 *
 * Registration flow:
 * 1. Fetch registration options from the backend (`POST /passkey`).
 * 2. Hand them to the browser via `startRegistration`, which prompts the user
 *    for touch, face, device password or PIN and creates the credential.
 * 3. Send the browser's response to the backend (`POST /passkey/verify`) so it
 *    can verify and store the credential.
 *
 * Only rendered for authorised users (see `/passkey` in `routes.tsx`).
 */
export const PasskeyPage = () => {
  const store = useStore();

  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddPasskey = async () => {
    if (!store.user) {
      setStatus('You need to be signed in to add a passkey.');
      return;
    }

    setLoading(true);
    setStatus('');
    try {
      const optionsJSON = await api.GetPasskeyRegistrationOptions(store.user);
      const regResp = await startRegistration({ optionsJSON });
      const verification = await api.VerifyPasskeyRegistration(store.user, regResp);
      setStatus(verification?.verified ? 'Passkey added.' : 'Passkey could not be verified.');
    } catch (err: any) {
      console.error(err);
      setStatus(err?.message || 'Could not add passkey.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div><p>Your device supports passkeys, a password replacement that validates your identity using touch, facial recognition, a device password, or a PIN.</p>
      <p>Passkeys can be used for sign-in as a simple and secure alternative to your password and two-factor credentials.</p>
      <button onClick={handleAddPasskey} disabled={loading}>{loading ? 'Adding…' : 'Add Passkey'}</button>
      {status && <p role="status">{status}</p>}
    </div>
  )
};
