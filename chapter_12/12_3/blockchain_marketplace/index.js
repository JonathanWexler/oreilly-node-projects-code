import Fastify from "fastify";
import MarketplaceNode from "./src/marketplaceNode.js";
import Blockchain from "./src/blockchain.js";

const fastify = Fastify();
let [PORT] = process.argv.slice(2);
PORT = PORT || 0;

let marketplaceNode;

fastify.get("/", async (request, reply) => {
  reply.send({ message: "Marketplace running" });
});

fastify.post("/register-node", async (request, reply) => {
  const { url: newNodeUrl } = request.body;
  await marketplaceNode.registerNode(newNodeUrl);
  reply.send({ message: "Node Registered" });
});

fastify.post("/sync-peers", async (request, reply) => {
  const { peers } = request.body;
  marketplaceNode.peers = peers;
  console.log(`${marketplaceNode.url} synced ${marketplaceNode.peers}`);
  reply.send({ message: "Synced Peers" });
});

fastify.post("/sync-blockchain", async (request, reply) => {
  const { chain, songs } = request.body;
  console.log(`Syncing blocks ${JSON.stringify(chain)}`);
  marketplaceNode.blockchain = new Blockchain(
    chain,
    marketplaceNode.blockchain.pendingTransactions
  );
  marketplaceNode.songs = { ...marketplaceNode.songs, ...songs };
  reply.send({ message: "Blockchain synced", blockCount: chain.length });
});

fastify.post("/payment", async (request, reply) => {
  const { price } = request.body;
  marketplaceNode.balance += price;
  reply.send({ message: `New balance ${marketplaceNode.balance}` });
});

fastify.post("/sell", async (request, reply) => {
  const { price, songTitle } = request.body;
  await marketplaceNode.processTransaction({
    price,
    songTitle,
    sender: marketplaceNode.url,
    transactionType: "SELL",
  });
  reply.send({ message: "Song being listed" });
});

fastify.post("/buy", async (request, reply) => {
  const { id } = request.body;
  const transaction = marketplaceNode.songs[id];
  if (!transaction) {
    return reply.send({ message: "No song exists by that id" });
  }

  const result = await marketplaceNode.processTransaction({
    id: transaction.id,
    price: transaction.price,
    songTitle: transaction.songTitle,
    expiration: transaction.expiration,
    recipient: transaction.sender,
    sender: marketplaceNode.url,
    transactionType: "BUY",
  });

  reply.send({ message: result });
});

fastify.get("/songs", async (_request, reply) => {
  reply.send({ songs: marketplaceNode.availableSongs() });
});

await fastify.listen({ port: PORT });
PORT = fastify.server.address().port;
console.log(`Running on http://localhost:${PORT}`);

const initializeNode = () => {
  const URL = `http://localhost:${PORT}`;
  const initialPeers = ["http://localhost:3000"];
  const blockchain = new Blockchain();
  marketplaceNode = new MarketplaceNode(URL, initialPeers, blockchain);
};

initializeNode();
