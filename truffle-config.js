require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = process.env.MNEMONIC;
const ID = process.env.IDMATICVIGI;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    contracts_directory: "./contracts/",
    contracts_build_directory: "./abis/",
    matic: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rpc-mumbai.maticvigil.com/v1/${ID}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 100000,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.1",
    },
  },
};
