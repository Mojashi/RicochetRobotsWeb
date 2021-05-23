import styled from "styled-components"
import { InputBase } from "./InputBase"

export const NumInput = styled(InputBase).attrs(props => ({
    type:"number",
}))`
    text-align:left;
    width:fit-content;
    & .input{
    width:2em;
    background:transparent;
    font-weight:bold;
    font-size:1.5em;
    color: white;
    padding:0;
    border:none;
    border-bottom: 1px solid;
    text-align:center;
        &:focus{
            outline:0;
        }
        &:disabled {
            opacity: 0.4;
            user-select:none;
        }
    }
    & .tail {
        white-space:nowrap;
        font-size: 1.3em;
    }
    & #title{
        text-align:left;
        margin-left:1em;
        font-weight:bold;
    }
`

