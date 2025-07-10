import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Guides from './pages/Guides';
import Profile from './pages/Profile';
import Auth from './pages/Auth'; // Import the new Auth component
import GuideDetails from './components/GuideDetails'; // Import the new GuideDetails component
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:guideId" element={<GuideDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;