import { join, relative } from 'path'
import { promises } from 'fs'
import { build } from 'esbuild'
import { LiteralUnion } from 'type-fest'
import { readFile, stat } from 'fs/promises'

export type BundleResult = {
  esmSize: number
  iifeSize: number
  cjsSize: number
}

export default async function bundleDependency(
  dependencyDirPath: string,
  entryFile: string,
  importStatement: LiteralUnion<'default', string>,
): Promise<BundleResult> {
  const entryFilePath = join(dependencyDirPath, '__entry__.js')

  const importPath = relative(dependencyDirPath, entryFile).replace(/^(?=[^.])/u, './')

  await promises.writeFile(
    entryFilePath,
    importStatement === 'default'
      ? `import defaultImport from '${importPath}'\nexport default defaultImport`
      : `import { ${importStatement} } from '${importPath}'\nexport default ${importStatement}`,
  )

  const options = {
    bundle: true,
    minify: true,
    entryPoints: [entryFilePath],
    define: {
      NODE_ENV: 'production',
    },
    external: Object.keys(
      JSON.parse(await readFile(join(dependencyDirPath, 'package.json'), { encoding: 'utf-8' }))
        .peerDependencies,
    ),
  }
  const outputPathCjs = join(dependencyDirPath, '__output-cjs__.js')
  const outputPathEsm = join(dependencyDirPath, '__output-esm__.js')
  const outputPathIife = join(dependencyDirPath, '__output-iife__.js')

  // todo: silentError(buildResult.warnings[0]...)
  await Promise.all([
    build({
      ...options,
      format: 'cjs',
      outfile: outputPathCjs,
    }),
    build({
      ...options,
      format: 'esm',
      outfile: outputPathEsm,
    }),
    build({
      ...options,
      format: 'iife',
      outfile: outputPathIife,
    }),
  ])

  return {
    cjsSize: (await stat(outputPathCjs)).size,
    esmSize: (await stat(outputPathEsm)).size,
    iifeSize: (await stat(outputPathIife)).size,
  }
}
