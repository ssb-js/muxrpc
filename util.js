
function isString (s) {
  return 'string' === typeof s
}

var isArray = Array.isArray

function isObject (o) {
  return o && 'object' === typeof o && !isArray(o)
}

function isEmpty (obj) {
  for(var k in obj) return false;
  return true
}

//I wrote set as part of permissions.js
//and then later mount, they do nearly the same thing
//but not quite. this should be refactored sometime.
//what differs is that set updates the last key in the path
//to the new value, but mount merges the last value
//which makes sense if it's an object, and set makes sense if it's
//a string/number/boolean.

exports.set = function (obj, path, value) {
  var _obj, _k
  for(var i = 0; i < path.length; i++) {
    var k = path[i]
    obj[k] = obj[k] || {}
    _obj = obj; _k = k
    obj = obj[k]
  }
  _obj[_k] = value
}

exports.get = function (obj, path) {
  if(isString(obj[path])) return obj[path]
  var value
  for(var i = 0; i < path.length; i++) {
    var k = path[i]
    value = obj = obj[k]
    if(null == obj) return obj
  }
  return value
}

exports.prefix = function (obj, path) {
  var value, parent = obj

  for(var i = 0; i < path.length; i++) {
    var k = path[i]
    value = obj = obj[k]
    if('object' !== typeof obj) {
      return obj
    }
    parent = obj
  }
  return 'object' !== typeof value ? !!value : false
}


function mkPath(obj, path) {
  for(var i in path) {
    var key = path[i]
    if(!obj[key]) obj[key]={}
    obj = obj[key]
  }

  return obj
}

function rmPath (obj, path) {
  (function r (obj, i) {
    var key = path[i]
    if(!obj) return
    else if(path.length - 1 === i)
      delete obj[key]
    else if(i < path.length) r(obj[key], i+1)
    if(isEmpty(obj[key])) delete obj[key]
  })(obj, 0)
}

function merge (obj, _obj) {
  for(var k in _obj)
    obj[k] = _obj[k]
  return obj
}

var mount = exports.mount = function (obj, path, _obj) {
  if(!Array.isArray(path))
    throw new Error('path must be array of strings')
  return merge(mkPath(obj, path), _obj)
}
var unmount = exports.unmount = function (obj, path) {
  return rmPath(obj, path)
}
