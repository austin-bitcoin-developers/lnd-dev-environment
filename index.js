var fs = require('fs');
var grpc = require('grpc');

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

function setUser(user, port) {
    var m = fs.readFileSync(`${__dirname}/${user}/data/admin.macaroon`);
    var macaroon = m.toString('hex');

    var metadata = new grpc.Metadata()
    metadata.add('macaroon', macaroon)
    var macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
        callback(null, metadata);
    });

    const homedir = require('os').homedir()

    var lndCert = fs.readFileSync(`${homedir}/.lnd/tls.cert`);
    var sslCreds = grpc.credentials.createSsl(lndCert);

    var credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

    var lnrpcDescriptor = grpc.load(`${homedir}/.lnd/rpc.proto`);
    var lnrpc = lnrpcDescriptor.lnrpc;
    var instance = new lnrpc.Lightning(`localhost:${port}`, credentials);

    instance.listPeers({}, function (err, response) {
        console.log('Peers:', user, JSON.stringify(response));
    });

    instance.listPayments({}, function (err, response) {
       console.log('Payments:', user, response);
    });

    instance.listChannels({}, function (err, response) {
       console.log('Channels:', user, JSON.stringify(response));
    });

    instance.listInvoices({}, function (err, response) {
        console.log('Invoices:', user, response);
     });
 
     instance.describeGraph({}, function (err, response) {
        console.log('Graph:', user, response);
     });

    var call = instance.subscribeInvoices({});
    call.on('data', function (invoice) {
        console.log(`${user} data`, invoice);
    })
        .on('end', function () {
            console.log('done')
        })
        .on('status', function (status) {
            console.log(`${user} status`, status);
        })
        .on('error', console.log);
}

setUser('alice', 10001)
setUser('bob', 10002)
setUser('charlie', 10003)
