package client

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/Lyyyttooon/vasespider/utils"
	"github.com/go-resty/resty/v2"
)

const (
	detailApi = "https://mtop.damai.cn/h5/mtop.alibaba.damai.detail.getdetail/1.2/"
)

var client = resty.New()

const cookie = "_m_h5_tk=fd72759a5183b31dd142738f419e393a_1685544746290; _m_h5_tk_enc=412d4a6d4f62443fb194fbcf1a98f814; _samesite_flag_=true; cookie2=1d8b887e0a28c76f54ba2718316d9223; t=71330ebfc5d728473d1825c38aa3110d; _tb_token_=16dee5eeabe3; l=fBQmMP_nNwtth-NTBOfwPurza77OSIRAguPzaNbMi9fPOefB5sWPW1aouW86C3GRF6oMR35xJrbyBeYBqQd-nxv9OEhO3tkmn_sLn7C..; isg=BDo6UMetCsIlO4YuN6-y-Sa4i2Bc677FzdNSzEQz502MN9hxLHjO3IgBg-XrpzZd"

// Param 请求传输结构体
type Param struct {
	JSV                   string `json:"jsv"`
	AppKey                string `json:"appKey"`
	T                     int64  `json:"t"`
	Sign                  string `json:"sign"`
	Type                  string `json:"type"`
	DataType              string `json:"dataType"`
	V                     string `json:"v"`
	H5Request             bool   `json:"H5Request"`
	AntiCreep             bool   `json:"AntiCreep"`
	AntiFlood             bool   `json:"AntiFlood"`
	Api                   string `json:"api"`
	Method                string `json:"method"`
	TbEagleeyexScmProject string `json:"tb_eagleeyex_scm_project"`
	RequestStart          int64  `json:"requestStart"`
	Data                  string `json:"data"`
}

// ParamData Data结构体
type ParamData struct {
	ItemId    string `json:"itemId"`
	DMChannel string `json:"dmChannel"`
}

// InitParam 初始化Param
func InitParam(cookie string, tickieId string) map[string]string {
	data := initParamData(tickieId)
	now := int(time.Now().UnixMilli())
	s := fmt.Sprintf("%s&%s&%s&%s", "fd72759a5183b31dd142738f419e393a_1685544746290;", strconv.Itoa(now), "12574478", data)

	return map[string]string{
		"jsv":                      "2.7.2",
		"appKey":                   "12574478",
		"t":                        strconv.Itoa(now),
		"sign":                     utils.MD5(s),
		"type":                     "originaljson",
		"dataType":                 "json",
		"v":                        "2.0",
		"H5Request":                "true",
		"AntiCreep":                "true",
		"AntiFlood":                "true",
		"api":                      "mtop.alibaba.detail.subpage.getdetail",
		"method":                   "GET",
		"tb_eagleeyex_scm_project": "20190509-aone2-join-test",
		"requestStart":             strconv.Itoa(now - 1),
		"data":                     data,
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
	client.SetDebug(true)
	resp, _ := client.R().
		SetQueryParams(params).
		SetHeader("origin", "https://m.damai.cn/").
		SetHeader("referer", "https://m.damai.cn/").
		SetHeader("cookie", cookie).
		Get(detailApi)
	fmt.Println(resp.Request.RawRequest.URL)
	fmt.Println(resp)
}
