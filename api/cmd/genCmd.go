package cmd

import (
	"github.com/Mojashi/RicochetRobots/api/gen"
	"github.com/spf13/cobra"
)

var (
	torus  bool   = false
	mirror bool   = false
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

	cmd.Flags().BoolVarP(&torus, "torus", "T", false, "gen torus problem")
	cmd.Flags().BoolVarP(&mirror, "mirror", "M", false, "gen mirror problem")
	cmd.Flags().StringVar(&remote, "remote", "", "add problems to remote server")
	return cmd
}
