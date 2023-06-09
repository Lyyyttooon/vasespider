const crypto = require('crypto')
const axios = require('axios').default

axios.defaults.baseURL = 'https://mtop.damai.cn/h5'
axios.defaults.headers.common['Content-type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['origin'] = 'https://m.damai.cn'
axios.defaults.headers.common['referer'] = 'https://m.damai.cn/'
axios.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'

const paramsAppKey = '12574478'
const paramsV2 = '2.0'
const paramsV4 = '4.0'
const paramsApiDatail = 'mtop.alibaba.detail.subpage.getdetail'
const paramsApiOrder = 'mtop.trade.order.build.h5'
const paramsApiSubmit = 'mtop.trade.order.create.h5'
const paramsMethodGet = 'GET'
const paramsMethodPost = 'POST'
const dmChannel = 'damai@damaih5_h5'
const ttid = '#t#ip##_h5_2014'
const aliDamai = 'ali.china.damai'

const detailUrl = '/mtop.alibaba.detail.subpage.getdetail/2.0/?'

async function getTicketsDetail(str) {
  let form = JSON.parse(str)
  let params = initCommonParams()
  let data = initDetailDataParam(form.itemId, 4, '')

  params.v = paramsV2
  params.method = paramsMethodGet
  params.sign = initSign(form.token, params.t, data)
  params.data = data
  params.api = paramsApiDatail
  console.log(form.cookie)

  const resp = await axios({
    url: detailUrl+parseParams(params),
    method: 'get',
    headers: {
      cookie: form.cookie
    }
  }).catch((err) => {
    console.log(err)
  })
  console.log(resp)
}

function initSign(token, t, data) {
  return md5(`${token}&${t}&${paramsAppKey}&${data}`)
}

function md5(data) {
  var md5 = crypto.createHash('md5')
  return md5.update(data).digest('hex')
}

// 生成data参数
function initDetailDataParam(itemId, dataType, performId) {
  let data = {
    itemId: itemId,
    bizCode: aliDamai,
    scenario: 'itemsku',
    exParams: initDetailExParams(dataType, performId),
    dmChannel: dmChannel
  }
  return JSON.stringify(data)
}

function initDetailExParams(dataType, dataId) {
  let data = {
    dataType: dataType,
    dataId: dataId,
    privilegeActId: ''
  }
  return JSON.stringify(data)
}

// 生成通用参数
function initCommonParams() {
  let now = new Date().getTime()
  let params = {
    jsv: '2.7.2',
    appKey: '12574478',
    t: now,
    sign: '',
    type: 'originaljson',
    dataType: 'json',
    v: '',
    H5Request: 'true',
    AntiCreep: 'true',
    AntiFlood: 'true',
    api: '',
    method: '',
    submitref: '',
    timeout: '',
    isSec: '',
    ecode: '',
    post: '',
    ttid: '',
    globalCode: '',
    tb_eagleeyex_scm_project: '20190509-aone2-join-test',
    requestStart: now - 1,
    data: ''
  }
  return params
}

function parseParams(data) {
  let str = ""
  for (let k in data) {
    if (data[k] === "") {
      continue
    }
    str += `${k}=${encodeURIComponent(data[k])}&`
  }
  return str.substring(0, str.length-1)
}

module.exports = { getTicketsDetail }
