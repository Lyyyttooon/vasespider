package client

import (
	"github.com/go-resty/resty/v2"
)

// UserAgent 浏览器UA
const UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"

// client http客户端
var client = resty.New()

// Client 客户端参数
type Client struct {
	Cookie        string
	Token         string
	TokenWithTime string

	SessionNum int
	TicketNum  int
}

func ParseCookie() {

}
