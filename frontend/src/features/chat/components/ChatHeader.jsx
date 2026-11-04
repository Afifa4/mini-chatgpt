import IconButton from "./IconButton.jsx";

/* Top bar of the conversation column (right-aligned actions only) */
function ChatHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-1 px-4">
      <IconButton icon="ri-more-fill" label="More options" className="hover:bg-[#2f2f2f]" />
    </header>
  );
}

export default ChatHeader;
