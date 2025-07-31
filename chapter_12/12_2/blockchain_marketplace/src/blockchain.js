import Block from "./block.js";

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
}

export default Blockchain;
