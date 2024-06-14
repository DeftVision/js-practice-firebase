import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './pages/Home'
import Error from './pages/Error'
import Navbar from './header/Navbar'
import FirebaseForm from './pages/FirebaseForm'

function App() {
  return (
      <Router>
          <Navbar />
        <Container sx={{display: 'flex', flexGrow: 1, justifyContent: 'center'}}>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Error />} />
              <Route path="/firebase-form" element={<FirebaseForm />} />
            </Routes>
          </div>
        </Container>
      </Router>
  );
}

export default App;
