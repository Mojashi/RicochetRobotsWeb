import {Dir, UP,RT,DN,LT, Hand} from "../game/hand"
import {useState} from "react"


interface Props {
    onChange : (hands:Hand[])=>void
    onSubmit : (hands:Hand[])=>void
}
function parseHands(str : string): Hand[] {
    var ret : Hand[] = []
    if(ret.length % 2 !== 0) throw new Error("invalid format")
    
    for(var i = 0; i < str.length; i+=2){
        var robot : number
        var dir : Dir
        
        robot = parseInt(str[i])
        switch(str[i + 1]){
            case "u": dir = UP;break;
            case "r": dir = RT;break;
            case "d": dir = DN;break;
            case "l": dir = LT;break;
            default:  throw new Error("invalid direction")
        }
        ret.push({robot:robot, dir:dir})
    }

    return ret
}

export default function HandsInput (props : Props) {
    const [hands, setHands] = useState<Hand[]>([])

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        try{
            const nHands = parseHands(e.target.value)
            setHands(nHands)
            props.onChange(nHands)
        }catch(e : any){
            // console.log(e)
            setHands([])
            props.onChange([])
        }
    }
    const handleSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
        props.onSubmit(hands)
    }

    return (
        <div>
            <button onClick={handleSubmit}>SUBMIT</button>
            <input type="text" onChange={handleChange}></input>
        </div>
    )
}

HandsInput.defaultProps = {
    onChange:(hands:Hand[])=>{},
    onSubmit:(hands:Hand[])=>{}
}