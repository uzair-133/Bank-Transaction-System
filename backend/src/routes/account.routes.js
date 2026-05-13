const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");
const Ledger = require("../models/ledger.model")
const router = express.Router();

/**
 * -Post /api/accounts/
 * -Create a new Account
 * -Protected routes
 */

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

/**
 * -Get /api/accounts
 * -Get all accounts of the logged in user
 * -Protected routes
 */
router.get("/detail",authMiddleware.authMiddleware,accountController.getUserAccountsController)

/**
 * -Get /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController. getAccountBalanceController)

router.get('/ledger/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Ledger se data find karo aur latest entries pehle dikhao
    const history = await Ledger.find({ account: accountId })
      .sort({ _id: -1 }) // Latest transactions top par
      .limit(20);

    res.status(200).json({ 
      success: true, 
      ledger: history 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;