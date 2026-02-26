import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza el titulo principal", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /react \+ tailwind listo/i })).toBeInTheDocument();
  });
});
