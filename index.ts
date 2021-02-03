import buildDependency from './buildDependency'
import installDependency from './installDependency'
import prettyBytes from 'pretty-bytes'
import { statSync } from 'fs'
import simpleSpawn from 'simple-spawn'
import getBoilerplateSize from './getBoilerplateSize'
;(async () => {
  try {
    console.log(prettyBytes(await getBoilerplateSize()))
    const dependencyDirPath = await installDependency('use-local-storage-state', '7.0.0')
    simpleSpawn('code', [dependencyDirPath])
    const outputPath = await buildDependency(dependencyDirPath, 'default')
    console.log(prettyBytes(statSync(outputPath).size))
  } catch (err) {
    throw err
  }
})()
