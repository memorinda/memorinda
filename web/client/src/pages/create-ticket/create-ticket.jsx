import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useStore } from "../../store/store";
import "./create-ticket.css";

import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';

import ABI from '../../abis/Event.json';
import { userLogout } from '../../store/userReducer';

import { create as ipfsHttpClient } from 'ipfs-http-client'

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const createTicketSchema = z
  .object({
    ticketPrice: z.number().positive(),
    ticketAmount: z.number().positive(),
  });


function CreateTicket() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();
  const [eventContract, setEventContract] = useState(null);
  const [eventAddress, setEventAddress] = useState(null);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTicketSchema),
    mode: "all",
  });

  const navigate = useNavigate();
  const [, dispatch] = useStore();


  const [errorMessage, setErrorMessage] = useState("");

  const [state] = useStore();
  const { organizerUser: currentUser } = state;

  const eventID = window.location.pathname.slice(15);

  useEffect(() => {
    console.log(eventContract);
  }, [eventContract]);

  const [photos, setPhotos] = useState([]);
  const [photURLs, setPhotoURLs] = useState([])

  const hiddenFileUploadRef = useRef(null)

  function onPhotoUpload(e) {
    setPhotos([...e.target.files])
  }
  
  function handleOnClick() {
    hiddenFileUploadRef.current.click();
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


  const OnSubmit = async (data) => {

    if(photos.length > 0){
      // load image to ipfs before connect wallet
      // const web3Modal = new Web3Modal()
      // const connection = await web3Modal.connect()
      // const provider = new ethers.providers.Web3Provider(connection)
      // const signer = provider.getSigner()

      //const resp = await eventFactory.methods.getDeployed

      // await axios.post(`${process.env.REACT_APP_URL}/events/add`, data, {
      // }).then(res => {
      //   console.log(res);
      // }).catch(err => console.log(err))
      console.log(eventID);
      const eventProperties = await eventFactory.methods.getEventsByID(parseInt(eventID)).call();
      console.log(eventProperties);
      const eventContractt = await new web3js.eth.Contract(ABI.abi,eventProperties._eventAddress);        

      console.log(eventContractt);
      const ticketResponse = await eventContractt.methods.createTicketsByAmount(data.ticketPrice, data.ticketAmount).send({from: account});
      console.log(ticketResponse);
      setPhotos([])

      navigate("/organizer-events");
    }

  };
  return (
    <div>
      <div className="event-navbar row justify-content-end align-items-center">
        <div className="col-2">
          <button
            type='button'
            className="btn btn-block btn-success"
            onClick={() => {
              navigate("/organizer-events");
            }}
          >
               My Events
          </button>
        </div>
        <div className="col-2">
          <button
            type='button'
            className=" btn btn-block btn-primary"
            onClick={() => {
              dispatch(userLogout())
            }}
          >
               LOGOUT
          </button>
        </div>
   
      </div>

      <div className="event-navbar row justify-content-end align-items-center">
        <div className="col-8 ml-4 align-items-center">
            <div className="addEvent-info row align-items-center">

    <div className="event-navbar row justify-content-end align-items-center">

      </div>
        <div className="addEvent-headInfo">
          <h2 className="">Create Tickets
          </h2>
        </div>
            </div>
            <div className="dashedBorder mt-5">
              <div className="addEventContent">

                <form onSubmit={handleSubmit(OnSubmit)}>

                  <div className="card-body">
                      <div className="mt-3 d-flex flex-column align-items-center">
                        <input
                          {...register("ticketPrice", {
                            setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                        })}
                          className="btn-border input-style form-control"
                          placeholder="Ticket Price"
                          type="number"
                        >
                        </input>
                        <small className="align-self-start error-text">
                          {errors.ticketPrice?.message}
                        </small>

                      </div>

                      <div className="mt-3 d-flex flex-column">
                        <input
                          {...register("ticketAmount", {
                            setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                        })}
                          className="btn-border input-style form-control"
                          placeholder="Ticket Amount"
                          type="number"
                        >
                        </input>
                      </div>
                      
                      <div className="  col-3 align-self-center">
                      <button
                        className="btn col-12 addEventBtn"
                        styles={{ display: "none" }}
                        disabled={photos.length < 1}
                      >
                        <span className="addEventBtnText">
                            Create Ticket
                        </span>
                      </button>
                      </div>
                      <div className="  col-2 align-self-center">
                <button
                  type='button'
                  className="upload-btn btn btn-block btn-primary"
                  onClick={handleOnClick}
                >Select Photo</button>
                <input 
                  className='file-input'
                    type="file"
                    ref={hiddenFileUploadRef}
                    accept='image/*' 
                    onChange={onPhotoUpload}
                  />
              </div>
                    </div>

                </form>
              </div>
            </div>
        </div>
        <div className="col-4 align-items-center">
        <div className="upload-photo">

          <div className="photo-preview row justify-content-center align-items-center">
            {photURLs.map( url => {
              return (
                <div key={url} className="preview-box">
                  <img src={url} alt="item"/>
              </div>
              );
            })}
          
          </div>
          </div>
  
        </div>
   
      </div>
      


         

    </div>

  );
}

export default CreateTicket;
