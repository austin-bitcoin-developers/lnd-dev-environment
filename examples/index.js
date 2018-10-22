const createInstance = require('./gprcinstance')

const bitcoind = process.argv.length > 2 && process.argv[2] == 'bitcoind'

// simple example of random rpc calls and subscriptions from code
function setUser(user, port) {
    var instance = createInstance(user, port, bitcoind)

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
