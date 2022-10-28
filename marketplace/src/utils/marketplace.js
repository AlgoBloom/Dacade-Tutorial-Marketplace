// import algorand software dev kit
import algosdk from "algosdk"
// import constants
import {
    algodClient,
    indexerClient,
    // marketPlaceNote,
    minRound,
    MyAlgoConnect,
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
}