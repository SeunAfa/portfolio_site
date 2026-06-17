import { test, expect } from "@playwright/test";

// Each project panel's info column has `overflow-hidden`. If the stacked
// content (title + description + tags + "Visit Site") is taller than that
// column, the button gets clipped at the bottom — the bug we just fixed.
//
// GSAP leaves inactive panels with a translateY offset and opacity 0, so a
// naive getBoundingClientRect would measure the animated position, not the
// rest layout. We neutralise those transforms first, then measure the true
// resting layout of every panel at once (no scrolling / snap fighting needed).

const viewports = [
  { name: "small phone (375)", width: 375, height: 812 },
  { name: "large phone (430)", width: 430, height: 932 },
  { name: "tablet (768)", width: 768, height: 1024 },
  { name: "laptop (1024)", width: 1024, height: 768 },
  { name: "desktop (1280)", width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`Visit Site button is not clipped @ ${vp.name}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    const ua = await page.evaluate(() => navigator.userAgent);
    console.log(`  engine: ${browserName} | UA: ${ua}`);

    // Let GSAP build the ScrollTriggers, then flatten the entry/exit tweens so
    // every project panel sits at its real resting layout.
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      document
        .querySelectorAll(".js-project-info, .js-project-img")
        .forEach((el) => {
          el.style.transform = "none";
          el.style.opacity = "1";
        });
    });

    const results = await page.evaluate(() => {
      const infos = [...document.querySelectorAll(".project-info")];
      // The whole panel fills the pinned viewport: h-[calc(100svh-79px)].
      const panel = document.querySelector("#projects > div > div");
      const panelHeight = panel
        ? Math.round(panel.getBoundingClientRect().height)
        : null;
      return infos.map((info, i) => {
        const link = [...info.querySelectorAll("a")].find((a) =>
          /visit site/i.test(a.textContent || "")
        );
        const ib = info.getBoundingClientRect();
        const lb = link ? link.getBoundingClientRect() : null;
        return {
          panel: i + 1,
          hasButton: !!link,
          panelHeight,
          infoHeight: Math.round(ib.height),
          // Button bottom relative to the info container's top — how far down
          // inside the overflow-hidden column the button sits.
          buttonBottomInInfo: lb ? Math.round(lb.bottom - ib.top) : null,
          // Positive => button is clipped past the column's bottom edge.
          overflowPx: lb ? Math.round(lb.bottom - ib.bottom) : null,
        };
      });
    });

    console.log(`\n[${vp.name}] panel height ${results[0]?.panelHeight}px`);
    for (const r of results) {
      console.log(
        `  Project ${r.panel}: button reaches ${r.buttonBottomInInfo}px ` +
          `of ${r.infoHeight}px info column → overflow ${r.overflowPx}px`
      );
    }

    // Hard proof a real browser rendered this: capture a full-page screenshot
    // attached to the report, plus a saved PNG per viewport.
    const slug = vp.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const shot = await page.screenshot({
      path: `test-results/screens/projects-${slug}.png`,
      fullPage: false,
    });
    await test.info().attach(`screenshot-${slug}`, {
      body: shot,
      contentType: "image/png",
    });

    expect(results.length).toBe(2);
    for (const r of results) {
      expect(r.hasButton, `Project ${r.panel} has a Visit Site button`).toBe(
        true
      );
      // 1) Button must sit within its overflow-hidden info column (allow 1px rounding).
      expect(
        r.overflowPx,
        `Project ${r.panel} button overflows info column by ${r.overflowPx}px`
      ).toBeLessThanOrEqual(1);
      // 2) The panel itself must fit the viewport (it's pinned to fill the screen),
      //    so nothing inside it can be pushed below the fold.
      expect(
        r.panelHeight,
        `Project ${r.panel} panel taller than viewport`
      ).toBeLessThanOrEqual(vp.height);
    }
  });
}
