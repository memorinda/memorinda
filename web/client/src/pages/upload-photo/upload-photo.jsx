import { useEffect, useState } from 'react';

function UploadPhoto() {

  const [photos, setPhotos] = useState([]);
  const [photURLs, setPhotoURLs] = useState([])

  function onPhotoUpload(e) {
    e.preventDefault();
    setPhotos([...e.targe.files])
  }

  useEffect(() => {
    if(photos.length > 0){
      const urlList = [];
      photos.forEach(photo  => urlList.push(URL.createObjectURL(photo)));
      setPhotoURLs(urlList)
    }
  }, [photos])

   return (
    <div className="upload-photo">
      <div className="photo-select row mt-5 justify-content-center align-items-center">
        <div className="  col-5 align-self-center">
           <input 
              type="file"
              multiple 
              accept='image/*' 
              onChange={onPhotoUpload}
            />
        </div>
      </div>

      <div className="photo-preview row mt-5 justify-content-center align-items-center">
        {photURLs.map( url => {
          return (
            <div className="  col-4 align-self-center">
              <img src={url} alt="item"/>
           </div>
          );
        })}
      
      </div>
    </div>
  )
}

export default UploadPhoto