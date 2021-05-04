import Arena from "./game/arena"
import Header from "./header"
import styled from "styled-components"
import Login from "./login"
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil"
import woodImg from "./img/wood.jpg"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RoomList from "./room"
import { fetchMe, userState } from "./recoil_states"
import { useEffect } from "react"

const TestBox = styled("div")`
  position:relative;
  height:calc(100% - 6ex);
`

const RootDiv = styled.div`
  width:100%;
  height:100%;
  overflow:hidden;
  background-image:url(${woodImg});
  background-repeat:repeat;
`

function App() {
  return (
    <RootDiv>
      <RecoilRoot>
          <InnerApp />
      </RecoilRoot>
    </RootDiv>
  );
}

function InnerApp() {
  const setUser = useSetRecoilState(userState)

  useEffect(() => {
    fetchMe(setUser)
  }, [setUser]);

  return (
    <Router>
      <div style={{ position: "relative", height: "6ex" }}>
        <Header />
      </div>
      <TestBox>
        <Switch>
          <Route exact path="/">
            <Arena />
          </Route>
          <Route exact path="/roomlist">
            <RoomList />
          </Route>
        </Switch>
      </TestBox>
        </Router>
  )
}

export default App;
