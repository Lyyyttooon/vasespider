package client

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"time"

	"github.com/Lyyyttooon/vasespider/utils"
	"github.com/go-resty/resty/v2"
)

const (
	UserAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1474.0"
)

const (
	detailApi = "https://mtop.damai.cn/h5/mtop.alibaba.damai.detail.getdetail/1.2/?"
)

var client = resty.New()

const cookie = "_m_h5_tk=20071fdac63b5c2af27885ebfd67f770_1685598510504; _m_h5_tk_enc=179f5ac9c6ceedea7b030e4b265d107a; isg=BB0dKzZ1JcTvBMHoQgF1ZsUaLPgXOlGMRIudkN_iP3SmljzIpYhnXv5AwIqQUmlE"

// Param 请求传输结构体
type Param struct {
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

// ParamData Data结构体
type ParamData struct {
	ItemId    string `json:"itemId"`
	DMChannel string `json:"dmChannel"`
}

// InitParam 初始化Param
func InitParam(cookie string, tickieId string) Param {
	data := initParamData(tickieId)
	now := time.Now().UnixMilli()
	s := fmt.Sprintf("%s&%s&%s&%s", "20071fdac63b5c2af27885ebfd67f770", strconv.Itoa(int(now)), "12574478", data)

	return Param{
		JSV:                   "2.7.2",
		AppKey:                "12574478",
		T:                     now,
		Sign:                  utils.MD5(s),
		Type:                  "originaljson",
		DataType:              "json",
		V:                     "2.0",
		H5Request:             "true",
		AntiCreep:             "true",
		AntiFlood:             "true",
		Api:                   "mtop.alibaba.detail.subpage.getdetail",
		Method:                "GET",
		TbEagleeyexScmProject: "20190509-aone2-join-test",
		RequestStart:          now - 1,
		Data:                  url.QueryEscape(data),
	}
}

// initParamData 初始化ParamData
func initParamData(tickieId string) string {
	data := ParamData{
		ItemId:    tickieId,
		DMChannel: "damai@damaih5_h5",
	}
	stringData, _ := json.Marshal(data)

	return string(stringData)
}

func RequestTickDetail() {
	params := InitParam(cookie, "720545258599")
	str := utils.ParseQuery(params)
	fmt.Println(str)
	client.SetDebug(true)
	resp, _ := client.R().
		SetHeader("origin", "https://m.damai.cn/").
		SetHeader("referer", "https://m.damai.cn/").
		SetHeader("cookie", cookie).
		SetHeader("User-Agent", UserAgent).
		Get(detailApi + str)
	fmt.Println(resp.Request.RawRequest.URL)
	fmt.Println(resp)
}
