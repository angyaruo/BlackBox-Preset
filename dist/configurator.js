import {questions,defaults,configurePreset,activeNotes,answerSummary} from './configurator-core.js';

const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let answers={...defaults},step=-1,source=null,loading=false,loadError='',downloading=false;
const status=$('#interview-status');

function download(text,name,type='application/json'){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}

async function loadSource(){
  if(source)return source;
  const r=await fetch('release.json');if(!r.ok)throw new Error('Release information is unavailable.');
  const release=await r.json();
  if(release.build!=='4.4.3'||release.filename!=='BLACKBOX-V1-build-4.4.3.json')throw new Error('This release needs an updated configurator. Please use the original download.');
  const response=await fetch(`downloads/${release.filename}`);if(!response.ok)throw new Error('The original preset could not be loaded.');
  const bytes=await response.arrayBuffer();
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
  if(bytes.byteLength!==release.bytes||hash!==release.sha256)throw new Error('The release checksum did not match. Reload the page and try again; no custom file was created.');
  const parsed=JSON.parse(new TextDecoder().decode(bytes));
  // Validate every mapped control before making a file available.
  configurePreset(parsed,answers);source=parsed;return source;
}

function fieldHTML(field){
  const disabled=field.key==='rules'&&answers.session==='matrix';
  return `<fieldset class="interview-field" ${disabled?'disabled':''}><legend>${escape(field.label)}</legend>${disabled?'<p class="field-hint">Matrix handles chapter outcomes, so Field Rules will be off in this download.</p>':''}<div class="answer-grid">${field.options.map(([value,label,description])=>`<label class="answer-choice"><input type="radio" name="${field.key}" value="${value}" ${answers[field.key]===value?'checked':''}><span><strong>${escape(label)}</strong><small>${escape(description)}</small></span></label>`).join('')}</div></fieldset>`;
}

function reviewHTML(){
  const result=source?configurePreset(source,answers):null;
  const summary=answerSummary(answers).map(f=>`<div><dt>${escape(f.label)}</dt><dd>${escape(f.effective)}${f.effective!==f.requested?`<small class="requested-choice">Your answer: ${escape(f.requested)}</small>`:''}</dd></div>`).join('');
  const changes=result?.changes.filter(c=>c.changed)||[];
  return `<div class="interview-review"><div><h3>Your configuration, explained.</h3><p class="interview-intro">This is a starting point based on your answers, not a prediction of your ideal story. You can edit any answer before downloading.</p><dl class="answer-summary">${summary}</dl></div><aside class="config-receipt"><span class="micro blue">PUBLIC V1 / CUSTOM COPY</span><h3>Ready for your first scene.</h3><p>Prompt wording, character-source slots, and core history rules are preserved. This copy changes mapped controls and display overlays.</p><h4>How these choices work together</h4><ul>${activeNotes(answers).map(n=>`<li>${escape(n)}</li>`).join('')}</ul><p class="micro">ANSWERS STAY IN THIS TAB · NO MODEL REQUESTS</p></aside></div>
  ${result?`<details class="config-diff"><summary>Compared with the original release · ${changes.length} setting changes <span aria-hidden="true">+</span></summary><div class="diff-scroll"><table><caption>Changes to saved settings. Matching factory defaults are synchronized too.</caption><thead><tr><th scope="col">Control</th><th scope="col">Original saved choice</th><th scope="col">Your saved choice</th></tr></thead><tbody>${changes.map(c=>`<tr><th scope="row">${escape(c.label)}</th><td>${escape(c.before)}</td><td>${escape(c.after)}</td></tr>`).join('')}</tbody></table></div></details>`:''}
  <div class="config-download"><button type="button" class="button primary" id="download-custom" ${!result||downloading?'disabled':''}>${downloading?'Preparing file…':'Download my BlackBox'} <span aria-hidden="true">↓</span></button><button type="button" class="small-control" id="download-receipt" ${!result?'disabled':''}>Save settings receipt</button><p>Import the custom JSON as a separate preset in Lumiverse. Its name includes “Custom”. Your original download remains available below.</p></div>
  ${loading?'<p class="loading" role="status">Checking the original release before creating your copy…</p>':''}
  ${loadError?`<p class="config-error" role="alert">${escape(loadError)} <button class="small-control" id="retry-config" type="button">Retry loading release</button></p>`:''}`;
}

