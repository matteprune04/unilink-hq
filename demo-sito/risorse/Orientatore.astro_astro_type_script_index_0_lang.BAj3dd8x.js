import{t as e}from"./modulo.C68hYzvi.js";var t=e=>e.replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]);document.querySelectorAll(`[data-orientatore]`).forEach(n=>{let r=n.dataset.orientatore,i=JSON.parse(document.querySelector(`[data-orientatore-dati="${r}"]`).textContent),a=n.querySelector(`.carta`),o=0,s={},c=[],l=()=>{let[e,n]=i.domande[o];a.innerHTML=`<div class="barra">${i.domande.map((e,t)=>`<i class="${t<=o?`on`:``}"></i>`).join(``)}</div>
        <span class="eyebrow">Domanda ${o+1} di ${i.domande.length}</span><h3>${t(e)}</h3>
        <div class="opzioni">${n.map(([e],n)=>`<button type="button" data-k="${n}">${t(e)}</button>`).join(``)}</div>
        ${o?`<button type="button" class="indietro">← Indietro</button>`:``}`,a.querySelectorAll(`[data-k]`).forEach(e=>e.onclick=()=>{let[t,r]=n[+e.dataset.k];c[o]=t;for(let[e,t]of Object.entries(r))s[e]=(s[e]||0)+t;o++,o<i.domande.length?l():u()}),a.querySelector(`.indietro`)?.addEventListener(`click`,()=>{o=0,c.length=0;for(let e in s)delete s[e];l()})},u=()=>{let n=Object.entries(s).sort((e,t)=>t[1]-e[1])[0][0],u=i.risultati[n];a.innerHTML=`<span class="eyebrow">${r===`corso`?`Il tuo corso è`:`La tua strada è`}</span><h3 class="ris">${t(u.nome)}</h3><p>${t(u.perche)}</p>
        <form class="modulo" novalidate>
          <p class="piccolo">Vuoi anche ${r===`corso`?`il curriculum consigliato e gli esami chiave`:`gli esami chiave e da dove partire`}? Te li mandiamo via email.</p>
          <div class="campi"><label>Email<input type="email" name="email" autocomplete="email" required></label>
          <label>${r===`corso`?`Scuola o corso di provenienza`:`Il tuo corso`}<input type="text" name="provenienza" maxlength="120"></label></div>
          <label>Anno<select name="anno"><option>Superiori · IV anno</option><option>Superiori · V anno</option><option>I anno di università</option><option>II anno</option><option>III anno</option><option>Altro</option></select></label>
          <label class="ck"><input type="checkbox" name="novita" value="si"> <span>Voglio ricevere ogni tanto novità su UniLink (facoltativo).</span></label>
          <label class="ck"><input type="checkbox" name="privacy"> <span>Ho letto l'<a href="/unilink-hq/demo-sito/privacy">informativa privacy</a>: usate l'email per mandarmi il risultato.</span></label>
          <input class="esca" type="text" name="sito" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div data-turnstile></div>
          <button class="btn btn-a" type="submit">Mandami il risultato completo</button>
          <p data-msg aria-live="polite"></p>
        </form>
        <p class="onesta">${t(i.nota)}</p>
        <button type="button" class="indietro">Rifai le domande</button>`;let d=a.querySelector(`form`);e(d,`orientatore`,()=>({tipo:r,risultato:n,risposte:c}),()=>{d.outerHTML=`<div class="completo"><p>${t(u.poi)}</p><p class="piccolo">Te l'abbiamo mandato anche via email.</p><a class="btn btn-p" href="/unilink-hq/demo-app/registrati">Crea l'account gratis</a></div>`}),a.querySelector(`.indietro`).onclick=()=>{o=0,c.length=0;for(let e in s)delete s[e];l()}};l()});