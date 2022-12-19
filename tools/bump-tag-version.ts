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
  console.log(`Latest Tag: ${lastTag}\nPackage Version: ${packageVersion}\n`);
  
  if (semver.gt(packageVersion, lastTag)) {
    console.log('Synchronizing tag')
    await simplegit.addTag(packageVersion)

    console.log('Pushing tags')
    await simplegit.pushTags()
  } else {
    console.log('Last tag and package version are synchronized')
  }
}

