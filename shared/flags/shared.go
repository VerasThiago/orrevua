package flags

import (
	"os"

	"github.com/spf13/viper"
)

const (
	PRODUCTION Environment = "PRODUCTION"
	LOCAL      Environment = "LOCAL"
	DOCKER     Environment = "DOCKER"
	ENV_NAME   string      = "TICKETS_ENV"
)

type SharedFlags struct {
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

type Environment string

type EnvFileConfig struct {
	Path string
	Name string
	Type string
}

func GetSharedFileConfigFromEnv() *EnvFileConfig {
	env := Environment(os.Getenv(ENV_NAME))
	if env == "" {
		panic("empty TICKETS_ENV env variable i.e. [PRODUCTION, LOCAL, DOCKER]")
	}

	switch env {
	case PRODUCTION:
		return &EnvFileConfig{
			Path: ".env",
			Name: "shared.production",
			Type: "env",
		}
	case DOCKER:
		return &EnvFileConfig{
			Path: ".env",
			Name: "shared.docker",
			Type: "env",
		}
	case LOCAL:
		return &EnvFileConfig{
			Path: "../shared/.env",
			Name: "shared.local",
			Type: "env",
		}
	}

	panic("invalid TICKETS_ENV env variable i.e. [PRODUCTION, LOCAL, DOCKER]")
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

	return &flags, nil
}
