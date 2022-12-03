package constants

import "time"

const (
	APP_TOKEN_EXPIRE_TIME            = 3 * time.Hour
	VERIFY_EMAIL_TOKEN_EXPIRE_TIME   = 1 * time.Hour
	RESET_PASSWORD_TOKEN_EXPIRE_TIME = 15 * time.Minute

	TOKEN_REGEX = "^[A-Za-z0-9_-]{2,}(?:\\.[A-Za-z0-9_-]{2,}){2}$"
	TOKEN_RULE  = "regex:" + TOKEN_REGEX
)
