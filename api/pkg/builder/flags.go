package builder

import (
	shared "github.com/verasthiago/tickets-generator/shared/flags"

	"github.com/spf13/viper"
)

type Flags struct {
	Port    string `mapstructure:"API_PORT"`
	WebPort string `mapstructure:"WEB_PORT"`
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
