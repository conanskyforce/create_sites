const rp = require('request-promise-native')
const Agent = require('socks5-https-client/lib/Agent');
const child = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const config = require('./v2Config')
const defaultConfig = config.vmessDefaultConfig
const socks5Config = config.socks5Config
const updateSubs = config.updateSubs
child.execSync('mkdir -p ~/.v2ray/configs')
let argv = process.argv[2]
let useAgent = false
if(argv == 'proxy') useAgent = true

updateSubs.forEach(sub => {
  getSub(sub.url, sub.name)
})

function getSub(url, hostName) {
  rp.get(url, useAgent?{
    agentClass: Agent,
    agentOptions: socks5Config
  }:null)
    .then(res => {
      let buf = Buffer.from(res, 'base64')
      let resList = buf.toString().split('\n').filter(i => i).filter(item => item.indexOf('vmess') != -1 || item.indexOf('ssr') != -1)
      let mapHelper = {};
      let configList = resList.map((item, index) => {
        if (~item.indexOf('vmess')) {
          mapHelper[index] = 'vmess'
        }
        if (~item.indexOf('ssr')) {
          mapHelper[index] = 'ssr'
        }
        return item.replace(/vmess\:\/\//g, '').replace(/ssr\:\/\//g, '')
      }).map((item, index) => {
        let ret;
        if (mapHelper[index] == 'vmess') {
          ret = JSON.parse(Buffer.from(item, 'base64').toString())
        } else if (mapHelper[index] == 'ssr') {
          let buf = Buffer.from(item, 'base64').toString()
          let tmp = buf.split(/:origin:|:plain:|\//)
          let address = tmp[0].split(':')[0]
          let port = tmp[0].split(':')[1] - 0;
          let method = tmp[1]
          let password = Buffer.from(tmp[2], 'base64').toString()
          ret = {
            address,
            port,
            method,
            password
          }
        }
        return ret
      })
      configList.forEach((config, index) => {
        let localConfig = JSON.parse(JSON.stringify(defaultConfig));
        if (mapHelper[index] == 'vmess') {
          if (!config.host || !config.add || !config.port) return
          localConfig.outbounds[0].settings.vnext[0].address = config.add
          localConfig.outbounds[0].settings.vnext[0].port = (config.port - 0);
          localConfig.outbounds[0].settings.vnext[0].users[0].id = config.id
          localConfig.outbounds[0].streamSettings.wsSettings.headers.host = config.host
          localConfig.outbounds[0].streamSettings.wsSettings.path = config.path
          localConfig.outbounds[0].streamSettings.network = config.net
          localConfig.outbounds[0].mux = {
            "enabled": false,
            "concurrency": 8
          }
        } else if (mapHelper[index] == 'ssr') {
          localConfig.outbounds[0].protocol = 'shadowsocks'
          delete localConfig.outbounds[0].mux
          localConfig.outbounds[0].streamSettings.network = 'tcp'
          delete localConfig.outbounds[0].settings.vnext
          localConfig.outbounds[0].settings.servers = [{
            port:+config.port,
            method:config.method,
            password:config.password,
            address:config.address,
            level:0,
            email:"",
            ota:false
          }]
        }

        let name = config.ps && config.ps.replace(/(\/|\\|\.|\s+|\(|\))/g, '') + '.json' || hostName + index + '.json'
        console.log(`write to ~/.v2ray/configs/${name}`)
        child.execSync(`touch ~/.v2ray/configs/${name}`)
        fs.writeFileSync(`${os.homedir()}/.v2ray/configs/${name}`, JSON.stringify(localConfig, null, 2));
      })
    })
    .catch(err => {
      console.log('error')
      console.log(err)
    })
}