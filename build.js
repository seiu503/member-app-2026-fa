const esbuild = require("esbuild");
const fs = require("fs");

async function build() {
  const css = fs.readFileSync("src/styles.css", "utf8");

  const jsResult = await esbuild.build({
    entryPoints: ["src/main.js"],
    bundle: true,
    format: "iife",
    globalName: "SEIUForm",
    write: false
  });

  const js = jsResult.outputFiles[0].text;

  const html = `<style>
${css}
</style>

<script>
${js}
</script>
`;

  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/formassembly-custom-code.html", html);
}

build();