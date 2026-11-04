import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar.jsx";
import ChatHeader from "./ChatHeader.jsx";
import Composer from "./Composer.jsx";
import MarkdownMessage from "./MarkdownMessage.jsx";

function ChatLayout() {
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);
  // Only used on small screens; on desktop the sidebar is always visible
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messages = chats[currentChatId]?.messages || [];

  const isNewChat = messages.length === 0 && !isLoading && !error;

  return (
    <div className="flex h-dvh overflow-hidden bg-[#212121] text-[#ececec] [color-scheme:dark]">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto [scrollbar-color:#424242_transparent] [scrollbar-width:thin]">
          {isNewChat ? (
            /* Empty state, centered in the free space */
            <div className="flex h-full items-center justify-center px-4">
              <h1 className="text-center text-2xl font-normal text-[#ececec] sm:text-[28px]">
                What's on your agenda today?
              </h1>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[760px] px-4 py-6">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[80%] whitespace-pre-wrap rounded-3xl bg-[#303030] px-4 py-2.5">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="w-full leading-7">
                      <MarkdownMessage content={msg.content} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && <p className="text-[#8e8e8e]">Thinking...</p>}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-sm text-[#d1d1d1]">
                  <i
                    className="ri-error-warning-line mt-0.5 text-base text-[#b4b4b4]"
                    aria-hidden="true"
                  ></i>
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Composer />
      </main>
    </div>
  );
}

export default ChatLayout;
