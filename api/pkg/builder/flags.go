package builder

import (
	"github.com/spf13/viper"
)

const (
	envFilePath = ".env"
	envFileName = "api"
	envFileType = "env"
)

type Flags struct {
	Port string `mapstructure:"API_PORT"`
}

func (f *Flags) InitFromViper() (*Flags, error) {
	viper := viper.New()
	viper.AddConfigPath(envFilePath)
	viper.SetConfigName(envFileName)
	viper.SetConfigType(envFileType)

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
