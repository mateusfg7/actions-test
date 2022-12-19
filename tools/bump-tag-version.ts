// @deno-types="npm:@types/semver"
import semver from "npm:semver";
import * as patch from "https://deno.land/std@0.170.0/node/path/mod.ts";
import { simpleGit, SimpleGit } from 'npm:simple-git'; 

import packageJson from '../package.json' assert {type: 'json' }

const dir = patch.join(Deno.cwd(), "./");

const simplegit: SimpleGit = simpleGit(dir);

const tags = await simplegit.tags();
const lastTag = tags.latest;
const packageVersion = packageJson.version;

if (lastTag) {
  console.log(`Latest Tag: ${lastTag}\nPackage Version: ${packageVersion}`);
  console.log(`Package Version is greather than Latest Tag? ${semver.gt(packageVersion, lastTag)}`);
  
  if (semver.gt(packageVersion, lastTag)) {
    console.log('Bump Tag')
    await simplegit.addTag(packageVersion)
  }
  
  console.log('Pushing Tag')
  await simplegit.pushTags()
}

