const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const config = require('./config')
const child = require('child_process')
const process = require('process')
const path = require('path')
const templ = './templates/template1/*'
const build = './build'
let { sites } = config;

async function startTask(tasks){
  for(let task of tasks){
    await runTask(task)
    console.log(`finished:${task.url}`)
  }
}

function runTask(task){
  return new Promise((resolve,reject)=>{
    const { url, title, searchKeyWord, beianCode, iconLogo } = task;
    let indexHtml = `./build/${url}/public/index.html`
    let contentHtml = `./build/${url}/src/components/my-content.js`
    let footerHtml = `./build/${url}/src/components/my-footer.js`
    let headerHtml = `./build/${url}/src/components/my-header.js`
    let navHtml = `./build/${url}/src/components/my-nav.js`
    const buildDir = `${build}/${url}`
    console.log(`delete:build/${url}`)
    rimraf.sync(buildDir)
    console.log(`mkdir: build/${url}`)
    mkdirp.sync(buildDir);
    child.execSync(`cp -r ${templ} ${buildDir}`);
    // 修改title
    const reg1 = /<title>(.*?)<\/title>/gi;
    const rep1 = `<title>${title}</title>`
    readAndReplace(indexHtml,'utf8',reg1,rep1)
    // 修改 logo语 与 icon
    const reg2 = /\squery\s=\s(.*?);/gi
    const rep2 = ` query = '${searchKeyWord}';`
    readAndReplace(contentHtml,'utf8',reg2,rep2)
    // 修改footer 
    const reg3 = /copyright:(.*)',/
    const rep3 = `copyright:'© 2018,${url}',`
    readAndReplace(footerHtml,'utf8',reg3,rep3)
    // 修改备案号
    const reg4 = /beian:(.*)',/
    const rep4 = `beian:'${beianCode}',`
    readAndReplace(footerHtml,'utf8',reg4,rep4)
    // logo png
    const reg5 = /'\.\.\/images\/logo\.png'/
    const rep5 = `'../images/logo${iconLogo}.png'`
    readAndReplace(headerHtml,'utf8',reg5,rep5)
    // logo title
    const reg6 = /title="logo"\>(.*?)<\/a>/
    const rep6 = `title="logo"\>${url}<\/a>`
    readAndReplace(headerHtml,'utf8',reg6,rep6)
    // logo title
    const reg7 = /javascript:alert\(\'(.*?)\'\)/
    const rep7 = `javascript:alert('${url}')`
    readAndReplace(headerHtml,'utf8',reg7,rep7)
    process.chdir(buildDir);
    console.log(`chdir:${buildDir}`)
    child.execSync('yarn');
    console.log(`finished yarn install ${buildDir}`)
    child.execSync('yarn build');
    console.log(`finished yarn build ${buildDir}`)
    process.chdir('../../')
    return resolve()
  })
}
sites = sites.filter(site=>site.title)
startTask(sites);

function readAndReplace(src,encoding,reg1,rep1){
  let file = fs.readFileSync(src,encoding);
  file = file.replace(reg1,rep1)
  fs.writeFileSync(src,file);
}