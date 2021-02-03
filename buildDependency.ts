import { join } from 'path'
import { promises } from 'fs'
import { build } from 'esbuild'
import { LiteralUnion, PackageJson } from 'type-fest'

export default async function buildDependency(
  dependencyDirPath: string,
  importStatement: LiteralUnion<'default', string>,
): Promise<string> {
  const packageJson: PackageJson = JSON.parse(
    await promises.readFile(join(dependencyDirPath, 'package.json'), { encoding: 'utf-8' }),
  )

  const entryFilePath = join(dependencyDirPath, '__entry__.js')

  await promises.writeFile(
    entryFilePath,
    importStatement === 'default'
      ? `import defaultImport from './index'\nexport default defaultImport`
      : `import { ${importStatement} } from './index'\nexport default ${importStatement}`,
  )

  const outputPath = join(dependencyDirPath, '__output__.js')

  await build({
    outfile: outputPath,
    entryPoints: [entryFilePath],
    bundle: true,
    minify: true,
    define: {
      NODE_ENV: 'production',
    },
    external: Object.keys(packageJson.peerDependencies ?? {}),
  })

  return outputPath
}
