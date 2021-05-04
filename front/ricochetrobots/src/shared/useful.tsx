import { SvgIcon } from "@material-ui/core"
import styled from "styled-components"

export const BurnedTitle = styled('div') `
color:saddlebrown;
font-weight: bold;
font-size: x-large;
position:relative;
text-align:center;
border-radius: 4px;
border: solid;
`


export const FitSvgIcon = styled((props) => (
    <SvgIcon classes={{root:"root"}} {...props}/>
))`
    &.root{
        width:100%;
        height:100%;
    }
`

export const SvgIconButton = styled(({selected, sComponent, component, ...props}) => (
    <SvgIcon classes={{root:"root"}} component={selected ? sComponent : component} {...props}/>
))<{selected:boolean}>`
    &:hover{
        color:black;
    }
    &:active{
        color:blue;
    }
`


export const SlideIn = styled("div")`
    &.enter {
        transform:translateY(-100vh);
    }
    &.enter-active{
        transition:transform 0.5s ease-in-out;
        transform:translateY(0);
    }
    &.exit {
        transform:translateY(0);
    }
    &.exit-active{
        transition:transform 0.5s ease-in-out;
        transform:translateY(100vh);
    }
`

export const ExpandIn = styled("div")`
    &.enter {
        height:0;
    }
    &.enter-active{
        transition:all 0.5s ease-in-out;
        height:100%;
    }
    &.exit {
        height:100%;
    }
    &.exit-active{
        transition:all 0.5s ease-in-out;
        height:0;
    }
    &.exit-done {
        height:0;
    }
`