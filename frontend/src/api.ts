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

  async UploadFile(asic: File): Promise<string> {
    try {
      const formData: FormData = new FormData();
      formData.append('asic', asic, asic.name);
      const ret = await axios.post(`${this.apiRoot}/chatgpt`, formData);
    //   if (ret.data.status !== 'ok') {
    //     throw new Error(ret.data.message);
    //   }
      console.log(ret,"ret")
      return ret.data.output[0].content[0].text;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

  async ExtractBO(fileURL: string): Promise<string> {
    try {
      const ret = await axios.post(`${this.apiRoot}/chatgpt/url`, { fileURL });
    //   if (ret.data.status !== 'ok') {
    //     throw new Error(ret.data.message);
    //   }
      console.log(ret,"ret")
      return ret.data.output[1].content[0].text;

    } catch (e: any) {
      throw new Error(e.response?.data?.message || `An error has occured, please try again later`);
    }
  },

}