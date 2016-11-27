'use strict'

const Promise = require('bluebird')
const IPFS = require('ipfs-daemon')

// Tests to run
const tests = require('./tests.conf.js')

// How many of the commands in the configuration to run in parallel
const parallelCommands = 1

// How many times to run the benchmark per command
const samples = 3

// IPFS daemon settings
const daemonConf = require('./daemon.conf.js')

// Clock
let start = new Date().getTime()

// Run a command
const runCommand = (onResult, times, name, command, ...args) => {
  let sample = 0
  let count = 0
  let startTime = new Date().getTime()
  let checkTime = 0
  let result = []

  process.stdout.write(`> Command: ${name}\n`)

  return new Promise((resolve) => {
    const runSample = (previousResult) => {
      if (previousResult)
        result.push({ benchmark: name, sample: sample, result: previousResult })

      if (sample < samples) {
        // Reset counters, time, etc.
        count = 0
        startTime = new Date().getTime()
        checkTime = 0
        sample ++
        loop() // Run another sample
      } else {
        // TODO: percentiles
        const max = result.reduce((res, sample) => Math.max(res, sample.result.throughput), 0)
        const min = result.reduce((res, sample) => Math.min(res, sample.result.throughput), max)
        const average = result.reduce((total, sample) => total + sample.result.throughput, 0) / result.length
        process.stdout.write(`Average ${Math.floor(average)} ops/s - (Min: ${min}, Max: ${max})\n`)
        resolve(result)
      }      
    }

    const loop = () => {
      if (count < times) {
        count++
        process.stdout.write('\r')
        process.stdout.write(`Sample #${sample} - Run: ${count} of ${times}`)
        // Run the command and spread the arguments
        command(...args, (err, result) => {
          const startCheckTime = new Date().getTime()
          // Callback to the provided expectation check
          onResult(err, result, (err, res) => {
            if (err) 
              return reject(err)

            checkTime -= new Date().getTime() - startCheckTime
            // Check done, next iteration
            process.nextTick(() => loop())
          })
        })
      } else {
        const duration = new Date().getTime() - startTime - checkTime
        const ops = Math.floor(count / (duration / 1000))
        const result = {
          command: name,
          duration: duration,
          count: count,
          throughput: ops // ops / s
        }
        process.stdout.write(` - Time: ${duration} ms, ${ops} ops/s\n`)
        process.nextTick(() => runSample(result))        
      }
    }

    runSample() // Start
  })
}

// Main
const main = () => {
  console.log(`-- IPFS commands benchmark ---`)

  console.log(`Starting IPFS daemon...`)

  // Start IPFS daemon
  const ipfs = new IPFS(daemonConf)

  // Exit on errors
  ipfs.on('error', (err) => {
    console.log(err)
    process.exit(1)
  })

  // Start benchmarking
  ipfs.on('ready', () => {
    // console.log(`node.js -> ${ipfs.Name.replace('+', ' -> ')}`)
    console.log(`Stack: node.js -> js-ipfs-api -> go-ipfs`)
    console.log(`Running commands`)

    const run = (c) => {
      if (c.description) 
        process.stdout.write(`> Benchmark: ${c.description}\n`)

      return runCommand(c.resShouldEqual, c.count, c.name, c.command, ...c.args)
    }

    const commands = tests(ipfs)
    Promise.mapSeries(commands, run, { concurrency: parallelCommands })
      .then((res) => {
        let runTime = new Date().getTime() - start
        console.log(`Total time: ${Math.floor(runTime / 1000)} seconds`)
        // console.log(JSON.stringify(res, null, 2))
        process.exit(0)
      })
      .catch((err) => console.error(err))
  })
}

// Start
main()
