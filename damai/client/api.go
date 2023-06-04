package client

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"reflect"
	"strings"
	"time"

	"github.com/Lyyyttooon/vasespider/utils"
)

// UserAgent 浏览器UA
const UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"

// api数据
const (
	// detailUrl 详情url
	detailUrl = "https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/2.0/?"
	// orderUrl 订单生成url
	orderUrl = "https://mtop.damai.cn/h5/mtop.trade.order.build.h5/4.0/?"
	// submitUrl 订单提交url
	submitUrl = "https://mtop.damai.cn/h5/mtop.trade.order.create.h5/4.0/?"
)

// 固定参数
const (
	paramsJSV    = "2.7.2"
	paramsAppKey = "12574478"

	paramsV2 = "2.0"
	paramsV4 = "4.0"

	paramsApiDatail = "mtop.alibaba.detail.subpage.getdetail"
	paramsApiOrder  = "mtop.trade.order.build.h5"
	paramsApiSubmit = "mtop.trade.order.create.h5"

	paramsMethodGet  = "GET"
	paramsMethodPost = "POST"

	paramsTrue = "true"

	dmChannel = "damai@damaih5_h5"
	ttid      = "#t#ip##_h5_2014"
	aliDamai  = "ali.china.damai"
)

// CommonParams 通用请求传输结构体
type CommonParams struct {
	JSV                   string `json:"jsv" url:"jsv"`
	AppKey                string `json:"appKey" url:"appKey"`
	T                     int64  `json:"t" url:"t"`
	Sign                  string `json:"sign" url:"sign"`
	Type                  string `json:"type" url:"type"`
	DataType              string `json:"dataType" url:"dataType"`
	V                     string `json:"v" url:"v"`
	H5Request             string `json:"H5Request" url:"H5Request"`
	AntiCreep             string `json:"AntiCreep" url:"AntiCreep"`
	AntiFlood             string `json:"AntiFlood" url:"AntiFlood"`
	Api                   string `json:"api" url:"api"`
	Method                string `json:"method" url:"method"`
	Submitref             string `json:"submitref" url:"submitref"`
	Timeout               string `json:"timeout" url:"timeout"`
	IsSec                 string `json:"isSec" url:"ttid"`
	Ecode                 string `json:"ecode" url:"ttid"`
	Post                  string `json:"post" url:"post"`
	Ttid                  string `json:"ttid" url:"ttid"`
	GlobalCode            string `json:"globalCode" url:"globalCode"`
	TbEagleeyexScmProject string `json:"tb_eagleeyex_scm_project" url:"tb_eagleeyex_scm_project"`
	RequestStart          int64  `json:"requestStart" url:"requestStart"`
	Data                  string `json:"data" url:"data"`
}

// initCommonParams 生成通用参数
func initCommonParams() CommonParams {
	now := time.Now().UnixMilli()
	return CommonParams{
		JSV:                   paramsJSV,
		AppKey:                paramsAppKey,
		T:                     now,
		Type:                  "originaljson",
		DataType:              "json",
		H5Request:             paramsTrue,
		AntiCreep:             paramsTrue,
		AntiFlood:             paramsTrue,
		TbEagleeyexScmProject: "20190509-aone2-join-test",
		RequestStart:          now - 1,
	}
}

// DetailParamsData 详情请求data结构体
type DetailParamsData struct {
	ItemId    string `json:"itemId"`
	BizCode   string `json:"bizCode"`
	Scenario  string `json:"scenario"`
	DMChannel string `json:"dmChannel"`
	ExParams  string `json:"exParams"`
}

// initDetailParamData 初始化DetailParamData
func initDetailParamData(itemId string, dataType int, performId string) string {
	data := DetailParamsData{
		ItemId:    itemId,
		BizCode:   aliDamai,
		Scenario:  "itemsku",
		DMChannel: dmChannel,
		ExParams:  initDetailExParams(dataType, performId),
	}
	stringData, _ := json.Marshal(&data)

	return string(stringData)
}

type DetailExParams struct {
	DataType       int    `json:"dataType"`
	DataId         string `json:"dataId"`
	PrivilegeActId string `json:"privilegeActId"`
}

func initDetailExParams(dataType int, dataId string) string {
	data := DetailExParams{
		DataType:       dataType,
		DataId:         dataId,
		PrivilegeActId: "",
	}
	b, _ := json.Marshal(&data)
	return string(b)
}

// genSign 生成hash值
func genSign(token string, now int64, appKey string, data string) string {
	return utils.MD5(fmt.Sprintf("%s&%d&%s&%s", token, now, appKey, data))
}

