import React from "react"
import styled from "styled-components"

type Props = {
    title?: string,
    placeHolder?: string,
    defaultValue?: string|number,
    disabled?:boolean,
    children? : React.ReactNode,
    onChange?:(text:string)=>void,
    isValid?: (text:string)=>boolean,
    className?: string,
    type: string,
}

export function InputBase({title, placeHolder, disabled, defaultValue, onChange, isValid, type,children, className} : Props){
    const validateChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        const value = event.target.value;
        if(onChange)
            if(!isValid || isValid(value)) onChange(value);
    }

    return (
        <div className={className}>
            <Box>
                {children}
                <input className="input" type={type} placeholder={placeHolder} onChange={validateChange} 
                 defaultValue={defaultValue} disabled={disabled}/>
            </Box>
            <div className="title">{title}</div>
        </div>
    )
}

InputBase.defaultProps = {
    type: "text",
};


const Box = styled("div")`
    display:inline;
`