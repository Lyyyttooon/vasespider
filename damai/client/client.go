package client

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// readConfig 读取配置
func readConfig() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
}

// Client 客户端参数
type Client struct {
	Cookie        string
	Token         string
	TokenWithTime string

	ItemId     string
	SkuId      string
	SessionNum int
	TicketNum  int

	BxUa        string
	BxUmidtoken string
	orderInfo   *OrderInfo
}

// InitClient 初始化客户端
func InitClient() Client {
	readConfig()
	client := Client{
		Cookie:      viper.GetString("cookie"),
		ItemId:      viper.GetString("itemId"),
		SkuId:       "5016701340284",
		SessionNum:  viper.GetInt("sessionNum"),
		TicketNum:   viper.GetInt("ticketNum"),
		BxUa:        viper.GetString("bxUa"),
		BxUmidtoken: viper.GetString("bxUmidtoken"),
	}
	client.Token, client.TokenWithTime = parseCookie(client.Cookie)
	return client
}

func (c *Client) TicketDetail() {
	GetTickDetail(c)
}

func (c *Client) PerformInfo() {
	GetPerformInfo(c)
}

func (c *Client) BuildOrder() {
	BuildOrder(c)
}

func (c *Client) SubmitOrder() {
	SubmitOrder(c, c.orderInfo)
}

// parseCookie 解析cookie
func parseCookie(cookie string) (token, tokenWithTime string) {
	str := strings.ReplaceAll(cookie, " ", "")
	strs := strings.Split(str, ";")
	for i := 0; i < len(strs); i++ {
		if strings.Contains(strs[i], "_m_h5_tk=") {
			str = strs[i]
		}
	}
	tokenWithTime = strings.Split(str, "=")[1]
	token = strings.Split(tokenWithTime, "_")[0]
	return
}
