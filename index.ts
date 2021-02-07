import bundleDependency from './bundleDependency'
import installDependency from './installDependency'
import prettyBytes from 'pretty-bytes'
import simpleSpawn from 'simple-spawn'
import { join } from 'path'
;(async () => {
  try {
    const dependencyDirPath = await installDependency('use-local-storage-state')
    simpleSpawn('code', [dependencyDirPath])
    const bundleResult = await bundleDependency(
      dependencyDirPath,
      join(dependencyDirPath, 'es/index.js'),
      'default',
    )
    console.log(prettyBytes(bundleResult.cjsSize))
    console.log(prettyBytes(bundleResult.esmSize))
    console.log(prettyBytes(bundleResult.iifeSize))
  } catch (err) {
    throw err
  }
})()
