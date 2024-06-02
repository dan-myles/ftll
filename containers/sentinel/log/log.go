package log

import (
	"os"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	Logger    *zap.SugaredLogger
	LOG_LEVEL string
)

func Init() {
	// Load logging level from .env file
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	LOG_LEVEL = os.Getenv("LOG_LEVEL")

	debugCfg := zap.Config{
		Encoding:         "console",
		Level:            zap.NewAtomicLevelAt(zapcore.DebugLevel),
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey: "message",

			LevelKey:    "level",
			EncodeLevel: zapcore.CapitalColorLevelEncoder,

			TimeKey:    "time",
			EncodeTime: zapcore.ISO8601TimeEncoder,

			CallerKey:    "caller",
			EncodeCaller: zapcore.ShortCallerEncoder,
		},
	}

	infoCfg := zap.Config{
		Encoding:         "console",
		Level:            zap.NewAtomicLevelAt(zapcore.InfoLevel),
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey: "message",

			LevelKey:    "level",
			EncodeLevel: zapcore.CapitalColorLevelEncoder,

			TimeKey:    "time",
			EncodeTime: zapcore.ISO8601TimeEncoder,

			CallerKey:    "caller",
			EncodeCaller: zapcore.ShortCallerEncoder,
		},
	}

	var logger *zap.Logger

	switch LOG_LEVEL {
	case "debug":
		logger, err = debugCfg.Build()
		if err != nil {
			panic(err)
		}
	case "info":
		logger, err = infoCfg.Build()
		if err != nil {
			panic(err)
		}
	default:
		logger, err = infoCfg.Build()
		if err != nil {
			panic(err)
		}
	}

	Logger = logger.Sugar()
}
