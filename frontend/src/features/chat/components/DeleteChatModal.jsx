import { useEffect } from "react";
import IconButton from "./IconButton.jsx";

function DeleteChatModal({ title, onCancel, onConfirm }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-chat-title"
        className="w-full max-w-[440px] rounded-2xl bg-[#2f2f2f] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()} // clicks inside the box shouldn't close it
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="delete-chat-title"
            className="text-lg font-semibold text-[#ececec]"
          >
            Delete chat?
          </h2>
          <IconButton
            icon="ri-close-line"
            label="Close"
            className="-mr-2 -mt-1"
            onClick={onCancel}
          />
        </div>

        <p className="mt-2 text-[15px] leading-6 text-[#b4b4b4]">
          This will permanently delete{" "}
          <span className="font-medium text-[#ececec]">{title}</span>. This
          can't be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-full border border-[#4a4a4a] px-5 text-sm text-[#ececec] transition-colors hover:bg-[#424242]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-full bg-[#4a2a2a] px-5 text-sm text-[#f87171] transition-colors hover:bg-[#5a3030]"
          >
            Delete chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteChatModal;
