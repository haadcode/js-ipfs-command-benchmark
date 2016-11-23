# ipfs-command-benchmark

Benchmark raw throughput of each IPFS command.

## Install and Run

```
git clone https://github.com/haadcode/js-ipfs-command-benchmark.git
cd js-ipfs-command-benchmark
npm install
npm start
```

## Options
To run with a specific IPFS binary:

```
IPFS_EXEC=/path/to/bin/ipfs npm start
```

IPFS Daemon Logs
```
LOG=debug npm start
```

## Example Output
```
-- IPFS commands benchmark ---
Starting IPFS daemon...
Running commands
> Command: ipfs.object.put
> Run: 1000 of 1000
> Time: 9080 ms, 110 ops / s
> Command: ipfs.version
> Run: 1000 of 1000
> Time: 4320 ms, 231 ops / s
> Command: ipfs.id
> Run: 1000 of 1000
> Time: 5348 ms, 186 ops / s
> Command: ipfs.object.get
> Run: 10000 of 10000
> Time: 1461 ms, 6844 ops / s
Total time: 23 seconds

[ { command: 'ipfs.object.put',
    duration: 9080,
    count: 1000,
    ops: 110 },
  { command: 'ipfs.object.get',
    duration: 1461,
    count: 10000,
    ops: 6844 },
  { command: 'ipfs.id', duration: 5348, count: 1000, ops: 186 },
  { command: 'ipfs.version', duration: 4320, count: 1000, ops: 231 } ]
```
