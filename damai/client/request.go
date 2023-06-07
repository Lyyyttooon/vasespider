package client

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/Lyyyttooon/vasespider/utils"
)

func buildFormData(c *Client, data, bxUa string) []byte {
	arr := []map[string]string{
		{
			"data": data,
		},
		{
			"bx-ua": bxUa,
		},
		{
			"bx-umidtoken": c.BxUmidtoken,
		},
	}

	str := ""
	for _, v := range arr {
		for sk, sv := range v {
			str += fmt.Sprintf("%s=%s&", sk, url.QueryEscape(sv))
		}
	}
	str = str[:len(str)-1]

	return []byte(str)
}

func request(url string, params CommonParams, body string, c *Client) (*utils.ResponseData, error) {
	params.Sign = genSign(c.Token, params.T, paramsAppKey, body)
	paramsStr := utils.ParseQuery(params)
	form := buildFormData(c, body, c.BxUa[0])
	if len(c.BxUa) > 1 {
		c.BxUa = c.BxUa[1:]
	}
	fmt.Println(string(form))

	resp, err := utils.Request(
		url+paramsStr,
		utils.RequestContext{
			Method: http.MethodPost,
			Headers: map[string]string{
				"origin":     "https://m.damai.cn",
				"referer":    "https://m.damai.cn/",
				"cookie":     c.Cookie,
				"User-Agent": UserAgent,
			},
			Body: form,
		},
	)
	return resp, err
}
