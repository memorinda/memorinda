import { useEffect, useRef, useState } from 'react';

import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { create } from "ipfs-http-client";

import ABI from '../../abis/Event.json';
import './upload-photo.scss';

function UploadPhoto() {


  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();

  const [photos, setPhotos] = useState([]);
  const [photURLs, setPhotoURLs] = useState([])
  const [photosBuffer, setPhotosBuffer] = useState([]);
  const [urlArr, setUrlArr] = useState([]);

  const hiddenFileUploadRef = useRef(null)

  const client = create('https://ipfs.infura.io:5001/api/v0');
  let eventAndTicketID =(window.location.pathname.slice(14)).split("/");
  //eventAndTicketID = eventAndTicketID.split("/");
  const eventID = eventAndTicketID[0];
  const ticketID = eventAndTicketID[1];

  function onPhotoUpload(e) {
    setPhotos([...e.target.files])
    const data = e.target.files;
    for (let i = 0; i < data.length; i++) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data[i]);
      reader.onloadend = () => {
        console.log("Buffer data: ", Buffer(reader.result));
        setPhotosBuffer(prev => [...prev, reader.result]);
      }
    }
    e.preventDefault();  
  }
  
  function handleOnClick() {
    hiddenFileUploadRef.current.click();
  }

  async function handleSubmit() {
    const ipfsLinks = [];
    for (let i = 0; i < photosBuffer.length; i++) {
      try {
        const created = await client.add(Buffer(photosBuffer[i]));
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        ipfsLinks.push(url);
        setUrlArr(prev => [...prev, url]);      
      } catch (error) {
        console.log(error.message);
      }
    }
    const eventObj = await eventFactory.methods.getEventsByID(eventID).call();
    const eventContract = await new web3js.eth.Contract(ABI.abi, eventObj._eventAddress);        

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

      {/* <div className="display">
        {urlArr.length !== 0
          ? urlArr.map((el) => { return (<div><img src={el} alt="nfts" /> <p> {el} </p></div>)})
          : <h3>Upload data</h3>}
      </div> */}
    </div>
  )
}

export default UploadPhoto;