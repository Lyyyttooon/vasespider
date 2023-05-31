package main

import (
	"fmt"
	"vasespider/damai/client"
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
