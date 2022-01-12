import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import SignIn from './pages/SignIn';
import Layout from './pages/Layout';
import Authenticate from './components/Authenticate';
// import Dashboard from './pages/Dashboard';
// import Users from './pages/Users';

function App() {
  console.log("app client...");
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<SignIn />} />
        <Route path="/admin/*" element={
          <Authenticate>
            <Layout />
          </Authenticate>
        } />
      </Routes>
    </Router>
  );
}

export default App;
