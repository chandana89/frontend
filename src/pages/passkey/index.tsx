import { startRegistration } from "@simplewebauthn/browser";
import { api } from "../../api";
import { useStore } from "../../store";

export const PasskeyPage = () => {
  const store = useStore();

  const handleAddPasskey = async () => {
    await api.GetPasskeyRegistrationOptions(store.user!)
      .then((optionsJSON) => {
        startRegistration({ optionsJSON })
          .then(async (regResp) =>
            await api.VerifyPasskeyRegistration(store.user!, regResp).then(verification =>
              console.log(verification)
            )
          )
          .catch(err => console.log(err));
      });
  }

  return (
    <div><p>Your device supports passkeys, a password replacement that validates your identity using touch, facial recognition, a device password, or a PIN.</p>
      <p>Passkeys can be used for sign-in as a simple and secure alternative to your password and two-factor credentials.</p>
      <button onClick={handleAddPasskey}>Add Passkey</button>
    </div>
  )
};
