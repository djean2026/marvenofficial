import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { PublicLayout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Music } from "./pages/Music";
import { Videos } from "./pages/Videos";
import { Tour } from "./pages/Tour";
import { Journal } from "./pages/Journal";
import { JournalPost } from "./pages/JournalPost";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/admin/Login";
import { RequireAuth } from "./pages/admin/AdminLayout";
import { Overview } from "./pages/admin/Overview";
import { ReleasesAdmin } from "./pages/admin/ReleasesAdmin";
import { VideosAdmin } from "./pages/admin/VideosAdmin";
import { ShowsAdmin } from "./pages/admin/ShowsAdmin";
import { JournalAdmin } from "./pages/admin/JournalAdmin";
import { PressAdmin } from "./pages/admin/PressAdmin";
import { InboxAdmin } from "./pages/admin/InboxAdmin";
import { FansAdmin } from "./pages/admin/FansAdmin";
import { SettingsAdmin } from "./pages/admin/SettingsAdmin";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const node = document.querySelector(hash);
      if (node) {
        node.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<RequireAuth />}>
          <Route index element={<Overview />} />
          <Route path="releases" element={<ReleasesAdmin />} />
          <Route path="videos" element={<VideosAdmin />} />
          <Route path="shows" element={<ShowsAdmin />} />
          <Route path="journal" element={<JournalAdmin />} />
          <Route path="press" element={<PressAdmin />} />
          <Route path="inbox" element={<InboxAdmin />} />
          <Route path="fans" element={<FansAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="music" element={<Music />} />
          <Route path="videos" element={<Videos />} />
          <Route path="tour" element={<Tour />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<JournalPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
