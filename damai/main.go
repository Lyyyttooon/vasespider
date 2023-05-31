package main

import (
	"fmt"

	"github.com/Lyyyttooon/vasespider/damai/client"
)

type TickiesDetail struct {
}

type Temp struct {
	Answer string
	Forced bool
	Image  string
}

func main() {
	fmt.Println("Hello, Damai")
	client.RequestTickDetail()
}
