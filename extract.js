const fs = require('fs')
const child = require('child_process')

let files = fs.readdirSync('.').filter(item=>item.endsWith('.gz'))

files = files.map(item=>{
	let dir = item.replace('build-','').replace('.tar.gz','')
	return {
		file:item,
		dir
	}
})

files.forEach(file=>{
	runStep(`rm -rf ${file.dir}`)
	runStep(`mkdir ${file.dir}`)
	runStep(`tar -zxvf ${file.file} -C ${file.dir}`)
	runStep(`mv ${file.dir}/build/* ${file.dir} && rm -rf ${file.dir}/build`)
	createNginxConfig(file.dir)
})
function runStep(desc){
	console.log(desc)
	child.execSync(desc)
}
function nginxConfigTempl(domain){
	return `
	server{
	    listen 80;
	    server_name  ${domain} www.${domain} api.${domain};
	    location / {
	        root /root/node_sites/websites/${domain};
	        index index.html index.htm index.php;
	        try_files $uri $uri/ /index.html;
	    }
	}
	`
}
function createNginxConfig(dir){
	fs.writeFileSync(`/etc/nginx/conf.d/${dir}.conf`,nginxConfigTempl(dir))
}