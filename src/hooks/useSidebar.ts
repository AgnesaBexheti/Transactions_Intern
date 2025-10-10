import { useCallback, useState } from 'react';

export function useSidebar(defaultOpen = false) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const openSidebar = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(v => !v), []);
  return { open, openSidebar, close, toggle };
}




// import { useState, useCallback } from 'react';
// export function useSidebar(defaultOpen = false) {
//   const [open, setOpen] = useState(defaultOpen);
//   const toggle = useCallback(() => setOpen(v => !v), []);
//   const close = useCallback(() => setOpen(false), []);
//   const openFn = useCallback(() => setOpen(true), []);
//   return { open, toggle, close, openFn };
// }