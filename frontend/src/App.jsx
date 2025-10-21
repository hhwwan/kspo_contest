import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import ChatPage from "./chatbot/ChatPage";
import Community from "./community/Community";
import Sdi_Pdi_Page from "./sdi_pdi/Sdi_Pdi_Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/sdi" element={<Sdi_Pdi_Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
