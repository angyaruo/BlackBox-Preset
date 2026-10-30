export const releaseContract = Object.freeze({version:'1.2.1', filename:'BLACKBOX-V1.2.1.json',name:'BLACKBOX // EiDOS : METALHEART · V1.2.1', blocks:108,sha256:'d77f5ce28dbd22a01f6a4e44a8aa4695ae756a21de205c5ac59a70816e455166'});
export const blockIds=Object.freeze({core:'d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a',kazz:'01a046ec-e1ea-7000-bded-4dfbbfc82025',archive:'f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c',meter:'a4b5c6d7-8e9f-0a1b-2c3d-4e5f6a7b8c9d',status:'b5c6d7e8-9f0a-1b2c-3d4e-5f6a7b8c9d0e'});
const folders=Object.freeze({shared:'BLACKBOX // 01 SHARED HISTORY & STATE',core:'BLACKBOX // 02 OG CORE',light:'BLACKBOX // 03 OG LIGHT',dark:'BLACKBOX // 04 OG DARK',liteCore:'BLACKBOX // 05 LITE CORE',lite:'BLACKBOX // 06 LITE ADAPTIVE'});
const pairKey=name=>name.replace(/^[^\p{L}\p{N}]+/u,'').replace(/\[(?:LIGHT|DARK)\]/g,'[THEME]');
export function setRenderer(rules,skin){
 if(!['dark','light','lite'].includes(skin))throw new Error('Unsupported renderer.');
 for(const folder of Object.values(folders))if(!rules.some(r=>r.folder===folder))throw new Error('Missing renderer folder: '+folder);
 const dark=new Map(rules.filter(r=>r.folder===folders.dark).map(r=>[pairKey(r.name),r.disabled]));
 return rules.map(r=>{let disabled=r.disabled;
  if(r.folder===folders.core)disabled=skin==='lite'?true:r.disabled;
  if(r.folder===folders.dark)disabled=skin==='dark'?r.disabled:true;
  if(r.folder===folders.light){const key=pairKey(r.name);if(!dark.has(key))throw new Error('Unpaired light rule: '+r.name);disabled=skin==='light'?dark.get(key):true;}
  if(r.folder===folders.liteCore||r.folder===folders.lite)disabled=skin!=='lite';
  return {...r,disabled};
 });
}
