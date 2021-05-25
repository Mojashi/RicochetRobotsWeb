import styled from "styled-components"
import { PALETTE } from "../../../app/palette"

export const Title = styled("div")<{color? : string}>`
	margin-bottom:0.7em;
	color: ${p=>p.color ? p.color : PALETTE.wood};
	font-family: Roboto;
	font-style: normal;
	font-weight: bold;
	font-size:1.5em;
	padding: 0em 0.5em 0em 0.5em;
	border: 3px solid ${p=>p.color ? p.color : PALETTE.wood};
	box-sizing: border-box;
	filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
	border-radius: 5px;
`