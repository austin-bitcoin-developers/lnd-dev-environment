#!/bin/bash
$GOPATH/bin/btcd --simnet --rpcuser=kek --rpcpass=kek --txindex --miningaddr=rqvJFKkeNRGQn6h7NJaabVUcfztnrCze2v &
$GOPATH/bin/lnd --configfile=alice/lnd.conf &
$GOPATH/bin/lnd --configfile=bob/lnd.conf &
$GOPATH/bin/lnd --configfile=charlie/lnd.conf &
