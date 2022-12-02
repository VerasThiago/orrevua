package shared

import "github.com/spf13/viper"

const (
	envFilePath = "../shared/.env"
	envFileName = "shared"
	envFileType = "env"
)

type SharedFlags struct {
	DatabaseHost     string `mapstructure:"DB_HOST"`
	DatabasePort     string `mapstructure:"DB_PORT"`
	DatabaseUser     string `mapstructure:"DB_USER"`
	DatabasePassword string `mapstructure:"DB_PASSWORD"`
	DatabaseName     string `mapstructure:"DB_NAME"`
	DatabaseSSLMode  string `mapstructure:"DB_SSLMODE"`
	DatabaseTimeZone string `mapstructure:"DB_TIMEZONE"`
	JwtKey           string `mapstructure:"JWT_KEY"`
}

func (f *SharedFlags) InitFromViper() (*SharedFlags, error) {
	viper := viper.New()
	viper.AddConfigPath(envFilePath)
	viper.SetConfigName(envFileName)
	viper.SetConfigType(envFileType)

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
