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
	detailApi = "https://mtop.damai.cn/h5/mtop.alibaba.damai.detail.getdetail/1.2"
)

var client = resty.New()

const cookie = "_m_h5_tk=e4ebc9b8f9dcae8a57e20ff6b24aac9d_1685533582032; _m_h5_tk_enc=f5406d740eb2626d33b3a16c268293fa; isg=BL-_Qy8354EJk-OdVSLninK9TpJJpBNGMh0_ylGMWm62YN3iWXWAlRt2pjaePOu-"

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
	ItemId    string `json:"item_id"`
	DMChannel string `json:"dm_channel"`
}

// InitParam 初始化Param
func InitParam(cookie string, tickieId string) map[string]string {
	data := initParamData(tickieId)
	now := int(time.Now().UnixMilli())
	s := fmt.Sprintf("%s&%s&%s&%s", cookie, strconv.Itoa(now), "12574478", data)

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
	resp, _ := client.R().
		SetQueryParams(params).
		Get(detailApi)
	fmt.Println(resp)
}
