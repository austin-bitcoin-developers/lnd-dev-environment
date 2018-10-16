const createInstance = require('./gprcinstance')

let grpcAlice = createInstance('alice', 10001)
let grpcBob = createInstance('bob', 10002)

grpcBob.addInvoice({
    memo: "created in code",
    value: 2030,
}, (errInv, inv) => {
    console.log('payment request recieved', inv.payment_request)
    grpcAlice.sendPaymentSync({
        payment_request: inv.payment_request
    }, (e, pay) => {
        console.log('payment sent', e, JSON.stringify(pay, null, 2))
    })
})
