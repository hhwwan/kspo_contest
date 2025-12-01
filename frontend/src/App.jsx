import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import ChatPage from "./chatbot/ChatPage";
import Community from "./community/Community";
import PostDetail from "./community/PostDetail";
import CommunityWrite from "./community/CommunityWrite";
import PostEdit from "./community/PostEdit";
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignupPage";
import Sdi_Pdi_Page from "./sdi_pdi/Sdi_Pdi_Page";
import UserPage from "./User/UserPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<PostDetail />} /> {/* 상세페이지 라우트 */}
        <Route path="/community/write" element={<CommunityWrite />} />
        <Route path="/community/:id/edit" element={<PostEdit />} />
        <Route path="/sdi" element={<Sdi_Pdi_Page />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;