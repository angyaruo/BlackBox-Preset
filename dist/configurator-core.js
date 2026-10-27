// Explicit mappings only: this configurator never edits prompt text or executes it.
export const questions = [
  {title:'Who holds the pen?', intro:'Choose how you want to participate. You can still change these settings in Lumiverse.', fields:[
    {key:'session',label:'Your part in the story',options:[['solo','My character is mine','Ordinary roleplay. You supply your own actions and dialogue.'],['focus','A group, one speaker at a time','For a real Lumiverse group chat; the selected member owns the turn.'],['ensemble','A coordinated group','For a real group chat; eligible cast members can interact.'],['matrix','Let BlackBox write the cast','Matrix authors everyone, including your fictional avatar, one chapter at a time.']]},
    {key:'rules',label:'How should uncertain actions resolve?',options:[['off','Through ordinary roleplay','No extra game procedure.'],['diceless','With explicit stakes and costs','Consequences follow established causes.'],['dice','With my own d6 roll','You roll externally after a check is declared. This is not a full D&D ruleset.']]}
  ]},
  {title:'Choose your reading experience.',intro:'These settings guide emphasis and disclosure; they do not rewrite the character card.',fields:[
    {key:'lens',label:'What should the writing notice?',options:[['neutral','Let the situation lead','No preferred emotional destination.'],['romance','Relationships and connection','Room for closeness or heartbreak, without guaranteed attraction.'],['adversity','Credible complications','Pressure from existing motives and circumstances.'],['melodrama','Personal stakes','Promises, loyalties, and unfinished emotional business.']]},
    {key:'discovery',label:'How much should the reader know?',options:[['open','Backstage access','Allow character interiority and optional commentary.'],['strict','Discover it in the scene','External observation only; spoiler-bearing panels are suppressed.']]},
    {key:'content',label:'Content settings',options:[['nonexplicit','Turn mature-content modules off','Disables Black Channel in this copy. This is a prompt setting, not an enforced content filter.'],['original','Keep the original release settings','Inherits this release’s mature-content selections. Review them in Lumiverse before playing.']]}
  ]},
  {title:'Find your prose rhythm.',intro:'Word counts are aims for the model. They are not hard limits or provider token settings.',fields:[
    {key:'length',label:'How much do you like to read?',options:[['short','Short · about 300 words','A smaller contribution with room for your response.'],['medium','Medium · about 600 words','Room for dialogue, action, and atmosphere.'],['long','Long · about 1,000 words','A developed scene contribution.'],['free','Let the scene decide','Free-Flow in roleplay; a 1,200-word chapter aim in Matrix.']]},
    {key:'perspective',label:'Narration perspective',options:[['third','Third person','“Mara turns the ticket over.”'],['first','First person, from a character','“I turn the ticket over.” This does not give the model control of your roleplay avatar.']]},
    {key:'voice',label:'Narration voice',options:[['eidos','Literary narrator','EiDOS provides the prose frame.'],['character','Character-colored narration','Vocabulary and judgments follow the focal character.']]}
  ]},
  {title:'Keep the people grounded.',intro:'Identity here belongs to your fictional persona. It does not describe you, the person taking this interview.',fields:[
    {key:'identity',label:'Your persona’s pronouns and identity',options:[['persona','Follow my persona','Keep its stated identity and pronouns; no override.'],['he_man','He / him · man','Use masculine identity and pronouns consistently.'],['she_woman','She / her · woman','Use feminine identity and pronouns consistently.'],['they_persona','They / them · keep stated gender','Pronouns do not assign a gender.']]},
    {key:'anchors',label:'Extra character consistency checks',options:[['standard','Keep the core character rules','Retain the release’s personality and evidence-grounding instructions.'],['extra','Add a closer character check','Enable Character Neurology and Appeasement Interdict to check unearned agreement or personality shifts.']]}
  ]},
  {title:'Dress the interface.',intro:'Choose the amount of visual presentation. All copies retain the shared display and history-cleanup rules.',fields:[
    {key:'visuals',label:'Visual detail',options:[['quiet','Prose first','No dialogue cards, illustrated objects, delivery effects, or rendered document props.'],['balanced','Dialogue and readable props','Speaker cards and simple screens or letters; no extra illustrations or delivery motion.'],['immersive','The full visual layer','Dialogue effects, detailed props, small object illustrations, and chapter headers. More output overhead.']]},
    {key:'skin',label:'Chat interface skin',options:[['dark','Dark METALHEART','Charcoal surfaces and soft accent colors.'],['light','Light METALHEART','The matching light overlays. This does not change the website theme.']]}
  ]},
  {title:'Who sits beside the story?',intro:'Commentary is a reader-facing aside. It does not establish what happened in the scene.',fields:[
    {key:'commentary',label:'Commentary voices',options:[['none','Neither','Leave the margins quiet.'],['eidos','EiDOS','A brief observation from the core.'],['kazz','Kazz','An irreverent guest in the feed. Independent of the cognition route.'],['both','Both','Two short takes on the same moment.']]},
    {key:'archive',label:'Continuity record',options:[['on','Keep Deep Archive','A structured record in chat history, not permanent external memory.'],['off','Leave the archive out','Less interface; the model still receives the available chat history.']]},
    {key:'fork',label:'Suggested next moves',options:[['on','Show Fork choices','Five suggestions. Nothing happens until you choose.'],['off','I’ll decide without a menu','Omit the roleplay suggestion panel.']]}
  ]},
  {title:'One last look behind the curtain.',intro:'These are visible presentation settings. They do not configure the provider’s native reasoning.',fields:[
    {key:'effort',label:'Visible planning summary',options:[['off','Story only','No printed planning trace.'],['light','A compact decision card','A short visible plan.'],['standard','A fuller, concise plan','Use Creative Pathfinding. Matrix uses its own author summary.']]},
    {key:'meter',label:'Primary relationship meter',options:[['on','Keep Conductance','Track the main character’s stance; it is not a measure of your own feelings.'],['off','Let the prose carry the relationship','Omit the numeric meter.']]},
    {key:'hud',label:'Condition and inventory panel',options:[['off','Leave it out','Keep the Dock smaller.'],['on','Show established items and condition','Useful for travel and game-like scenes; it does not invent equipment.']]}
  ]}
];

