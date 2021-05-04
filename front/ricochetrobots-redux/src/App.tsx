
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { fetchMeApi } from './api/fetchMe';
import './App.css';
import MenuView from './component/menu/Menu';
import { Room } from './container/Room';
import { setUser } from './container/SiteSlice';
function App() {
  const dispatch  = useDispatch()
  useEffect(()=>{fetchMeApi((user)=>{dispatch(setUser(user))})},[])

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
