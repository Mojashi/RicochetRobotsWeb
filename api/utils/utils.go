package utils

import "sync"

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
