import styled from "styled-components"
import { InputBase } from "./InputBase"

export const Input = styled(InputBase)`
    margin:1em;
    text-align:left;
    width:fit-content;
    & .input{
        border-radius: 7px 7px 0 0;
        border: 0;
        border-bottom: 1px solid;
        padding:0.9em;
        color: #333333;
        font-weight:bold; 

        &:focus{
            outline:0;
        }
        &::disabled {
            pointer-events:none;
        }
    }
    & #title{
        text-align:left;
        margin-left:1em;
        font-weight:bold;
    }
`

