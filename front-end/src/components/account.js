import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { connect, disconnect } from "../features/blockchain"
import { ethers, utils } from "ethers"
import { Button, makeStyles } from "@material-ui/core"

import networks from "../networksMap.json"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const useStyles = makeStyles((theme) => ({

    container: {
        padding: theme.spacing(3),
        display: "flex",
        float: "right",


        gap: theme.spacing(1)
    },


}));

function Account() {

    const classes = useStyles()
    const dispatch = useDispatch()
    const data = useSelector((state) => state.blockchain.value)

    async function getAccount() {
        const id = setInterval(async () => {
            try {
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const chainId = await provider.getNetwork()
                const account = await signer.getAddress()
                const balance = await signer.getBalance()

                dispatch(connect(
                    { account: account, balance: utils.formatUnits(balance), network: networks[String(chainId.chainId)] }))
            } catch (err) {
                console.log(err)
            }
        }, 2000)
    }

    const isConnected = data.account !== ""

    const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;


    useEffect(() => {
        getAccount();
    }, []);
    return (

        <div className={classes.container}>
            {isConnected ? (
                <>
                    <Button variant='contained' color="primary" >
                        {parseFloat(data.balance).toFixed(4)}
                    </Button>
                    <Button variant='contained' color="primary">
                        {shortenAddress(data.account)}
                    </Button>
                </>
            ) : (


                <Button variant='contained' color="primary" onClick={() => { getAccount() }}>connect</Button>

            )}

        </div>
    )
}

export default Account
