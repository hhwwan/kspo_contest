import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Sdi_Pdi_Page from "./sdi_pdi/Sdi_Pdi_Page";
import ChatPage from "./chatbot/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sdi" element={<Sdi_Pdi_Page />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
