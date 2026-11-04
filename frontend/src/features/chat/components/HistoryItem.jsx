import { useCallback, useState } from "react";
import IconButton from "./IconButton.jsx";
import { useClickOutside } from "../hooks/useClickOutside.js";

function HistoryItem({ title, active = false, onClick, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useClickOutside(menuOpen, closeMenu);

  return (
    <li className="relative" ref={menuRef}>
      <div
        className={`group flex h-10 cursor-pointer items-center rounded-lg pl-2.5 pr-1 text-[15px] transition-colors ${
          active
            ? "bg-[#424242] text-[#ececec]"
            : "text-[#ececec] hover:bg-[#424242]"
        }`}
        onClick={onClick}
      >
        <span className="flex-1 truncate">{title}</span>

        <span
          className={`flex items-center ${
            active || menuOpen ? "" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <IconButton
            icon="ri-more-fill"
            label="More options"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation(); // don't open the chat when opening the menu
              setMenuOpen((open) => !open);
            }}
          />
        </span>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-2xl border border-[#3a3a3a] bg-[#353535] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onDelete?.();
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm text-[#f87171] transition-colors hover:bg-[#424242]"
          >
            <i
              className="ri-delete-bin-line text-[18px]"
              aria-hidden="true"
            ></i>
            <span>Delete</span>
          </button>
        </div>
      )}
    </li>
  );
}

export default HistoryItem;
