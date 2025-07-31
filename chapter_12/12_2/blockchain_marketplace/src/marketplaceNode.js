import axios from "axios";

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
    await this.broadcastBlockchain(); // NEW LINE HERE
  }

  async broadcastBlockchain() {
    this.broadcast("sync-blockchain", { chain: this.blockchain.chain });
  }
}

export default MarketplaceNode;
