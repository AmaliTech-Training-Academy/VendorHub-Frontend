import { VendorSloganTicker } from "@/components/shared/VendorSloganTicker";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// import { VendorSloganTicker } from "@/components/shared/VendorSloganTicker";

function render(slogans: string[]) {
  return renderToStaticMarkup(createElement(VendorSloganTicker, { slogans }));
}

describe("VendorSloganTicker", () => {
  it("renders nothing when the vendor has no slogans", () => {
    expect(render([])).toBe("");
    expect(render(["   ", ""])).toBe("");
  });

  it("shows only the vendor's own slogans, once for screen readers", () => {
    const markup = render(["Fresh from the oven", "  "]);
    expect(markup).toContain('<p class="sr-only">Fresh from the oven</p>');
    expect(markup).not.toContain("Local favorites");
  });
});
