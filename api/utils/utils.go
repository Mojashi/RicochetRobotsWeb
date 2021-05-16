package utils

import (
	"encoding/base64"
	"os"
	"sync"
)

func Max(x, y int) int {
	if x > y {
		return x
	} else {
		return y
	}
}

func Min(x, y int) int {
	if x > y {
		return y
	} else {
		return x
	}
}

func CopySyncMap(m *sync.Map) *sync.Map {
	ret := &sync.Map{}
	m.Range(func(key, value interface{}) bool {
		ret.Store(key, value)
		return true
	})
	return ret
}

//エンコード
func EncodeBase64(path string) string {
	file, _ := os.Open(path)
	defer file.Close()

	fi, _ := file.Stat() //FileInfo interface
	size := fi.Size()    //ファイルサイズ

	data := make([]byte, size)
	file.Read(data)

	return base64.StdEncoding.EncodeToString(data)
}
