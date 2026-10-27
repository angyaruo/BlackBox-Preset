import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {categoryGuide} from './guide-data.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2];
const portraitSource=process.argv[3];
if(!source) throw new Error('Pass the current Lumiverse export as the first argument.');
const bytes=fs.readFileSync(source), preset=JSON.parse(bytes);
if(preset.presetVersion!=='1.0.0'||preset.name!=='BLACKBOX // EiDOS : METALHEART · V1')throw new Error('Expected the reviewed official V1 export.');
const dist=path.join(root,'dist');
fs.mkdirSync(path.join(dist,'downloads'),{recursive:true});
fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
fs.copyFileSync(source,path.join(dist,'downloads','BLACKBOX-V1.json'));
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
<core_commentary>She recognizes the train, but not the destination. Notice what she protects before deciding what her silence means.</core_commentary>
[Affinity: +23% | Δ (+2%) | Sparks: 3 | Grudge: 0 | Take: 8 | Dynamic: Shared curiosity builds trust; the next decision still belongs to you.]
<parasite_feed>Oh, a train that isn't on the timetable. Excellent. Completely normal. Ask about the ticket before you adopt a new supernatural problem.</parasite_feed>
${fork}
${archive}
</neural_dock>`;
const demos={
  scene:render(`<p>The station clock stopped at 00:17. Beneath it, Mara turned the ticket over once, then tucked it beneath her thumb.</p>${voice('Mara','#e4bd78','“That train wasn’t here a minute ago.”')}<p>Its doors opened without a sound. She stepped aside, leaving the way clear—and the decision unmade.</p>${voice('Station attendant','#c6ace6','“Last service. If you have a ticket.”','hush')}`),
  dock:render(dock),
  archive:render(archive),
  voices:render(`${voice('Mara','#e4bd78','“You don’t have to trust me. Look at the date.”')}${voice('Station attendant','#c6ace6','“Some journeys arrive before they leave.”','hush')}${voice('Someone','#e995a4','“Wait. That’s my name on your ticket.”','tremor')}`)
};
fs.writeFileSync(path.join(dist,'demos.json'),JSON.stringify(demos));
const spec=[
  ['Session Architecture','Play','Choose who holds the pen.','Switch between roleplay, where your avatar remains yours, and Matrix, where EiDOS authors the cast in chapters.'],
  ['Polyphony','Play','Give an ensemble room to breathe.','Focus gives one group member the turn; Ensemble coordinates eligible members. Applies to real group chats, not solo play or Matrix.'],
  ['Black Veil','Play','Decide what the reader can know.','Open the backstage, permit scoped dramatic irony, or keep discovery external. Protected modes suppress spoiler-bearing panels.'],
  ['Field Rules','Play','Put uncertainty on the table.','Optional diceless costs or player-supplied d6 checks. Roll a real die after stakes and a check ID are established; no dice tool is included.'],
  ['Cut & Carry','Play','Move to the part that matters.','Recognize explicit Cut, Montage, and Downtime commands while leaving uncertain outcomes and important choices unresolved.'],
  ['Narrative Mass','Writing','Find your scene’s breathing room.','Set a prose word aim, choose Free-Flow, or use Pulse for responsive turns. These are model instructions, not a guaranteed length limit.'],
  ['Sensor Perspective','Writing','Choose the camera.','Set the narration perspective independently of the operator’s input voice. First-person input does not transfer control of your avatar.'],
  ['Style Kernel','Writing','Change the voice, keep the character.','Separate the literary frame from character-colored prose. Perspective and voice are independent controls.'],
  ['No-Clone','Writing','Give the scene somewhere new to go.','Instructional checks discourage repeating the same beat and framing. Model, context, summaries, and character-card wording still matter.'],
  ['Identity Anchor','Character','Keep identity grounded.','Choose persona defaults, he/him, she/her, or they/them. They/them retains the persona’s stated gender; explicit OOC corrections take precedence.'],
  ['Subject Resistance','Character','Affection does not erase a spine.','Tune how readily the cast yields without replacing established motives or personality.'],
  ['Affective Integrity','Character','Let feelings stay complicated.','Preserve personality, conflicting motives, and character-specific responses as relationships develop.'],
  ['Epistemic Resistance','Character','Belief needs a reason.','Keep character knowledge tied to evidence and in-world access rather than automatic agreement with every claim.'],
  ['Prior Existence','Character','A life beyond your arrival.','Ground NPCs in histories and commitments that exist independently of the operator.'],
  ['Black Hat','Character','Make opposition character-specific.','Optional antagonist profiles organize targets, methods, reach, and restraints. Enable intentionally for a suitable story.'],
  ['Fork Protocol','Interface','Five doors. Your decision.','Offer feasible operator-owned actions with short possible consequences. Suggestions do not become canon until selected.'],
  ['Affective Conductance','Memory','Track a bond, not a verdict.','A primary-pair affinity meter with Sparks and Grudge. Group routing can suspend it; attachment is not agreement.'],
  ['Memory Spine','Memory','Keep the consequences in view.','Deep Archive records current continuity and open threads inside chat history. It is not an external database or unlimited memory.'],
  ['Relationship Mesh','Memory','More than one relationship exists.','Keep ensemble attachment and friction distinct rather than flattening the cast into a single score.'],
  ['Latent Threads','Memory','Remember the unfinished business.','Track unresolved pressures with causal limits rather than treating every loose end as an immediate twist.'],
  ['Core Trace','Interface','EiDOS is watching.','Optional compact, noncanonical reader commentary from the core interface voice.'],
  ['Parasite Feed','Interface','Kazz is already inside.','An independent, optional commentary voice. His feed does not authorize changes to story canon.'],
  ['Vocal Chambers','Interface','Let each voice leave a signature.','Speaker labels, a small waveform, and pastel-to-character gradients frame tagged dialogue. The display depends on valid generated tags.'],
  ['Subject Status','Interface','A readable inventory of the present.','Optional established-state display for physical condition, equipment, inventory, and active effects.']
];
const modules=spec.map(([needle,category,tagline,description])=>{
  const block=preset.blocks.find(b=>b.name.toLowerCase().includes(needle.toLowerCase()));
  if(!block)throw new Error('Missing documented module: '+needle);
  return {id:block.id,name:block.name.replace(/^[^A-Za-z]+/,''),category,tagline,description,enabled:block.enabled,controls:(block.variables||[]).map(v=>{
    const saved=preset.promptVariables?.[block.id]?.[v.name]??v.defaultValue;
    return {name:v.name,label:v.label,type:v.type,description:v.description||'',default:v.options?.find(o=>o.id===v.defaultValue)?.label??v.defaultValue,saved:v.options?.find(o=>o.id===saved)?.label??saved,options:v.options?.map(o=>o.label)};
  })};
});
const release={publicVersion:'1.0',presetVersion:'1.0.0',format:'Lumiverse',filename:'BLACKBOX-V1.json',bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),moduleCount:modules.length,sourceName:preset.name,categories:categoryGuide(preset),modules};
fs.writeFileSync(path.join(dist,'release.json'),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify({release:release.publicVersion,presetVersion:release.presetVersion,bytes:release.bytes,modules:modules.length,sha256:release.sha256,demos:Object.keys(demos),styles:styles.length}));
