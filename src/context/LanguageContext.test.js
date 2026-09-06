import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LanguageProvider, useLanguage, LANGUAGES } from "./LanguageContext.jsx";

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const TestConsumer = ({ translationArg }) => {
    const { lang, toggleLang, t } = useLanguage();
    return React.createElement(
      "div",
      null,
      React.createElement("span", { "data-testid": "current-lang" }, lang),
      React.createElement("span", { "data-testid": "translation" }, t(translationArg)),
      React.createElement("button", { type: "button", onClick: toggleLang }, "Toggle")
    );
  };

  it("exports LANGUAGES mapping with id and en labels", () => {
    expect(LANGUAGES).toBeDefined();
    expect(LANGUAGES.id).toBe("ID");
    expect(LANGUAGES.en).toBe("EN");
  });

  it('(a) t("backToIsland") returns Indonesian by default', () => {
    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: "backToIsland" })
      )
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("id");
    expect(screen.getByTestId("translation")).toHaveTextContent("Kembali ke Pulau");
  });

  it("(b) toggling lang via toggleLang switches to EN and translates string key", () => {
    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: "backToIsland" })
      )
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("id");
    expect(screen.getByTestId("translation")).toHaveTextContent("Kembali ke Pulau");

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translation")).toHaveTextContent("Back to Island");
  });

  it('(c) AUTO-DETECT object mode: t({ id: "Halo", en: "Hello" }) returns "Halo" in id, "Hello" after switch to en', () => {
    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: { id: "Halo", en: "Hello" } })
      )
    );

    expect(screen.getByTestId("translation")).toHaveTextContent("Halo");

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));

    expect(screen.getByTestId("translation")).toHaveTextContent("Hello");
  });

  it("(d) t({ id, en }) falls back to id when target lang is missing or undefined", () => {
    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: { id: "Hanya Indonesia" } })
      )
    );

    expect(screen.getByTestId("translation")).toHaveTextContent("Hanya Indonesia");

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translation")).toHaveTextContent("Hanya Indonesia");
  });

  it("(d.2) string key fallback: falls back to id dictionary when key missing from en dict, or returns key if completely missing", () => {
    const MissingKeyConsumer = () => {
      const { toggleLang, t } = useLanguage();
      return React.createElement(
        "div",
        null,
        React.createElement("span", { "data-testid": "missing" }, t("completely_unknown_key")),
        React.createElement("button", { type: "button", onClick: toggleLang }, "Toggle")
      );
    };

    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(MissingKeyConsumer)
      )
    );

    expect(screen.getByTestId("missing")).toHaveTextContent("completely_unknown_key");
    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("missing")).toHaveTextContent("completely_unknown_key");
  });

  it("(e) provider persists to localStorage and initializes from localStorage", () => {
    const { unmount } = render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: "backToIsland" })
      )
    );

    expect(localStorage.getItem("portfolio_lang")).toBe("id");

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(localStorage.getItem("portfolio_lang")).toBe("en");

    unmount();

    // Re-mount new provider, should read 'en' from localStorage
    render(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(TestConsumer, { translationArg: "backToIsland" })
      )
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");
    expect(screen.getByTestId("translation")).toHaveTextContent("Back to Island");
  });

  it("useLanguage hook returns safe defaults when used outside LanguageProvider", () => {
    let capturedContext;
    const OutsideComponent = () => {
      capturedContext = useLanguage();
      return React.createElement(
        "div",
        null,
        React.createElement("span", null, capturedContext.t("backToIsland")),
        React.createElement("span", null, capturedContext.t({ id: "Halo", en: "Hello" }))
      );
    };

    render(React.createElement(OutsideComponent));
    expect(capturedContext.lang).toBe("id");
    expect(capturedContext.t("backToIsland")).toBe("Kembali ke Pulau");
    expect(capturedContext.t({ id: "Halo", en: "Hello" })).toBe("Halo");
  });
});
