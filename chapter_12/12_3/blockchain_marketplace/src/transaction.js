import { randomUUID } from "crypto";

class Transaction {
  constructor({
    id,
    price,
    songTitle,
    expiration,
    recipient,
    sender,
    transactionType,
  }) {
    this.id = id || randomUUID();
    this.price = price;
    this.songTitle = songTitle;
    this.expiration = expiration;
    this.recipient = recipient;
    this.sender = sender;
    this.type = transactionType;
  }
}

export default Transaction;
