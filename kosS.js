
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const request = require('request-promise-native')
const urlBase = 'http://localhost:9200/'
const PORT = 9525
const app = new Koa()
let corsWhiteList = []
const router = new Router()
app.use(async (ctx, next) => {
  let { referer } = ctx.request.headers
  console.log(referer)
  referer[referer.length-1] == '/'?(referer = referer.slice(0,-1)):null
  if(corsWhiteList.length){
    corsWhiteList.forEach(white=>{
      ctx.set("Access-Control-Allow-Origin", white); 
    })
  }
  if(~referer.indexOf('devdapps.top')){
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
  ctx.body = await request(urlBase+'_search')
})
router.post('/query', async (ctx,next) =>{
  let body = ctx.request.body;
  console.log(body)
  if(!(body.query && body.query.match)){
    ctx.status = 404
    ctx.body = '{query:{match:{x:x}}} format needed'
  }
  ctx.body = await request({
    url: `${urlBase}_search`,
    body: JSON.stringify(body),
    headers:{
      'Content-Type':'application/json'
    }
  })
})
app
.use(bodyParser())
.use(router.allowedMethods())
.use(router.routes())
.listen(PORT,()=>{
  console.log(`server running at: http://localhost:${PORT}`)
})