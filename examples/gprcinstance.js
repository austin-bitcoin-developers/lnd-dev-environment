const fs = require('fs');
const grpc = require('grpc');

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

function createInstance(user, port, bitcoind) {
    const m = fs.readFileSync(`${__dirname}/../${user}/data/${bitcoind ? 'chain/bitcoin/regtest/':'chain/bitcoin/simnet/'}admin.macaroon`);
    const macaroon = m.toString('hex');
    
    let metadata = new grpc.Metadata()
    metadata.add('macaroon', macaroon)
    const macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
        callback(null, metadata);
    });
    
    const homedir = require('os').homedir()
    
    const lndCert = fs.readFileSync(`${homedir}/.lnd/tls.cert`);
    const sslCreds = grpc.credentials.createSsl(lndCert);
    
    const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
    
    const lnrpcDescriptor = grpc.load(`${homedir}/.lnd/rpc.proto`);
    const lnrpc = lnrpcDescriptor.lnrpc;
    return new lnrpc.Lightning(`localhost:${port}`, credentials);

}

module.exports = createInstance
