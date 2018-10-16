#!/bin/bash
$GOPATH/bin/btcd --simnet --rpcuser=kek --rpcpass=kek --txindex --miningaddr=rp3ZUSQXNcViTvKdNud2wTav9U6sJMXX6j &
$GOPATH/bin/lnd --configfile=alice/lnd.conf &
$GOPATH/bin/lnd --configfile=bob/lnd.conf &
$GOPATH/bin/lnd --configfile=charlie/lnd.conf &
