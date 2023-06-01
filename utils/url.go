package utils

import (
	"fmt"
	"reflect"
	"strconv"
)

func ParseQuery(data interface{}) string {
	t := reflect.TypeOf(data)
	v := reflect.ValueOf(data)
	str := ""
	for i := 0; i < t.NumField(); i++ {
		if i != 0 {
			switch v.Field(i).Kind() {
			case reflect.String:
				str += fmt.Sprintf("&%s=%s", t.Field(i).Tag.Get("url"), v.Field(i).String())
			case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
				str += fmt.Sprintf("&%s=%s", t.Field(i).Tag.Get("url"), intEncoder(v.Field(i)))
			}
			continue
		}
		switch v.Field(i).Kind() {
		case reflect.String:
			str += fmt.Sprintf("%s=%s", t.Field(i).Tag.Get("url"), v.Field(i).String())
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			str += fmt.Sprintf("%s=%s", t.Field(i).Tag.Get("url"), intEncoder(v.Field(i)))
		}
	}
	return str
}

func intEncoder(v reflect.Value) string {
	return strconv.FormatInt(v.Int(), 10)
}
