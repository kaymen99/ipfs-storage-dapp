import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { connect, disconnect } from "../features/blockchain"
import { ethers, utils } from "ethers"
import { Button, makeStyles } from "@material-ui/core"
import Web3Modal from "web3modal"

import networks from "../networksMap.json"


const eth = window.ethereum
const web3Modal = new Web3Modal()

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

    const [injectedProvider, setInjectedProvider] = useState();

    async function fetchAccountData() {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)

        setInjectedProvider(provider);

        const signer = await provider.getSigner()
        const chainId = await provider.getNetwork()
        const account = await signer.getAddress()
        const balance = await signer.getBalance()

        dispatch(connect(
            {
                account: account,
                balance: utils.formatUnits(balance),
                network: networks[String(chainId.chainId)]
            }
        ))
    }

    async function Disconnect() {
        web3Modal.clearCachedProvider();
        if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
            await injectedProvider.provider.disconnect();
            setInjectedProvider(null)
        }

        dispatch(disconnect())
        setTimeout(() => {
            window.location.reload();
        }, 1);
    }

    useEffect(() => {
        if (eth) {
            eth.on('chainChanged', (chainId) => {
                fetchAccountData()
            })
            eth.on('accountsChanged', (accounts) => {
                fetchAccountData()
            })
        }
    }, [])

    const isConnected = data.account !== ""

    const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

    return (

        <div className={classes.container}>
            {isConnected ? (
                <>
                    <Button variant='contained' color="primary" >
                        {parseFloat(data.balance).toFixed(4)}
                    </Button>
                    <Button variant='contained' color="primary" onClick={() => { Disconnect() }} >
                        {shortenAddress(data.account)}
                    </Button>
                </>
            ) : (


                <Button variant='contained' color="primary" onClick={() => { fetchAccountData() }}>connect</Button>

            )}

        </div>
    )
}

export default Account