// initDetailParams 初始化DetailParam
func initDetailParams(client *Client) CommonParams {
	params := initCommonParams()

	data := initDetailParamData(client.ItemId, 4, "")

	params.V = paramsV2
	params.Method = paramsMethodGet
	params.Sign = genSign(client.Token, params.T, paramsAppKey, data)
	params.Data = url.QueryEscape(data)
	params.Api = paramsApiDatail

	return params
}

// GetTickDetail 请求票务详情
func GetTickDetail(c *Client) {
	params := initDetailParams(c)
	str := utils.ParseQuery(params)
	resp, err := utils.Request(
		detailUrl+str,
		utils.RequestContext{
			Method: http.MethodGet,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
		},
	)
	fmt.Println(resp, err)
}

// initPerformInfoParams 初始化场次参数
func initPerformInfoParams(client *Client) CommonParams {
	params := initCommonParams()

	data := initDetailParamData(client.ItemId, 2, "211301573")

	params.V = paramsV2
	params.Method = paramsMethodGet
	params.Sign = genSign(client.Token, params.T, paramsAppKey, data)
	params.Data = url.QueryEscape(data)
	params.Api = paramsApiDatail

	return params
}

// GetPerformInfo 获取场次信息
func GetPerformInfo(c *Client) {
	params := initPerformInfoParams(c)
	str := utils.ParseQuery(params)
	resp, err := utils.Request(
		detailUrl+str,
		utils.RequestContext{
			Method: http.MethodGet,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
		},
	)
	fmt.Println(resp, err)
}

// 订单参数生成
func initBuildOrderParams(client *Client, data string) CommonParams {
	params := initCommonParams()

	params.Sign = genSign(client.Token, params.T, paramsAppKey, data)
	params.V = paramsV4
	params.Api = paramsApiOrder
	params.Method = paramsMethodPost
	params.Ttid = url.QueryEscape(ttid)
	params.GlobalCode = aliDamai

	return params
}

type OrderExParams struct {
	Channel        string `json:"channel"`
	Damai          string `json:"damai"`
	UmpChannel     string `json:"umpChannel"`
	SubChannel     string `json:"subChannel"`
	AtomSplit      string `json:"atomSplit"`
	ServiceVersion string `json:"serviceVersion"`
	CustomerType   string `json:"customerType"`
}

func initOrderExParams() string {
	data := OrderExParams{
		Channel:        "damai_app",
		Damai:          "1",
		UmpChannel:     "100031004",
		SubChannel:     dmChannel,
		AtomSplit:      "1",
		ServiceVersion: "2.0.0",
		CustomerType:   "default",
	}
	b, _ := json.Marshal(&data)
	return string(b)
}

type OrderData struct {
	BugNow    string `json:"buyNow"`
	ExParams  string `json:"exParams"`
	BuyParam  string `json:"buyParam"`
	DmChannel string `json:"dmChannel"`
}

func initOrderParamData(itemId, skuId string, ticketNum int) string {
	data := OrderData{
		BugNow:    paramsTrue,
		ExParams:  initOrderExParams(),
		BuyParam:  fmt.Sprintf("%s_%d_%s", itemId, ticketNum, skuId),
		DmChannel: dmChannel,
	}
	b, _ := json.Marshal(&data)
	return string(b)
}

func initBuildOrderForm(c *Client, data string) io.Reader {
	arr := []map[string]string{
		{
			"data": data,
		},
		{
			"bx-ua": c.BxUa,
		},
		{
			"bx-umidtoken": c.BxUmidtoken,
		},
	}
	return utils.NewForm(arr...)
}

// 生成订单
func BuildOrder(c *Client) {
	data := initOrderParamData(c.ItemId, c.SkuId, c.TicketNum)
	params := initBuildOrderParams(c, data)
	paramsStr := utils.ParseQuery(params)
	formData := initBuildOrderForm(c, data)
	resp, err := utils.Request(
		orderUrl+paramsStr,
		utils.RequestContext{
			Method: http.MethodPost,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
			Body: formData,
		},
	)
	fmt.Println(resp, err)
}

type OrderInfo struct {
	Data      map[string]interface{} `json:"data"`
	Global    OrderInfoGlobal        `json:"global"`
	Hierarchy OrderInfoHierarchy     `json:"hierarchy"`
	Linkage   OrderInfoLinkage       `json:"linkage"`
}

type OrderInfoGlobal struct {
	SecretKey   string `json:"secretKey"`
	SecretValue string `json:"secretValue"`
}

