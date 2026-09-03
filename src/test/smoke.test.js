import React from "react";
import { render, screen } from "@testing-library/react";

describe("Vitest & Testing Library Harness Smoke Test", () => {
  it("executes deterministic pure assertions", () => {
    const add = (a, b) => a + b;
    expect(add(2, 3)).toBe(5);
    expect(typeof globalThis.AudioContext).toBe("function");
    const ctx = new globalThis.AudioContext();
    expect(ctx.state).toBe("running");
  });

  it("renders a React component in jsdom with @testing-library/react and jest-dom matchers", () => {
    function TerminalBadge({ label }) {
      return React.createElement(
        "div",
        { "data-testid": "terminal-badge", className: "badge" },
        React.createElement("span", null, label)
      );
    }

    render(React.createElement(TerminalBadge, { label: "CYBER_SYSTEM_ONLINE" }));
    const badge = screen.getByTestId("terminal-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("CYBER_SYSTEM_ONLINE");
  });
});
