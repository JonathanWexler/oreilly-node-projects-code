import Block from "./block.js";
import { createHash } from "crypto";

class Blockchain {
  constructor(chain, pendingTransactions = []) {
    this.chain = chain || [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = pendingTransactions;
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block([], null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async mineBlock() {
    const targetPrefix = "0".repeat(this.difficulty);
    let nonce = 0;
    let hash = "";

    while (hash.substring(0, this.difficulty) !== targetPrefix) {
      nonce++;
      hash = createHash("sha256")
        .update(JSON.stringify(this.chain) + nonce)
        .digest("hex");
    }

    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(this.pendingTransactions, previousBlock.hash);
    previousBlock.nextHash = newBlock.hash;
    this.chain.push(newBlock);
    this.pendingTransactions = [];
  }
}

export default Blockchain;
