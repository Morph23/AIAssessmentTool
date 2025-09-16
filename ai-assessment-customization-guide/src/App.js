import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;