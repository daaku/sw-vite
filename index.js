// @ts-check
/** @import { Plugin} from 'vite' */

/** @returns {Plugin} */
export function swPlugin(
  { input = 'node_modules/@daaku/sw-vite/sw.js', output = 'sw.js' } = {},
) {
  return {
    name: 'sw-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(`/${output}`)) {
          req.url = req.url.replace(output, input)
        }
        next()
      })
    },
    config(config) {
      // merge existing input if any is found
      let inputOptions = config.build?.rolldownOptions?.input || {
        main: 'index.html',
      }
      if (Array.isArray(inputOptions)) {
        throw new Error('build.rolldownOptions.input as array is unsupported')
      }
      if (typeof inputOptions === 'string') {
        inputOptions = { main: inputOptions }
      }
      inputOptions[output] = input
      return {
        build: {
          rolldownOptions: {
            input: inputOptions,
            output: {
              entryFileNames({ name, isEntry }) {
                if (isEntry && name === output) return output
                return 'assets/[name].[hash].js'
              },
            },
          },
        },
      }
    },
  }
}
