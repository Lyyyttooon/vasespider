package client

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"time"

	"github.com/Lyyyttooon/vasespider/utils"
)

const (
	detailApi = "https://mtop.damai.cn/h5/mtop.alibaba.damai.detail.getdetail/1.2/?"
)

// DetailParam 详情请求传输结构体
type DetailParam struct {
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

// DetailParamData 详情请求data结构体
type DetailParamData struct {
	ItemId    string `json:"itemId"`
	DMChannel string `json:"dmChannel"`
}

// InitDetailParam 初始化DetailParam
func InitDetailParam(cookie string, tickieId string) DetailParam {
	data := initDetailParamData(tickieId)
	now := time.Now().UnixMilli()
	s := fmt.Sprintf("%s&%s&%s&%s", "20071fdac63b5c2af27885ebfd67f770", strconv.Itoa(int(now)), "12574478", data)

	return DetailParam{
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

// initDetailParamData 初始化DetailParamData
func initDetailParamData(tickieId string) string {
	data := DetailParamData{
		ItemId:    tickieId,
		DMChannel: "damai@damaih5_h5",
	}
	stringData, _ := json.Marshal(data)

	return string(stringData)
}

func RequestTickDetail() {
	params := InitDetailParam(cookie, "720545258599")
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
