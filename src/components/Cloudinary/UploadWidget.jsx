import { CldUploadWidget } from 'next-cloudinary';
 

export default function UploadWidget ({onSuccess})  {

    return(
        <CldUploadWidget 
        uploadPreset="webchat"
        onSuccess={(result, { widget }) => {
            console.log('este es el valor de result ',result)
            onSuccess(result?.info);  // { public_id, secure_url, etc }
        }}
        onFailure={(error, { widget }) => { console.error('Upload failed:', error); }}
>
  {({ open }) => {
    return (
      <button onClick={() => open()}>
        Upload an Image
      </button>
    );
  }}
</CldUploadWidget>)
 }