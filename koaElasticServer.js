
const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const request = require('request-promise-native')
const urlBase = 'http://localhost:9200/'
const renderView = require('./views/index').renderView
const PORT = 9540
const app = new Koa()
let corsWhiteList = [
  'http://106.54.64.20:9540'
]
const router = new Router()
app.use(static('.'))
app
.use(bodyParser())
app.use(async (ctx, next) => {
  let { referer } = ctx.request.headers
  console.log(referer)
  referer && referer[referer.length-1] == '/'?(referer = referer.slice(0,-1)):null
  if(corsWhiteList.length){
    corsWhiteList.forEach(white=>{
      ctx.set("Access-Control-Allow-Origin", white); 
    })
  }
  if(referer && ~referer.indexOf('devdapps.top')){
    ctx.set("Access-Control-Allow-Origin", referer);
  }
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  ctx.set("Content-Type", "application/json;charset=utf-8");
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Max-Age", 300);
  await next();
})

router.get('/', async (ctx,next) =>{
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = await renderView('home')
})
function logger(data){
  console.log(body)
  child.execSync(`echo "${JSON.stringify(data)}" >> koaElasticServer.log`)
}
router.post('/query', async (ctx,next) =>{
  let body = ctx.request.body;
  logger(body)
  if(!(body.query && body.query.match)){
    ctx.status = 404
    ctx.body = '{query:{match:{x:x}}} format needed'
  }
  let res;
  try{
    res = await request({
      url: `${urlBase}_search`,
      body: JSON.stringify(body),
      headers:{
        'Content-Type':'application/json'
      }
    })
  }catch(err){
    console.log(`await request error:`)
    console.log(err)
    res = 'Internal Error'
  }
  ctx.body = res
})

app
.use(router.allowedMethods())
.use(router.routes())
.listen(PORT,()=>{
  console.log(`server running at: http://localhost:${PORT}`)
})

