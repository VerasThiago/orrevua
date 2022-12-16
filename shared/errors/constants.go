package errors

type ErrorData struct {
	Type    string
	Message string
}

var (
	UNVERIFIED_ACCOUNT      = ErrorData{Type: "UNVERIFIED_ACCOUNT", Message: "Unverified account"}
	INVALID_PASSWORD        = ErrorData{Type: "INVALID_PASSWORD", Message: "Invalid password"}
	GENERIC_ERROR           = ErrorData{Type: "GENERIC_ERROR", Message: "There was an error regenerating. We've been notified and will look into it!"}
	DATA_ALREADY_BEGIN_USED = ErrorData{Type: "DATA_ALREADY_BEGIN_USED", Message: "Data is already being used"}
	DATA_NOT_FOUND          = ErrorData{Type: "DATA_NOT_FOUND", Message: "Data not found"}
	INVALID_INPUT           = ErrorData{Type: "INVALID_INPUT", Message: "Invalid Input"}
)
