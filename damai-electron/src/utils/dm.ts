import { type formStruct } from '@/App.vue'
import { getBxua, getUmid } from '@/utils/baxia'

const paramsAppKey = '12574478'
const paramsV2 = '2.0'
const paramsV4 = '4.0'
const paramsApiDatail = 'mtop.alibaba.detail.subpage.getdetail'
const paramsApiOrder = 'mtop.trade.order.build.h5'
const paramsApiSubmit = 'mtop.trade.order.create.h5'
const paramsMethodGet = 'GET'
const paramsMethodPost = 'POST'
const dmChannel = 'damai@damaih5_h5'
const ttid = encodeURIComponent('#t#ip##_h5_2014')
const aliDamai = 'ali.china.damai'

const detailUrl = '/mtop.alibaba.detail.subpage.getdetail/2.0/?'
const orderUrl =  '/mtop.trade.order.build.h5/4.0/?'
const submitUrl = '/mtop.trade.order.create.h5/4.0/?'

// 获取门票详情
export async function getTicketsInfo(form: formStruct) {
  const params = initCommonParams()
  const data = initDetailDataParam(form.itemId, 4, '')

  params.v = paramsV2
  params.method = paramsMethodGet
  params.data = data
  params.api = paramsApiDatail

  const sendData = {
    url: detailUrl,
    params,
    data,
    ...form
  }

  const resp = await damaiRequest.getRequest(JSON.stringify(sendData))
  const respJ = JSON.parse(resp)
  const result = JSON.parse(respJ.data.result)
  if (
    result.performCalendar &&
    result.performCalendar.performViews &&
    Array.isArray(result.performCalendar.performViews)
  ) {
    const performViews = result.performCalendar.performViews
    const performIdList = []
    for (let i = 0; i < performViews.length; i++) {
      performIdList.push(performViews[i].performId)
    }
    return {
      performIdList
    }
  }

  return null
}

// 获取场次信息
export async function getPerformInfo(form: formStruct, performId: string) {
  const params = initCommonParams()
  const data = initDetailDataParam(form.itemId, 2, performId)

  params.v = paramsV2
  params.method = paramsMethodGet
  params.data = data
  params.api = paramsApiDatail

  const sendData = {
    url: detailUrl,
    params,
    data,
    ...form
  }

  const resp = await damaiRequest.getRequest(JSON.stringify(sendData))
  const respJ = JSON.parse(resp)
  const result = JSON.parse(respJ.data.result)
  console.log(result)

  if (result.perform && result.perform.skuList && Array.isArray(result.perform.skuList)) {
    if (
      result.perform.skuList.length >= form.sessionNum &&
      result.perform.skuList[form.gradeNum - 1].skuSalable === 'true'
    ) {
      return {
        hasTicket: true,
        sku: result.perform.skuList[form.gradeNum - 1],
        skuList: result.perform.skuList
      }
    }
    return {
      hasTicket: false,
      sku: null,
      skuList: result.perform.skuList
    }
  }
  return {
    hasTicket: false,
    sku: null,
    skuList: null
  }
}

// 生成订单
export async function buildOrder(form: formStruct, skuId: string) {
  const data = initOrderParamData(form.itemId, form.ticketsNum, skuId)
  const params = initBuildOrderParams()

  const sendData = {
    url: orderUrl,
    params,
    data,
    bxUa: getBxua(),
    bxUmidtoken: getUmid(),
    ...form
  }

  const resp = await damaiRequest.postRequest(JSON.stringify(sendData))
  console.log(resp)
}

// 生成data参数
function initDetailDataParam(itemId: string, dataType: number, performId: string) {
  const data = {
    itemId: itemId,
    bizCode: aliDamai,
    scenario: 'itemsku',
    exParams: initDetailExParams(dataType, performId),
    dmChannel: dmChannel
  }
  return JSON.stringify(data)
}

// 生成详情ExParams参数
function initDetailExParams(dataType: number, dataId: string) {
  const data = {
    dataType: dataType,
    dataId: dataId,
    privilegeActId: ''
  }
  return JSON.stringify(data)
}

// 生成通用参数
function initCommonParams() {
  const now = new Date().getTime()
  const params = {
    jsv: '2.7.2',
    appKey: paramsAppKey,
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

function initOrderParamData(itemId: string, ticketNum: number, skuId: string) {
  return JSON.stringify({
    buyNow: 'true',
    exParams: initOrderExParams(),
    buyParam: `${itemId}_${ticketNum}_${skuId}`,
    dmChannel: dmChannel
  })
}

function initOrderExParams() {
  return JSON.stringify({
    channel: 'damai_app',
    damai: '1',
    umpChannel: '100031004',
    subChannel: dmChannel,
    atomSplit: '1',
    serviceVersion: '2.0.0',
    customerType: 'default'
  })
}

function initBuildOrderParams() {
  const params = initCommonParams()

  params.v = paramsV4
  params.api = paramsApiOrder
  params.method = paramsMethodPost
  params.ttid = ttid
  params.globalCode = aliDamai

  return params
}
