package builder

import (
	"os"

	shared "github.com/verasthiago/tickets-generator/shared/flags"

	"github.com/spf13/viper"
)

type Flags struct {
	Port string `mapstructure:"API_PORT"`
}

func (f *Flags) InitFromViper(envConfigFile *shared.EnvFileConfig) (*Flags, error) {
	viper := viper.New()
	viper.AddConfigPath(envConfigFile.Path)
	viper.SetConfigName(envConfigFile.Name)
	viper.SetConfigType(envConfigFile.Type)

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

func GetApiFileConfigFromEnv() *shared.EnvFileConfig {
	env := shared.Environment(os.Getenv(shared.ENV_NAME))
	switch env {
	case shared.PRODUCTION:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "api.production",
			Type: "env",
		}
	case shared.DOCKER:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "api.docker",
			Type: "env",
		}
	case shared.LOCAL:
		return &shared.EnvFileConfig{
			Path: ".env",
			Name: "api.local",
			Type: "env",
		}
	}
	panic("invalid TICKETS_ENV env variable")
}
