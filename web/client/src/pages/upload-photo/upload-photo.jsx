import { useEffect, useRef, useState } from 'react';
import { uploadPhotosToContract } from '../../utils/photo-upload-utils';
import './upload-photo.scss';

function UploadPhoto() {

  const [photos, setPhotos] = useState([]);
  const [photURLs, setPhotoURLs] = useState([])

  const hiddenFileUploadRef = useRef(null)

  function onPhotoUpload(e) {
    setPhotos([...e.target.files])
  }
  
  function handleOnClick() {
    hiddenFileUploadRef.current.click();
  }

  function handleSubmit() {
    if(photos.length > 0){
      uploadPhotosToContract(photos)
      setPhotos([])
    }
  }

  useEffect(() => {
    if(photos.length > 0){
      const urlList = [];
      photos.forEach(photo  => urlList.push(URL.createObjectURL(photo)));
      setPhotoURLs(urlList)
      console.log(urlList)
    }
    else{
      setPhotoURLs([])
    }
  }, [photos])

   return (
    <div className="upload-photo">
      <div className="photo-select row mt-5 justify-content-center align-items-center">
   
        <div className="  col-sm-3 mb-3 align-self-center">
          <button
            type='button'
            className="upload-btn btn btn-block btn-primary"
            onClick={handleOnClick}
          >Select Photo</button>
           <input 
            className='file-input'
              type="file"
              ref={hiddenFileUploadRef}
              multiple 
              accept='image/*' 
              onChange={onPhotoUpload}
            />
        </div>

        <div className="  col-sm-3 mb-3 align-self-center">
          <button
            type='button'
            className="upload-btn btn btn-block btn-success"
            onClick={handleSubmit}
            disabled={photURLs.length===0}
          >
          Upload
          </button>
          
        </div>
      </div>
      {photURLs.length>0 && <div className="photo-preview row mt-5 justify-content-center align-items-center">
        <div className="  col-4 align-self-center">
          <h3>Selected Photos</h3>

        </div> 
       </div>
      }
      <div className="photo-preview row mt-5 justify-content-center align-items-center">
        {photURLs.map( url => {
          return (
            <div key={url} className="preview-box">
              <img src={url} alt="item"/>
           </div>
          );
        })}
      
      </div>
    </div>
  )
}

export default UploadPhoto