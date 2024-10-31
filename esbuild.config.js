const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ['source/scripts/index.ts', 'source/stylesheets/index.scss'],
    bundle: true,
    outdir: 'dist',
    plugins: [sassPlugin()],
    sourcemap: true,
    minify: false //change to `true` for production
  });

  await ctx.watch();
}

build().catch(() => process.exit(1));
