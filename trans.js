const child = require('child_process')
const rimraf = require('rimraf')
const path = require('path')
const process = require('process')
const config = require('./config')

const { sites,lancer,tomotech } = config;
const build = `./build`
sites.forEach(site=>{
  const { url } = site;
  const projectDir = path.resolve(__dirname,'build',url)
  process.chdir(projectDir);
  console.log(projectDir)
  rimraf.sync(`${projectDir}/build-${url}.tar.gz`)
  child.execSync(`tar -zcf build-${url}.tar.gz build`)
  // child.execSync(`scp ${projectDir}/build-${url}.tar.gz root@${lancer}:/root/node_sites/websites`)
  child.execSync(`scp ${projectDir}/build-${url}.tar.gz root@${tomotech}:/root/node_sites/websites`)
})
