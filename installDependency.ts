import { join } from 'path'
import { tmpdir } from 'os'
import { promises } from 'fs'
import simpleSpawn from 'simple-spawn'
import { getRandomPath } from 'get-file-name'

export default async function installDependency(
  dependencyName: string,
  version?: string,
): Promise<string> {
  const uniqueFolderPath = getRandomPath(tmpdir())

  await promises.mkdir(uniqueFolderPath)

  await promises.writeFile(join(uniqueFolderPath, 'package.json'), packageJsonContents)

  await simpleSpawn(
    'npm',
    ['install', version === undefined ? dependencyName : `${dependencyName}@${version}`],
    {
      cwd: uniqueFolderPath,
    },
  )

  return join(uniqueFolderPath, 'node_modules', dependencyName)
}

const packageJsonContents = `
{
    "name": "dummy",
    "version": "0.1.0",
    "private": true
}
`
