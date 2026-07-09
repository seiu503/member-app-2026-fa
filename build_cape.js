const esbuild = require("esbuild");
const fs = require("fs");

async function build() {
  const css = fs.readFileSync("src_cape/styles_cape.css", "utf8");

  const modalJs = fs.readFileSync(
    "node_modules/van11y-accessible-modal-window-aria/dist/van11y-accessible-modal-window-aria.min.js",
    "utf8"
  );

  const jsResult = await esbuild.build({
    entryPoints: ["src_cape/main_cape.js"],
    bundle: true,
    format: "iife",
    globalName: "SEIUForm",
    write: false
  });

  const appJs = jsResult.outputFiles[0].text;

  const html = `<style>
${css}
</style>

<script>
${modalJs}

${appJs}
</script>`;

  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/cape-formassembly-custom-code.html", html);
}

build();