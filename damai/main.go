package main

import (
	"fmt"
	"time"

	"github.com/Lyyyttooon/vasespider/damai/client"
)

func main() {
	c := client.InitClient()
	// c.TicketDetail()
	// c.PerformInfo()
	err := c.BuildOrder()
	if err != nil {
		fmt.Println(err)
		return
	}
	time.Sleep(10 * time.Millisecond)
	c.SubmitOrder()
}
