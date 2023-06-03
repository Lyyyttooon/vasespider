package client

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
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
)

// 固定参数
const (
	paramsJSV    = "2.7.2"
	paramsAppKey = "12574478"

	paramsV2 = "2.0"
	paramsV4 = "4.0"

	paramsApiDatail = "mtop.alibaba.detail.subpage.getdetail"
	paramsApiOrder  = "mtop.trade.order.build.h5"

	paramsMethodGet  = "GET"
	paramsMethodPost = "POST"

	paramsTrue = "true"

	dmChannel = "damai@damaih5_h5"
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
		V:                     paramsV2,
		H5Request:             paramsTrue,
		AntiCreep:             paramsTrue,
		AntiFlood:             paramsTrue,
		Method:                paramsMethodGet,
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
		BizCode:   "ali.china.damai",
		Scenario:  "itemsku",
		DMChannel: dmChannel,
		ExParams:  initDetailExParams(dataType, performId),
	}
	stringData, _ := json.Marshal(data)

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
	b, _ := json.Marshal(data)
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
func initBuildOrderParams() CommonParams {
	params := initCommonParams()

	params.V = paramsV4
	params.Api = paramsApiOrder
	params.Method = paramsMethodPost
	params.Ttid = "#t#ip##_h5_2014"
	params.GlobalCode = "ali.china.damai"

	return params
}

type OrderExParams struct {
	Channel        string `json:"channel"`
	Damai          string `json:"damai"`
	UmpChannel     string `json:"UmpChannel"`
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
	b, _ := json.Marshal(data)
	return string(b)
}

type OrderData struct {
	BugNow    string
	ExParams  string
	BuyParam  string
	DmChannel string
}

func initOrderParamData(itemId, skuId string, ticketNum int) string {
	data := OrderData{
		BugNow:    paramsTrue,
		ExParams:  initOrderExParams(),
		BuyParam:  fmt.Sprint("%s_%d_%s", itemId, ticketNum, skuId),
		DmChannel: dmChannel,
	}
	b, _ := json.Marshal(data)
	return string(b)
}

// 生成订单
func BuildOrder(c *Client) {
	itemId, skuId := "720545258599", "5016701340283"

	params := initBuildOrderParams()
	paramsStr := utils.ParseQuery(params)
	data := initOrderParamData(itemId, skuId, c.TicketNum)
	resp, err := utils.Request(
		orderUrl+paramsStr,
		utils.RequestContext{
			Method: http.MethodGet,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
			Body: data,
		},
	)
	fmt.Println(resp, err)
}

func SubmitOrder() {

}
