package utils

import (
	"github.com/spf13/viper"
	"log"
)

type environment struct {
	DatabaseUrl string
	SecretKey   string
}

var Env *environment

func LoadEnv() {
	v := viper.New()
    v.SetConfigFile(".env")
	v.AutomaticEnv()
    err := v.ReadInConfig()
    if err != nil {
        log.Fatal("Unable to read env vairables.")
    }

    e := new(environment)
	errUnmarshal := v.Unmarshal(&e)
	if errUnmarshal != nil {
		log.Fatalf("Unable to load environment: %s", errUnmarshal)
	}

    Env = e
}
