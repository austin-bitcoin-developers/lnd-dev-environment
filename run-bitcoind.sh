#!/bin/bash
bitcoind --regtest --rpcuser=kek --rpcpassword=kek --txindex -conf=./bitcoin.conf --zmqpubrawblock=tcp://127.0.0.1:28332 --zmqpubrawtx=tcp://127.0.0.1:28333 &
$GOPATH/bin/lnd --configfile=alice/lnd-bitciond.conf &
$GOPATH/bin/lnd --configfile=bob/lnd-bitcoind.conf &
$GOPATH/bin/lnd --configfile=charlie/lnd-bitcoind.conf &
