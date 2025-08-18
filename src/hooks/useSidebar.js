import { useState, useCallback } from 'react';
export function useSidebar(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const close = useCallback(() => setOpen(false), []);
  const openFn = useCallback(() => setOpen(true), []);
  return { open, toggle, close, openFn };
}