// @deno-types="npm:@types/semver"
import semver from "npm:semver";
import * as patch from "https://deno.land/std@0.170.0/path/mod.ts";
import { simpleGit, SimpleGit } from 'npm:simple-git'; 

import packageJson from '../package.json' assert {type: 'json' }

function log(text: string) {
  console.log(`LOG | ${text}`)
}

log(`Working directory: ${Deno.cwd()}`)

log('Init simple-git instance')
const simplegit: SimpleGit = simpleGit(Deno.cwd());

log('Get latest repository tag and package version\n')
const tags = await simplegit.tags();
const lastTag = tags.latest;
const packageVersion = packageJson.version;

log(`Package Version ${packageVersion}`)
log(`Last Tag ${lastTag}\n`)

log('Verify if latest tag is not undefined')
if (lastTag) {
  log(`Latest Tag: ${lastTag}\nPackage Version: ${packageVersion}\n`);
  
  if (semver.gt(packageVersion, lastTag)) {
    log('Synchronizing tag')
    await simplegit.addTag(packageVersion)

    log('Pushing tags')
    await simplegit.pushTags()
  } else {
    log('Last tag and package version are synchronized')
  }
} else {
  log('There is no latest tag')
}

