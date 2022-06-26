import { ethers } from "ethers";
import QRCode from 'qrcode';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import {QrReader} from "react-qr-reader";
import { useNavigate } from 'react-router';
import ABI from '../../abis/Event.json';
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { useStore } from "../../store/store";
import "./verify.scss";



function Verify() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();
  const [signatureRes, setSignatureRes] = useState("");
  const [errorMessageSign, setErrorMessageSign] = useState("");
  const [errorMessageVerify, setErrorMessageVerify] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [eventID, setEventID] = useState("");
  const [ticketID, setTicketID] = useState("");
  const [qrImage, setQrImage] = useState("");
  // const [startReading, setStartReading] = useState(false);
  // const [scanResult, setScanResult] = useState("");


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
    setTicketID(data.ticketIDSign)
    setUserAccount(account);
    console.log("a");

    console.log(typeof(signature));
    console.log(signature);
    setSignatureRes(signature);
    } catch (err) {
      console.log(err);
      setErrorMessageSign("Error during verification of ticket");

    }
  };

  useEffect(() => {
    const jsonData = {
      signatureRes,
      ticketID
    }
    QRCode.toDataURL(JSON.stringify(jsonData))
    .then(setQrImage)
  },[signatureRes])

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
    // console.log(data);
    // setStartReading(true)

    try {
      await window.ethereum.send("eth_requestAccounts");
  
      console.log("account: ", account);
      const signerAddr = await ethers.utils.verifyMessage(ticketID, signatureRes);
      console.log("mm");
      console.log(signerAddr);
      console.log(userAccount);
      //const event = allEvents[eventID - 1];
      console.log("event:", allEvents[eventID - 1]);
      const eventContract = await new web3js.eth.Contract(ABI.abi, allEvents[eventID - 1]._eventAddress);        

      const realOwnerAddr = await eventContract.methods.getTicketOwnerByID(ticketID).call();

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

  // const handleScanWebCam = (result) => {
  //   if (result) {
  //     console.log("Scan result: ",result);
  //     setScanResult(result);
  //   }
    
  // };

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
                    className="btn-border input-style form-control mb-2"
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
                    className="col-6 btn btn-block btn-primary"
                  >
                      SIGN
                  </button>
                </div>
              
              </form>
              <div className="text-center mt-5">
                <h2 className="mt-2 mb-3">
                    <b>VERIFY TICKET</b>
                  </h2>
                </div>
              <div className='row'>
                <p className="errorMessage">{errorMessageVerify}</p>
                <div className='text-center'>
                    {signatureRes !== "" ? <img  src={qrImage} alt="qrImage"/> : <p>Please Sign to create QR code</p>}
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
                    onClick={() => onSubmitVerify(qrImage)}
                  >
                      VERIFY
                  </button>
                </div>

                    
                {/* {startReading &&
                  <div className="mt-5 row text-center justify-content-center">
                <h1>Scanning</h1>
                  <QrReader
                    delay={300}
                    style={{ width: "100%" }}
                    // onError={handleErrorWebCam}
                    onScan={handleScanWebCam}
                  />
                  <h3>Scanned Result</h3>
                  {scanResult}
                </div>
                } */}

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
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