export const defaults = Object.freeze({session:'solo',rules:'off',lens:'neutral',discovery:'open',content:'nonexplicit',length:'medium',perspective:'third',voice:'eidos',identity:'persona',anchors:'standard',visuals:'balanced',skin:'dark',commentary:'eidos',archive:'on',fork:'on',effort:'light',meter:'on',hud:'off'});
const lensIds={neutral:'01a05e06-b0db-7000-bf81-eb5c9de4d867',romance:'01a05e06-e4f8-7000-a067-005f82e14712',adversity:'fd363108-e22e-40dd-b5d1-a19530f61d93',melodrama:'7edb4a71-33b7-44c2-842a-33bf39744dad'};
const cameraIds={third:'01a05bbf-73f1-7000-a75b-9eb0068c9401',first:'01a05bbf-6ddd-7000-9947-8f15900de783'};

export function validateAnswers(answers){
  for(const field of questions.flatMap(q=>q.fields))if(!field.options.some(o=>o[0]===answers[field.key]))throw new Error(`Choose a valid answer for ${field.label}.`);
  for(const key of Object.keys(answers))if(!Object.hasOwn(defaults,key))throw new Error(`Unknown answer: ${key}`);
}

export function activeNotes(a){
  validateAnswers(a);
  const notes=[];
  if(a.session==='matrix')notes.push('Matrix writes the fictional avatar too. Group routing and Field Rules are off. Roleplay camera and prose-voice controls are dormant. Fork is replaced by Matrix’s six chapter directions; chapter headers remain active.');
  if(a.session==='focus'||a.session==='ensemble')notes.push('Group routing needs an actual Lumiverse group chat. It suspends the primary-pair Conductance meter; the group roster still comes from Lumiverse.');
  if(a.discovery==='strict')notes.push('Strict discovery overrides first-person or character-interior narration and suppresses commentary, visible planning, private relationship meters, and backstage archive entries. Their saved choices can return when you switch discovery back to Open.');
  if(a.session!=='matrix'&&a.rules!=='off')notes.push('Field Rules suspends Fork suggestions and Operator Privilege. Your rules choice takes priority over the saved Fork switch.');
  if(a.session!=='matrix'&&a.rules==='dice')notes.push('Roll your own d6 after a check and its ID are declared, then submit the matching result in Lumiverse. The website does not roll dice.');
  if(a.archive==='off')notes.push('Deep Archive’s child trackers are dormant while its master is off. Chat history is retained.');
  if(a.content==='original')notes.push('Mature-content settings are inherited from the original export; this choice does not certify suitability for a particular scene or audience.');
  notes.push('Import as a separate preset and check its Custom Variables. Existing chat-level overrides can still take precedence. This configures the file; model behavior remains variable.');
  return notes;
}

