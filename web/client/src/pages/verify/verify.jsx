import { zodResolver } from "@hookform/resolvers/zod";
import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useContract } from '../../providers/ContractProvider';
import { useMetamask } from '../../providers/MetaMaskProvider';
import { useStore } from "../../store/store";
import "./verify.scss";

const verifySchema = z
  .object({
    ticketID: z.string().nonempty("Please enter ticket id"),
  });

function Verify() {

  const {contract: eventFactory, web3js} = useContract();
  const account = useMetamask();
  const [errorMessage, setErrorMessage] = useState("");


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(verifySchema),
    mode: "all",
  });

  const [, dispatch] = useStore();

  const onSubmit = async (data) => {

    try {
      await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(data.ticketID);
    const address = await signer.getAddress();

    console.log(signature, address);

      const signerAddr = await ethers.utils.verifyMessage(data.message, signature);
      if (signerAddr !== address) {
        setErrorMessage("Successfully verified ticket");
      }
      reset()

    } catch (err) {
      console.log(err);
      setErrorMessage("Error during verification of ticket");

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
                  <b>VERIFY TICKET ID</b>
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="errorMessage">{errorMessage}</p>
                <div className="mt-4 d-flex flex-column">
                  <input
                    {...register("ticketID")}
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
                      VERIFY
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
