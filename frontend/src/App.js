import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './pages/Home'
import Error from './pages/Error'
import UserForm from './pages/UserForm'
import Navbar from './header/Navbar'
import DocumentForm from './pages/DocumentForm'

function App() {
  return (
      <Router>
          <Navbar />
        <Container sx={{display: 'flex', flexGrow: 1, justifyContent: 'center'}}>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-user" element={<UserForm />} />
              <Route path="*" element={<Error />} />
              <Route path="/document-form" element={<DocumentForm />} />
            </Routes>
          </div>
        </Container>
      </Router>
  );
}

export default App;
