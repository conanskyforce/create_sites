const form = document.forms[0]
const input = document.getElementsByClassName('input')[0]
const submit = document.querySelector('[type=submit]')

let result = document.querySelector('.res')

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
  .then(appendToRes)
  .catch(err=>{
    console.error(err)
  })
})

function appendToRes(res){
  if(res.data) res = res.data
  let took = res.took;
  let hits = res.hits.hits;
  result.innerHTML = `<h2>耗时：${took}ms</h2>`+`<div class="list-container">
  ${generateItem(hits)}
  </div>`
}
function generateItem(hits){
  let dataList = hits.map(hit=>hit._source);
  let ret = ''
  dataList.forEach(data=>{
    let {
      address,
      businessScope,
      capital,
      character,
      city,
      code,
      legalRepresentative,
      name,
      province,
      registrationDay,
    } = data;
    ret +=`
    <div class="list-item">
    <p>address : ${address},businessScope : ${businessScope},capital : ${capital},character : ${character},city : ${city}</p>
    <p>code : ${code},legalRepresentative : ${legalRepresentative},name : ${name},province : ${province},registrationDay : ${registrationDay}</p>
    <hr/>
    </div>
    `
  })
  return ret
}

