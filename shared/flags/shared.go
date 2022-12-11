package flags

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

const (
	DEPLOY_ENV string = "ORREVUA_DEPLOY_ENV"

	DEPLOY_LOCAL      string = "local"
	DEPLOY_DOCKER     string = "docker"
	DEPLOY_PRODUCTION string = "production"

	ENV_FILE_PATH string = ".env"
	ENV_FILE_TYPE string = "env"

	SHARED_PACKAGE_NAME = "shared"
	SHARED_PACKAGE_PATH = "../shared"
)

var AVAILABLE_ENV_VARS_MAP = map[string]bool{
	"production": true,
	"local":      true,
	"docker":     true,
}

type SharedFlags struct {
	Deploy            string
	AppHost           string `mapstructure:"APP_HOST"`
	DatabaseHost      string `mapstructure:"DB_HOST"`
	DatabasePort      string `mapstructure:"DB_PORT"`
	DatabaseUser      string `mapstructure:"DB_USER"`
	DatabasePassword  string `mapstructure:"DB_PASSWORD"`
	DatabaseName      string `mapstructure:"DB_NAME"`
	DatabaseSSLMode   string `mapstructure:"DB_SSLMODE"`
	DatabaseTimeZone  string `mapstructure:"DB_TIMEZONE"`
	SMTPEmailLogin    string `mapstructure:"SMTP_SRC_EMAIL_LOGIN"`
	SMTPEmailPassword string `mapstructure:"SMTP_EMAIL_PASSWORD"`
	SMTPEmailIdentity string `mapstructure:"SMTP_IDENTITY"`
	SMTPEmailHost     string `mapstructure:"SMTP_HOST"`
	SMTPEmailPort     string `mapstructure:"SMTP_PORT"`
	JwtKey            string `mapstructure:"JWT_KEY"`
	JwtKeyEmail       string `mapstructure:"JWT_KEY_EMAIL"`
}

type EnvFileConfig struct {
	Path string
	Name string
	Type string
}

func getDeployEnv() string {
	env := os.Getenv(DEPLOY_ENV)
	if _, ok := AVAILABLE_ENV_VARS_MAP[string(env)]; !ok {
		panic("invalid ORREVUA_DEPLOY_ENV env variable i.e. [production, local, docker]")
	}
	return env
}

func GetFileEnvConfigFromDeployEnv(serviceName string) *EnvFileConfig {
	deployEnv := getDeployEnv()

	var filePath string = ENV_FILE_PATH
	fileName := fmt.Sprintf("%v.%v.env", serviceName, deployEnv)

	if serviceName == SHARED_PACKAGE_NAME {
		filePath = fmt.Sprintf("%+v/%+v", SHARED_PACKAGE_PATH, ENV_FILE_PATH)
	}

	return &EnvFileConfig{
		Path: filePath,
		Name: fileName,
		Type: ENV_FILE_TYPE,
	}
}

func (f *SharedFlags) InitFromViper(config *EnvFileConfig) (*SharedFlags, error) {
	viper := viper.New()
	viper.AddConfigPath(config.Path)
	viper.SetConfigName(config.Name)
	viper.SetConfigType(config.Type)

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var flags SharedFlags
	if err := viper.Unmarshal(&flags); err != nil {
		return nil, err
	}

	flags.Deploy = getDeployEnv()

	return &flags, nil
}
