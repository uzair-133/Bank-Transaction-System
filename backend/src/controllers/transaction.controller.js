const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose")
/**
 * Create a new transaction
 * The 10 steps transfer flow:
    * 1.Validate request
    * 2. Validate impotent key 
    * 3. Check  accounts status 
    * 4.Derive sender balance from ledger
    * 5. create transaction document with pending status
    * 6.create debit ledger entry 
    * 7.create credit ledger entry
    * 8. update transaction status to completed
    * 9.commit mongodb session
    * 10. send email notification to sender and receiver  
 */



async function createTransaction(req, res) {

/**
 * Validate request
 */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "fromAccount, toAccount, amount and idempotencyKey are required" })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: "fromAccount or toAccount not found" })
    }


    /**
     * 2- Validate idempotent key 
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                meassage: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(202).json({
                message: "transaction is still processing"
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                meassage: "transaction failed previously, please try again"
            })
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                meassage: "transaction was reversed, please try again"
            })
        }
    }

    /**
     * 3. check account status
     */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be active to process the transaction"
        })
    }

    /**
     *4.Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance()
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance.Current balance is ${balance}. Requested balance is ${amount}`
        })
    }

   let transaction;
   try{

  
    /**
     * 5. create transaction document with pending status
     */
    const session = await mongoose.startSession()
    session.startTransaction()

     transaction = (await transactionModel.create([ {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }], {session}))[0]

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type:"DEBIT"
    }],{session})

    await ( () => {
         return new Promise((resolve)=> setTimeout(resolve, 15 * 1000))
    })()
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type:"CREDIT"
    }],{session})

  await transactionModel.findOneAndUpdate(
    {_id: transaction._id},
    {status: "COMPLETED"},
    {session}
  )
   
    await session.commitTransaction()
    session.endSession()
 } catch(err){
    return res.status(400).json({
        message: "Transaction is pending, due to some issue, please try again later",
        error: err.message
    })
 }
    /**
     * 10. send email notification to sender and receiver  
     */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message:"transaction completed successfully",
        transaction:transaction
    })
    
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })


}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}