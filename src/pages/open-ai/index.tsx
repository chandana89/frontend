import { useEffect, useState } from "react";
import { api } from "../../api";
import { marked } from 'marked';

type TForm = {
  prompt: string;
  fileURL: string;
}

export const OpenAIPage = () => {
 const [form, setForm] = useState<TForm>({
    prompt: '',
    fileURL: '',
  });

  const [beneficialOwner, setBeneficialOwner] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!form.fileURL) return;
    setLoading(true);
    try {
      // const ret = await api.UploadFile(fileData);
      const ret = await api.ExtractBO(form);
      const html = await marked.parse(ret);
      setBeneficialOwner(html);
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <p>To extract BO information from ASIC document. please provide URL of the ASIC document and provide a prompt</p>
      <div>
        {/* <FileUpload
          onUpload={f => setFileData(f ? f[0] : undefined)}
          label='Accepted format: PDF, PNG, EML and JPEG only (Max size: 20Mb)'
          validator={f => f.type !== 'application/pdf' && f.type !== 'image/png' && f.type !== 'image/jpeg' && !f.type.match(/application\/vnd\.openxmlformats/) && !f.name.match(/\.eml$/i) ? 'Only PDF, PNG, EML, and JPG files are supported' : undefined}
        /> */}
        <input type="text" aria-describedby="search" placeholder="Enter File URL" className="form-control mb-3" onChange={e => setForm({...form, fileURL: e.target.value})} />
        <input type="text" aria-describedby="search" placeholder="Enter your prompt" className="form-control" onChange={e => setForm({...form, prompt: e.target.value})} />
      </div>
      <button type='submit' className='btn btn-primary mt-4' disabled={loading} onClick={handleSubmit}>
        Submit
      </button>
        <div
          dangerouslySetInnerHTML={{ __html: beneficialOwner }}
          style={{ lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}
        />
      </div>
  
  );
};
