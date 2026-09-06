import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | Raka Fantino`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
