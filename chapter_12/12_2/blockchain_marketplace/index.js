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
  const { chain } = request.body;
  console.log(`Syncing blocks ${JSON.stringify(chain)}`);
  marketplaceNode.blockchain = new Blockchain(
    chain,
    marketplaceNode.blockchain.pendingTransactions
  );
  reply.send({ message: "Blockchain synced", blockCount: chain.length });
});

await fastify.listen({ port: PORT });
PORT = fastify.server.address().port;
console.log(`Running on http://localhost:${PORT}`);

const initializeNode = () => {
  const URL = `http://localhost:${PORT}`;
  const initialPeers = ["http://localhost:3000"];
  const blockchain = new Blockchain(); // NEW BLOCKCHAIN INSTANCE
  marketplaceNode = new MarketplaceNode(URL, initialPeers, blockchain);
};

initializeNode();
