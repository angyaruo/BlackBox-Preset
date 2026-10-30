import {cleanName} from './guide-data.mjs';
export function moduleGuide(preset){
 const spec=[
 [2,'Play','Choose who holds the pen.','Roleplay preserves your avatar; Chapter Writing authors the fictional cast one chapter at a time.'],
 [3,'Play','Give an ensemble room to breathe.','Focused Character or Ensemble coordinates eligible members in a real group chat.'],
 [4,'Play','Decide what the reader knows.','Open permits backstage material. Dramatic Irony and Strict Discovery suppress commentary and visible traces; Strict also uses an external camera.'],
 [5,'Play','Put uncertainty on the table.','Choose No Checks, diceless stakes or externally rolled player d6 checks.'],
 [6,'Play','Move to the part that matters.','Disabled by default. Enable this block for explicit bounded Cut, Montage and Downtime commands; important choices remain unresolved.'],
 [12,'Writing','Let the scene continue.','Reply boundaries require no chapter closure or posed wait. Independent actions may continue; actual player decisions remain yours.'],
 [14,'Writing','The world has ongoing work.','Background activity follows fictional time, motives, means and access. A schedule can mature without the avatar witnessing it.'],
 [18,'Writing','Choose what the narration notices.','The Observer and the other persona-style lenses bias emphasis without rewriting canon or personality.'],
 [32,'Writing','Find your scene’s breathing room.','Choose Targeted, Free-Flow or Pulse in one dropdown. Scene Word Aim applies in Targeted; Chapter Writing has its own aim.'],
 [35,'Writing','Choose the camera.','Narration perspective does not change ownership or grant access to the player’s interior.'],
 [37,'Writing','Keep every voice in your language.','Response Language applies to scene, commentary, cognition, menus and Archive values. Exact parser keys and static skin labels stay unchanged.'],
 [39,'Writing','Give attention room to develop.','The Style Kernel guides connected paragraphs, precise detail, distinct speech, viewpoint and meaningful interiority.'],
 [40,'Writing','Leave stock narrative moves behind.','The Cliché Gate targets canned constructions and semantic repetition alongside constructive prose guidance. Active by default; disable this block to opt out.'],
 [55,'Character','Keep identity grounded.','Follow the persona or choose a pronoun/gender override; current explicit OOC corrections take precedence.'],
 [34,'Character','Affection does not erase a spine.','Character Resistance changes willingness, never established facts or personality.'],
 [47,'Character','Let feelings stay complicated.','Preserve personality and mixed motives through closeness without compulsory softening or hostility.'],
 [46,'Character','Belief needs a reason.','Separate evidence, explanations, private assessment, disclosure and cooperation. Expertise grants no hidden knowledge.'],
 [50,'Character','A life beyond your arrival.','People retain compatible routines, obligations and relationships outside the current exchange.'],
 [49,'Character','Make opposition character-specific.','Optional antagonist profiles specify targets, methods, reach and restraints.'],
 [57,'Character','An optional gentler spotlight.','Favor Your Character is off in the neutral release. It does not transfer control of your avatar.'],
 [59,'Character','Choose an attraction modifier deliberately.','Attraction Bias is off in the neutral release; ordinary chemistry still follows character and scene.'],
 [63,'Interface','Five doors. Your decision.','Choice Menus supplies five feasible RP actions or six Chapter Writing directions. Off suppresses both; hints grant no additional action.'],
 [64,'Memory','Track a bond, not a verdict.','Conductance measures the main character’s stance with Affinity, Sparks and Grudge. Group modes can suspend it; it never reads your feelings.'],
 [65,'Memory','Keep consequences in view.','Deep Archive maintains a complete current snapshot in available chat history, not an external or unlimited memory database.'],
 [69,'Memory','More than one relationship exists.','Relationship Map separates ensemble attachment, friction, leverage and changes.'],
 [70,'Memory','Remember unfinished business.','Unresolved Threads retains causal carriers, locks, age and weight; a loose end is not an automatic revelation.'],
 [73,'Interface','EiDOS is watching.','Optional short noncanonical core commentary. Both protected Black Veil modes suppress it.'],
 [74,'Interface','Kazz is already inside.','An independent commentary voice, enabled in the official release. Choosing Kazz Override neither enables nor replaces his feed.'],
 [78,'Interface','Four presentation switches, one home.','Voice Effects, Dialogue Cards, Scene Motifs & Thoughts and Chapter Headers share this variable menu. The official switches start off.'],
 [85,'Interface','Let each voice leave a signature.','Tagged dialogue uses speaker labels, restrained effects and pastel-to-speaker color gradients. Enable through Presentation.'],
 [77,'Interface','A readable inventory of the present.','Persona Status is an optional established condition/equipment panel; it does not invent possessions.'],
 [98,'Writing','Choose your visible planning record.','Creative, Reconstruction and Kazz remain distinct routes. Full Creative/Kazz use the adjustable 1450-word aim; Light and Chapter Writing use compact records. Character Neurology is fixed; Agreement Bias Check is optional.']
 ];
 return spec.map(([i,category,tagline,description])=>{
  const b=preset.blocks[i];if(!b)throw new Error('Missing documented block '+i);
  return {id:b.id,name:cleanName(b.name),category,tagline,description,enabled:b.enabled,controls:(b.variables||[]).map(v=>{
   const saved=preset.promptVariables?.[b.id]?.[v.name]??v.defaultValue;
   return {name:v.name,label:v.label,type:v.type,description:v.description||'',default:v.options?.find(o=>o.id===v.defaultValue)?.label??v.defaultValue,saved:v.options?.find(o=>o.id===saved)?.label??saved,options:v.options?.map(o=>o.label)};
  })};
 });
}
