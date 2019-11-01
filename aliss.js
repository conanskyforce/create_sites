const Client = require('./aliSdk/lib/client')
const config = require('./config')
const client = new Client({
  accessKeyId:config.accessKeyId,
  secretAccessKey:config.secretAccessKey,
  endpoint:config.endpoint,
});

console.log(client)