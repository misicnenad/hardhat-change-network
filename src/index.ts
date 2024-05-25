/**
 * @author misicnenad
 * @copyright
 * @license MIT
 */

import { extendEnvironment } from "hardhat/config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import { lazyFunction } from "hardhat/plugins";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import type { EthereumProvider } from "hardhat/types";
import "./type-extensions";

extendEnvironment((hre) => {
  // Cache HRE providers
  const providers: { [name: string]: EthereumProvider } = {
    [hre.network.name]: hre.network.provider,
  };

  async function getProvider(networkName: string): Promise<EthereumProvider> {
    // check if network config is even set
    if (!hre.config.networks[networkName]) {
      throw new Error(`changeNetwork: Couldn't find network '${networkName}'`);
    }

    if (!providers[networkName]) {
      providers[networkName] = createProvider(
        networkName,
        hre.config.networks[networkName],
        undefined,
        hre.artifacts
      );
    }
    return providers[networkName];
  }

  // use lazyFunction to avoid initializing things until they are actually needed
  hre.changeNetwork = lazyFunction(() => async (networkName) => {
    const toProvider = await getProvider(networkName);

    // update hardhat's network data
    hre.network.name = networkName;
    hre.network.config = hre.config.networks[networkName];
    hre.network.provider = toProvider;

    // update underlying library's provider data
    if ("ethers" in hre) {
      const { HardhatEthersProvider } = await import(
        // @ts-ignore
        "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider"
      );
      // @ts-ignore
      hre.ethers.provider = new HardhatEthersProvider(toProvider, networkName);
    }
    if ("web3" in hre) {
      // @ts-ignore
      const Web3 = await import("web3");
      hre.web3 = new Web3(toProvider);
    }
  });
});
