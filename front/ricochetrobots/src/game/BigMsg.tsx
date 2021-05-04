import styled, { keyframes } from "styled-components"
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

type Props = {
    onShowEnd : ()=>void,
    timeout : number,
    text:string,
    show : boolean,
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const bound = keyframes`
0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }
20%  { transform: scale(1.0, 1.06) translate(-5%, -4%) skew(6deg, 0deg); }
50%  { transform: scale(1.0, 0.94) translate(5%, 4%) skew(-6deg, 0deg); }
65%  { transform: scale(1.0, 1.03) translate(2%, -2%) skew(-3deg, 0deg); }
80%  { transform: scale(1.0, 0.97) translate(-2%, 2%) skew(3deg, 0deg); }
100% { transform: scale(1.0, 1.0) translate(0%, 0%); }
`

const InBox = styled("div")<{len:number}>`
    display:inline-block;
    font-weight:bold;
    font-size:calc(60vw / ${p=>p.len});
    z-index:10000000;
    &.enter {
        opacity:0;
        transform:scale(10, 10);
    }
    &.enter-active {
        opacity:1;
        transform:scale(1, 1);
        transition:all 0.3s;
    }
    /* &.enter-done {
        animation: ${bound} 0.8s linear 0s infinite;
    } */
    &.exit {
        opacity:1;
    }
    &.exit-active {
        opacity:0;
        transition:all 0.3s;
    }
`

export default function BigMsg(props : Props) {
    const {onShowEnd, timeout, text, show, ...rest} = props

    const [pshow, setPShow] = useState<boolean>(false)

    useEffect(()=>{
        if(show){
            setPShow(true)
            setTimeout(()=>{setPShow(false)}, timeout)
        } else {
            setPShow(false)
        }
    }, [text, show])

    return (
        <div {...rest}>
            <CSSTransition in={pshow} timeout={300} unmountOnExit={true} onExited={onShowEnd}>
                <InBox len={text.length}>
                {text}
                </InBox>
            </CSSTransition>
        </div>
    )
}

BigMsg.defaultProps = {
    onShowEnd:()=>{},
}