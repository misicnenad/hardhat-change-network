/** @author misicnenad */

import { extendEnvironment } from "hardhat/config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import { lazyFunction } from "hardhat/plugins";
import type { EthereumProvider } from "hardhat/types/provider";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";
import Web3 from "web3";

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  const providers: { [name: string]: EthereumProvider } = {
    [hre.network.name]: hre.network.provider,
  };

  async function getProvider(name: string): Promise<EthereumProvider> {
    if (!providers[name]) {
      providers[name] = await createProvider(hre.config, name, hre.artifacts);
    }
    return providers[name];
  }

  hre.changeNetwork = lazyFunction(() => async (networkName: string) => {
    // check if network config is set
    if (!hre.config.networks[networkName]) {
      throw new Error(`changeNetwork: Couldn't find network '${networkName}'`);
    }

    const toProvider = await getProvider(networkName);

    // update hardhat's network data
    hre.network.name = networkName;
    hre.network.config = hre.config.networks[networkName];
    hre.network.provider = toProvider;

    // update underlying library's provider data
    if (hre.ethers) {
      hre.ethers.provider = new HardhatEthersProvider(toProvider, networkName);
    }
    if (hre.web3) {
      hre.web3 = new Web3(toProvider);
    }
  });
});
