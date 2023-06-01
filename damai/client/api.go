package client

import (
	"encoding/json"
	"fmt"
	"net/url"
	"time"

	"github.com/Lyyyttooon/vasespider/utils"
)

// api数据
const (
	detailApi = "https://mtop.damai.cn/h5/mtop.alibaba.damai.detail.getdetail/1.2/?"
)

// 固定参数
const (
	paramsJSV = "2.7.2"
	paramsAppKey = "12574478"

	paramsDatailApi = "mtop.alibaba.damai.detail.getdetail"
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
		V:                     "2.0",
		H5Request:             "true",
		AntiCreep:             "true",
		AntiFlood:             "true",
		Method:                "GET",
		TbEagleeyexScmProject: "20190509-aone2-join-test",
		RequestStart:          now - 1,
	}
}

// DetailParamsData 详情请求data结构体
type DetailParamsData struct {
	ItemId    string `json:"itemId"`
	DMChannel string `json:"dmChannel"`
}

// InitDetailParams 初始化DetailParam
func InitDetailParams(tickieId string) CommonParams {
	commonParam := initCommonParams()

	data := initDetailParamData(tickieId)

	commonParam.Sign = genSign("02ddaabc5dceb1d38decb2dbde13dd5e", commonParam.T, paramsAppKey, data)
	commonParam.Data = url.QueryEscape(data)
	commonParam.Api = paramsDatailApi

	return commonParam
}

// initDetailParamData 初始化DetailParamData
func initDetailParamData(tickieId string) string {
	data := DetailParamsData{
		ItemId:    tickieId,
		DMChannel: "damai@damaih5_h5",
	}
	stringData, _ := json.Marshal(data)

	return string(stringData)
}

// genSign 生成hash值
func genSign(token string, now int64, appKey string, data string) string {
	return utils.MD5(fmt.Sprintf("%s&%d&%s&%s", token, now, appKey, data))
}

// RequestTickDetail 请求票务详情
func RequestTickDetail(cookie, itemId string) {
	params := InitDetailParams(itemId)
	str := utils.ParseQuery(params)
	resp, _ := client.R().
		SetHeader("origin", "https://m.damai.cn/").
		SetHeader("referer", "https://m.damai.cn/").
		SetHeader("cookie", cookie).
		SetHeader("User-Agent", UserAgent).
		Get(detailApi + str)
	fmt.Println(resp.Request.RawRequest.URL)
	fmt.Println(resp)
}
