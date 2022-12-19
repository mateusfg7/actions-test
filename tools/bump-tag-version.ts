import git from "npm:isomorphic-git";
// @deno-types="npm:@types/semver"
import semver from "npm:semver";
import * as fs from "https://deno.land/std@0.170.0/node/fs.ts";
import * as patch from "https://deno.land/std@0.170.0/node/path/mod.ts";

import packageJson from "../package.json" assert { type: "json" };

const dir = patch.join(Deno.cwd(), "./");

async function getLastTag() {
  const tags = await git.listTags({ fs, dir });
  const sortedTags = semver.rsort(tags);

  return sortedTags[0];
}

const lastTag = await getLastTag();
const packageVersion = packageJson.version;

console.log(`Latest Tag: ${lastTag}\nPackage Version: ${packageVersion}`);
console.log(`Package Version is greather than Latest Tag? ${semver.gt(packageVersion, lastTag)}`);

if (semver.gt(packageVersion, lastTag)) {
  console.log('Bump Tag')
  await git.tag({ fs, dir, ref: packageVersion })
}