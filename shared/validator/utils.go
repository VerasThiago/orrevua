package validator

import "net/url"

func MergeUrlValues(keys []string, values url.Values) (merged []string) {
	for _, key := range keys {
		if values.Has(key) {
			merged = append(merged, values.Get(key))
		}
	}
	return
}

func GetRulesKey(rule map[string][]string) []string {
	keys := make([]string, 0, len(rule))
	for k := range rule {
		keys = append(keys, k)
	}
	return keys
}
