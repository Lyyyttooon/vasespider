package main

import (
	"github.com/Lyyyttooon/vasespider/damai/client"
)

func main() {
	c := client.InitClient()
	// c.TicketDetail()
	c.BuildOrder()
	c.SubmitOrder()
}
