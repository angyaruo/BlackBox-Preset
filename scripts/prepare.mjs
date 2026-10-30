import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {categoryGuide} from './guide-data.mjs';
import {moduleGuide} from './module-data.mjs';
import {releaseContract} from '../dist/release-contract.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2];
const portraitSource=process.argv[3];
if(!source) throw new Error('Pass the current Lumiverse export as the first argument.');
const bytes=fs.readFileSync(source), preset=JSON.parse(bytes);
if(preset.presetVersion!==releaseContract.version||preset.name!==releaseContract.name||crypto.createHash('sha256').update(bytes).digest('hex')!==releaseContract.sha256)throw new Error('Expected the reviewed V1.2.1 export.');
const dist=path.join(root,'dist');
fs.mkdirSync(path.join(dist,'downloads'),{recursive:true});
fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
fs.copyFileSync(source,path.join(dist,'downloads',releaseContract.filename));
if(portraitSource){
  const html=fs.readFileSync(portraitSource,'utf8');
  const match=html.match(/<template id="hl-portrait"><img src="data:image\/([^;]+);base64,([^"]+)/);
  if(!match)throw new Error('EiDOS portrait missing from approved preview.');
  fs.writeFileSync(path.join(dist,'assets',`eidos.${match[1]}`),Buffer.from(match[2],'base64'));
}
const rules=preset.extensions.regex_scripts.filter(r=>r.target.includes('display')&&!r.name.includes('[LIGHT]')&&!r.disabled).sort((a,b)=>a.sort_order-b.sort_order);
const styles=[...new Set(rules.flatMap(r=>[...r.replace_string.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1])))].join('\n');
fs.writeFileSync(path.join(dist,'assets','metalheart.css'),styles+'\n');
const render=input=>{
  let html=input;
  for(const rule of rules)html=html.replace(new RegExp(rule.find_regex,rule.flags),rule.replace_string);
  return html.replace(/<style>[\s\S]*?<\/style>/g,'').replace(/https:\/\/files.catbox.moe\/9by9l0.png/g,'assets/eidos.webp').replace(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g,'assets/kazz.webp');
};
const voice=(who,color,words,effect='plain')=>`<eidos_dialogue speaker="${who}" color="${color}" effect="${effect}">${words}</eidos_dialogue>`;
const archive=`<deep_archive>
<details><summary>EiDOS // DEEP ARCHIVE — TAKE 08</summary>
<details><summary>MEMORY SPINE // CAUSAL LOAD</summary>
<b>The unlisted train</b>: | Record: An empty train arrived at 00:17. | Access: Both investigators saw it. | Unknown: Its origin.
<b>The ticket</b>: | Record: A paper ticket bears tomorrow's date. | Access: Mara read it aloud. | Condition: Kept as evidence.
</details>
<details><summary>RELATIONSHIP MESH</summary>
<b>Mara ↔ Operator</b>: | Attachment: Trust is growing. | Friction: Mara wants to board; the operator has not decided. | Unknown: Whether they will travel together.
</details>
<details><summary>WORLD-BODY // PHYSICAL STATE</summary>
<b>Spatial</b>: Platform 04, under the last working lamp. The train doors remain open.
<b>Hazards</b>: The timetable is unreliable. No immediate physical threat is established.
</details>
</details>
</deep_archive>`;
const fork=`<fork_protocol>
[1] Examine the ticket under the platform light. || Test a detail before committing to the journey.
[2] Ask Mara why she recognizes the train. || Invite disclosure; she may choose to withhold it.
[3] Board and keep the door in sight. || Gain access while accepting an uncertain exit.
[4] Speak to the station attendant. || Seek an independent account of the arrival.
[5] Stay on the platform and watch. || Preserve distance; the departure window may close.
</fork_protocol>`;
const dock=`<neural_dock>
${fork}
<core_commentary>She recognizes the train, but not the destination. Notice what she protects before deciding what her silence means.</core_commentary>
<parasite_feed>Oh, a train that isn't on the timetable. Excellent. Completely normal. Ask about the ticket before you adopt a new supernatural problem.</parasite_feed>
[Affinity: +23% | Δ(+2%) | Sparks: 3 | Grudge: 0 | Take: 8 | Dynamic: Shared curiosity builds trust; Mara keeps the ticket within reach.]
<!-- ARCHIVE_START -->
${archive}
<!-- ARCHIVE_END -->
</neural_dock>`;
const demos={
  scene:render(`<p>The station clock stopped at 00:17. Beneath it, Mara turned the ticket over once, then tucked it beneath her thumb.</p>${voice('Mara','#e4bd78','“That train wasn’t here a minute ago.”')}<p>The doors opened without a sound. Mara laid the ticket against the timetable, covering an empty line with tomorrow’s date.</p>${voice('Station attendant','#c6ace6','“Last service. If you have a ticket.”','hush')}`),
  dock:render(dock),
  archive:render(archive),
  voices:render(`${voice('Mara','#e4bd78','“You don’t have to trust me. Look at the date.”')}${voice('Station attendant','#c6ace6','“Some journeys arrive before they leave.”','hush')}${voice('Someone','#e995a4','“Wait. That’s my name on your ticket.”','tremor')}`)
};
fs.writeFileSync(path.join(dist,'demos.json'),JSON.stringify(demos));
const modules=moduleGuide(preset);
const release={publicVersion:releaseContract.version,presetVersion:releaseContract.version,format:'Lumiverse',filename:releaseContract.filename,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),moduleCount:modules.length,sourceName:preset.name,categories:categoryGuide(preset),modules};
fs.writeFileSync(path.join(dist,'release.json'),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify({release:release.publicVersion,presetVersion:release.presetVersion,bytes:release.bytes,modules:modules.length,sha256:release.sha256,demos:Object.keys(demos),styles:styles.length}));
