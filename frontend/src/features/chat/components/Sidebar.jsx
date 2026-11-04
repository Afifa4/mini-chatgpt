import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NavItem, { NewChatIcon } from "./NavItem.jsx";
import HistoryItem from "./HistoryItem.jsx";
import AccountMenu from "./AccountMenu.jsx";
import DeleteChatModal from "./DeleteChatModal.jsx";
import IconButton from "./IconButton.jsx";
import { useChat } from "../hooks/useChat.js";
import { useAuth } from "../../auth/hook/useAuth.js";

function cleanTitle(title = "") {
  return title.replace(/[*#"`]/g, "").trim() || "New Chat";
}

function Sidebar({ isMobileOpen, onMobileClose }) {
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);

  const { handleOpenChat, handleNewChat, handleDeleteChat } = useChat();
  const { handleLogout } = useAuth();

  const [chatToDelete, setChatToDelete] = useState(null);

  const chatHistory = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!isMobileOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onMobileClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

    <aside
      className={`${
        isMobileOpen ? "fixed inset-y-0 left-0 z-40 flex" : "hidden"
      } h-full w-[260px] max-w-[85vw] shrink-0 flex-col bg-[#2f2f2f] md:static md:z-auto md:flex`}
    >
      {/* Brand */}
      <div className="flex h-14 items-center justify-between px-3">
        <span className="pl-1 text-lg font-semibold text-white">
          Mini ChatGPT
        </span>
        <IconButton
          icon="ri-close-line"
          label="Close sidebar"
          className="md:hidden"
          onClick={onMobileClose}
        />
      </div>

      {/* Primary navigation */}
      <nav className="px-2">
        <NavItem
          icon={<NewChatIcon />}
          label="New chat"
          onClick={() => {
            handleNewChat();
            onMobileClose();
          }}
        />
      </nav>

      {/* Chat history */}
      <div className="mt-4 flex-1 overflow-y-auto px-2 [scrollbar-color:#424242_transparent] [scrollbar-width:thin]">
        {chatHistory.length > 0 && (
          <h2 className="px-2.5 pb-2 pt-1 text-[15px] text-[#8e8e8e]">
            Recents
          </h2>
        )}
        <ul className="space-y-0.5">
          {chatHistory.map((chat) => (
            <HistoryItem
              key={chat._id}
              title={cleanTitle(chat.title)}
              active={chat._id === currentChatId}
              onClick={() => {
                handleOpenChat(chat._id);
                onMobileClose();
              }}
              onDelete={() => setChatToDelete(chat)}
            />
          ))}
        </ul>
      </div>

      {/* Account */}
      <AccountMenu
        username={user?.username || "User"}
        email={user?.email}
        onLogout={handleLogout}
      />

      {chatToDelete && (
        <DeleteChatModal
          title={cleanTitle(chatToDelete.title)}
          onCancel={() => setChatToDelete(null)}
          onConfirm={() => {
            handleDeleteChat(chatToDelete._id);
            setChatToDelete(null);
          }}
        />
      )}
    </aside>
    </>
  );
}

export default Sidebar;