export function answerSummary(a){
  validateAnswers(a);
  return questions.flatMap(q=>q.fields).map(f=>{
    const requested=f.options.find(o=>o[0]===a[f.key])[1];let effective=requested;
    if(a.session==='matrix'){
      if(f.key==='rules')effective='Off — Matrix handles chapter outcomes';
      if(f.key==='fork')effective='Matrix’s six chapter directions';
      if(['perspective','voice'].includes(f.key))effective='Matrix authorship — roleplay control dormant';
      if(f.key==='length')effective=`Chapter aim: ${{short:300,medium:600,long:1000,free:1200}[a.length]} words`;
      if(f.key==='effort'&&a.effort!=='off')effective='Compact Matrix author summary';
    }
    if(a.session!=='matrix'&&a.rules!=='off'&&f.key==='fork')effective='Suppressed by Field Rules';
    if(['focus','ensemble'].includes(a.session)&&f.key==='meter')effective='Suspended in an active group chat';
    if(a.discovery==='strict'){
      if(f.key==='perspective')effective='External third-person observation';
      if(f.key==='voice')effective='Literary narration of observable events';
      if(['commentary','effort','meter'].includes(f.key))effective='Suppressed by Strict Discovery';
      if(f.key==='archive'&&a.archive==='on')effective='Public continuity only — backstage entries suppressed';
    }
    return {key:f.key,label:f.label,requested,effective};
  });
}

