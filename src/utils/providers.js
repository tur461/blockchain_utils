import {ethers} from 'ethers';
import {URL} from '../constants/gsafe';

let defaultProvider = ethers.getDefaultProvider('ropsten');

// ... OR ...

let etherscanProvider = new ethers.providers.EtherscanProvider('ropsten');

// ... OR ...

let infuraProvider = new ethers.providers.InfuraProvider('ropsten');

// const web3Provider = window.ethereum;
    // const provider = new ethers.providers.Web3Provider(web3Provider)


const urlInfo = {
    url: URL.PROVIDER,
    allowInsecure: !0,
}
const provider = new ethers.providers.JsonRpcProvider(urlInfo);

export {
    defaultProvider,
    etherscanProvider,
    infuraProvider,
}