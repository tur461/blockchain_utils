import { ethers } from "ethers";
import { ADDR, END, METH } from "../constants/gsafe";
import { get_signer_n_provider } from "../utils/gsafe";
const GNOSIS_SAFE_ABI = require('../abi/GnosisSafe.json');
const GNOSIS_SAFE_L2_ABI = require('../abi/GnosisSafeL2.json');

async function sendTx(meth, d, end) {
    const sp = get_signer_n_provider(end);
    const ct = new ethers.Contract(
        ADDR.GNOSIS_SAFE, 
        GNOSIS_SAFE_ABI,
        // also passing provider to connect to 
        // local blockchain, which otherwise connects
        // to inbuilt provider which i don't know what it's!
        // i will put signer instead of provider
        // so sending signed transactions should also work
        sp.signer,
    );
    console.log('ct:', ct);
    let c = await ct.nonce();
    console.log('sending:', c.toString());
    const splitsEth = ethers.utils.splitSignature(d.sign);
    console.log('\nSplits:\n', splitsEth);
    
    const data = [
        d.td.to,
        d.td.value,
        d.td.data,
        d.td.operation,
        d.td.safeTxGas,
        d.td.baseGas,
        d.td.gasPrice,
        d.td.gasToken,
        d.td.refundReceiver,
        d.sign
    ]

    const txDataEncoded = await ct[METH.EN_TX_DATA](...data.slice(0, 9), d.td.nonce);
    console.log('txDataEncoded', txDataEncoded, await ethers.utils.keccak256(txDataEncoded));
    
    const txHash = await ct[METH.GET_TX_HASH](...data.slice(0, 9), d.td.nonce);
    console.log('txHash', txHash)
    // const gasLimit = await ct.estimateGas[meth](...data);
    // console.log('gas estimate:', gasLimit.toString());
    return ct[meth](...data, { gasLimit: 100000 });
}

export {
    sendTx,
}