import { assert } from "chai";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", () => {
  describe("Hardhat Runtime Environment extension", () => {
    useEnvironment("hardhat-project");

    it("Should add the function", function () {
      assert.instanceOf(this.hre.changeNetwork, Function);
    });
  });
});
