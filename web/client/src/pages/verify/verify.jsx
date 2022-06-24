import { zodResolver } from "@hookform/resolvers/zod";
import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router';
import { z } from "zod";
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { useStore } from "../../store/store";
import "./verify.scss";



function Verify() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();
  const [errorMessageSign, setErrorMessageSign] = useState("");
  const [errorMessageVerify, setErrorMessageVerify] = useState("");
  const [userAccount, setUserAccount] = useState("");


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

    try {
      console.log("b");

      await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(data.ticketIDSign);
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

  const onSubmitVerify = async (data) => {

    try {
      await window.ethereum.send("eth_requestAccounts");
  
    console.log("account: ", account);
      const signerAddr = await ethers.utils.verifyMessage(data.ticketIDVerify, errorMessageSign);
      console.log("mm");
      console.log(signerAddr);
      console.log(userAccount);
      if (signerAddr.toLowerCase() === userAccount.toLowerCase()) {
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
