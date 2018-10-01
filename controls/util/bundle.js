// Bundle contents of a directory into one file
'use strict'
const Bundler = require('parcel-bundler')
const path = require('path')
module.exports = async function (indir, outdir, ext) {
  const options = {
    outDir: outdir, // The out directory to put the build files in, defaults to dist
    outFile: path.basename(indir) + ext, // The name of the outputFile
    watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    cache: false, // Enabled or disables caching, defaults to true
    contentHash: false, // Disable content hash from being included on the filename
    minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
    target: 'browser', // browser/node/electron, defaults to browser
    logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
    hmr: false, // Enable or disable HMR while watching
    sourceMaps: false // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  }
  // I don't think there's an option to avoid writing to a file :|
  const bundle = await new Bundler(require.resolve(indir), options).bundle()
  return bundle.name // Output filepath
}
