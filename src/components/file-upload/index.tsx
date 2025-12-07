import * as Icons from "react-feather";
import { useState } from "react";
import { useDropzone } from "react-dropzone";


type TProps = {
  onUpload: (arg0: File[] | undefined) => void;
  validator?: (arg0: File) => string | undefined;
  multiple?: boolean;
  label: string;
  maxSize?: number
  isError?: boolean;
  disabled?: boolean;
}

export const FileUpload = ({ onUpload, multiple = false, label, maxSize = 20, validator, isError, disabled }: TProps) => {

  const [fileError, setFileError] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);


  const handleDeleteFile = (file: File) => {
    const list = files.filter(f => f.name !== file.name);
    setFiles(list);
    onUpload(list)
  }

  const onDrop = (list: File[]) => {
    setFileError(undefined)

    for (const file of list) {

      if (validator) {
        const e = validator(file);
        if (e) {
          setFileError(e);
          return;
        }
      }

      if (file.size > maxSize * 1024 * 1024 * 1024) {
        setFileError(`Maximum file size is ${maxSize}Mb`)
        return;
      }
    }
    setFiles(list)
    onUpload(list)
  }

  const { getRootProps, getInputProps } = useDropzone({ multiple, onDrop })

  return (
    <>
      <div {...getRootProps()} className="file-upload-wrapper">
        <input {...getInputProps()} className={`form-control${fileError ? ' is-invalid' : ''}`} disabled={disabled} />
        <div className={`upload-action mx-auto${isError ? ' error' : ''}`}>
          <div className='upload-action-icon'>
            <Icons.Upload size={32} />
          </div>
          <h4 className='mt-3'>Drop files here or click to upload</h4>
        </div>
        <small>{label}</small>
        {fileError && <div className='text-danger'>{fileError}</div>}
      </div>

      <ul className='mt-2 list-unstyled'>
        {files.map((file, i) =>
          <li key={i}>
            <div className='monospace text-truncate w-75 d-flex align-items-center mt-1 gap-2'>
              <Icons.CheckSquare className='text-success' size={18} />
              <span>{file.name}</span>
              <span className='text-muted'>|</span>
              <button
                className='btn btn-link text-danger p-0 text-decoration-underline' type='button' onClick={() => handleDeleteFile(file)}>
                <Icons.Trash2 className='text-danger me-1' size={18} />
                delete
              </button>
            </div>
          </li>
        )}
      </ul>
    </>
  );
};
