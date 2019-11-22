const fs = require('fs')
const path = require('path')
const child = require('child_process')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
var router = new Router()
var app = new Koa()
const v2rayConfig = `/etc/v2ray/config.json`
app.use(bodyParser())
router.get('/',(ctx,next)=>{
        ctx.body = 'hello'
})
let files = fs.readdirSync('/root/.v2ray/configs')
console.log(files)
router.get('/v2config',(ctx,next)=>{
    let ret = ''
    files.forEach(file=>{
      ret += `<option value="${file}">${file}</option>`
    })
    ctx.body = `
    <style>
    .submit-form{
      width: 300px;
      margin:auto;
      margin-top:20px;
      text-align:center;
    }
    h2{
      text-align:center;
    }
    select ,option{
      height: 30px;
      min-width: 100px;
    }
    button {
      height:30px;
      width:45px;
      border-radius:5px;
    }
    </style>
    <div class="submit-form">
    <h2>Submit your config</h2>
    <form action="/v2config" method="POST" onsubmit="submit" >
        <select name='config'>
        ${ret}
        </select>
        <button type="submit">提交</button>
    </form>
    </div>
    `
})

router.post('/v2config',(ctx,next)=>{
  let config = ctx.request.body.config
  if(config){
      fs.unlinkSync(v2rayConfig)
      console.log(`delete file ${v2rayConfig}`)
      fs.copyFileSync(`/root/.v2ray/configs/${config}` ,v2rayConfig)
      console.log(`copy  file ./configs/${config} to ${v2rayConfig}`)
      child.execSync('systemctl restart v2ray')
      ctx.body = `success applied ${config}`;

  }else{
      ctx.body = `ooops, not work！`;
  }

})

router.get('*',(ctx,next)=>{
      ctx.body = 'oooooops'
})
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(9522,()=>{
      console.log(`server running at http://localhost:9522/`)
})
