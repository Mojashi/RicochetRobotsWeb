package cmd

import (
	"github.com/Mojashi/RicochetRobots/api/gen"
	"github.com/spf13/cobra"
)

var (
	torus  int    = 0
	mirror int    = 0
	remote string = ""
)

func genCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "gen -T 1 -M 0 -P http://127.0.0.1",
		Short: "gen problem (and add to remote server)",
		RunE: func(cmd *cobra.Command, args []string) error {
			gen.Gen(torus, mirror, remote)
			return nil
		},
	}

	cmd.Flags().IntVarP(&torus, "torus", "T", 0, "gen torus problem")
	cmd.Flags().IntVarP(&mirror, "mirror", "M", 0, "gen mirror problem")
	cmd.Flags().StringVar(&remote, "remote", "", "add problems to remote server")
	return cmd
}
