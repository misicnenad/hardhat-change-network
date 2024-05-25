// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
	networks: {
		mainnet: {
			url: "envConfigProd.MAINNET_RPC_URL",
			accounts: [],
		},
		sepolia: {
			url: "envConfigDev.SEPOLIA_RPC_URL",
			accounts: [],
		},
		polygonAmoy: {
			url: "envConfigDev.AMOY_RPC_URL",
			accounts: [],
		},
		polygon: {
			url: "envConfigProd.POLYGON_RPC_URL",
			accounts: [],
		},
		hardhat: {
			accounts: [],
		},
	},
};

export default config;
