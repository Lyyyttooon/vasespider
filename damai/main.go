package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/device"
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

func main() {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),
	)
	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, _ = context.WithTimeout(ctx, 30*time.Second)
	ctx, _ = chromedp.NewContext(ctx, chromedp.WithLogf(log.Printf))

	err := chromedp.Run(ctx,
		chromedp.Navigate("https://www.damai.cn"),
		chromedp.Emulate(device.IPhone13ProMax),
		chromedp.EmulateViewport(1284, 2778),
	)
	if err != nil {
		panic(err.Error())
	}

	// readConfig()
	// client.RequestTickDetail(viper.GetString("cookie"), viper.GetString("itemId"))
}
