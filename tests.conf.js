'use strict'

const expect = require('chai').expect

// Some test data
const testBuffer = new Buffer("testing 1 2 3")
const testObjectHash = 'QmPespFG7po1ieDGF3NSzP5tZiKXHaLz7DCGxc4HEpUwzG'

// Commands to run and their result tests
module.exports = (ipfs) => {
  // Add objects to the list here to run them in the benchmarks
  return [
    {
      name: 'ipfs.object.put',
      command: ipfs.object.put,
      args: [testBuffer],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        // Returns a DAGNode
        expect(err).to.not.exist
        expect(res.data).to.equal(testBuffer)
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
        expect(err).to.not.exist
        expect(res.data).to.equal(testBuffer)
        done()
      } 
    },
    {
      name: 'ipfs.id',
      command: ipfs.id,
      args: [],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        // console.log(res)
        expect(err).to.not.exist
        expect(res.id).to.exist
        expect(res.publicKey).to.exist
        expect(res.addresses).to.exist
        expect(res.agentVersion).to.exist
        expect(res.protocolVersion).to.exist
        done()
      } 
    },
    {
      name: 'ipfs.version',
      command: ipfs.version,
      args: [],
      count: 1000,
      resShouldEqual: (err, res, done) => {
        expect(err).to.not.exist
        expect(res.version).to.exist
        expect(res.commit).to.exist
        expect(res.repo).to.exist
        done()
      } 
    },
  ]
}
