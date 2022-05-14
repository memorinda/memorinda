import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useStore } from "../../store/store";
import "./organizer-addEvent.css";


import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
//import { ethers } from 'ethers';

const addEventSchema = z
  .object({
    eventName: z.string().nonempty(),
    eventDescription: z.string().nonempty(),
    eventCapacity: z.number().positive(),
    eventDate: z.date(),
    eventLocation: z.string().nonempty(),
    eventPrice: z.number().positive(),
  });


function AddEvent() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addEventSchema),
    mode: "all",
  });

  const navigate = useNavigate();


  const [errorMessage, setErrorMessage] = useState("");

  const [state] = useStore();
  const { user: currentUser } = state;


  const onSubmit = async (data) => {

    // load image to ipfs before connect wallet
    // const web3Modal = new Web3Modal()
    // const connection = await web3Modal.connect()
    // const provider = new ethers.providers.Web3Provider(connection)
    // const signer = provider.getSigner()

    const resp = await eventFactory.methods.createEvent(data.eventName, data.eventDescription, 30, 30, data.eventDate.getTime(), data.eventCapacity).send({from: account});

    await axios.post(`${process.env.REACT_APP_URL}/events/add`, data, {
    }).then(res => {
      console.log(res);
    }).catch(err => console.log(err))

    navigate("/add-event");

  };
  return (
    <div>
      <div className="addEvent-info row align-items-center">
        <div className="addEvent-headInfo">
          <h2 className="">Organize Event
          </h2>
        </div>
      </div>
      <div className="dashedBorder mt-5">
        <div className="addEventContent">

        <form onSubmit={handleSubmit(onSubmit)}>

           <div className="card-body">
              <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventName")}
                  className="btn-border input-style form-control"
                  placeholder="Event Name"
                  type="text"
                >
                </input>
                <small className="align-self-start error-text">
                  {errors.eventName?.message}
                </small>

              </div>

              <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventDescription")}
                  className="btn-border input-style form-control"
                  placeholder="Event Description"
                  type="text"
                >
                </input>
              </div>
              <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventLocation")}
                  className="btn-border input-style form-control"
                  placeholder="Event Location"
                  type="text"
                >
                </input>
                <small className="align-self-start error-text">
                  {errors.eventLocation?.message}
                </small>

              </div>
              <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventDate", {
                  setValueAs: (v) => v === "" ? undefined : new Date(v),
                  })}
                  className="btn-border input-style form-control"
                  placeholder="Event Date"
                  type="date"
                >
                </input>
                <small className="align-self-start error-text">
                  {errors.eventDate?.message}
                </small>
              </div>

               <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventCapacity",  {
                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                })}
                  className="btn-border input-style form-control"
                  placeholder="Event Capacity"
                  type="number"
                >
                </input>
                <small className="align-self-start error-text">
                  {errors.eventCapacity?.message}
                </small>
              </div>

               <div className="mt-3 d-flex flex-column">
                <input
                  {...register("eventPrice", {
                      setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                  })}
                  className="btn-border input-style form-control"
                  placeholder="Event Price"
                  type="number"
                  step="0.001"
                >
                </input>
                <small className="align-self-start error-text">
                  {errors.eventCapacity?.message}
                </small>
              </div>


              <button
                className="btn col-2 addEventBtn"
                styles={{ display: "none" }}
              >
                <span className="addEventBtnText">
                    Create Event
                </span>
              </button>
            </div>

        </form>
        </div>
      </div>

    </div>

  );
}

export default AddEvent;
