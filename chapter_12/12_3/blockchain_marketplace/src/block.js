import { createHash } from "crypto";

class Block {
  constructor(transactions, previousHash) {
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nextHash = null;
  }

  calculateHash() {
    return createHash("sha256")
      .update(
        this.previousHash + this.timestamp + JSON.stringify(this.transactions)
      )
      .digest("hex");
  }
}

export default Block;
