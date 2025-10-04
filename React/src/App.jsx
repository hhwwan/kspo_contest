import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Sdi_Pdi_Page from './Sdi_Pdi_Page'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sdi" element={<Sdi_Pdi_Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
