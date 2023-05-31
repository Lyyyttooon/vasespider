package utils

import (
	"crypto/md5"
	"fmt"
)

// MD5 md5哈希
func MD5(str string) string {
	data := []byte(str) //切片
	has := md5.Sum(data)
	md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
	return md5str
}
