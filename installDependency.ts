import { join } from "https://deno.land/std/path/mod.ts";

/**
 *
 * @param dependencyName
 * @returns folder path where the dependency have been installed
 */
export default async function installDependency(dependencyName: string, version?: string): Promise<string> {
    const installDir = await Deno.makeTempDir()

    await Deno.writeTextFile(join(installDir, 'package.json'), packageJsonContents)

    const result = await Deno.run({
        cwd: installDir,
        stdout: 'piped',
        stderr: 'piped',
        cmd: ['yarn', 'add', `${dependencyName}${version === undefined ? '' : `@${version}`}`]
    })

    // it seems this actually waits for the process to finish
    await result.status()

    return join(installDir, 'node_modules', dependencyName)
}

const packageJsonContents = `
{
  "name": "dummy",
  "version": "0.1.0",
  "private": true
}
`