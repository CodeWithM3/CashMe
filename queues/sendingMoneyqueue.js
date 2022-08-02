const Bull = require('bull');
const {createBullBoard} = require('@bull-board/api')
const {BullAdapter} = require('@bull-board/api/bullAdapter')
const {ExpressAdapter} = require('@bull-board/express')
const serverAdapter = new ExpressAdapter()


const sendMoney = new Bull('Transfer', {
    redis : process.env.REDIS_URL || 6379,
    // do maximum of 500 jobs per sec
    limiter:{
      max: 500,
      duration: 1000
    }
});

  createBullBoard({
  queues: [new BullAdapter(sendMoney)],
  serverAdapter

})

const TransferMoney = async (data) =>{
  await sendMoney.add({account_bank: data.AccountBank, account_number: data.MerchantID,amount:data.Amount, narration: data.Narration, currency: data.Currency, reference: data.Reference, debit_currency:data.DebitCurrency},
    {attempts: 3,
    delay: 10000,
    repeat:{
    every: 3000,
    limit: 2
  }});
}

module.exports = {TransferMoney, serverAdapter};

