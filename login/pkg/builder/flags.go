package builder

import (
	"github.com/spf13/viper"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

type Flags struct {
	Port    string `mapstructure:"LOGIN_PORT"`
	WebPort string `mapstructure:"WEB_PORT"`
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
