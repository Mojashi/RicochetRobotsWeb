import React, { RefObject, useEffect, useRef } from "react"

type Props = {
    text? : string
    hashTags? : string[]
    className? : string
}

export function TweetButton({text, hashTags , className} : Props){
    const ref = useRef(null)
    
    useEffect(()=>{
        if (ref.current){
        //@ts-ignore
        twttr.widgets.load(ref.current.tweetButton);
        }
    },[ref.current])
    return <div className={className}>
    <a ref={ref}
        href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
        className="twitter-share-button" 
        //@ts-ignore
        data-text={text}
        data-hashtags={hashTags?.join(",")}
        data-related={"ricochetrobots"}
        data-size="large"
        data-show-count="false"/>
    </div>
    
}