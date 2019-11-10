
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const request = require('request-promise-native')
const urlBase = 'http://localhost:9200/'
const PORT = 9525
const app = new Koa()
const router = new Router()
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