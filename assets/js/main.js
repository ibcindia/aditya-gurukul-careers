document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
 document.querySelectorAll('[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();const m=f.querySelector('[data-message]');if(m)m.textContent='Demo only: connect a secure backend before collecting or saving real information.';
 }));
 const s=document.querySelector('[data-job-search]');if(s)s.addEventListener('input',()=>document.querySelectorAll('[data-job-card]').forEach(c=>c.hidden=!c.innerText.toLowerCase().includes(s.value.toLowerCase())));
});
