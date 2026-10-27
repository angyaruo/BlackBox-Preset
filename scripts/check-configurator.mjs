import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {questions,defaults,configurePreset,activeNotes,answerSummary} from '../dist/configurator-core.js';

const source=JSON.parse(fs.readFileSync(fileURLToPath(new URL('../dist/downloads/BLACKBOX-V1-build-4.4.3.json',import.meta.url)),'utf8'));
const snapshot=JSON.stringify(source);
const value=(p,name)=>{const b=p.blocks.find(b=>b.variables?.some(v=>v.name===name)),v=b.variables.find(v=>v.name===name);const raw=p.promptVariables[b.id]?.[name]??v.defaultValue;return v.options?.find(o=>o.id===raw)?.value??raw;};
const enabled=(p,name)=>p.blocks.find(b=>b.name.includes(name)).enabled;
let variants=0;
function verify(answers){
  const {preset:p,changes,filename}=configurePreset(source,answers);variants++;
  assert(filename.endsWith('.json'));assert.notEqual(p.name,source.name);
  assert(p.name.includes('Custom'));assert.equal(p.blocks.length,source.blocks.length);
  const restored=structuredClone(p);restored.name=source.name;
  for(const c of changes){
    if(c.kind==='variable'){
      const i=p.blocks.findIndex(b=>b.id===c.blockId),v=p.blocks[i].variables.find(v=>v.name===c.key),sv=source.blocks[i].variables.find(v=>v.name===c.key);
      assert.equal(p.promptVariables[c.blockId][c.key],v.defaultValue,'Saved selection and default must agree');
      if(v.type==='select')assert(v.options.some(o=>o.id===v.defaultValue),'Selects store option IDs, not prose/value strings');
      restored.blocks[i].variables.find(v=>v.name===c.key).defaultValue=sv.defaultValue;
      if(Object.hasOwn(source.promptVariables[c.blockId]||{},c.key))restored.promptVariables[c.blockId][c.key]=source.promptVariables[c.blockId][c.key];
      else delete restored.promptVariables[c.blockId][c.key];
      if(!Object.hasOwn(source.promptVariables,c.blockId)&&!Object.keys(restored.promptVariables[c.blockId]).length)delete restored.promptVariables[c.blockId];
    }else if(c.kind==='block'){
      const i=p.blocks.findIndex(b=>b.id===c.blockId);restored.blocks[i].enabled=source.blocks[i].enabled;
    }
  }
  for(let i=0;i<p.extensions.regex_scripts.length;i++){
    const r=p.extensions.regex_scripts[i],s=source.extensions.regex_scripts[i];
    if(r.name.includes('[LIGHT]'))assert.equal(r.disabled,answers.skin!=='light');
    else if(r.name.includes('[DARK]'))assert.equal(r.disabled,answers.skin!=='dark');
    else assert.deepEqual(r,s,'Shared regex rules must not change');
    restored.extensions.regex_scripts[i].disabled=s.disabled;
  }
  assert.deepEqual(restored,source,'Only declared control/default/overlay/name changes are allowed');
  assert.equal(value(p,'session_mode'),answers.session==='matrix'?'matrix':'roleplay');
  assert.equal(value(p,'rpg_mode'),answers.session==='matrix'?'off':answers.rules);
  assert.equal(value(p,'group_mode'),['focus','ensemble'].includes(answers.session)?answers.session:'off');
  assert.equal(value(p,'cognition_route'),'creative','Visible Kazz commentary must not select the Kazz planning route');
  assert.equal(value(p,'operator_identity'),answers.identity);
  assert.equal(enabled(p,'EiDOS Core Trace'),['eidos','both'].includes(answers.commentary));
  assert.equal(enabled(p,'Kazz Parasite Feed'),['kazz','both'].includes(answers.commentary));
  assert.equal(enabled(p,'Memory Spine (Deep Archive)'),answers.archive==='on');
  assert.equal(value(p,'nsfw_on'),answers.content==='nonexplicit'?0:value(source,'nsfw_on'));
  assert.equal(value(p,'dialogue_frames'),answers.visuals==='quiet'?0:1);
  if(answers.discovery==='strict')assert(activeNotes(answers).some(n=>n.includes('suppresses commentary')));
  const summary=answerSummary(answers);
  if(answers.discovery==='strict')assert.equal(summary.find(f=>f.key==='perspective').effective,'External third-person observation');
  if(answers.session==='matrix')assert.equal(summary.find(f=>f.key==='rules').effective,'Off — Matrix handles chapter outcomes');
  if(answers.session==='matrix')assert.equal(value(p,'narrative_mass_free_flow'),0);
  return p;
}

verify(defaults);
for(const f of questions.flatMap(q=>q.fields))for(const [option] of f.options)verify({...defaults,[f.key]:option});
for(const session of ['solo','focus','ensemble','matrix'])for(const rules of ['off','dice','diceless'])for(const discovery of ['open','strict'])for(const commentary of ['none','eidos','kazz','both'])verify({...defaults,session,rules,discovery,commentary,skin:'light'});
assert.equal(JSON.stringify(source),snapshot,'Source input is immutable');
assert.throws(()=>configurePreset(source,{...defaults,identity:'invalid'}),/valid answer/);
assert.throws(()=>configurePreset(source,{...defaults,extra:'unknown'}),/Unknown answer/);
const broken=structuredClone(source);broken.blocks=broken.blocks.filter(b=>!b.variables?.some(v=>v.name==='session_mode'));
assert.throws(()=>configurePreset(broken,defaults),/Expected one control/);
const duplicate=structuredClone(source);duplicate.blocks.push(structuredClone(source.blocks[2]));
assert.throws(()=>configurePreset(duplicate,defaults),/Expected one control/);
console.log(JSON.stringify({passed:true,configurationVariants:variants,checks:['Every offered answer maps to a valid control','Saved values and defaults agree','Mode combinations and explanatory notes','Matched light/dark overlays','Original prompts, provider settings, and core rules preserved','Source immutability','Invalid or incompatible schemas fail closed']},null,2));
