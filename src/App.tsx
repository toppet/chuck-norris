import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.scss';

import Home from './components/Home/Home';
import Success from './components/Success/Success';
import NotFound from './components/NotFound/NotFound';

export default function BasicExample() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/success">
            <Success />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

