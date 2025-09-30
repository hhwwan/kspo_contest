import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import SdiPage from './SdiPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sdi" element={<SdiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
