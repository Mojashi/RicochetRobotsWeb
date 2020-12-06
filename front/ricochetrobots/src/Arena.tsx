import Board, {BoardModel} from "./Game/Board"
import {PlayerModel} from "./Game/Player"
import {useState, useEffect, useRef} from "react"
import styled from "styled-components"
import {fetchArenaGame} from "./api"

const CenterBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
`

function Arena() {
    var [board, setBoard] = useState(new BoardModel(10, 10))
    var [rectSize, setRectSize] = useState( [0,0] )
    var bBox = useRef<HTMLDivElement>(null)
    
    useEffect( () => {
        if(bBox.current)
            setRectSize([bBox.current.offsetHeight,bBox.current!.offsetWidth])
    }, [bBox]);

    useEffect(() => {
        function handleResize() {
            if(bBox.current)
                setRectSize([bBox.current.offsetHeight,bBox.current!.offsetWidth])
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(()=>{
        const game = fetchArenaGame()
        setBoard(game.board)
        setPlayers(game.players)
        // setTimeLimit
    })
    
    var cellSize = Math.min(rectSize[0] / board.height, rectSize[1] / board.width)
    
    var [players, setPlayers] = useState([new PlayerModel("blue", [0,0])])
    
    return (
        <div ref={bBox} style={{width:"80%", height:"80%"}}>
        <CenterBox>
        <Board board={board} cellSize={cellSize} players={players}/>
        <button onClick={()=>{
            console.log(players[0].pos)
            setPlayers(ps=>[new PlayerModel("blue", [ps[0].pos[0] + 1, ps[0].pos[1]])])
        }}>aaaaaa</button>
        </CenterBox>
        </div>
    );
}

export default Arena;