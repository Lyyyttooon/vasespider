package client

import (
	"encoding/json"
	"net/http"

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
	return utils.NewForm(arr...)
}

func request(url string, params CommonParams, body interface{}, c *Client) (*utils.ResponseData, error) {
	bodyB, _ := json.Marshal(body)
	bodyStr := string(bodyB)
	params.Sign = genSign(c.Token, params.T, paramsAppKey, bodyStr)
	paramsStr := utils.ParseQuery(params)
	form := buildFormData(c, bodyStr, c.BxUa)

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
