const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
[
  'readdir',
  'stat',
  'readFile',
  'copyFile',
  'unlink',
  'rename',
].forEach(item=>{
  fs[item] = promisify(fs[item])
})

class FileManager {
	getStats(file){}
	async list(dirPath){
		let files = await fs.readdir(dirPath);
    let stats = [];
    for(let file of files){
      let fPath = path.join(dirPath,file);
      let stat = await fs.stat(fPath);
      stats.push({
        name:file,
        stat
      })
    }
		return stats
	}
}

let manager =  new FileManager();

manager.list('.')
.then(res=>{
  console.log(res)
})
.catch(console.log)