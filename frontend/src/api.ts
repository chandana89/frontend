import axios from "axios";

export const api = {
     apiRoot: 'http://localhost:8001',
    async GetBio(): Promise<string> {
    try {
      const ret = await axios.get(`${this.apiRoot}/`);
    //   if (ret.data.status !== 'ok') {
    //     throw new Error(ret.data.message);
    //   }
      console.log(ret,"ret")
      return ret.data.details;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

}