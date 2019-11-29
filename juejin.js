var request = require('request-promise-native')
var child = require('child_process')
var fs = require('fs')
const api = 'https://web-api.juejin.im/query'

let category = {
  'frontend': {
    cate:'5562b415e4b00c57d9b94ac8',
    name:'frontend'
  },

}

function generateQuery(after) {
  return {
    "operationName": "",
    "query": "",
    "variables": {
      // "tags": [],
      // "category": category.frontend.cate,
      "first": 20,
      "after": after || "",
      "order": "POPULAR"
    },
    "extensions": {
      "query": {
        "id": "21207e9ddb1de777adeaca7a2fb38030"
      }
    }
  }
}
const headers = {
  "X-Agent": "Juejin/Web",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3966.3 Safari/537.36",
  "Content-Type": "application/json"
}

class Logger {
  constructor(name) {
    this.name = name;
  }
  info(msg) {
    if (typeof (msg) != 'string') msg = JSON.stringify(msg)
    child.execSync(` echo "${new Date()}[info]: ${msg}" >> ${this.name}.all.info.log`)
  }
  error(msg) {
    if (typeof (msg) != 'string') msg = JSON.stringify(msg)
    child.execSync(` echo "${new Date()}[error]: ${msg}" >> ${this.name}.all.error.log`)
  }
}
var logger = new Logger('juejin')
var totalCount = 0;
function spider(after) {
  const configs = {
    method: 'POST',
    body: JSON.stringify(generateQuery(after))
  }
  request(api, {
    ...configs,
    headers
  })
  .then(res => {
    try { 
      res = JSON.parse(res)
    }catch(err){
      logger.error(err.message)
    }
    if (res && res.data && res.data.articleFeed && res.data.articleFeed.items && res.data.articleFeed.items.pageInfo ) {
      let edges = res.data.articleFeed.items.edges
      savePages(edges)
      let pageInfo = res.data.articleFeed.items.pageInfo
      let {
        endCursor,
        hasNextPage
      } = pageInfo;
      logger.info('endCursor,' + endCursor)
      if (hasNextPage) {
        setTimeout(()=>{
          spider(endCursor)
        },120)
      }
    } else {
      logger.error('no suitable res')
    }
  }).catch(err => {
    console.log('-----------------')
    console.log(err.name, err.statusCode,err.stack)
    logger.error(err.name + err.statusCode)
    console.log('-----------------')
  })
}

function savePages(pages) {
  pages.forEach(data=>{
    totalCount++
    console.log(`total:${totalCount}`)
    fs.writeFileSync('./juejin.all.data',JSON.stringify(data)+'\n',{flag:'a+'})
  })
}
spider()