import fs from 'node:fs';
import assert from 'node:assert/strict';
import {configurePreset,defaults} from '../dist/configurator-core.js';
import {releaseContract} from '../dist/release-contract.js';

const original=JSON.parse(fs.readFileSync(new URL('../dist/downloads/'+releaseContract.filename,import.meta.url),'utf8'));
const voice='<eidos_dialogue speaker="Mara" color="#D9383A" effect="plain">Check <span class="bb-voice bb-impact">the date</span> first.</eidos_dialogue>';
const dock='<neural_dock><core_trace>[SESSION: Cold Boot]</core_trace><parasite_feed>Check the date first.</parasite_feed><subvocal_leak_tracker>Mara — I recognize that train.</subvocal_leak_tracker><deep_archive>\n## World-Body\n- Platform four.\n\n## Causal Spine\n| Event | Source |\n|---|---|\n| Train arrived | Both saw it |\n</deep_archive></neural_dock>';
let cases=0;
for(const skin of ['dark','light']){
  const p=configurePreset(original,{...defaults,skin}).preset;
  assert.equal(p.presetVersion,releaseContract.version);assert(!p.name.includes('4.4.'));
  const rules=p.extensions.regex_scripts.filter(r=>r.target.includes('display')&&!r.disabled).sort((a,b)=>a.sort_order-b.sort_order);
  const render=text=>rules.reduce((s,r)=>s.replace(new RegExp(r.find_regex,r.flags),r.replace_string),text).replace(/<style>[\s\S]*?<\/style>/g,'');
  const dialogue=render(voice),archive=render(dock);
  assert(dialogue.includes('mh-utterance'));assert(dialogue.includes('--mh-speaker:#D9383A'));assert(!dialogue.includes('<eidos_dialogue'));
  assert.equal((archive.match(/class="mh-module mh-unparsed"/g)||[]).length,2);
  assert.equal((archive.match(/class="mh-recovered-body"/g)||[]).length,2);
  assert(!archive.includes('<deep_archive>'));cases++;
}
assert(original.blocks[9].content.includes('already documented; never scan them'));
console.log(JSON.stringify({v1RepairCases:cases,passed:true}));
