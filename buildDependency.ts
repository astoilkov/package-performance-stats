import { join } from 'path'
import { promises } from 'fs'
import { build } from 'esbuild'
import { LiteralUnion } from 'type-fest'

export default async function buildDependency(
  dependencyDirPath: string,
  importStatement: LiteralUnion<'default', string>,
): Promise<string> {
  const entryFilePath = join(dependencyDirPath, '__entry__.js')

  await promises.writeFile(
    entryFilePath,
    importStatement === 'default'
      ? `import defaultImport from './index'\nexport default defaultImport`
      : `import { ${importStatement} } from './index'\nexport default ${importStatement}`,
  )

  const outputPath = join(dependencyDirPath, '__output__.js')

  await build({
    bundle: true,
    minify: true,
    outfile: outputPath,
    entryPoints: [entryFilePath],
    define: {
      NODE_ENV: 'production',
    },
  })

  return outputPath
}
