import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),app=read('app.js'),css=read('styles.css');
const release=JSON.parse(read('release.json')),demos=JSON.parse(read('demos.json'));
const checks=[];
const check=(name,fn)=>{fn();checks.push(name);};
check('Download is exactly the documented source build',()=>{
  const bytes=fs.readFileSync(path.join(root,'downloads',release.filename));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),release.sha256);assert.equal(bytes.length,release.bytes);
  const preset=JSON.parse(bytes);assert.equal(preset.name,release.sourceName);assert.equal(release.publicVersion,'1.0');assert.equal(release.build,'4.4.3');
  for(const m of release.modules){const b=preset.blocks.find(b=>b.id===m.id);assert(b);for(const c of m.controls){const v=b.variables.find(v=>v.name===c.name);assert.equal(c.default,v.options?.find(o=>o.id===v.defaultValue)?.label??v.defaultValue);}}
});
check('Local links and image/script/stylesheet assets exist under the project path',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const text of [html,...Object.values(demos)])for(const m of text.matchAll(/(?:href|src)="([^"]+)"/g)){
    const url=m[1];if(/^(https:|data:)/.test(url))continue;
    if(url.startsWith('#')){assert(ids.includes(url.slice(1)),url);continue;}
    assert(!url.startsWith('/'),'Site paths must be relative for project Pages');assert(fs.existsSync(path.join(root,url)),url);
  }
  for(const m of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g))for(const id of m[1].split(' '))assert(ids.includes(id),id);
});
check('Demo markup uses actual component renders without raw interface tags',()=>{
  for(const name of ['scene','dock','archive','voices'])assert(demos[name]?.length>500);
  const all=Object.values(demos).join('');assert(!/<\/?(?:neural_dock|deep_archive|core_commentary|parasite_feed|eidos_dialogue)\b/.test(all));
  assert(!/<script\b|\bon\w+=|javascript:/i.test(all));assert(!all.includes('$1'));
  assert.equal((demos.dock.match(/class="mh-choice-action"/g)||[]).length,5);
  assert.equal((demos.archive.match(/class="mh-circuit-label"/g)||[]).length,3);
  assert(demos.dock.includes('mh-kazz-cutout'));assert(demos.voices.includes('Someone'));assert(demos.voices.includes('--mh-speaker:#e4bd78'));
});
check('Static deployment needs no third-party runtime requests',()=>{
  assert(!/<script[^>]*src="https?:/i.test(html));assert(!/@import\s|url\(\s*['"]?https?:/i.test(css+read('assets/metalheart.css')));
  assert(!/https?:\/\//.test(app));assert(!/C:\\Users|C:\/Users|127\.0\.0\.1/.test(html+app+css));
});
check('Controls include keyboard access, reduced motion, and data-load recovery',()=>{
  for(const token of ['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End','retry-content','clipboard.writeText','aria-selected','aria-pressed'])assert(app.includes(token),token);
  assert(css.includes('prefers-reduced-motion'));assert(css.includes('focus-visible'));assert(html.includes('skip-link'));assert(html.includes('<noscript>'));
});
check('The category guide covers every block once and shows saved selections accurately',()=>{
  const preset=JSON.parse(read('downloads/'+release.filename));
  const ids=release.categories.flatMap(c=>c.blocks.map(b=>b.id));
  assert.equal(ids.length,preset.blocks.length);assert.equal(ids.length,new Set(ids).size);
  assert.deepEqual(new Set(ids),new Set(preset.blocks.map(b=>b.id)));
  for(const m of release.modules)for(const c of m.controls){
    const b=preset.blocks.find(b=>b.id===m.id),v=b.variables.find(v=>v.name===c.name),saved=preset.promptVariables[b.id]?.[v.name]??v.defaultValue;
    assert.equal(c.saved,v.options?.find(o=>o.id===saved)?.label??saved);
  }
});
await import('./check-configurator.mjs');
console.log(JSON.stringify({passed:checks.length,checks,modules:release.modules.length,bytes:release.bytes,sha256:release.sha256},null,2));
