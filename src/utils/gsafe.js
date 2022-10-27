import { ethers } from 'ethers';
import { ADDR, END, URL } from '../constants/gsafe';

function get_dummy_data() {
    return {
        value: 0,
        nonce: 0,
        baseGas: 0,
        gasPrice: 0,
        operation: 0,
        safeTxGas: 0,
        to: ADDR.SAFE_OWNER,
        data: '0x',
        gasToken: ADDR.ZERO,
        refundReceiver: ADDR.SAFE_OWNER,
    }
}

function get_signer_n_provider(end) {
    let p = null, s = null;
    if(end === END.FRONT) {
        const web3Provider = window.ethereum;
        p = new ethers.providers.Web3Provider(web3Provider)
        s = p.getSigner(0);
    } else {
        const urlInfo = {
            url: URL.PROVIDER,
            allowInsecure: !0,
        }
        p = new ethers.providers.JsonRpcProvider(urlInfo);
        s = p.getSigner(0);
    }
    return {
        signer: s,
        provider: p
    };
}

export {
    get_dummy_data,
    get_signer_n_provider,
}