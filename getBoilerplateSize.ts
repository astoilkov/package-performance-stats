import { tmpdir } from 'os'
import { join } from 'path'
import { promises } from 'fs'
import { build } from 'esbuild'
import { getRandomPath } from 'get-file-name'
import { stat } from 'fs/promises'
import simpleSpawn from 'simple-spawn'

export default async function getBoilerplateSize(): Promise<number> {
  const uniqueFolderPath = getRandomPath(tmpdir())
  const outputPath = join(uniqueFolderPath, 'output.js')
  const entryPath = join(uniqueFolderPath, 'entry.js')

  await promises.mkdir(uniqueFolderPath)

  await promises.writeFile(
    entryPath,
    `import dummyExternalPackage from 'dummy-external-package'\nexport default dummyExternalPackage`,
  )

  await build({
    minify: true,
    bundle: true,
    outfile: outputPath,
    entryPoints: [entryPath],
    external: ['dummy-external-package'],
  })

  simpleSpawn('code', [uniqueFolderPath])

  return (await stat(outputPath)).size
}
