package client

import (
	"github.com/go-resty/resty/v2"
)

// UserAgent 浏览器UA
const UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"

// client http客户端
var client = resty.New()

// cookie 临时cookie
const cookie = "_m_h5_tk=20071fdac63b5c2af27885ebfd67f770_1685598510504; _m_h5_tk_enc=179f5ac9c6ceedea7b030e4b265d107a; isg=BB0dKzZ1JcTvBMHoQgF1ZsUaLPgXOlGMRIudkN_iP3SmljzIpYhnXv5AwIqQUmlE"

type Client struct {
	Cookie        string
	Token         string
	TokenWithTime string
}

func ParseCookie() {

}
