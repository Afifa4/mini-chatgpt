import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

function Composer() {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { handleSendMessage, handleUploadDocument } = useChat();
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const isBusy = isLoading || isUploading;

  async function handleSubmit(e) {
    e.preventDefault();

    const text = message.trim();
    if (!text || isBusy) return;

    setMessage("");
    await handleSendMessage({ message: text, chatId: currentChatId });
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    const data = await handleUploadDocument({ file, chatId: currentChatId });
    setIsUploading(false);

    if (data) {
      setUploadedFile({ name: data.document.fileName, chatId: data.chat._id });
    }
  }

  return (
    <div className="shrink-0 px-4 pb-4">
      <div className="mx-auto w-full max-w-[760px]">
        <p className="mb-3 text-center text-xs text-[#8e8e8e]">
          Mini ChatGPT can make mistakes. Check important info.
        </p>

        {isUploading && (
          <p className="mb-2 text-sm text-[#8e8e8e]">Uploading PDF...</p>
        )}
        {!isUploading && uploadedFile?.chatId === currentChatId && (
          <p className="mb-2 text-sm text-[#d1d1d1]">
            <i className="ri-file-pdf-2-line mr-1" aria-hidden="true"></i>
            {uploadedFile.name} is ready. Ask a question about it.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#2f2f2f] py-2 pl-2 pr-2 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            aria-label="Upload PDF"
            disabled={isBusy}
            onClick={() => fileInputRef.current.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#ececec] transition-colors hover:bg-[#424242] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="ri-attachment-2 text-[20px]" aria-hidden="true"></i>
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={5000}
            placeholder="Ask Mini ChatGPT"
            aria-label="Message"
            className="h-9 min-w-0 flex-1 bg-transparent text-base text-[#ececec] outline-none placeholder:text-[#8e8e8e]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={isBusy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#d7d7d7] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="ri-arrow-up-line text-[20px]" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Composer;
