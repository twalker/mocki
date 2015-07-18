/**
 * mocki mocks backbone model resource requests by
 * responding with mock json files in /test/fixtures.
*/
var path = require('path')
var fs = require('fs')
var cuid = require('cuid')
var express = require('express')
var bodyParser = require('body-parser')

var mockspath = path.join(__dirname, '..', '..', '..', 'test', 'fixtures')

var actions = {
  list: function (req, res) {
    var collectionDir = res._collectionDir
    var listFilePath = path.join(collectionDir, 'list.json')

    fs.exists(collectionDir, function (exists) {
      if (exists) {
        // collection directory exists
        fs.exists(listFilePath, function (exists) {
          if (exists) {
            // list.json exists, serve that
            listFile()
          } else {
            // generate collection from individual json files
            files()
          }
        })

      } else {
        // no collection dir
        dirNotFound()
      }
    })

    function listFile () {
      fs.readFile(listFilePath, function (err, data) {
        if (err) throw err
        res.json(JSON.parse(data))
      })
    }

    function files () {
      // put individual .json mocks into an array
      fs.readdir(collectionDir, function (err, listing) {
        if (err) throw err
        var models = []
        var files = listing.filter(function (name) {return (/\.json$/i).test(name)})
        var len = files.length
        var i = 0

        var addToList = function addToList (err, data) {
          if (err) throw err

          models.push(JSON.parse(data))
          if (i === len - 1) {
            res.json(models)
          } else {
            i++
          }
        }

        if (len === 0) {
          res.json(models)
        } else {
          files.forEach(function (filename) {
            fs.readFile(path.join(collectionDir, filename), addToList)
          })
        }
      })
    }

    function dirNotFound () {
      res.status(404).json({error: collectionDir + ' not found.'})
    }

  },

  show: function (req, res) {
    var filePath = path.join(res._collectionDir, res._mockId + '.json')
    fs.exists(filePath, function (exists) {
      if (exists) {
        fs.readFile(filePath, function (err, data) {
          if (err) throw err
          res.json(JSON.parse(data))
        })
      } else {
        res.status(404).json({error: filePath + ' not found.'})
      }
    })
  },

  create: function (req, res) {
    var json = req.body
    var id = json.id = json.id || cuid()
    var filePath = path.join(res._collectionDir, id + '.json')

    fs.writeFile(filePath, JSON.stringify(json, null, 2), function (err) {
      if (err) throw err
    })

    res.json(json)
  },

  destroy: function (req, res) {
    var filePath = path.join(res._collectionDir, res._mockId + '.json')
    fs.readFile(filePath, function (err, data) {
      if (err) throw err
      fs.unlink(filePath, function (err) {
        if (err) throw err
        res.sendStatus(204)
      })
    })
  }

}

// sets a _collectionDir and _mockId variable from the route parameters
function collectDir (req, res, next) {
  if (res._collectionDir) return next()

  var pathParts = [mockspath, req.params.collection]
  // are we looking to serve a subcollection?
  if (req.params.id && req.params.subcollection) {
    pathParts.push(req.params.id, req.params.subcollection)
  }
  // explicitly set the id since there could be id, or id and subid
  res._mockId = req.params.subid || req.params.id
  res._collectionDir = path.join.apply(null, pathParts)
  next()
}

// set origin headers to allow CORS
function setOrigin (req, res, next) {
  res.header('X-Powered-By', 'mocki')
  res.header('Access-Control-Allow-Origin', req.header('origin') || '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
}

module.exports = function (fixturesPath) {
  var mocks = express.Router()
  if (fixturesPath) mockspath = fixturesPath

  mocks
    .use(bodyParser.json())
    // allow cross origin xhr
    .use(setOrigin)

  // nested subcollections/resources actions
  mocks.route('/:collection/:id/:subcollection/:subid')
    .all(collectDir)
    .get(actions.show)
    .put(actions.create)
    .delete(actions.destroy)

  mocks.route('/:collection/:id/:subcollection')
    .all(collectDir)
    .get(actions.list)
    .post(actions.create)

  // typical RESTful resource actions
  mocks.route('/:collection/:id')
    .all(collectDir)
    .get(actions.show)
    .put(actions.create)
    .delete(actions.destroy)

  mocks.route('/:collection')
    .all(collectDir)
    .get(actions.list)
    .post(actions.create)

  return mocks
}
