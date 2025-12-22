import type { Plugin } from 'vite'
export function swPlugin({ input, output }?: {
  input?: string | undefined
  output?: string | undefined
}): Plugin
