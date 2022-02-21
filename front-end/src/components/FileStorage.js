
import React, { useEffect, useState } from "react"
import { ethers, utils } from "ethers"
import { create } from "ipfs-http-client"
import { Buffer } from "buffer"
import { useDispatch, useSelector } from "react-redux"
import { connect } from "../features/blockchain"

import { Button, makeStyles, Input, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from "@material-ui/core"

import { Folder } from "@material-ui/icons"


import SmartContract from "../artifacts/contracts/FileStorage.json"
import contractsAddress from "../artifacts/deployments/map.json"
import networks from "../networksMap.json"


const ipfsClient = create("https://ipfs.infura.io:5001/api/v0")
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/"
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

// contract address on ganache network
const ads = contractsAddress["5777"]["FileStorage"][0]
// contract address on polygon mumbai test network
// const ads = contractsAddress["80001"]["FileStorage"][0]

const useStyles = makeStyles((theme) => ({
    Container: {
        padding: theme.spacing(4),
        display: "flex",
        textAlign: "center",
        gap: theme.spacing(1)
    },
    box: {
        position: "center",
        padding: theme.spacing(2),
        marginLeft: "20%"
    },
    uploadBtn: {
        position: "center",
        padding: theme.spacing(2),
    }
}))

function FileStorage() {

    const [selectedFile, setSelectedFile] = useState()
    const [isSelected, setisSelected] = useState(false)
    const [name, setName] = useState("")
    const [size, setSize] = useState()
    const [userFiles, setUserFiles] = useState([])

    const [loading, setLoading] = useState(false)

    const data = useSelector((state) => state.blockchain.value)
    const dispatch = useDispatch()

    const classes = useStyles()


    const updateBalance = async () => {
        const signer = provider.getSigner()
        const balance = await signer.getBalance()
        dispatch(
            connect(
                { ...data, balance: utils.formatUnits(balance) }
            )
        )
    }

    // read uploaded file using FileReader and buffer
    const getFile = (e) => {

        e.preventDefault()

        const reader = new window.FileReader();

        const file = e.target.files[0];

        if (file !== undefined) {
            reader.readAsArrayBuffer(file)

            reader.onloadend = () => {

                const buf = Buffer(reader.result, "base64")
                setSelectedFile(buf)
                setisSelected(true)

                setName(file.name)
                setSize(file.size)
            }
        }

    }

    // a function to convert file size to readable format ex: KB, MB...
    const niceBytes = (x) => {

        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0, n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l) {

            n = n / 1024;

        }
        return String(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }

    const upload = async () => {
        if (selectedFile !== undefined) {
            try {
                setLoading(true)

                const signer = await provider.getSigner()
                const storageContract = new ethers.Contract(ads, SmartContract.abi, signer);

                const addedFile = await ipfsClient.add(selectedFile)

                const ipfsHash = ipfsBaseUrl + addedFile.path

                const fee = await storageContract.getListingFee()

                const add_tx = await storageContract.uploadFile(name, size, ipfsHash, { value: fee })
                await add_tx.wait();

                setLoading(false)

                getUserFiles()

                setName("")
                setSize(null)
                setisSelected(false)
                setSelectedFile(null)
                updateBalance()
            }
            catch (err) {
                console.log(err)
                setLoading(false)
            }

        }
        else { return }
    }

    const getUserFiles = async () => {
        if (data.account !== "" && isGoodNet) {

            const signer = await provider.getSigner()
            const storageContract = new ethers.Contract(ads, SmartContract.abi, signer);

            const filesList = await storageContract.getUserFiles(data.account)

            setUserFiles(filesList)
        }
    }


    useEffect(() => {
        if (data.account !== "" && isGoodNet) {
            getUserFiles();
        }
    }, [userFiles, data.account, data.network]);


    // ganache network is used for testing purposes 

    const currentNetwork = networks["1337"]

    // switch to polygon mainnet/testnet for production

    // const currentNetwork = networks["80001"]

    const isGoodNet = data.network === currentNetwork

    const isConnected = data.account !== ""
    return (
        <>
            {isConnected ? (

                isGoodNet ? (
                    <>

                        <div >
                            <Input type="file" name="file" onChange={(e) => { getFile(e) }} />
                        </div>
                        <br />

                        {isSelected ? (
                            <div>
                                <p>file name: {name}</p>
                                <p>file size: {niceBytes(size)}</p>
                            </div>
                        ) : null}


                        <div className={classes.uploadBtn}>

                            <Button variant='contained' color="primary" onClick={() => { upload() }}>
                                {loading ? <CircularProgress size={26} color="#fff" /> : "upload"}
                            </Button>
                        </div>
                        {userFiles.length !== 0 ? (
                            <h1>You have {userFiles.length} files uploaded</h1>
                        ) : (
                            <h1>You didn't upload any file</h1>
                        )}
                        <div className={classes.box}>

                            <List>
                                {userFiles.map((fileData, i) => {

                                    const uploadDate = new Date(fileData.uploadDate.toNumber() * 1000).toLocaleString()
                                    return (
                                        <ListItem key={i}>
                                            <ListItemIcon>
                                                <Folder />
                                            </ListItemIcon>
                                            <a href={fileData.uri} style={{ textDecoration: 'none', color: "black" }}>
                                                <ListItemText
                                                    primary={fileData.name}
                                                    secondary={niceBytes(fileData.size) + "   ||   " + uploadDate}
                                                />
                                            </a>


                                        </ListItem>)
                                })}
                            </List>
                        </div>
                    </>
                ) : (

                    <p>You are on the wrong network switch to {currentNetwork} network</p>
                )

            ) : null
            }

        </>
    );


}





export default FileStorage