function render(focus=false){
  const review=step===questions.length;
  $('#interview-welcome').hidden=step!==-1;$('#interview-workspace').hidden=step===-1;
  if(step===-1)return;
  $('#interview-progress').value=step+1;$('#interview-progress').max=questions.length+1;
  $('#interview-progress-label').textContent=review?'Review / your custom copy':`Step ${step+1} of ${questions.length} / ${questions[step].title}`;
  $('#interview-heading').textContent=review?'Your BlackBox. Your switches.':questions[step].title;
  $('#interview-intro').textContent=review?'Check the choices and the mode notes below. Nothing has been downloaded yet.':questions[step].intro;
  $('#interview-body').innerHTML=review?reviewHTML():questions[step].fields.map(fieldHTML).join('');
  $('#interview-back').disabled=step===0;
  $('#interview-next').hidden=review;$('#interview-next').textContent=step===questions.length-1?'Review my setup →':'Continue →';
  $('#interview-next').disabled=false;
  $('#interview-step-note').textContent=!review&&answers.discovery==='strict'&&[2,5,6].includes(step)?'Strict Discovery is selected: private narration and backstage panels are suppressed, even when their saved choices below are on.':'';
  if(focus){$('#interview-heading').focus({preventScroll:true});$('#configure').scrollIntoView({block:'start'});}
  $('#download-custom')?.addEventListener('click',()=>{
    if(!source||downloading)return;
    downloading=true;
    try{
      const result=configurePreset(source,answers);download(JSON.stringify(result.preset,null,2)+'\n',result.filename);
      status.textContent='Custom file prepared; your browser should start the download. Import it as a separate Lumiverse preset, then check its Custom Variables.';
    }catch(error){status.textContent='No file was created. '+error.message;}
    finally{downloading=false;}
  });
  $('#download-receipt')?.addEventListener('click',()=>{
    const result=configurePreset(source,answers);
    const lines=answerSummary(answers).map(f=>`${f.label}: ${f.effective}${f.effective!==f.requested?` (your answer: ${f.requested})`:''}`);
    download(['BLACKBOX Public V1 / custom settings / internal build 4.4.3','',...lines,'','Mode notes',...result.notes.map(n=>'- '+n),'','Changed saved controls',...result.changes.filter(c=>c.changed).map(c=>`${c.label}: ${c.before} → ${c.after}`)].join('\n'),'BLACKBOX-V1-custom-settings.txt','text/plain');
    status.textContent='Settings receipt prepared for download.';
  });
  $('#retry-config')?.addEventListener('click',prepareReview);
}

async function prepareReview(){
  if(loading)return;
  loading=true;loadError='';render();
  try{await loadSource();}catch(error){loadError=error.message;}
  finally{loading=false;if(step===questions.length)render();}
}

$('#start-interview').addEventListener('click',()=>{step=0;status.textContent='';render(true);});
$('#interview-body').addEventListener('change',e=>{
  if(!e.target.matches('input[type=radio]'))return;
  answers[e.target.name]=e.target.value;status.textContent='';
  if(e.target.name==='session')render();
});
$('#interview-next').addEventListener('click',()=>{step++;render(true);if(step===questions.length)prepareReview();});
$('#interview-back').addEventListener('click',()=>{if(step>0){step--;render(true);}});
$('#restart-interview').addEventListener('click',()=>{$('#restart-confirmation').hidden=false;$('#confirm-restart').focus();});
$('#cancel-restart').addEventListener('click',()=>{$('#restart-confirmation').hidden=true;$('#restart-interview').focus();});
$('#confirm-restart').addEventListener('click',()=>{answers={...defaults};step=0;loadError='';status.textContent='Answers reset to the interview’s starting suggestions.';$('#restart-confirmation').hidden=true;render(true);});
render();
