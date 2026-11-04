import { useCallback, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside.js";

function AccountMenu({ username, email, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useClickOutside(menuOpen, closeMenu);

  return (
    <div className="relative px-2 pb-3 pt-2" ref={menuRef}>
      {menuOpen && (
        <div className="absolute bottom-full left-2 right-2 z-20 mb-1 rounded-2xl border border-[#3a3a3a] bg-[#353535] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          {email && (
            <p className="truncate px-2.5 pb-1.5 pt-1 text-sm text-[#b4b4b4]">
              {email}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm text-[#ececec] transition-colors hover:bg-[#424242]"
          >
            <i
              className="ri-logout-box-r-line text-[18px]"
              aria-hidden="true"
            ></i>
            <span>Log out</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#424242] ${
          menuOpen ? "bg-[#424242]" : ""
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10a37f] text-xs font-semibold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-[#ececec]">
            {username}
          </span>
          <span className="block text-xs text-[#b4b4b4]">Free</span>
        </span>
      </button>
    </div>
  );
}

export default AccountMenu;
