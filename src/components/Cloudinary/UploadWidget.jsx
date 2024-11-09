import { CldUploadWidget } from 'next-cloudinary';
 

export default ({onSuccess}) => {
    const {NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,NEXT_PUBLIC_CLOUDINARY_API_KEY,NEXT_PUBLIC_CLOUDINARY_API_SECRET} = process.env
    // console.log('valor del env',NEXT_PUBLIC_CLOUDINARY_API_KEY,NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,NEXT_PUBLIC_CLOUDINARY_API_SECRET)
    // En cualquier componente de React/Next.js
console.log('Cloudinary Cloud Name1:', NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
console.log('Cloudinary Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

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