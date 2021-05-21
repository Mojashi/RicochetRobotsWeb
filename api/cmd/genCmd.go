package cmd

import (
	"github.com/Mojashi/RicochetRobots/api/gen"
	"github.com/spf13/cobra"
)

func genCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "gen 0 0",
		Short: "gen problem",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			gen.Gen(args[0] == "1", args[1] == "1")
			return nil
		},
	}

	return cmd
}
