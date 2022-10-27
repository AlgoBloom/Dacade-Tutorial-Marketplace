// here we define config for connection to algo network

// import algosdk we need to connect with blockchain
import algosdk from "algosdk"
// import wallet library
import MyAlgoConnect from "@randlabs/myalgo-connect"

// set the configuration for connection to test net
const config = {
    algodToken: "",
    algodServer: "https://node.testnet.algoexplorerapi.io",
    algodPort: "",
    indexerToken: "",
    indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
    indexerPort: "",
}

// create new algod client
export const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort)
// create indexer client
export const indexerClient = new algosdk.Indexer(config.indexerToken, config.indexerServer, config.indexerPort)
// create wallet connection
export const MyAlgoConnect = new MyAlgoConnect()

// used to limit search of txn up to this round
export const minRound = 21540981

// arc standard for naming
// export const marketPlaceNote = "marketplace:uv1"

// max local storange allocation, immutable
export const numLocalInts = 0
export const numLocalBytes = 0

// max global storage allocation, immutable
export const numGlobalInts = 2 // count and sold
export const numGlobalBytes = 3 // name and desc