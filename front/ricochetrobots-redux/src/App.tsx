
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import { getMeApi } from './api/getMe';
import './App.css';
import MenuView from './component/menu/browser/Menu';
import { setUser } from './container/GameSlice';
import { Room } from './container/Room';
import { UserNav } from './container/UserNav';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import MenuViewMobile from './component/menu/mobile/MenuMobile';
function App() {
  const dispatch  = useDispatch()
  useEffect(()=>{getMeApi((user)=>{dispatch(setUser(user))})},[])

  return (
    <Router>
    <div className="App" draggable={false}>
      <Switch>
        <Route path="/" exact>
          {isMobile ? 
            <MenuViewMobile/>:
            <MenuView />
          }
        </Route>
        <Route path="/room/:roomID" exact>
          <Room />
        </Route>
      </Switch>
      <UserNavStyled/>
    </div>
    </Router>
  );
}

const UserNavStyled = styled(UserNav)`
    z-index: 1000;
    position : absolute;
    right : 0;
    top : 0.1em;
    /* transform:translateY(100%); */
`
export default App;
