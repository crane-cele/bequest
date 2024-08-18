import express = require("express");
import cors = require("cors");
import { Blockchain, Block } from "./blockchain";

const PORT = process.env.PORT || 8080;
const app = express();
let database = { data: "Hello World" };

let blockchain = new Blockchain();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ data: database.data });
});

app.post("/", (req, res) => {
  const newBlock = new Block(
    blockchain.chain.length,
    new Date().toISOString(),
    req.body.data,
    blockchain.getLatestBlock().hash
  );

  blockchain.addBlock(newBlock);
  database.data = req.body.data;
  res.sendStatus(200);
});

app.get("/verify", (req, res) => {
  const isValid = blockchain.isChainValid();
  res.json({ isValid });
});

app.post("/restore", (req, res) => {
  blockchain = new Blockchain();
  database.data = blockchain.chain[0].data;
  res.json({ data: database.data });
});

app.post("/tamper", (req, res) => {
  const chainLength = blockchain.chain.length;
  if (chainLength > 1) {
    blockchain.chain[chainLength - 1].data = "Tampered Data";
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
