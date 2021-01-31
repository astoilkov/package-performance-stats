import build from "./build.ts";
import installDependency from "./installDependency.ts";

console.log(await build(await installDependency('use-local-storage-state')))