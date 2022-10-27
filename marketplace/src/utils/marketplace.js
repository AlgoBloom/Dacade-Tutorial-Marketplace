import algosdk from "algosdk"

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

import approvalProgram from "!!raw-loader!../contracts/marketplace_approval.teal"
import clearProgram from "!!raw-loader!../contracts/marketplace_clear.teal"
import { base64ToUTF8String, utf8ToBase64String } from "./conversions"


