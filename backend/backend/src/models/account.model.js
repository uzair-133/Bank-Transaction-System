const mongoose = require('mongoose');
const ledgerModel = require("./ledger.model")
const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"account must be associated with a user"],
        index:true
        //indexing work on b+tree
    },
    accountTitle: {
        type: String,
        uppercase: true, // Professional look ke liye (Optional)
        trim: true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"status must be either ACTIVE, FROZEN or CLOSED"
        },
        default:"ACTIVE"
    },
    currency: {
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"PKR"
    }
},{
    timestamps:true
})
//compound index
accountSchema.index({user:1, status:1})


accountSchema.methods.getBalance = async function(){
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id} },
        {
            $group: {
                _id:null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            {$eq: ["$type","DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond:[
                            {$eq: ["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{ $subtract:["$totalCredit","$totalDebit"]}
            }
        }
    ])
    if(balanceData.length === 0){
        return 0;
    }
    return balanceData[0].balance;
}

const accountModel = mongoose.model("account",accountSchema);
///
accountSchema.pre('validate', async function(next) {
    if (this.isNew && !this.accountTitle) {
        try {
            const userData = await mongoose.model("user").findById(this.user);
            if (userData) {
                this.accountTitle = userData.name; 
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});
module.exports = accountModel