type OrderInfoHierarchy struct {
	Component []string            `json:"component"`
	Root      string              `json:"root"`
	BaseType  []string            `json:"base_type"`
	Structure map[string][]string `json:"structure"`
}

type OrderInfoLinkage struct {
	Input     []string               `json:"input"`
	Request   []string               `json:"request"`
	Signature string                 `json:"signature"`
	Common    OrderInfoLinkageCommon `json:"common"`
}

type OrderInfoLinkageCommon struct {
	QueryParams    string `json:"queryParams"`
	Compress       bool   `json:"compress"`
	ValidateParams string `json:"validate_params"`
	Structures     string `json:"structures"`
	SubmitParams   string `json:"submit_params"`
}

func initSubmitParams(submitref string) CommonParams {
	params := initCommonParams()

	params.Api = paramsApiSubmit
	params.V = paramsV4
	params.Submitref = submitref
	params.Timeout = "15000"
	params.IsSec = "1"
	params.Ecode = "1"
	params.Post = "1"
	params.Ttid = ttid
	params.GlobalCode = aliDamai

	return params
}

// SubmitOrder 提交订单
func SubmitOrder(c *Client, orderInfo *OrderInfo) {
	orderData := map[string]interface{}{}

	for _, v := range orderInfo.Linkage.Input {
		if strings.HasPrefix(v, "dmViewer_") {
			item := orderInfo.Data[v].(map[string]interface{})
			viewerList := item["fields"].(map[string]interface{})["viewerList"]
			if reflect.TypeOf(viewerList).Kind() == reflect.Slice && len(viewerList.([]interface{})) > 0 {
				if len(viewerList.([]interface{})) < c.TicketNum {
					fmt.Println("实际观演人数小于实际购票数量，购票数量会被设为实际观演人数")
					c.TicketNum = len(viewerList.([]interface{}))
				}
				for i := 0; i < c.TicketNum; i++ {
					item["fields"].(map[string]interface{})["viewerList"].([]interface{})[i].(map[string]interface{})["isUsed"] = true
				}
			}
			orderData[v] = item
		} else {
			orderData[v] = orderInfo.Data[v]
		}
	}

	confirmOrderKey := orderInfo.Hierarchy.Root
	orderData[confirmOrderKey] = orderInfo.Data[confirmOrderKey]

	keysList := orderInfo.Hierarchy.Structure[confirmOrderKey]
	for _, v := range keysList {
		if strings.HasPrefix(v, "order_") {
			orderData[v] = orderInfo.Data[v]
		}
	}

	orderHierarchy := map[string]interface{}{
		"structure": orderInfo.Hierarchy.Structure,
	}

	orderLinkage := map[string]interface{}{
		"common": map[string]interface{}{
			"compress":       orderInfo.Linkage.Common.Compress,
			"submitParams":   orderInfo.Linkage.Common.SubmitParams,
			"validateParams": orderInfo.Linkage.Common.ValidateParams,
		},
		"signature": orderInfo.Linkage.Signature,
	}

	submitOrderParams := initSubmitParams(orderInfo.Global.SecretValue)
	submitOrderParamsStr := utils.ParseQuery(submitOrderParams)

	feature := map[string]string{
		"subChannel":     "damai@damaih5_h5",
		"returnUrl":      "https://m.damai.cn/damai/pay-success/index.html?spm=a2o71.orderconfirm.bottom.dconfirm&sqm=dianying.h5.unknown.value",
		"serviceVersion": "2.0.0",
		"dataTags":       "sqm:dianying.h5.unknown.value",
	}

	orderDataB, _ := json.Marshal(&orderData)
	orderHierarchyB, _ := json.Marshal(&orderHierarchy)
	orderLinkageB, _ := json.Marshal(&orderLinkage)
	params := map[string]string{
		"data":      string(orderDataB),
		"hierarchy": string(orderHierarchyB),
		"linkage":   string(orderLinkageB),
	}

	paramsB, _ := json.Marshal(&params)
	featureB, _ := json.Marshal(&feature)
	submitOrderData := map[string]string{
		"params":  string(paramsB),
		"feature": string(featureB),
	}
	sumitOrderDataB, _ := json.Marshal(&submitOrderData)
	fmt.Println(sumitOrderDataB)

	resp, err := utils.Request(
		submitUrl+submitOrderParamsStr,
		utils.RequestContext{
			Method: http.MethodPost,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
			// Body: string(sumitOrderDataB),
		},
	)
	fmt.Println(resp, err)
}
