// import algorand software dev kit
import algosdk from "algosdk"
// import constants
import {
    algodClient,
    indexerClient,
    // marketPlaceNote,
    minRound,
    myAlgoConnect,
    numGlobalBytes,
    numGlobalInts,
    numLocalBytes,
    numLocalInts
} from "./constants"
// import our teal programs
import approvalProgram from "!!raw-loader!../contracts/marketplace_approval.teal";
import clearProgram from "!!raw-loader!../contracts/marketplace_clear.teal";
// import conversions
import { base64ToUTF8String, utf8ToBase64String } from "./conversions"

// constructor function to build a product
class Product {
    constructor(name, image, description, price, sold, appId, owner) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.price = price;
        this.sold = sold;
        this.appId = appId;
        this.owner = owner;
    }
}

// implement logic for building a product
// compiles sc in teal fmt to program
const compileProgram = async (programSource) => {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await algodClient.compile(programBytes).do();
    // algod API requires txn params as Uint8Array
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

// now we create a product, application creation txn
export const createProductAction = async (senderAddress, product) => {
    // log that the product is being added
    console.log("Adding product...")

    // here we use the algod client to get txn params
    let params = await algodClient.getTransactionParams().do();
    // sets the fee param to be the algorand min txn fee from the algosdk
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    // set flat fee to true
    params.flatFee = true;

    // compile programs
    const compiledApprovalProgram = await compileProgram(approvalProgram);
    const compiledClearProgram = await compileProgram(clearProgram);

    // creates a note to id txns 
    let note = new TextEncoder().encode(marketplaceNote);
    let name = new TextEncoder().encode(product.name);
    let image = new TextEncoder().encode(product.image);
    let description = new TextEncoder().encode(product.description);
    let price = new TextEncoder().encode(product.price);

    // passes in the above as a group of app args
    let appArgs = [name, image, description, price];

    // application create txn is built here
    let txn = algosdk.makeApplicationCallTxnFromObject({
        from: senderAddress,
        // txn params come from algod client
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: compiledApprovalProgram,
        clearProgram: compiledClearProgram,
        numLocalInts: numLocalInts,
        numLocalByteSlices: numLocalBytes,
        numGlobalInts: numGlobalInts,
        numGlobalByteSlices: numLocalBytes,
        note: note,
        appArgs: appArgs
    });

    // transaction id
    let txId = txn.txID().toString();

    // transaction is signed and submitted 
    let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("Signed transaction with txID: %s", txId);
    await algodClient.sendRawTransaction(signedTxn.blob).do();

    // returns confirmed txn object
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    // print transaction info
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // await transaction response and then pull out app id
    let transactionResponse = await algodClient.pendingTransactionInformation(tx.Id).do();
    let appId = transactionResponse['application-index'];
    console.log("Created new app-id: ", appId);
    // complete function by returnin the app id of the product created
    return appId
}

// function that purchases a product from the smart contract
export const buyProductAction = async (senderAddress, product, count) => {
    // print statement tells user that product is being purchased
    console.log("Buying product...");

    // get txn params from algosdk
    let params = await algodClient.getTransactionParams().do();
    // set fee param equal to the algorand min txn fee
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    // set flat fee param equal to true
    params.flatFee = true;

    // get the buy argument and encode it
    let buyArg = new TextEncoder().encode("buy");
    // get the count and encode as uint 64
    let countArg = algosdk.encodeUint64(count);
    // create an array of app args
    let appArgs = [buyArg, countArg];

    // building the application call transaction
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        // product is purchased by txn sender
        from: senderAddress,
        

    })

}