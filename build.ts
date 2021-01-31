import { join } from "https://deno.land/std/path/mod.ts";

export default async function build(dependencyDirPath: string): Promise<number> {
    const outfile = 'package-performance-stats.js'
    const packageJson = JSON.parse(await Deno.readTextFile(join(dependencyDirPath, 'package.json')))
    const result = await Deno.run({
        cwd: dependencyDirPath,
        stdout: 'piped',
        stderr: 'piped',
        cmd: [
            'npx',
            'esbuild',
            'index.js',
            '--bundle',
            `--outfile=${outfile}`,
            '--minify',
            '--define:process.env.NODE_ENV="production"',
            ...Object.keys(packageJson.peerDependencies).map(peerDependencyName => `--external:${peerDependencyName}`)
        ]
    })

    console.log(await result.output())
    console.log(new TextDecoder().decode(await result.stderrOutput()))

    const stat = await Deno.stat(join(dependencyDirPath, outfile))

    return stat.size
}