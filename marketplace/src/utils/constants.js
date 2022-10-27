// here we define config for connection to algo network

// import algosdk we need to connect with blockchain
import algosdk from "algosdk";
// import wallet library
import MyAlgoConnect from "@randlabs/myalgo-connect";

// set the configuration for connection to test net
const config = {
    algodToken: "",
    algodServer: "https://node.testnet.algoexplorerapi.io",
    algodPort: "",
    indexerToken: "",
    indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
    indexerPort: "",
}