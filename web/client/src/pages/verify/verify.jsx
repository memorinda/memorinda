import { zodResolver } from "@hookform/resolvers/zod";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router';
import { z } from "zod";
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { useStore } from "../../store/store";
import "./verify.scss";
import ABI from '../../abis/Event.json';



function Verify() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();
  const [errorMessageSign, setErrorMessageSign] = useState("");
  const [errorMessageVerify, setErrorMessageVerify] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [eventID, setEventID] = useState("");


  const [userTickets, setUserTickets] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
  });
  const navigate = useNavigate();

  const [, dispatch] = useStore();

  const onSubmitSign = async (data) => {

    fetchTickets();
    try {
      console.log("b");

      await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(data.ticketIDSign);
    console.log("eventID:", data.eventIDSign);
    setEventID(data.eventIDSign);
    setUserAccount(account);
    console.log("a");

    console.log(typeof(signature));
    console.log(signature);
    setErrorMessageSign(signature);
    } catch (err) {
      console.log(err);
      setErrorMessageSign("Error during verification of ticket");

    }
  };

  const fetchTickets = async () => {
    console.log(account);

    var get_events = await eventFactory.methods.getDeployedEvents().call();
    setAllEvents(get_events);
    console.log("all events:", allEvents);

    var allTickets = [];
    for (let i = 0; i < get_events.length; i++) {
        
        const eventContract = await new web3js.eth.Contract(ABI.abi, get_events[i]._eventAddress);        
        const eventTickets = await eventContract.methods.getAllTicketsByUserAddress(account).call();
        const userEventTickets = eventTickets.filter(item => item._isActive == true);
        
        console.log(userEventTickets);

        if (userEventTickets) {
            allTickets = allTickets.concat(userEventTickets);
        }
    }
    setUserTickets(allTickets);
    console.log(allTickets);
  }

  const getTicketOwnerAddr = async (ticketID) => {

  }

  const onSubmitVerify = async (data) => {

    try {
      await window.ethereum.send("eth_requestAccounts");
  
      console.log("account: ", account);
      const signerAddr = await ethers.utils.verifyMessage(data.ticketIDVerify, errorMessageSign);
      console.log("mm");
      console.log(signerAddr);
      console.log(userAccount);
      //const event = allEvents[eventID - 1];
      console.log("event:", allEvents[eventID - 1]);
      const eventContract = await new web3js.eth.Contract(ABI.abi, allEvents[eventID - 1]._eventAddress);        

      const realOwnerAddr = await eventContract.methods.getTicketOwnerByID(data.ticketIDVerify).call();

      console.log("realOwnerAddr", realOwnerAddr);
      console.log("signerAddr", signerAddr);

      if (signerAddr.toLowerCase() === realOwnerAddr.toLowerCase()) {
        console.log("aa");
        setErrorMessageVerify("Successfully verified ticket");
      }
      else {
        setErrorMessageVerify("Error during verification of ticket");
      }
      

    } catch (err) {
      console.log(err);
      setErrorMessageVerify("Error during verification of ticket");

    }
  };

  useEffect(() => {
    fetchTickets();
  }, [account, setAllEvents, setUserTickets])

  return (
    <div className="imge">
      <div className="fullscreen row justify-content-center align-items-center">
        <div className="col-8 justify-content-start">
          <div className="card p-1 mb-0">
            <div className="card-body">
              <div className="text-center">
                <h2 className="mt-2 mb-3">
                  <b>SIGN TICKET ID</b>
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmitSign)}>
                <p className="errorMessage">{errorMessageSign}</p>
                <div className="mt-4 d-flex flex-column">
                  <input
                    {...register("ticketIDSign")}
                    className="btn-border input-style form-control"
                    placeholder="Enter Ticket Id"
                  >
                  </input>
                  <input
                    {...register("eventIDSign")}
                    className="btn-border input-style form-control"
                    placeholder="Enter Event Id"
                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.ticketID?.message}
                  </small>
                </div>
                <div className="mt-5 row text-center justify-content-center">
                  <button
                    type='submit'
                    className="col-6 btn btn-block btn-success"
                  >
                      SIGN
                  </button>
                </div>
              
              </form>

              <h2 className="mt-2 mb-3">
                  <b>VERIFY TICKET</b>
                </h2>
              <form onSubmit={handleSubmit(onSubmitVerify)}>
                <p className="errorMessage">{errorMessageVerify}</p>
                <div className="mt-4 d-flex flex-column">
                  <input
                    {...register("ticketIDVerify")}
                    className="btn-border input-style form-control"
                    placeholder="Enter Ticket Id"
                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.ticketID?.message}
                  </small>
                </div>

                {/* <div className="mt-4 d-flex flex-column">
                  <input
                    {...register("signature")}
                    className="btn-border input-style form-control"
                    placeholder="Enter Signature"
                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.ticketID?.message}
                  </small>
                </div> */}
               
                <div className="mt-5 row text-center justify-content-center">
                  <button
                    type='submit'
                    className="col-6 btn btn-block btn-success"
                  >
                      VERIFY
                  </button>
                </div>

                <div className="mt-5 row text-center justify-content-center">
                  <button
                    type='button'
                    className="btn col-4 btn-block btn-secondary"
                    onClick={() => {
                      navigate("/organizer-events");
                    }}
                  >
                      GO BACK
                  </button>
              </div>
              
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
