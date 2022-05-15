module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gasPrice: 0x01,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.4",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  settings: {          // See the solidity docs for advice about optimization and evmVersion
    optimizer: {
      enabled: true,
      runs: 1
    }
  },
}