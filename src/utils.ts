import Debug from 'debug'
import { ResolvedOptions, Route } from './types'

export function extensionsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function normalizePath(str: string): string {
  return str.replace(/\\/g, '/')
}

export const debug = {
  // 代码生成
  gen: Debug('vite-plugin-store:gen'),
  // transform
  transform: Debug('vite-plugin-store:transform'),
  // 热加载
  hmr: Debug('vite-plugin-store:hmr'),
}

const dynamicRouteRE = /^\[.+\]$/
export const nuxtDynamicRouteRE = /^_[\s\S]*$/

export function pathsToTree(paths: string[]) {
  const result: Object[] = []
  const level = { result }

  paths.forEach((path) => {
    path.split('/').reduce((r: any, name, i, a) => {
      if (!r[name]) {
        r[name] = { result: [] }
        r.result.push({ name, children: r[name].result })
      }
      return r[name]
    }, level)
  })
  return result
}

export function resolveImportMode(
  filepath: string,
  options: ResolvedOptions,
) {
  const mode = options.importMode
  if (typeof mode === 'function')
    return mode(filepath)
  if (options.syncIndex && filepath === `/${options.pagesDir}/index.vue`)
    return 'sync'
  else
    return mode
}

export function pathToName(filepath: string) {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$')
}
