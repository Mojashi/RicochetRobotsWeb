package cmd

import (
	"github.com/Mojashi/RicochetRobots/api/apiServer"
	"github.com/spf13/cobra"
)

// RootCmd is root command
var RootCmd = &cobra.Command{
	Use:   "api",
	Short: "run api server",
	Run: func(cmd *cobra.Command, args []string) {
		apiServer.Run()
	},
}

func init() {
	cobra.OnInitialize()
	RootCmd.AddCommand(
		genCmd(),
		getTwitterPicCmd(),
	)
}
