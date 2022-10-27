
const URL = {
    PROVIDER: 'http://localhost:8448/',
}

const ADDR = {
    ZERO: '0x' + '0'.repeat(40),
    SAFE_OWNER: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    // GNOSIS_SAFE: '0x' + '0'.repeat(40),
    GNOSIS_SAFE: '0x51b5A48dc420877336e7541e0b62a974C8438ea4',
}

const CHAIN_ID = {
    ETHEREUM: 1,
    HARDHAT: 31337,
    MUM_POLY: 8001,
}

const END = {
    BACK: 0,
    FRONT: 1,
}

const METH = {
    EXEC_TX: 'execTransaction',
    EN_TX_DATA: 'encodeTransactionData',
    GET_TX_HASH: 'getTransactionHash',
}

export {
    URL,
    END,
    METH,
    ADDR,
    CHAIN_ID,
}