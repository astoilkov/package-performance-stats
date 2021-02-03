import buildDependency from './buildDependency'
import installDependency from './installDependency'
import prettyBytes from 'pretty-bytes'
;(async () => {
  try {
    console.log(
      prettyBytes(await buildDependency(await installDependency('use-local-storage-state'))),
    )
  } catch (err) {
    throw err
  }
})()
