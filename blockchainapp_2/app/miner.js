const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // Include a reward for the miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    // Create a block consisting of the valid transactions
    const block = this.blockchain.addBlock(validTransactions);

    // Synchronize chains in the pper-to-peer server
    this.p2pServer.syncChains();

    // Clear the transaction pool
    this.transactionPool.clear();

    // Broadcast to every miner to clear their transaction pools
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
