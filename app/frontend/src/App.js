import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import TherapistPage from './pages/TherapistPage';
import ClientSessionPage from './pages/ClientSessionPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/therapist/" component={TherapistPage} />
        <Route path="/session/:sessionId" component={ClientSessionPage} />
      </Switch>
    </Router>
  );
}

export default App;
