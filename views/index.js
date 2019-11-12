const fs = require('fs')
const path = require('path')
const cache = {}
const view = './views'
module.exports = {
  renderView:(route)=>{
    return new Promise((resolve,reject)=>{
      if(cache[route]){
        return resolve(cache[route])
      }else{
        cache[route] = fs.readFileSync(path.resolve(view,`${route}.html`))
        return resolve(cache[route])
      }
    })
  }
}