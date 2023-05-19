import "../styles/index.css";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JSZip from "jszip";
import throttle from "lodash.throttle";
import { File } from "web3.storage";
import { ethers, utils } from "ethers";
import { connect } from "../features/blockchain";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Folder } from "@mui/icons-material";
import {
  StoreContent,
  StoreManyFiles,
  IPFS_GATEWAY,
} from "../utils/StoreContent";
import SmartContract from "../artifacts/contracts/FileStorage.json";
import contractsAddress from "../artifacts/deployments/map.json";
import networks from "../utils/networksMap.json";

// contract address on ganache network
const ads = contractsAddress["5777"]["FileStorage"][0];
// contract address on polygon mumbai test network
// const ads = contractsAddress["80001"]["FileStorage"][0]

function FileStorage() {
  const data = useSelector((state) => state.blockchain.value);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    name: "",
    content: null,
    isFolder: false,
  });
  const [userFiles, setUserFiles] = useState([]);

  const updateBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    dispatch(connect({ ...data, balance: utils.formatUnits(balance) }));
  };

  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(-1);
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const onZipUpdate = (metadata) => {
    setProgress(metadata.percent);
    console.log("progression: " + metadata.percent.toFixed(2) + " %");
    if (metadata.currentFile) {
      console.log("current file = " + metadata.currentFile);
    }
  };
  const throttledZipUpdate = throttle(onZipUpdate, 50);

  const handleFolderSelect = () => {
    folderInputRef.current.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFolderChange = () => {
    const fileList = Array.from(folderInputRef.current.files);
    setFiles(fileList);
  };

  const handleFileChange = () => {
    const fileList = Array.from(fileInputRef.current.files);
    setFiles(fileList);
  };

  const calculateTotalSize = () => {
    let total = 0;
    files.forEach((file) => {
      total += file.size;
    });
    setTotalSize(total);
  };

  const formatFileSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateZip = () => {
    if (files.length === 1 && !files[0].webkitRelativePath) {
      // Skip zipping if only a single file is uploaded
      const file = files[0];
      setUploadedFiles({
        ...uploadedFiles,
        name: file.name,
        content: file,
        isFolder: false,
      });
      return;
    }

    let _folderName;
    if (files[0].webkitRelativePath) {
      // Folder
      _folderName = files[0].webkitRelativePath.split("/")[0];
    } else {
      // Standalone file
      _folderName = "";
    }

    const zip = new JSZip();

    const handleFile = (file) => {
      if (file.webkitRelativePath) {
        // Folder
        zip.file(file.webkitRelativePath, file);
      } else {
        // Standalone file
        zip.file(file.name, file);
      }
    };

    files.forEach(handleFile);

    zip
      .generateAsync({ type: "blob" }, throttledZipUpdate)
      .then(function (content) {
        const zipName = _folderName ? `${_folderName}.zip` : "files.zip";
        setUploadedFiles({
          ...uploadedFiles,
          name: zipName,
          content: content,
          isFolder: true,
        });
        console.log("Zip generated and ready:", zipName, content);
      })
      .catch((e) => console.log(e));
  };

  const upload = async () => {
    if (uploadedFiles.content !== undefined) {
      try {
        setLoading(true);

        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const storageContract = new ethers.Contract(
          ads,
          SmartContract.abi,
          signer
        );

        let cid;
        let filename;
        if (uploadedFiles.isFolder) {
          // Case 1 : upload zip folder

          // cid = await StoreContent(
          //   new File([uploadedFiles.content], uploadedFiles.name)
          // );
          // filename = uploadedFiles.name.slice(0, uploadedFiles.name.length - 4);

          // Case 2 : upload html website
          filename = files[0].name;
          cid = await StoreManyFiles(files);
        } else {
          filename = uploadedFiles.name;
          cid = await StoreContent(uploadedFiles.content);
        }
        const ipfsHash = `ipfs://${cid}/${filename}`;

        const fee = await storageContract.getListingFee();
        const add_tx = await storageContract.uploadFile(
          filename,
          totalSize,
          ipfsHash,
          {
            value: fee,
          }
        );
        await add_tx.wait();

        setLoading(false);
        setFiles([]);
        setUploadedFiles({
          name: "",
          content: null,
          isFolder: false,
        });
        setTotalSize(null);

        getUserFiles();
        updateBalance();
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  const getUserFiles = async () => {
    if (data.account !== "" && isGoodNet) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const storageContract = new ethers.Contract(
        ads,
        SmartContract.abi,
        signer
      );

      const filesList = await storageContract.getUserFiles(data.account);
      setUserFiles(filesList);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      calculateTotalSize();
      generateZip();
    }
  }, [files]);

  useEffect(() => {
    if (window.ethereum !== undefined) {
      getUserFiles();
    }
  }, [userFiles, data.account, data.network]);

  // ganache network is used for testing purposes
  const currentNetwork = networks["1337"];

  // switch to polygon mainnet/testnet for production
  // const currentNetwork = networks["80001"]

  const isGoodNet = data.network === currentNetwork;
  const isConnected = data.account !== "";
  return (
    <>
      {isConnected ? (
        isGoodNet ? (
          <>
            <div>
              <div className="button-row">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFolderSelect}
                >
                  Select Folder
                </Button>
                <span className="or">or</span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFileSelect}
                >
                  Select File(s)
                </Button>
                <input
                  ref={folderInputRef}
                  type="file"
                  directory=""
                  webkitdirectory=""
                  style={{ display: "none" }}
                  onChange={handleFolderChange}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              {files.length > 0 && (
                <div>
                  <h3>Selected Files</h3>
                  {files.length > 1 && (
                    <>
                      <progress max={100} value={progress}>
                        {progress?.toFixed(2)}%{" "}
                      </progress>
                    </>
                  )}
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="file-name">File Name</th>
                          <th className="file-size">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((file, index) => (
                          <tr key={index}>
                            <td className="file-name">
                              {file.webkitRelativePath || file.name}
                            </td>
                            <td className="file-size">
                              {formatFileSize(file.size)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="total-size">
                    Total Size: {formatFileSize(totalSize)}
                  </div>
                </div>
              )}
            </div>
            <br />

            <div style={{ paddingBottom: "30px" }}>
              <Button
                variant="contained"
                color="success"
                disabled={files.length == 0}
                onClick={() => {
                  upload();
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "upload"
                )}
              </Button>
            </div>
            {userFiles.length !== 0 ? (
              <h1>You have {userFiles.length} files uploaded</h1>
            ) : (
              <h1>You didn't upload any file</h1>
            )}
            <div className="files-list">
              <List>
                {userFiles.map((fileData, i) => {
                  const uploadDate = new Date(
                    fileData.uploadDate.toNumber() * 1000
                  ).toLocaleString();
                  const uri = fileData.uri.replace("ipfs://", IPFS_GATEWAY);
                  return (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <Folder />
                      </ListItemIcon>
                      <a
                        href={uri}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItemText
                          primary={fileData.name}
                          secondary={
                            formatFileSize(fileData.size) +
                            "   ||   " +
                            uploadDate
                          }
                        />
                      </a>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </>
        ) : (
          <p>You are on the wrong network switch to {currentNetwork} network</p>
        )
      ) : null}
    </>
  );
}

export default FileStorage;
