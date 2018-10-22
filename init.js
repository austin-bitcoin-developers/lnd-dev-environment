const fs = require('fs');
const grpc = require('grpc');

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

const create = process.argv.length > 2 && process.argv[2] == 'create'

function initUser(port, password, mnemonic, cb) {
    const homedir = require('os').homedir()
    
    const lndCert = fs.readFileSync(`${homedir}/.lnd/tls.cert`);
    const sslCreds = grpc.credentials.createSsl(lndCert);
    const lnrpcDescriptor = grpc.load(`${homedir}/.lnd/rpc.proto`)
    const lnrpc = lnrpcDescriptor.lnrpc
    const walletUnlocker = new lnrpc.WalletUnlocker(`localhost:${port}`, sslCreds)
    const request = { 
        wallet_password: Buffer.from(password, 'utf-8')
    }
    if(create) {
        request.cipher_seed_mnemonic = mnemonic
        walletUnlocker.initWallet(request, function(err, response) {
            console.log(err, response);
            if(cb) cb()
        })
    } else {
        walletUnlocker.unlockWallet(request, function(err, response) {
            console.log(err, response);
            if(cb) cb()
        })

    }
}
const aliceMnemonic = [
    "abstract",  "deliver",   "expose",    "tackle",
    "picnic",    "fat",       "dinosaur",  "swear", 
    "outdoor",   "point",     "pioneer",   "draw",  
    "double",    "penalty",   "reform",    "good",  
    "horror",    "oval",      "kitchen",   "west",  
    "rough",     "sibling",   "destroy",   "test" 
]

const bobMnemonic = [
    "ability", "weapon", "van", "genre",  
    "kind", "deliver", "note", "repair", 
    "rival", "patrol", "angle", "blue",   
    "clock", "involve", "profit", "hour",   
    "you", "similar", "scissors", "fashion",
    "cheese", "cabbage", "benefit", "inch"
]


const charlieMnemonic =[
    "above", "parrot", "diary", "trumpet",
    "armed", "guard", "boy", "lazy",   
    "law", "picnic", "cave", "veteran",
    "flight", "because", "menu", "border", 
    "enemy", "tip", "three", "century",
    "siege", "piece", "snap", "peanut"
]
initUser(10001, "alicepass", aliceMnemonic, () => {
initUser(10002, "bobpasss", bobMnemonic, () => {
initUser(10003, "charliepass", charlieMnemonic)
    })
})
