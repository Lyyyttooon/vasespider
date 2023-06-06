package utils

import (
	"bytes"
	"io"
	"net/http"
	"net/url"
	"strings"
)

// Request 请求
func Request(url string, RequestData RequestContext) (*ResponseData, error) {
	req, err := http.NewRequest(RequestData.Method, url, bytes.NewReader(RequestData.Body))
	if err != nil {
		return nil, err
	}

	RequestData.req = req
	RequestData.setHeaders()

	return RequestData.do()
}

// Request 请求结构体
type RequestContext struct {
	Method  string
	Headers map[string]string
	Body    []byte

	req *http.Request
}

// setHeaders 设置请求头
func (r *RequestContext) setHeaders() {
	r.req.Header.Add("Content-type", "application/x-www-form-urlencoded")
	for i := range r.Headers {
		r.req.Header.Add(i, r.Headers[i])
	}
}

// do 发送请求
func (r *RequestContext) do() (*ResponseData, error) {
	res, err := http.DefaultClient.Do(r.req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	response := &ResponseData{Res: res}
	response.body, err = io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return response, err
}

// Response 响应结构体
type ResponseData struct {
	Res *http.Response

	body []byte
}

func (r *ResponseData) Body() []byte {
	return r.body
}

func (r *ResponseData) String() string {
	return strings.TrimSpace(string(r.body))
}

func NewForm(items ...map[string]string) []byte {
	formValues := url.Values{}
	for _, v := range items {
		for sk, sv := range v {
			formValues.Set(sk, sv)
		}
	}
	return []byte(formValues.Encode())
}
