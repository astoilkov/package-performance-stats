import { join } from 'path'
import { promises } from 'fs'
import { build } from 'esbuild'
import { PackageJson } from 'type-fest'

export default async function buildDependency(dependencyDirPath: string): Promise<number> {
  const packageJson: PackageJson = JSON.parse(
    await promises.readFile(join(dependencyDirPath, 'package.json'), { encoding: 'utf-8' }),
  )
  const outputPath = join(dependencyDirPath, '__output__.js')

  await build({
    outfile: outputPath,
    entryPoints: [join(dependencyDirPath, 'index.js')],
    bundle: true,
    minify: true,
    define: {
      NODE_ENV: 'production',
    },
    external: Object.keys(packageJson.peerDependencies ?? {}),
  })

  return (await promises.stat(outputPath)).size
}
