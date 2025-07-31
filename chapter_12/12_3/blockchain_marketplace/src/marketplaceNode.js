import axios from "axios";
import Transaction from "./transaction.js";

class MarketplaceNode {
  constructor(url, peers = [], blockchain) {
    this.url = url;
    this.peers = peers;
    this.blockchain = blockchain;
    this.balance = 50000;
    this.songs = {};
    this.broadcastSelf();
  }

  async broadcast(path, data) {
    await Promise.all(
      this.peers.map(async (peer) => {
        if (peer === this.url) return;
        try {
          await axios.post(`${peer}/${path}`, data);
        } catch (error) {
          console.error(error.message);
        }
      })
    );
  }

  async broadcastSelf() {
    this.broadcast("register-node", { url: this.url });
  }

  async registerNode(newNodeUrl) {
    this.peers.push(newNodeUrl);
    await this.broadcast("sync-peers", { peers: this.peers });
    await this.broadcastBlockchain();
  }

  async broadcastBlockchain() {
    this.broadcast("sync-blockchain", {
      chain: this.blockchain.chain,
      songs: this.songs,
    });
  }

  availableSongs() {
    return Object.values(this.songs)
      .filter((transaction) => transaction.type === "SELL")
      .map(({ id, songTitle, price }) => [id, songTitle, price]);
  }

  async mine() {
    const price = this.blockchain.miningReward;
    const reward = new Transaction({
      sender: this.peers[0],
      recipient: this.url,
      price,
      transactionType: "MINE",
    });

    this.blockchain.pendingTransactions.push(reward);
    await this.blockchain.mineBlock();
    this.balance += price;
    return "Mining complete";
  }

  async processTransaction(transactionHash) {
    const transaction = new Transaction(transactionHash);
    const id = transactionHash.id || transaction.id;

    if (transaction.type === "BUY") {
      if (this.balance < transaction.price) return "Insufficient balance";
      this.balance -= transaction.price;
      try {
        await axios.post(`${transaction.sender}/payment`, {
          price: transaction.price,
        });
      } catch (e) {
        console.log(e.message);
      }
      console.log({ bal: this.balance });
    }

    this.songs[id] = transaction;
    this.blockchain.pendingTransactions.push(transaction);

    if (this.blockchain.pendingTransactions.length > 4) {
      console.log(await this.mine());
    }

    await this.broadcastBlockchain();
    return "Processed transaction";
  }
}

export default MarketplaceNode;
