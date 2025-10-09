import { useEffect, useState } from "react";
import { api } from "../../api";
import { FileUpload } from "../../components/file-upload";
import { marked } from 'marked';

export const DashboardPage = () => {
  const [portfolio, setPortfolio] = useState<string>('');
  const [fileData, setFileData] = useState<File>();
  const [fileURL, setFileURL] = useState<string>();
  const [beneficialOwner, setBeneficialOwner] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!fileURL) return;
    setLoading(true);
    try {
      console.log(fileURL)
      // const ret = await api.UploadFile(fileData);
      const ret = await api.ExtractBO(fileURL!);
      const html = await marked.parse(ret);
      setBeneficialOwner(html);
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.GetBio().then(setPortfolio);
  }, []);

  return (
    <div>
      <div>
        {/* <FileUpload
          onUpload={f => setFileData(f ? f[0] : undefined)}
          label='Accepted format: PDF, PNG, EML and JPEG only (Max size: 20Mb)'
          validator={f => f.type !== 'application/pdf' && f.type !== 'image/png' && f.type !== 'image/jpeg' && !f.type.match(/application\/vnd\.openxmlformats/) && !f.name.match(/\.eml$/i) ? 'Only PDF, PNG, EML, and JPG files are supported' : undefined}
        /> */}
        <input type="text" aria-describedby="search" placeholder="Enter File URL" className="form-control" onChange={e => setFileURL(e.target.value)} />
      </div>
      <button type='submit' className='btn btn-primary' disabled={loading} onClick={handleSubmit}>
        Submit
      </button>
        <div
          dangerouslySetInnerHTML={{ __html: beneficialOwner }}
          style={{ lineHeight: '1.6', fontFamily: 'Arial, sans-serif' }}
        />
      </div>
  
  );
};
