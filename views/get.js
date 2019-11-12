const form = document.forms[0]
const input = document.getElementsByClassName('input')[0]
const submit = document.querySelector('[type=submit]')

let res = document.querySelector('.res')

submit.addEventListener('click',(e)=>{
  e.preventDefault();
  let value = input.value;
  if(!value) return console.error('请输入条件！');
  axios({
    url:"http://106.54.64.20:9540/query",
    method:'POST',
    headers:{'Content-Type':'application/json'},
    data:{query:{match:{name:value,}},from:0,size:10}
    })
  .then(res=>res.json())
  .then(appendToRes)
})

function appendToRes(res){
  res.innerHTML = res.join('\n')
}