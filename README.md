# ipfs-command-benchmark

Benchmark raw throughput of IPFS commands.

## Usage

**Requires**
- Node.js >= 6.0
- npm >= 3.0
- make (*optional, if not using make, see package.json for npm commands*)

Install:
```
git clone https://github.com/haadcode/js-ipfs-command-benchmark.git
cd js-ipfs-command-benchmark/
```

Run:
```
make
```

## Options
To run with a specific IPFS binary:

```
IPFS_EXEC=/path/to/bin/ipfs npm start
```

Clean Run:
```
make clean && make
```

Logging:

```
LOG=debug node benchmark.js
```

## Current Benchmarks
```
-- IPFS commands benchmark ---
Starting IPFS daemon...
Stack: node.js -> js-ipfs-api -> go-ipfs
Running commands
> Benchmark: Send/receive messages - no peers
> Command: ipfs.pubsub.subscribe
Sample #1 - Run: 1000 of 1000 - Time: 5447 ms, 183 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 6453 ms, 154 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 6777 ms, 147 ops/s
Average 161 ops/s - (Min: 147, Max: 183)
> Benchmark: Run pubsub.publish
> Command: ipfs.pubsub.publish
Sample #1 - Run: 1000 of 1000 - Time: 1797 ms, 556 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 2194 ms, 455 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 2403 ms, 416 ops/s
Average 475 ops/s - (Min: 416, Max: 556)
> Benchmark: Run pubsub.subscribe and cancel the subscription
> Command: ipfs.pubsub.subscribe
Sample #1 - Run: 1000 of 1000 - Time: 3115 ms, 321 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 2569 ms, 389 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 2738 ms, 365 ops/s
Average 358 ops/s - (Min: 321, Max: 389)
> Command: ipfs.object.put
Sample #1 - Run: 1000 of 1000 - Time: 3315 ms, 301 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 3568 ms, 280 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 3224 ms, 310 ops/s
Average 297 ops/s - (Min: 280, Max: 310)
> Command: ipfs.object.get
Sample #1 - Run: 10000 of 10000 - Time: 430 ms, 23255 ops/s
Sample #2 - Run: 10000 of 10000 - Time: 378 ms, 26455 ops/s
Sample #3 - Run: 10000 of 10000 - Time: 342 ms, 29239 ops/s
Average 26316 ops/s - (Min: 23255, Max: 29239)
> Command: ipfs.id
Sample #1 - Run: 1000 of 1000 - Time: 2938 ms, 340 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 5136 ms, 194 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 2992 ms, 334 ops/s
Average 289 ops/s - (Min: 194, Max: 340)
> Command: ipfs.version
Sample #1 - Run: 1000 of 1000 - Time: 3207 ms, 311 ops/s
Sample #2 - Run: 1000 of 1000 - Time: 2755 ms, 362 ops/s
Sample #3 - Run: 1000 of 1000 - Time: 2503 ms, 399 ops/s
Average 357 ops/s - (Min: 311, Max: 399)
Total time: 58 seconds
```

## TODO

- Add percintile metrics
- Yargsify so that commands can be run from cli
