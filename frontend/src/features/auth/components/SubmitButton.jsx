function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="h-10 w-full rounded-lg bg-[#10a37f] text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#0e8f6f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#10a37f]/30 active:bg-[#0b7a5f]"
    >
      {children}
    </button>
  );
}

export default SubmitButton;
