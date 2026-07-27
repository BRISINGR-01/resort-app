import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Availability from './components/Availability';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import 'react-phone-input-2/lib/style.css';
import './App.css';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Availability />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
