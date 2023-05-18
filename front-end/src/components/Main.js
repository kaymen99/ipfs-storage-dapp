import "../styles/index.css";
import React from "react";
import { useSelector } from "react-redux";
import Account from "./Account";
import FileStorage from "./FileStorage";

function Main() {
  const data = useSelector((state) => state.blockchain.value);
  const isConnected = data.account !== "";

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="title">DStore</h1>
          <div className="note">
            {isConnected ? (
              <p>
                Note: You are currently connected to the{" "}
                {data.network ? data.network : "unknown"} network
              </p>
            ) : (
              <p>Please connect your wallet</p>
            )}
          </div>
          <Account />
        </div>
      </nav>

      <h1>IPFS Storage Dapp</h1>
      <br />
      <div>
        {isConnected ? (
          <>
            <FileStorage />
          </>
        ) : null}
      </div>
    </>
  );
}

export default Main;
