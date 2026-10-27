(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let release=null,category='All',expanded=false,skin='dark',view='scene',starter='character';
  const captions={scene:'A scene leaves room for your next move. Dialogue blends pastel blue with each speaker’s color.',dock:'A compact, collapsible Dock. Open Fork protocol for five suggestions, or Deep archive for the scene record.',archive:'Continuity you can inspect. Open a section to see attributed facts, relationships, and physical constraints.',voices:'Three speakers, three color signatures. The typography stays close to the surrounding prose.'};
  const starters={
    character:{title:'Character drama',description:'A grounded solo scene with room for conflicting motives. Keep the cast’s personality intact while letting the relationship change.',settings:[['Session Mode','Roleplay'],['Group turn ownership','Off'],['Reader access','Open'],['Resolution mode','Off'],['Deep Archive','Optional'],['Commentary','EiDOS, Kazz, both, or neither']],caution:'Open reader access can expose backstage information. Choose Strict discovery if you want to learn only what is externally available.'},
    mystery:{title:'Blind investigation',description:'Let uncertainty survive. Use an external camera so a private thought or backstage panel does not solve the mystery for you.',settings:[['Session Mode','Roleplay'],['Group turn ownership','Off'],['Reader access','Strict discovery'],['Resolution mode','Off'],['Commentary / backstage','Suppressed by protected mode']],caution:'Protected modes suppress spoiler-bearing displays without erasing their saved switches. Avoid putting secret answers in your own visible instructions.'},
    ensemble:{title:'Ensemble cast',description:'Let the present cast bring separate aims into the same scene. Use this inside a real Lumiverse group chat.',settings:[['Session Mode','Roleplay'],['Group turn ownership','Ensemble'],['Reader access','Open'],['Relationship Mesh','Enable if wanted'],['Primary-pair meter','Suspended by group routing']],caution:'Polyphony is inactive in solo chats and Matrix. It coordinates eligible group members; it does not create extra character cards.'},
    rpg:{title:'RPG expedition',description:'Resolve uncertain actions with declared stakes and a player-supplied roll. Keep important choices in the player’s hands.',settings:[['Session Mode','Roleplay'],['Group turn ownership','Off'],['Resolution mode','Player d6'],['Reader access','Strict discovery'],['Transition commands','Enable if wanted']],caution:'Wait for a pending check and its ID, then roll externally and send [Roll R01: 4] with the matching ID. Field Rules suspends Fork and Operator Privilege.'}
  };
  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let quiet=motionPreference.matches;
  try{const saved=localStorage.getItem('blackbox-motion');if(saved)quiet=saved==='quiet';}catch{}
  function setMotion(value){
    quiet=value;document.documentElement.dataset.motion=value?'quiet':'live';
    $('#motion-toggle').setAttribute('aria-pressed',String(value));
    $('#motion-toggle span:last-child').textContent=value?'Motion off':'Motion on';
    $$('.bb44').forEach(n=>n.dataset.motion=value?'quiet':'live');
  }
  setMotion(quiet);
  $('#motion-toggle').addEventListener('click',()=>{setMotion(!quiet);try{localStorage.setItem('blackbox-motion',quiet?'quiet':'live');}catch{}});
  motionPreference.addEventListener?.('change',e=>setMotion(e.matches));

  function activateTab(key,focus=false){
    view=key;
    $$('[data-view]').forEach(b=>{const active=b.dataset.view===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});
    $$('#demo-stage > [role=tabpanel]').forEach(p=>p.hidden=p.id!==`demo-${key}`);
    $('#demo-caption').textContent=captions[key];
  }
  function bindTabs(selector,attribute,activate,vertical=false){
    const buttons=$$(selector);
    buttons.forEach((b,i)=>{
      b.addEventListener('click',()=>activate(b.dataset[attribute]));
      b.addEventListener('keydown',e=>{
        const next=vertical?'ArrowDown':'ArrowRight',prev=vertical?'ArrowUp':'ArrowLeft';
        let index;if(e.key===next)index=(i+1)%buttons.length;else if(e.key===prev)index=(i-1+buttons.length)%buttons.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=buttons.length-1;else return;
        e.preventDefault();activate(buttons[index].dataset[attribute],true);
      });
    });
  }
  bindTabs('[data-view]','view',activateTab);
  function applySkin(){
    $('#demo-stage').dataset.skin=skin;
    $$('#demo-stage .bb44').forEach(n=>{n.classList.toggle('bb44-light',skin==='light');n.classList.toggle('bb44-dark',skin==='dark');});
    $('#demo-theme').setAttribute('aria-pressed',String(skin==='light'));
    $('#demo-theme span').textContent=skin==='light'?'Light skin':'Dark skin';
  }
  $('#demo-theme').addEventListener('click',()=>{skin=skin==='dark'?'light':'dark';applySkin();});
  $('#demo-stage').addEventListener('click',e=>{
    const choice=e.target.closest('[data-regex-action]');if(!choice)return;
    const action=choice.querySelector('.mh-choice-action')||choice;
    $('#demo-receipt').textContent='Preview choice: '+action.textContent.replace(/\s+/g,' ').trim()+' No chat message was sent.';
  });

  function moduleHTML(m){
    const controls=m.controls.length?m.controls.map(c=>`<div class="control-note"><strong>${escape(c.label)}</strong><p>${escape(c.description)}</p><div class="micro">SAVED IN THE DOWNLOAD / ${escape(c.saved??c.default)}</div>${c.saved!==undefined&&c.saved!==c.default?`<div class="micro factory-note">FACTORY DEFAULT / ${escape(c.default)}</div>`:''}${c.options?`<p class="control-options">Choices: ${c.options.map(escape).join(' · ')}</p>`:''}</div>`).join(''):`<div class="control-note"><strong>Prompt block · ${m.enabled?'enabled':'disabled'} in the release</strong><p>Find “${escape(m.name)}” in the preset editor. This module may depend on a master setting or play mode.</p></div>`;
    return `<details class="module-card" data-category="${escape(m.category)}"><summary><span class="micro">${escape(m.category)} / MODULE</span><span class="disclosure" aria-hidden="true">+</span><h3>${escape(m.name)}</h3><p class="tagline">${escape(m.tagline)}</p></summary><div class="module-body"><p>${escape(m.description)}</p>${controls}</div></details>`;
  }
  function renderModules(){
    if(!release)return;
    const query=$('#module-search').value.trim().toLocaleLowerCase();
    const matches=release.modules.filter(m=>(category==='All'||m.category===category)&&JSON.stringify(m).toLocaleLowerCase().includes(query));
    const showAll=expanded||query||category!=='All';const shown=showAll?matches:matches.slice(0,6);
    $('#module-grid').innerHTML=shown.length?shown.map(moduleHTML).join(''):'<p class="empty-state">No modules match these filters. Try a different word or reset the filters.</p>';
    $('#module-count').textContent=`${matches.length} module${matches.length===1?'':'s'}${shown.length<matches.length?` · showing ${shown.length}`:''}`;
    $('#show-modules').hidden=!!query||category!=='All'||matches.length<=6;
    $('#show-modules').textContent=expanded?'Show fewer module notes ↑':`Show all ${matches.length} module notes ↓`;
  }
  $('#module-search').addEventListener('input',renderModules);
  $$('[data-category]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;$$('.filter-row button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));renderModules();}));
  $('#clear-search').addEventListener('click',()=>{category='All';expanded=false;$('#module-search').value='';$$('.filter-row button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category==='All')));renderModules();});
  $('#show-modules').addEventListener('click',()=>{expanded=!expanded;renderModules();if(!expanded)$('#field-guide').scrollIntoView({block:'start'});});
  $$('[data-find]').forEach(a=>a.addEventListener('click',()=>{category='All';$('#module-search').value=a.dataset.find;$$('.filter-row button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category==='All')));renderModules();}));

  function activateStarter(key,focus=false){
    starter=key;const s=starters[key];
    $$('[data-starter]').forEach(b=>{const active=b.dataset.starter===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});
    $('#starter-panel').setAttribute('aria-labelledby',`starter-${key}`);
    $('#starter-heading').textContent=s.title;$('#starter-description').textContent=s.description;$('#starter-caution').textContent=s.caution;
    $('#starter-settings').innerHTML=s.settings.map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
    $('#copy-status').textContent='';
  }
  bindTabs('[data-starter]','starter',activateStarter,true);activateStarter(starter);
  async function copy(text,status){
    try{await navigator.clipboard.writeText(text);status.textContent='Copied to clipboard.';}
    catch{
      status.textContent='Clipboard unavailable. Select and copy the text below.';
      const area=document.createElement('textarea');area.value=text;area.readOnly=true;area.setAttribute('aria-label','Text to copy');area.style.cssText='width:100%;min-height:120px;margin-top:10px;background:#171719;color:#f1f0eb;border:1px solid #4a494f;padding:10px;font:12px monospace';
      status.append(area);area.focus();area.select();
    }
  }
  $('#copy-starter').addEventListener('click',()=>{const s=starters[starter];copy(`BLACKBOX Public V1 — ${s.title}\n\n${s.settings.map(([a,b])=>`${a}: ${b}`).join('\n')}\n\n${s.caution}`, $('#copy-status'));});
  $('#copy-hash').addEventListener('click',()=>{if(release)copy(release.sha256,$('#hash-status'));else $('#hash-status').textContent='Release metadata has not loaded.';});
  async function load(){
    try{
      const [r,d]=await Promise.all(['release.json','demos.json'].map(async url=>{const response=await fetch(url);if(!response.ok)throw new Error(`${url}: ${response.status}`);return response.json();}));
      release=r;
      $('#category-guide').innerHTML=r.categories.map((c,i)=>`<details class="category-card"><summary><span class="category-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span><h3>${escape(c.title)}</h3><p>${escape(c.tagline)}</p></span><span class="disclosure" aria-hidden="true">+</span></summary><div class="category-body"><p>${escape(c.description)}</p><p class="category-tip"><strong>How to use it:</strong> ${escape(c.tip)}</p><h4>Blocks in this category</h4><ul class="category-blocks">${c.blocks.map(b=>`<li><span>${escape(b.name)}</span>${b.controls.length?`<small>Controls: ${b.controls.map(escape).join(' · ')}</small>`:''}</li>`).join('')}</ul></div></details>`).join('');
      for(const [key,html] of Object.entries(d)){const panel=$(`#demo-${key}`);if(panel)panel.innerHTML=html;}
      // Open the archive's outer shell in its own specimen; keep its inner sections interactive.
      const archive=$('#demo-archive .mh-archive-module');if(archive)archive.open=true;
      $('#download-hash').textContent=r.sha256;
      $('#download-size').textContent=(r.bytes/1048576).toFixed(2)+' MiB';
      renderModules();applySkin();setMotion(quiet);activateTab(view);
    }catch(error){
      console.error('BlackBox content failed to load:',error.message);
      $('#category-guide').innerHTML='<p class="empty-state">The category map could not load. Use the Retry loading button in the field guide below.</p>';
      $('#module-grid').innerHTML='<p class="empty-state">The guide could not load. The download and installation instructions are still available. <button class="small-control" id="retry-content" type="button">Retry loading</button></p>';
      $('#demo-scene').innerHTML='<p>Interactive examples are temporarily unavailable. Please retry from the field guide below.</p>';
      $('#retry-content').addEventListener('click',load,{once:true});
    }
  }
  load();
})();
