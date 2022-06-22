import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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


  const OnSubmit = async (data) => {

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

    // try {
    //   const added = await client.add(
    //     file,
    //     {
    //       progress: (prog) => console.log(`received: ${prog}`)
    //     }
    //   )
    //   const url = `https://ipfs.infura.io/ipfs/${added.path}`

    // } catch (error) {
    //   console.log('Error uploading file: ', error)
    // } 

    const eventProperties = await eventFactory.methods.getEventsByID(parseInt(eventID)).call();
    console.log(eventProperties);
    const eventContractt = await new web3js.eth.Contract(ABI.abi,eventProperties._eventAddress);        

    console.log(eventContractt);
    const ticketResponse = await eventContractt.methods.createTicketsByAmount(data.ticketPrice, data.ticketAmount).send({from: account});
    console.log(ticketResponse);
    navigate("/organizer-events");

  };
  return (
    <div>
      <div className="event-navbar row justify-content-end align-items-center">
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
      <div className="addEvent-info row align-items-center">

      <div className="event-navbar row justify-content-end align-items-center">
      <div className="col-1">
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
              <div className="mt-3 d-flex flex-column">
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
              

              <button
                className="btn col-2 addEventBtn"
                styles={{ display: "none" }}
              >
                <span className="addEventBtnText">
                    Create Ticket
                </span>
              </button>
            </div>

        </form>
        </div>
      </div>

    </div>

  );
}

export default CreateTicket;
