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
import approvalProgram from "!!raw-loader!../contracts/marketplace_approval.teal"
import clearProgram from "!!raw-loader!../contracts/marketplace_clear.teal"
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
