package main

import (
	"fmt"

	"github.com/Lyyyttooon/vasespider/damai/client"
	"github.com/spf13/viper"
)

// readConfig 读取配置
func readConfig() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil { // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
}

func main() {
	readConfig()
	client.RequestTickDetail(viper.GetString("cookie"), viper.GetString("itemId"))
}