export function configurePreset(source,answers){
  validateAnswers(answers);
  if(!Array.isArray(source.blocks)||!source.promptVariables||!Array.isArray(source.extensions?.regex_scripts))throw new Error('This release does not have the expected Lumiverse structure.');
  const p=structuredClone(source),changes=[];
  const setVar=(name,value)=>{
    const matches=p.blocks.flatMap(b=>(b.variables||[]).filter(v=>v.name===name).map(v=>({b,v})));
    if(matches.length!==1)throw new Error(`Expected one control: ${name}`);
    const {b,v}=matches[0];let stored=value,label=String(value);
    if(v.type==='select'){
      const option=v.options.find(o=>o.id===value||o.value===value);
      if(!option)throw new Error(`Unsupported choice for ${name}`);
      stored=option.id;label=option.label;
    }else if(v.type==='switch'&&value!==0&&value!==1)throw new Error(`Invalid switch: ${name}`);
    else if(['number','slider'].includes(v.type)&&(!Number.isFinite(value)||(v.min!=null&&value<v.min)||(v.max!=null&&value>v.max)))throw new Error(`Out-of-range control: ${name}`);
    const before=source.promptVariables[b.id]?.[name]??v.defaultValue;
    const beforeLabel=v.options?.find(o=>o.id===before)?.label??String(before);
    p.promptVariables[b.id]??={};p.promptVariables[b.id][name]=stored;v.defaultValue=stored;
    changes.push({label:v.label||name,before:beforeLabel,after:label,changed:before!==stored,kind:'variable',blockId:b.id,key:name});
  };
  const setBlock=(name,enabled)=>{
    const matches=p.blocks.filter(b=>b.name.includes(name));
    if(matches.length!==1)throw new Error(`Expected one block: ${name}`);
    const b=matches[0],before=b.enabled;b.enabled=enabled;
    changes.push({label:b.name.replace(/^[^A-Za-z]+/,''),before:before?'On':'Off',after:enabled?'On':'Off',changed:before!==enabled,kind:'block',blockId:b.id});
  };
  const a=answers,matrix=a.session==='matrix',immersive=a.visuals==='immersive',props=a.visuals!=='quiet';
  setVar('session_mode',matrix?'matrix':'roleplay');setVar('group_mode',['focus','ensemble'].includes(a.session)?a.session:'off');
  setVar('rpg_mode',matrix?'off':a.rules);setVar('veil_mode',a.discovery);setVar('veil_allowance','');
  setVar('narrator_lens',lensIds[a.lens]);
  const words={short:300,medium:600,long:1000,free:1200}[a.length];
  setVar('words_target',a.length==='free'?600:words);setVar('matrix_words',words);
  setVar('pulse_mode',0);setVar('narrative_mass_free_flow',!matrix&&a.length==='free'?1:0);
  setVar('camera_lens',cameraIds[a.perspective]);setVar('prose_voice',a.voice);setVar('operator_identity',a.identity);
  setVar('character_neurology_append',a.anchors==='extra'?1:0);setVar('appeasement_interdict',a.anchors==='extra'?1:0);
  setVar('dialogue_frames',props?1:0);setVar('kinetic_vocal_tissue',immersive?1:0);setVar('mnemonic_scenography',immersive?1:0);setVar('light_novel',immersive||matrix?1:0);
  for(const name of ['html_fun','html_paper_fun'])setVar(name,props?1:0);
  for(const name of ['html_immersive','html_cameron','html_paper_immersive','html_paper_cameron'])setVar(name,immersive?1:0);
  setBlock('EiDOS Core Trace',['eidos','both'].includes(a.commentary));setBlock('Kazz Parasite Feed',['kazz','both'].includes(a.commentary));
  setBlock('Memory Spine (Deep Archive)',a.archive==='on');setBlock('Affective Conductance',a.meter==='on');setBlock('Subject Status HUD',a.hud==='on');
  setVar('cyoa_enabled',a.fork==='on'?1:0);setVar('cognition_route','creative');setVar('cognition_effort',a.effort);
  if(a.content==='nonexplicit')setVar('nsfw_on',0);
  let light=0,dark=0;
  for(const r of p.extensions.regex_scripts){
    if(r.name.includes('[LIGHT]')){r.disabled=a.skin!=='light';light++;}
    if(r.name.includes('[DARK]')){r.disabled=a.skin!=='dark';dark++;}
  }
  if(!light||light!==dark)throw new Error('The release does not have matching light and dark display rules.');
  changes.push({label:'Display overlays',before:source.extensions.regex_scripts.some(r=>r.name.includes('[LIGHT]')&&!r.disabled)?'Light / mixed':'Dark',after:a.skin==='light'?'Light':'Dark',changed:source.extensions.regex_scripts.some((r,i)=>r.disabled!==p.extensions.regex_scripts[i].disabled),kind:'skin'});
  p.name=`BLACKBOX // EiDOS : METALHEART · V1 · Custom ${matrix?'Matrix':'RP'}`;
  return {preset:p,changes,notes:activeNotes(a),filename:`BLACKBOX-V1-custom-${matrix?'matrix':'roleplay'}-${a.skin}.json`};
}
