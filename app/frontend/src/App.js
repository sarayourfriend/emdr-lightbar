import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { View } from '@wp-g2/components';
import TherapistPage from './pages/TherapistPage';
import TherapistHelpPage from './pages/TherapistHelpPage';
import ClientSessionPage from './pages/ClientSessionPage';
import ClientStartSessionPage from './pages/ClientStartSessionPage'
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <View css={{ margin: '1rem' }}>
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/therapist/" exact component={TherapistPage} />
          <Route path="/therapist/help/" exact component={TherapistHelpPage} />
          <Route path="/session/" exact component={ClientStartSessionPage} />
          <Route path="/session/:sessionId" component={ClientSessionPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </View>
  );
}

export default App;
