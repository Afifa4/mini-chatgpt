/**
 * Small square icon-only button used across the chat UI
 * (sidebar header, top bar, message actions, code block header).
 * Pass onClick to attach behaviour.
 */
function IconButton({ icon, label, className = "", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#b4b4b4] transition-colors hover:bg-[#424242] hover:text-[#ececec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]/40 ${className}`}
    >
      <i className={`${icon} text-[18px]`} aria-hidden="true"></i>
    </button>
  );
}

export default IconButton;
