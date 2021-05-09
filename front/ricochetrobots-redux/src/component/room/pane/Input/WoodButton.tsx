import React, { useState } from "react"
import styled from "styled-components"

type Props = {
    disable : boolean,
    onClick? : ()=>void,
    className? : string,
    children? : React.ReactNode,
}

export function WoodButton({disable, onClick , children, className} : Props){
    const [pushed, setPushed] = useState(false);

    return (
        <Div className={className + (disable ? " disable":"") + (pushed ? " pushed":"")} 
            onClick={onClick} onMouseDown={()=>setPushed(true)} onMouseUp={()=>setPushed(false)}
            onMouseLeave={()=>setPushed(false)}
        >
            {children}
        </Div>
    )
}
WoodButton.defaultProps = {
    disable:false,
}


const Div = styled("div")`
    background: rgba(255, 255, 255, 0.28);
    border: 5px solid #854710;
    border-style:outset;
    border-radius:0.3em;
    padding:0.1em 1em 0.1em 1em;
    cursor:pointer;

    &.disable {
        pointer-events:none;
        cursor:not-allowed;
        filter: grayscale(80%);
        opacity : 0.6;
    }
    &.pushed {
        border-style:inset;
        box-shadow: 0 0 4px black inset;
    }
`