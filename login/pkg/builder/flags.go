package builder

import (
	"os"

	"github.com/spf13/viper"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

type Flags struct {
	Port string `mapstructure:"LOGIN_PORT"`
}

func GetLoginFileConfigFromEnv() *shared.EnvFileConfig {
	env := shared.Environment(os.Getenv(shared.ENV_NAME))
	if env == "" {
		panic("empty TICKETS_ENV env variable i.e. [PRODUCTION, LOCAL, DOCKER]")
	}

	switch env {
	case shared.PRODUCTION:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "login.production",
			Type: "env",
		}
	case shared.DOCKER:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "login.docker",
			Type: "env",
		}
	case shared.LOCAL:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "login.local",
			Type: "env",
		}
	}

	panic("invalid TICKETS_ENV env variable i.e. [PRODUCTION, LOCAL, DOCKER]")
}

func (f *Flags) InitFromViper(config *shared.EnvFileConfig) (*Flags, error) {
	viper := viper.New()
	viper.AddConfigPath(config.Path)
	viper.SetConfigName(config.Name)
	viper.SetConfigType(config.Type)

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var flags Flags
	if err := viper.Unmarshal(&flags); err != nil {
		return nil, err
	}

	return &flags, nil
}
