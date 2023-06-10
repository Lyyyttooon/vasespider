const crypto = require('crypto')
const axios = require('axios').default

axios.defaults.baseURL = 'https://mtop.damai.cn/h5'
axios.defaults.headers.common['Content-type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Origin'] = 'https://m.damai.cn'
axios.defaults.headers.common['Referer'] = 'https://m.damai.cn/'
axios.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'

// Get请求
async function getRequest(str) {
  let data = JSON.parse(str)

  data.params.sign = initSign(data.token, data.params.t, data.params.appKey, data.data)

  const resp = await axios({
    url: data.url + formParams(data.params),
    method: 'get',
    headers: {
      Cookie: data.cookie
    }
  }).catch((err) => {
    return JSON.stringify(err.data)
  })
  return JSON.stringify(resp.data)
}

// Post请求
async function postRequest(str) {
  let data = JSON.parse(str)

  data.params.sign = initSign(data.token, data.params.t, data.params.appKey, data.data)
  let form = formData(data)

  const resp = await axios({
    url: data.url + formParams(data.params),
    method: 'post',
    data: form,
    headers: {
      Cookie: data.cookie
    }
  }).catch((err) => {
    return JSON.stringify(err.data)
  })
  console.log(resp)
  return JSON.stringify(resp.data)
}

// 生成sign
function initSign(token, t, appKey, data) {
  return md5(`${token}&${t}&${appKey}&${data}`)
}

// md5算法
function md5(data) {
  var md5 = crypto.createHash('md5')
  return md5.update(data).digest('hex')
}

// 格式化params
function formParams(data) {
  let str = ''
  for (let k in data) {
    if (data[k] === '') {
      continue
    }
    str += `${k}=${encodeURIComponent(data[k])}&`
  }
  return str.substring(0, str.length - 1)
}

// 格式化data
function formData(data) {
  let sendData = {
    data: data.data,
    'bx-ua': data.bxUa,
    'bx-umidtoken': data.bxUmidtoken
  }
  return formParams(sendData)
}

module.exports = { getRequest, postRequest }
