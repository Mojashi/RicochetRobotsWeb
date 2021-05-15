
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { getMeApi } from './api/getMe';
import './App.css';
import MenuView from './component/menu/Menu';
import { setUser } from './container/GameSlice';
import { Room } from './container/Room';
function App() {
  const dispatch  = useDispatch()
  useEffect(()=>{getMeApi((user)=>{dispatch(setUser(user))})},[])

  return (
    <Router>
    <div className="App" draggable={false}>
      <Switch>
        <Route path="/" exact>
          <MenuView />
        </Route>
        <Route path="/room/:roomID" exact>
          <Room />
        </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
