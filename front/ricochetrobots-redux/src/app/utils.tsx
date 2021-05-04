import { useState } from "react";

export function useToggle(initialValue : boolean):[boolean, ()=>void,React.Dispatch<React.SetStateAction<boolean>>]{
    const [stat, setStat] = useState<boolean>(initialValue)
    const toggleStat = ()=>{setStat(stat=>!stat)}
    return [stat, toggleStat, setStat];
}