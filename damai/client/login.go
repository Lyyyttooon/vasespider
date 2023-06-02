package client

import (
	"context"
	"log"
	"time"

	"github.com/chromedp/chromedp"
)

func QRCode() {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),
	)
	ctx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, _ = context.WithTimeout(ctx, 30*time.Second)
	ctx, _ = chromedp.NewContext(ctx, chromedp.WithLogf(log.Printf))

	err := chromedp.Run(
		ctx,
		chromedp.Navigate("https://passport.damai.cn/login"),
	)
	if err != nil {
		panic(err.Error())
	}
}
