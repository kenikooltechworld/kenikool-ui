/**
 * Selector Testing Utility
 * Verifies that target containers exist and that components have successfully
 * mounted into them via the `v` attribute target system.
 */

const app = document.querySelector(".app");

app.addEventListener("click", (a, b) => {
  let sum = 5 + 6;
  console.log(`Sum of ${5} and ${6} is ${sum}`);
});
const TARGETS_TO_TEST = [
  ".log",
  // Add other target selectors here as you use them, e.g.:
  // '#app',
  // '.hero',
];

async function runSelectorTests() {
  console.group("🚀 Kenikool UI: Selector Mounting Tests");

  // Small delay to allow Web Components to connect and move
  await new Promise((resolve) => setTimeout(resolve, 500));

  TARGETS_TO_TEST.forEach((selector) => {
    const container = document.querySelector(selector);

    if (!container) {
      console.error(`❌ Target NOT FOUND: "${selector}"`);
      return;
    }

    const components = container.querySelectorAll(
      "k-button, k-badge, k-text, k-box, k-stack, k-row, k-grid, k-col, k-frame, k-section, k-container, k-loader",
    );

    if (components.length > 0) {
      console.log(
        `✅ Target FOUND: "${selector}" (${components.length} component(s) mounted)`,
      );
      components.forEach((comp, i) => {
        console.log(`   └─ [${i}] <${comp.tagName.toLowerCase()}>`);
      });
    } else {
      console.warn(
        `⚠️ Target FOUND: "${selector}", but NO components are mounted inside it.`,
      );
    }
  });

  console.groupEnd();
}

// Run tests when DOM is fully loaded
if (document.readyState === "complete") {
  runSelectorTests();
} else {
  window.addEventListener("load", runSelectorTests);
}
