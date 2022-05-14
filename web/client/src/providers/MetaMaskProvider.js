import React, { createContext, useContext, useEffect, useState } from "react";

const metamaskContext = createContext();

const MetamaskProvider = ({ children }) => {
    const [account, setAccount] = useState("");

    const signIn = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
    };

    useEffect(() => {
        signIn();
    }, [])

    return (
        <metamaskContext.Provider value={account}>
            {typeof window.ethereum !== 'undefined' ? children : "No metamask on the page!"}
        </metamaskContext.Provider>
    );
};

const useMetamask = () => useContext(metamaskContext);

export { MetamaskProvider, useMetamask };