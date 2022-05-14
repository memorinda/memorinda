
import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from 'web3';

import ABI from '../abis/EventFactory.json';

const contractContext = createContext();

function ContractProvider({ children }) {

    const secureTicketAddress = ABI.networks["5777"].address;

    const [contract, setContract] = useState(null);
    const [web3js, setWeb3js] = useState(null);

    useEffect(() => {
        if (typeof window.web3 !== 'undefined') {

            const web3js = new Web3(window.web3.currentProvider);
            setWeb3js(web3js);
            setContract(new web3js.eth.Contract(ABI.abi, secureTicketAddress));
        }
    }, []);

    return <contractContext.Provider value={{contract, web3js}}>{contract !== null && children}</contractContext.Provider>;
}

const useContract = () => useContext(contractContext);

export { ContractProvider, useContract };