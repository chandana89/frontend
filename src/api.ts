import axios from "axios";

export const api = {
  apiRoot: import.meta.env.VITE_API_HOST,

  /** Password sign-in. Resolves with the user's email and a session token. */
  async Login(userName: string, password: string): Promise<{ user: string, token: string }> {
    try {
      const ret = await axios.post(`${this.apiRoot}/authenticate/login`, { userName, password });
      //   if (ret.data.status !== 'ok') {
      //     throw new Error(ret.data.message);
      //   }
      return { user: ret.data.user, token: ret.data.token };

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  /**
   * Creates an account and signs it in (`POST /authenticate/register`).
   * Resolves with the same `{ user, token }` as `Login`.
   */
  async Register(email: string, password: string): Promise<{ user: string, token: string }> {
    try {
      const ret = await axios.post(`${this.apiRoot}/authenticate/register`, { email, password });
      return { user: ret.data.user, token: ret.data.token };

    } catch (e: any) {
      // Validation errors come back as a list of messages.
      const message = e.response?.data?.message;
      throw new Error((Array.isArray(message) ? message.join('. ') : message) || `An error has occured, please try again later`);
    }
  },

  /** Ends the session for `token` (`POST /authenticate/logout`). */
  async Logout(token: string) {
    await axios.post(`${this.apiRoot}/authenticate/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
  },

  async SaveToken(userName: string, token: string): Promise<string> {
    try {
      const ret = await axios.post(`${this.apiRoot}/notifications/token`, { userName, token });
      //   if (ret.data.status !== 'ok') {
      //     throw new Error(ret.data.message);
      //   }
      console.log(ret, "ret")
      return ret.data.details;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  /**
   * Requests WebAuthn registration options for the signed-in user (`POST /passkey`).
   * The returned JSON is passed directly to `startRegistration` from
   * `@simplewebauthn/browser`.
   */
  async GetPasskeyRegistrationOptions(token: string) {
    try {
      const ret = await axios.post(`${this.apiRoot}/passkey`, {}, { headers: { Authorization: `Bearer ${token}` } });
      return ret.data;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  /**
   * Sends the browser's registration response to the backend for verification
   * (`POST /passkey/verify`). `authResp` is the value resolved by `startRegistration`.
   * Resolves with the backend's verification result.
   */
  async VerifyPasskeyRegistration(token: string, authResp: any) {
    try {
      const ret = await axios.post(`${this.apiRoot}/passkey/verify`, { authResp }, { headers: { Authorization: `Bearer ${token}` } });
      return ret.data;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  /**
   * Requests usernameless WebAuthn authentication options (`POST /passkey/login`).
   * The returned JSON is passed directly to `startAuthentication` from
   * `@simplewebauthn/browser`, which lets the user pick any passkey saved for this site.
   */
  async GetPasskeyLoginOptions() {
    try {
      const ret = await axios.post(`${this.apiRoot}/passkey/login`);
      return ret.data;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  /**
   * Sends the browser's authentication response to the backend (`POST /passkey/login/verify`).
   * The backend finds the account from the passkey. Resolves with the signed-in user,
   * and a session token, in the same shape as `Login`.
   */
  async VerifyPasskeyLogin(authResp: any): Promise<{ user: string, token: string }> {
    try {
      const ret = await axios.post(`${this.apiRoot}/passkey/login/verify`, { authResp });
      return { user: ret.data.user, token: ret.data.token };

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  async GetBio(): Promise<string> {
    try {
      const ret = await axios.get(`${this.apiRoot}/`);
      //   if (ret.data.status !== 'ok') {
      //     throw new Error(ret.data.message);
      //   }
      console.log(ret, "ret")
      return ret.data.details;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  async UploadFile(asic: File): Promise<string> {
    try {
      const formData: FormData = new FormData();
      formData.append('asic', asic, asic.name);
      const ret = await axios.post(`${this.apiRoot}/chatgpt`, formData);
      //   if (ret.data.status !== 'ok') {
      //     throw new Error(ret.data.message);
      //   }

      return ret.data.output[0].content[0].text;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  async ExtractBO(form: { fileURL: string, prompt: string }): Promise<string> {
    try {
      const ret = await axios.post(`${this.apiRoot}/chatgpt/url`, form);
      //   if (ret.data.status !== 'ok') {
      //     throw new Error(ret.data.message);
      //   }

      return ret.data.output[1].content[0].text;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

}