'use strict'

const Promise = require('bluebird')
const expect = require('chai').expect
const IPFS = require('ipfs-daemon')

// Tests to run
const tests = require('./tests.conf.js')

// How many of the commands in the configuration to run in parallel
const parallelCommands = 1

// IPFS daemon settings
const daemonConf = require('./daemon.conf.js')

// Clock
let start = new Date().getTime()

// Run a command
const runCommand = (onResult, times, name, command, ...args) => {
  let count = 0
  let startTime = new Date().getTime()
  let checkTime = 0

  process.stdout.write(`> Command: ${name}\n`)

  return new Promise((resolve) => {
    const loop = () => {
      if (count < times) {
        count++
        process.stdout.write('                                   \r')
        process.stdout.write('> Run: ' + count + ' of ' + times + '\r')
        // Run the command and spread the arguments
        command(...args, (err, result) => {
          const startCheckTime = new Date().getTime()
          // Callback to the provided expectation check
          onResult(err, result, () => {
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
          ops: ops
        }
        process.stdout.write(`\n> Time: ${duration} ms, ${ops} ops / s\n`)
        resolve(result)
      }
    }
    loop() // Start
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
    console.log(`Running commands`)

    const run = (c) => {
      return runCommand(c.resShouldEqual, c.count, c.name, c.command, ...c.args)
    }

    const commands = tests(ipfs)
    Promise.map(commands, run, { concurrency: 1 })
      .then((res) => {
        let runTime = new Date().getTime() - start
        console.log(`Total time: ${Math.floor(runTime / 1000)} seconds`)
        console.log()
        console.log(res)
        process.exit(0)
      })
  })
}

// Start
main()
