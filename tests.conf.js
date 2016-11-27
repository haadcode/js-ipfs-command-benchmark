'use strict'

const assert = require('assert')

// Some test data
const testTopic = 'helloworld'
const testBuffer = new Buffer("testing 1 2 3")
const testObjectHash = 'QmPespFG7po1ieDGF3NSzP5tZiKXHaLz7DCGxc4HEpUwzG'

// Commands to run and their result tests
module.exports = (ipfs) => {
  // Add objects to the list here to run them in the benchmarks
  return [
    {
      description: 'Send/receive messages - no peers',
      name: 'ipfs.pubsub.subscribe',
      command: ipfs.pubsub.subscribe,
      args: [testTopic],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        assert.equal(err, null)
        res.on('data', (message) => {
          assert.deepEqual(message.data, testBuffer.toString())
          res.cancel(done)
        })
        ipfs.pubsub.publish(testTopic, testBuffer)
      } 
    },
    {
      name: 'ipfs.pubsub.publish',
      command: ipfs.pubsub.publish,
      description: 'Run pubsub.publish',
      args: [testTopic, testBuffer],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        assert.equal(err, null)
        done()
      } 
    },
    {
      name: 'ipfs.pubsub.subscribe',
      command: ipfs.pubsub.subscribe,
      description: 'Run pubsub.subscribe and cancel the subscription',
      args: [testTopic],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        assert.equal(err, null)
        assert.notEqual(res, null)
        res.cancel(done)
      } 
    },
    {
      name: 'ipfs.object.put',
      command: ipfs.object.put,
      args: [testBuffer],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        // Returns a DAGNode
        assert.equal(err, null)
        assert.deepEqual(res.toJSON().data, testBuffer)
        done() // remember to call done at the end of the check
      } 
    },
    {
      name: 'ipfs.object.get',
      command: ipfs.object.get,
      args: [testObjectHash],
      count: 10000,
      resShouldEqual: (err, res, done) => {
        // Returns a DAGNode
        assert.equal(err, null)
        assert.deepEqual(res.data, testBuffer)
        done()
      } 
    },
    {
      name: 'ipfs.id',
      command: ipfs.id,
      args: [],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        assert.equal(err, null)
        assert.notEqual(res.publicKey, null)
        assert.notEqual(res.addresses, null)
        assert.notEqual(res.agentVersion, null)
        assert.notEqual(res.protocolVersion, null)
        done()
      } 
    },
    {
      name: 'ipfs.version',
      command: ipfs.version,
      args: [],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        assert.equal(err, null)
        assert.notEqual(res.version, null)
        assert.notEqual(res.commit, null)
        assert.notEqual(res.repo, null)
        done()
      } 
    },
  ]
}
