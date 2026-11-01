
(function(){
'use strict';
const BASE='https://mbzidcvdjcmowavhmrmr.supabase.co', KEY='sb_publishable_kOfhA0a2i5HZ-Qyb1cMOkg_qFuBthDw', STORE='magnetic-session-v2';
const $=id=>document.getElementById(id);
const safe=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let session=null,user=null,workspaces=[],workspaceId='',postList=[],editing=null;
function notice(message,error=false){$('notice').textContent=message;$('notice').className='msg'+(error?' err':'')}
function getSaved(){try{return JSON.parse(localStorage.getItem(STORE))}catch{return null}}
function setSession(s){session=s;if(s?.access_token)localStorage.setItem(STORE,JSON.stringify(s));else localStorage.removeItem(STORE)}
async function request(route,options={}){
 const response=await fetch(BASE+route,{...options,headers:{apikey:KEY,'Content-Type':'application/json',...(session?.access_token?{Authorization:'Bearer '+session.access_token}:{}),...(options.headers||{})}});
 let data;const text=await response.text();try{data=text?JSON.parse(text):null}catch{data=text}
 if(!response.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||('Request failed: HTTP '+response.status));
 return data;
}
async function auth(route,payload){return request('/auth/v1/'+route,{method:'POST',body:JSON.stringify(payload),headers:{}})}
async function ensureSession(){
 if(!session?.access_token)return false;
 const expires=(session.expires_at||0)*1000;
 if(expires && expires<Date.now()+90000){
  if(!session.refresh_token){setSession(null);return false}
  try{setSession(await auth('token?grant_type=refresh_token',{refresh_token:session.refresh_token}))}catch{setSession(null);return false}
 }
 return true;
}
async function dataRequest(table,method='GET',body=null,query='',prefer='return=representation'){
 if(!await ensureSession())throw Error('Your session expired. Please sign in again.');
 return request('/rest/v1/'+table+query,{method,body:body===null?undefined:JSON.stringify(body),headers:{Prefer:prefer}});
}
async function refreshUI(){
 const logged=await ensureSession();
 if(logged){
  try{user=await request('/auth/v1/user')}catch(e){setSession(null);user=null;notice('Session expired. Sign in again.',true)}
 }else user=null;
 $('auth').classList.toggle('hidden',!!user);$('app').classList.toggle('hidden',!user);
 $('logout').classList.toggle('hidden',!user);$('identity').textContent=user?.email||'Signed out';
 if(user)await loadWorkspaces();else{workspaces=[];workspaceId='';postList=[];editing=null}
}
async function loadWorkspaces(){
 workspaces=await dataRequest('workspaces','GET',null,'?select=id,name&order=created_at.asc')||[];
 if(!workspaces.find(x=>x.id===workspaceId))workspaceId=workspaces[0]?.id||'';
 $('workspace').innerHTML=workspaces.map(w=>'<option value="'+safe(w.id)+'">'+safe(w.name)+'</option>').join('');
 $('workspace').value=workspaceId;$('save').disabled=!workspaceId;await loadPosts()
}
async function loadPosts(){
 if(!workspaceId){postList=[];$('posts').innerHTML='<p class="muted">Create a workspace to begin.</p>';return}
 postList=await dataRequest('posts','GET',null,'?select=id,title,body,status,scheduled_at&workspace_id=eq.'+encodeURIComponent(workspaceId)+'&order=created_at.desc')||[];
 $('posts').innerHTML=postList.length?postList.map(p=>'<div class="item"><strong>'+safe(p.title)+'</strong><div class="muted">'+safe(p.status.replaceAll('_',' '))+(p.scheduled_at?' · '+safe(new Date(p.scheduled_at).toLocaleString('en-AU')):'')+'</div><button data-id="'+safe(p.id)+'" class="edit">Edit</button></div>').join(''):'<p class="muted">No posts saved yet.</p>';
 document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>editPost(b.dataset.id));
}
function resetEditor(){editing=null;$('editorHeading').textContent='Create post';$('title').value='';$('body').value='';$('date').value='';$('status').value='draft';$('delete').classList.add('hidden')}
function editPost(id){const p=postList.find(x=>x.id===id);if(!p)return;editing=id;$('editorHeading').textContent='Edit post';$('title').value=p.title;$('body').value=p.body;$('date').value=p.scheduled_at?new Date(new Date(p.scheduled_at).getTime()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16):'';$('status').value=p.status;$('delete').classList.remove('hidden')}
async function run(fn){try{await fn()}catch(e){console.error('Magnetic action failed',e);notice(e.message||String(e),true)}}
$('signin').onclick=()=>run(async()=>{
 const email=$('email').value.trim(),password=$('password').value;
 if(!email||!password)throw Error('Enter your email and password.');
 const result=await auth('token?grant_type=password',{email,password});\n if(!result?.access_token)throw Error('Sign-in did not return a session.');\n setSession(result);notice('Credentials accepted. Loading your workspace…');\n try{await refreshUI();notice('Signed in successfully.')}catch(error){\n  $('auth').classList.add('hidden');$('app').classList.remove('hidden');\n  $('logout').classList.remove('hidden');$('identity').textContent=email;\n  notice('Signed in, but workspace loading failed: '+(error?.message||error),true);\n }
});
$('signup').onclick=()=>run(async()=>{
 const email=$('email').value.trim(),password=$('password').value;
 if(!email||!email.includes('@'))throw Error('Enter a valid email.');
 if(password.length<6)throw Error('Password must be at least 6 characters.');
 const result=await auth('signup',{email,password,gotrue_meta_security:{},data:{}});
 if(result.access_token){setSession(result);await refreshUI();notice('Account created and signed in.')}
 else notice('If this is a new account, check your email for confirmation. If you have already registered, click Sign in with the same email and password.');
});
$('logout').onclick=()=>run(async()=>{setSession(null);await refreshUI();notice('Signed out.')});
$('createWorkspace').onclick=()=>run(async()=>{
 const name=$('workspaceName').value.trim();if(!name)throw Error('Enter a workspace name.');
 const id=await dataRequest('rpc/create_workspace','POST',{workspace_name:name});workspaceId=id;
 $('workspaceName').value='';await loadWorkspaces();notice('Workspace created.');
});
$('workspace').onchange=()=>run(async()=>{workspaceId=$('workspace').value;resetEditor();await loadPosts()});
$('save').onclick=()=>run(async()=>{
 if(!workspaceId)throw Error('Create a workspace first.');
 const title=$('title').value.trim();if(!title)throw Error('Enter a post title.');
 const payload={title,body:$('body').value,status:$('status').value,scheduled_at:$('date').value?new Date($('date').value).toISOString():null};
 if(editing)await dataRequest('posts','PATCH',payload,'?id=eq.'+editing+'&workspace_id=eq.'+workspaceId);
 else await dataRequest('posts','POST',{...payload,workspace_id:workspaceId,author_id:user.id});
 resetEditor();await loadPosts();notice('Post saved in Magnetic.');
});
$('delete').onclick=()=>run(async()=>{
 if(!editing||!confirm('Delete this post permanently?'))return;
 await dataRequest('posts','DELETE',null,'?id=eq.'+editing+'&workspace_id=eq.'+workspaceId);resetEditor();await loadPosts();notice('Post deleted.');
});
$('clear').onclick=resetEditor;
window.addEventListener('error',e=>notice('Application error: '+e.message,true));
window.addEventListener('unhandledrejection',e=>notice('Application error: '+(e.reason?.message||e.reason),true));
$('resetPassword').onclick=()=>run(async()=>{\n const email=$('email').value.trim();if(!email||!email.includes('@'))throw Error('Enter your email address first.');\n await auth('recover',{email});notice('If the address belongs to an account, a password reset email has been requested. Check spam too.');\n});\nsetSession(getSaved());
run(async()=>{await refreshUI();if(!user)notice('Ready. Sign in with your existing email and password, or use Reset password.');});
})();
