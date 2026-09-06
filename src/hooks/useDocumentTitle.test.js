import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle Hook", () => {
  it("sets document title with author suffix and restores on unmount", () => {
    document.title = "Original Title";

    const { rerender, unmount } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Tentang" },
    });

    expect(document.title).toBe("Tentang | Raka Fantino");

    rerender({ title: "Proyek" });
    expect(document.title).toBe("Proyek | Raka Fantino");

    unmount();
    expect(document.title).toBe("Original Title");
  });
});
