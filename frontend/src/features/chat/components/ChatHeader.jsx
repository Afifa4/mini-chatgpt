import IconButton from "./IconButton.jsx";

/* Top bar of the conversation column; the menu button only shows on small screens */
function ChatHeader({ onOpenSidebar }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-1 px-4">
      <div className="flex items-center gap-2 md:invisible">
        <IconButton
          icon="ri-menu-line"
          label="Open sidebar"
          className="hover:bg-[#2f2f2f]"
          onClick={onOpenSidebar}
        />
        <span className="text-base font-semibold text-white">Mini ChatGPT</span>
      </div>
      <IconButton icon="ri-more-fill" label="More options" className="hover:bg-[#2f2f2f]" />
    </header>
  );
}

export default ChatHeader;
