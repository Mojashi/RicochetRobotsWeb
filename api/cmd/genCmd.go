package cmd

import (
	"github.com/Mojashi/RicochetRobots/api/gen"
	"github.com/spf13/cobra"
)

func genCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "gen",
		Short: "gen problem",
		RunE: func(cmd *cobra.Command, args []string) error {
			gen.Gen()
			return nil
		},
	}

	return cmd
}
