import styled from "styled-components"
import { InputBase } from "./InputBase"

export const SearchBox = styled(InputBase)`
    margin:1em;
    text-align:left;
    width:fit-content;
    & .input{
        border-radius: 7px;
        border: 0;
        border-bottom: 1px solid;
        padding:0.9em;
        color: #333333;
        font-weight:bold; 

        &:focus{
            outline:0;
        }
    }
    & #title{
        text-align:left;
        margin-left:1em;
        font-weight:bold;
    }
`

