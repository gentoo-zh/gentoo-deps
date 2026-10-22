// npm installs the optional native packages of the runner platform only, so the tarball
// would build on amd64 alone. Add the linux arm64 glibc ones listed in package-lock.json.
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const lock = require(join(process.cwd(), 'package-lock.json'));
const allows = (list, value) => !list || list.includes(value);

async function main() {
  for (const [path, meta] of Object.entries(lock.packages)) {
    if (!(meta.optional || meta.devOptional) || existsSync(path)) continue;
    if (!meta.cpu?.includes('arm64') || !allows(meta.os, 'linux') || !allows(meta.libc, 'glibc')) continue;

    const response = await fetch(meta.resolved);
    if (!response.ok) throw new Error(`${meta.resolved}: HTTP ${response.status}`);
    const tarball = Buffer.from(await response.arrayBuffer());
    const [algorithm, digest] = meta.integrity.split(/-(.*)/s);
    if (createHash(algorithm).update(tarball).digest('base64') !== digest) {
      throw new Error(`${meta.resolved}: integrity mismatch`);
    }

    mkdirSync(path, { recursive: true });
    execFileSync('tar', ['-xz', '--strip-components=1', '-C', path], { input: tarball });
    console.log(`${path} ${meta.version}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
