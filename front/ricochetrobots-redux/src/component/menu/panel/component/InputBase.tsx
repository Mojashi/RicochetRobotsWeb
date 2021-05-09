import React, { useState } from "react"
import styled from "styled-components"

type Props = {
    title?: string,
    placeHolder?: string,
    defaultValue: string|number,
    disabled?:boolean,
    children? : React.ReactNode,
    type: string,
    onChange?:(text:string|number)=>void,
    isValid?: (text:string|number)=>boolean,
    className?: string,
    tail? : React.ReactNode,
}

export function InputBase({title, placeHolder, disabled, defaultValue,tail, onChange, isValid, type,children, className} : Props){
    const [value, setValue] = useState(defaultValue)
    const validateChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        var value: string | number = event.target.value;
        if(type === "number"){
            if(value == "") value = 0
            else value = parseInt(value)
        }
        if(!isValid || isValid(value)) {
            if(onChange)onChange(value)
            setValue(value.toString())
        };
    }

    return (
        <div className={className}>
            <Box>
                {children}
                <InputStyled className="input" type={type} placeholder={placeHolder} onChange={validateChange} 
                     defaultValue={defaultValue} disabled={disabled} value={value}/>
                <span className="tail">{tail}</span>
            </Box>
            <div className="title">{title}</div>
        </div>
    )
}

InputBase.defaultProps = {
    type: "text",
};

const InputStyled = styled("input")`
`

const Box = styled("div")`
    display:inline;
`