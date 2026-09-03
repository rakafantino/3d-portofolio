import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommandPalette from "./CommandPalette";

// Hoist navigation mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CommandPalette Component", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.dataset.paletteOpen = "false";
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    // Mock window.open
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    if (originalClipboard) {
      Object.assign(navigator, { clipboard: originalClipboard });
    }
    document.body.dataset.paletteOpen = "false";
    vi.restoreAllMocks();
  });

  it("does not render dialog when open=false", () => {
    render(<CommandPalette open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog with accessibility attributes when open=true", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: /command palette/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("sets document.body.dataset.paletteOpen to true when open, false when closed", () => {
    const { rerender } = render(<CommandPalette open={true} onClose={vi.fn()} />);
    expect(document.body.dataset.paletteOpen).toBe("true");

    rerender(<CommandPalette open={false} onClose={vi.fn()} />);
    expect(document.body.dataset.paletteOpen).toBe("false");
  });

  it("auto-focuses search input when opened", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);
    expect(searchInput).toBeInTheDocument();
    expect(document.activeElement).toBe(searchInput);
  });

  it("filters command list based on search query", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    fireEvent.change(searchInput, { target: { value: "proj" } });

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.queryByText("About")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact")).not.toBeInTheDocument();
  });

  it("displays NO MATCHING COMMANDS empty state when search matches nothing", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    fireEvent.change(searchInput, { target: { value: "nonexistent-command-xyz" } });

    expect(screen.getByText(/no matching commands/i)).toBeInTheDocument();
  });

  it("navigates active item with ArrowDown and ArrowUp and wraps around", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    const items = screen.getAllByRole("option");
    expect(items[0]).toHaveAttribute("aria-selected", "true");

    // ArrowDown moves to second item
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    const itemsAfterDown = screen.getAllByRole("option");
    expect(itemsAfterDown[1]).toHaveAttribute("aria-selected", "true");

    // ArrowUp moves back to first item
    fireEvent.keyDown(searchInput, { key: "ArrowUp" });
    const itemsAfterUp = screen.getAllByRole("option");
    expect(itemsAfterUp[0]).toHaveAttribute("aria-selected", "true");

    // ArrowUp on first item wraps to last item
    fireEvent.keyDown(searchInput, { key: "ArrowUp" });
    const itemsAfterWrap = screen.getAllByRole("option");
    expect(itemsAfterWrap[itemsAfterWrap.length - 1]).toHaveAttribute("aria-selected", "true");
  });

  it("prevents default on ArrowDown and ArrowUp to isolate 3D canvas events", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true, bubbles: true });
    const preventDownSpy = vi.spyOn(downEvent, "preventDefault");
    fireEvent(searchInput, downEvent);
    expect(preventDownSpy).toHaveBeenCalled();

    const upEvent = new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true, bubbles: true });
    const preventUpSpy = vi.spyOn(upEvent, "preventDefault");
    fireEvent(searchInput, upEvent);
    expect(preventUpSpy).toHaveBeenCalled();
  });

  it("executes route navigation on Enter and closes palette", () => {
    const handleClose = vi.fn();
    render(<CommandPalette open={true} onClose={handleClose} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    // Filter to Projects
    fireEvent.change(searchInput, { target: { value: "projects" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(mockNavigate).toHaveBeenCalledWith("/projects");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("executes Copy Email action and copies to clipboard", async () => {
    const handleClose = vi.fn();
    render(<CommandPalette open={true} onClose={handleClose} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    fireEvent.change(searchInput, { target: { value: "copy email" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("rakafantinoo@gmail.com");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("opens GitHub external link in new tab", () => {
    const handleClose = vi.fn();
    render(<CommandPalette open={true} onClose={handleClose} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    fireEvent.change(searchInput, { target: { value: "github.com" } });
    // Click command item directly
    const githubOption = screen.getByRole("option", { name: /^\[01\]\s*GitHub/i });
    fireEvent.click(githubOption);

    expect(window.open).toHaveBeenCalledWith("https://github.com/rakafantino", "_blank", "noopener,noreferrer");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(<CommandPalette open={true} onClose={handleClose} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);

    fireEvent.keyDown(searchInput, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    render(<CommandPalette open={true} onClose={handleClose} />);

    const backdrop = screen.getByTestId("command-palette-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus inside dialog on Tab press", () => {
    render(<CommandPalette open={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/search commands/i);
    const closeBtn = screen.getByRole("button", { name: /close palette/i });

    // Focus close button, Tab should cycle to input
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.keyDown(closeBtn, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(searchInput);

    // Shift+Tab from input cycles to close button
    fireEvent.keyDown(searchInput, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(closeBtn);
  });

  it("toggles via global Cmd+K or Ctrl+K shortcut", () => {
    const handleClose = vi.fn();
    const handleOpen = vi.fn();

    // Testing when closed -> triggers onToggle/onOpen if mounted in App
    const { rerender } = render(<CommandPalette open={false} onClose={handleClose} onOpen={handleOpen} />);

    // Cmd+K to open
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(handleOpen).toHaveBeenCalledTimes(1);

    // Ctrl+K to open
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(handleOpen).toHaveBeenCalledTimes(2);

    // When already open, Cmd+K triggers close
    rerender(<CommandPalette open={true} onClose={handleClose} onOpen={handleOpen} />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
