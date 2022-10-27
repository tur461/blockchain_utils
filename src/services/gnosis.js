import { ethers } from 'ethers';
import {get_dummy_data, get_signer_n_provider} from '../utils/gsafe';
import {URL, ADDR, CHAIN_ID, END, METH} from '../constants/gsafe';
import { sendTx } from './contract';

// from GnosisSafe.sol
const EIP712_DOMAIN = 'EIP712Domain(uint256 chainId,address verifyingContract)';
const SAFE_TX = 'SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)';

// must be the key name of 
// message type in types sub-object of 
// typedData (see below)
const PRI_TYPE = 'SafeTx';

// from gnosis-safe-sdk
const EIP712_DOMAIN_TYPE = [
    { type: 'uint256', name: 'chainId' },
    { type: 'address', name: 'verifyingContract'}
]

const SAFE_TX_TYPE = [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' }
]

const get_types = _ => {
    return {
        // EIP712Domain is same as EIP712Domain in const EIP712_DOMAIN
        EIP712Domain: EIP712_DOMAIN_TYPE,
        // SafeTx is same as SafeTx in const SAFE_TX
        SafeTx: SAFE_TX_TYPE,
    }
}

const get_domain_type_values = _ => {
    return {
        // chain id of blockchain contract deployed on. 
        chainId:  CHAIN_ID.HARDHAT,
        // address of the contract verifying the signature.
        verifyingContract: ADDR.GNOSIS_SAFE,
    }
}

const get_primary_type_values = _ => {
    const d = get_dummy_data();
    return {
        to: d.to,
        value: d.value,
        data: d.data,
        operation: d.operation,
        safeTxGas: d.safeTxGas,
        baseGas: d.baseGas,
        gasPrice: d.gasPrice,
        gasToken: d.gasToken,
        refundReceiver: d.refundReceiver,
        nonce: d.nonce,
    }
}

const get_typed_data = _ => {
    return {
        types: get_types(),
        // the key-name from the types object above whose 
        // values are to be passed in the message below
        primaryType: PRI_TYPE,
        // object
        domain: get_domain_type_values(),
        // object
        message: get_primary_type_values(),
    }
}

// using in-browser wallet as provider
// with ethers js 
async function generate_sign_using_frontend(td) {
    const sp = get_signer_n_provider(END.FRONT);
    console.log('got provider and singer!', sp);
    // using _signTypedData()
    const signI = await sp.signer._signTypedData(
        td.domain,
        { [PRI_TYPE]: td.types[PRI_TYPE] },
        td.message
    );
    
    // using eth_signTypedData_v4
    
    const data = JSON.stringify(td);
    const from = ADDR.SAFE_OWNER;
    const params = [from, data];
    const method = "eth_signTypedData_v4";

    const signII = await sp.provider.send(method, params);

    console.log('signI:', signI, signI.slice(2).length/2);
    console.log('signII:', signII, signII.slice(2).length/2);
    return {
        I: signI,
        II: signII,
    }
}

async function generate_sign_using_backend(td) {
    const sp = get_signer_n_provider(END.BACK);
    console.log('got provider and singer!');
    const signI = await sp.signer._signTypedData(
        td.domain,
        { [PRI_TYPE]: td.types[PRI_TYPE] },
        td.message
    );
    // using eth_signTypedData_v4

    const data = JSON.stringify(td);
    const from = ADDR.SAFE_OWNER;
    const params = [from, data];
    const method = "eth_signTypedData_v4";
    // equivalent to web3.currentProvider.request({method, params, from})
    const signII = await sp.provider.send(method, params);

    console.log('signI:', signI, signI.slice(2).length/2);
    console.log('signII:', signII, signII.slice(2).length/2);
    return {
        I: signI,
        II: signII,
    }
}

function generate_signed_data(end) {
    const typedData = get_typed_data();
    // console.log('td:', typedData);

    return end === END.FRONT ? 
        generate_sign_using_frontend(typedData) :
        end === END.BACK ? 
        generate_sign_using_backend(typedData) : 
        'Invalid END type!';
}

async function send_to_gnosis_safe(sign) {
    if (sign.length === 0) return console.log('no sign passed!');
    const typedData = get_typed_data();

    const res = sendTx(METH.EXEC_TX, {
        sign,
        td: typedData.message,
        data: typedData,
    });
    return res;
}

export {
    send_to_gnosis_safe,
    generate_signed_data,
    generate_sign_using_backend,
    generate_sign_using_frontend,
}