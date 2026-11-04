import { useEffect, useRef } from "react";

/* Calls onOutside when a click lands outside the returned ref (only while active) */
export function useClickOutside(active, onOutside) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [active, onOutside]);

  return ref;
}
