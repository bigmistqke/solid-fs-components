(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))o(c);new MutationObserver(c=>{for(const t of c)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(c){const t={};return c.integrity&&(t.integrity=c.integrity),c.referrerPolicy&&(t.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?t.credentials="include":c.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(c){if(c.ep)return;c.ep=!0;const t=i(c);fetch(c.href,t)}})();const equalFn=(e,n)=>e===n,$PROXY=Symbol("solid-proxy"),$TRACK=Symbol("solid-track"),signalOptions={equals:equalFn};let runEffects=runQueue;const STALE=1,PENDING=2,UNOWNED={owned:null,cleanups:null,context:null,owner:null},NO_INIT={};var Owner=null;let Transition=null,ExternalSourceConfig=null,Listener=null,Updates=null,Effects=null,ExecCount=0;function createRoot(e,n){const i=Listener,o=Owner,c=e.length===0,t=n===void 0?o:n,a=c?UNOWNED:{owned:null,cleanups:null,context:t?t.context:null,owner:t},l=c?e:()=>e(()=>untrack(()=>cleanNode(a)));Owner=a,Listener=null;try{return runUpdates(l,!0)}finally{Listener=i,Owner=o}}function createSignal(e,n){n=n?Object.assign({},signalOptions,n):signalOptions;const i={value:e,observers:null,observerSlots:null,comparator:n.equals||void 0},o=c=>(typeof c=="function"&&(c=c(i.value)),writeSignal(i,c));return[readSignal.bind(i),o]}function createComputed(e,n,i){const o=createComputation(e,n,!0,STALE);updateComputation(o)}function createRenderEffect(e,n,i){const o=createComputation(e,n,!1,STALE);updateComputation(o)}function createEffect(e,n,i){runEffects=runUserEffects;const o=createComputation(e,n,!1,STALE);o.user=!0,Effects?Effects.push(o):updateComputation(o)}function createMemo(e,n,i){i=i?Object.assign({},signalOptions,i):signalOptions;const o=createComputation(e,n,!0,0);return o.observers=null,o.observerSlots=null,o.comparator=i.equals||void 0,updateComputation(o),readSignal.bind(o)}function isPromise(e){return e&&typeof e=="object"&&"then"in e}function createResource(e,n,i){let o,c,t;arguments.length===2&&typeof n=="object"||arguments.length===1?(o=!0,c=e,t=n||{}):(o=e,c=n,t={});let a=null,l=NO_INIT,p=!1,d="initialValue"in t,w=typeof o=="function"&&createMemo(o);const y=new Set,[v,k]=(t.storage||createSignal)(t.initialValue),[T,_]=createSignal(void 0),[N,S]=createSignal(void 0,{equals:!1}),[I,x]=createSignal(d?"ready":"unresolved");function P(f,u,b,m){return a===f&&(a=null,m!==void 0&&(d=!0),(f===l||u===l)&&t.onHydrated&&queueMicrotask(()=>t.onHydrated(m,{value:u})),l=NO_INIT,h(u,b)),u}function h(f,u){runUpdates(()=>{u===void 0&&k(()=>f),x(u!==void 0?"errored":d?"ready":"unresolved"),_(u);for(const b of y.keys())b.decrement();y.clear()},!1)}function s(){const f=SuspenseContext,u=v(),b=T();if(b!==void 0&&!a)throw b;return Listener&&!Listener.user&&f&&createComputed(()=>{N(),a&&(f.resolved||y.has(f)||(f.increment(),y.add(f)))}),u}function g(f=!0){if(f!==!1&&p)return;p=!1;const u=w?w():o;if(u==null||u===!1){P(a,untrack(v));return}const b=l!==NO_INIT?l:untrack(()=>c(u,{value:v(),refetching:f}));return isPromise(b)?(a=b,"value"in b?(b.status==="success"?P(a,b.value,void 0,u):P(a,void 0,void 0,u),b):(p=!0,queueMicrotask(()=>p=!1),runUpdates(()=>{x(d?"refreshing":"pending"),S()},!1),b.then(m=>P(b,m,void 0,u),m=>P(b,void 0,castError(m),u)))):(P(a,b,void 0,u),b)}return Object.defineProperties(s,{state:{get:()=>I()},error:{get:()=>T()},loading:{get(){const f=I();return f==="pending"||f==="refreshing"}},latest:{get(){if(!d)return s();const f=T();if(f&&!a)throw f;return v()}}}),w?createComputed(()=>g(!1)):g(!1),[s,{refetch:g,mutate:k}]}function createSelector(e,n=equalFn,i){const o=new Map,c=createComputation(t=>{const a=e();for(const[l,p]of o.entries())if(n(l,a)!==n(l,t))for(const d of p.values())d.state=STALE,d.pure?Updates.push(d):Effects.push(d);return a},void 0,!0,STALE);return updateComputation(c),t=>{const a=Listener;if(a){let l;(l=o.get(t))?l.add(a):o.set(t,l=new Set([a])),onCleanup(()=>{l.delete(a),!l.size&&o.delete(t)})}return n(t,c.value)}}function batch(e){return runUpdates(e,!1)}function untrack(e){if(Listener===null)return e();const n=Listener;Listener=null;try{return e()}finally{Listener=n}}function on(e,n,i){const o=Array.isArray(e);let c;return t=>{let a;if(o){a=Array(e.length);for(let p=0;p<e.length;p++)a[p]=e[p]()}else a=e();const l=untrack(()=>n(a,c,t));return c=a,l}}function onMount(e){createEffect(()=>untrack(e))}function onCleanup(e){return Owner===null||(Owner.cleanups===null?Owner.cleanups=[e]:Owner.cleanups.push(e)),e}function getListener(){return Listener}function createContext(e,n){const i=Symbol("context");return{id:i,Provider:createProvider(i),defaultValue:e}}function useContext(e){return Owner&&Owner.context&&Owner.context[e.id]!==void 0?Owner.context[e.id]:e.defaultValue}function children(e){const n=createMemo(e),i=createMemo(()=>resolveChildren(n()));return i.toArray=()=>{const o=i();return Array.isArray(o)?o:o!=null?[o]:[]},i}let SuspenseContext;function readSignal(){if(this.sources&&this.state)if(this.state===STALE)updateComputation(this);else{const e=Updates;Updates=null,runUpdates(()=>lookUpstream(this),!1),Updates=e}if(Listener){const e=this.observers?this.observers.length:0;Listener.sources?(Listener.sources.push(this),Listener.sourceSlots.push(e)):(Listener.sources=[this],Listener.sourceSlots=[e]),this.observers?(this.observers.push(Listener),this.observerSlots.push(Listener.sources.length-1)):(this.observers=[Listener],this.observerSlots=[Listener.sources.length-1])}return this.value}function writeSignal(e,n,i){let o=e.value;return(!e.comparator||!e.comparator(o,n))&&(e.value=n,e.observers&&e.observers.length&&runUpdates(()=>{for(let c=0;c<e.observers.length;c+=1){const t=e.observers[c],a=Transition&&Transition.running;a&&Transition.disposed.has(t),(a?!t.tState:!t.state)&&(t.pure?Updates.push(t):Effects.push(t),t.observers&&markDownstream(t)),a||(t.state=STALE)}if(Updates.length>1e6)throw Updates=[],new Error},!1)),n}function updateComputation(e){if(!e.fn)return;cleanNode(e);const n=ExecCount;runComputation(e,e.value,n)}function runComputation(e,n,i){let o;const c=Owner,t=Listener;Listener=Owner=e;try{o=e.fn(n)}catch(a){return e.pure&&(e.state=STALE,e.owned&&e.owned.forEach(cleanNode),e.owned=null),e.updatedAt=i+1,handleError(a)}finally{Listener=t,Owner=c}(!e.updatedAt||e.updatedAt<=i)&&(e.updatedAt!=null&&"observers"in e?writeSignal(e,o):e.value=o,e.updatedAt=i)}function createComputation(e,n,i,o=STALE,c){const t={fn:e,state:o,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:Owner,context:Owner?Owner.context:null,pure:i};return Owner===null||Owner!==UNOWNED&&(Owner.owned?Owner.owned.push(t):Owner.owned=[t]),t}function runTop(e){if(e.state===0)return;if(e.state===PENDING)return lookUpstream(e);if(e.suspense&&untrack(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<ExecCount);)e.state&&n.push(e);for(let i=n.length-1;i>=0;i--)if(e=n[i],e.state===STALE)updateComputation(e);else if(e.state===PENDING){const o=Updates;Updates=null,runUpdates(()=>lookUpstream(e,n[0]),!1),Updates=o}}function runUpdates(e,n){if(Updates)return e();let i=!1;n||(Updates=[]),Effects?i=!0:Effects=[],ExecCount++;try{const o=e();return completeUpdates(i),o}catch(o){i||(Effects=null),Updates=null,handleError(o)}}function completeUpdates(e){if(Updates&&(runQueue(Updates),Updates=null),e)return;const n=Effects;Effects=null,n.length&&runUpdates(()=>runEffects(n),!1)}function runQueue(e){for(let n=0;n<e.length;n++)runTop(e[n])}function runUserEffects(e){let n,i=0;for(n=0;n<e.length;n++){const o=e[n];o.user?e[i++]=o:runTop(o)}for(n=0;n<i;n++)runTop(e[n])}function lookUpstream(e,n){e.state=0;for(let i=0;i<e.sources.length;i+=1){const o=e.sources[i];if(o.sources){const c=o.state;c===STALE?o!==n&&(!o.updatedAt||o.updatedAt<ExecCount)&&runTop(o):c===PENDING&&lookUpstream(o,n)}}}function markDownstream(e){for(let n=0;n<e.observers.length;n+=1){const i=e.observers[n];i.state||(i.state=PENDING,i.pure?Updates.push(i):Effects.push(i),i.observers&&markDownstream(i))}}function cleanNode(e){let n;if(e.sources)for(;e.sources.length;){const i=e.sources.pop(),o=e.sourceSlots.pop(),c=i.observers;if(c&&c.length){const t=c.pop(),a=i.observerSlots.pop();o<c.length&&(t.sourceSlots[a]=o,c[o]=t,i.observerSlots[o]=a)}}if(e.owned){for(n=e.owned.length-1;n>=0;n--)cleanNode(e.owned[n]);e.owned=null}if(e.cleanups){for(n=e.cleanups.length-1;n>=0;n--)e.cleanups[n]();e.cleanups=null}e.state=0}function castError(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function handleError(e,n=Owner){throw castError(e)}function resolveChildren(e){if(typeof e=="function"&&!e.length)return resolveChildren(e());if(Array.isArray(e)){const n=[];for(let i=0;i<e.length;i++){const o=resolveChildren(e[i]);Array.isArray(o)?n.push.apply(n,o):n.push(o)}return n}return e}function createProvider(e,n){return function(o){let c;return createRenderEffect(()=>c=untrack(()=>(Owner.context={...Owner.context,[e]:o.value},children(()=>o.children))),void 0),c}}const FALLBACK$1=Symbol("fallback");function dispose$1(e){for(let n=0;n<e.length;n++)e[n]()}function mapArray(e,n,i={}){let o=[],c=[],t=[],a=0,l=n.length>1?[]:null;return onCleanup(()=>dispose$1(t)),()=>{let p=e()||[],d,w;return p[$TRACK],untrack(()=>{let v=p.length,k,T,_,N,S,I,x,P,h;if(v===0)a!==0&&(dispose$1(t),t=[],o=[],c=[],a=0,l&&(l=[])),i.fallback&&(o=[FALLBACK$1],c[0]=createRoot(s=>(t[0]=s,i.fallback())),a=1);else if(a===0){for(c=new Array(v),w=0;w<v;w++)o[w]=p[w],c[w]=createRoot(y);a=v}else{for(_=new Array(v),N=new Array(v),l&&(S=new Array(v)),I=0,x=Math.min(a,v);I<x&&o[I]===p[I];I++);for(x=a-1,P=v-1;x>=I&&P>=I&&o[x]===p[P];x--,P--)_[P]=c[x],N[P]=t[x],l&&(S[P]=l[x]);for(k=new Map,T=new Array(P+1),w=P;w>=I;w--)h=p[w],d=k.get(h),T[w]=d===void 0?-1:d,k.set(h,w);for(d=I;d<=x;d++)h=o[d],w=k.get(h),w!==void 0&&w!==-1?(_[w]=c[d],N[w]=t[d],l&&(S[w]=l[d]),w=T[w],k.set(h,w)):t[d]();for(w=I;w<v;w++)w in _?(c[w]=_[w],t[w]=N[w],l&&(l[w]=S[w],l[w](w))):c[w]=createRoot(y);c=c.slice(0,a=v),o=p.slice(0)}return c});function y(v){if(t[w]=v,l){const[k,T]=createSignal(w);return l[w]=T,n(p[w],k)}return n(p[w])}}}function indexArray(e,n,i={}){let o=[],c=[],t=[],a=[],l=0,p;return onCleanup(()=>dispose$1(t)),()=>{const d=e()||[];return d[$TRACK],untrack(()=>{if(d.length===0)return l!==0&&(dispose$1(t),t=[],o=[],c=[],l=0,a=[]),i.fallback&&(o=[FALLBACK$1],c[0]=createRoot(y=>(t[0]=y,i.fallback())),l=1),c;for(o[0]===FALLBACK$1&&(t[0](),t=[],o=[],c=[],l=0),p=0;p<d.length;p++)p<o.length&&o[p]!==d[p]?a[p](()=>d[p]):p>=o.length&&(c[p]=createRoot(w));for(;p<o.length;p++)t[p]();return l=a.length=t.length=d.length,o=d.slice(0),c=c.slice(0,l)});function w(y){t[p]=y;const[v,k]=createSignal(d[p]);return a[p]=k,n(v,p)}}}function createComponent(e,n){return untrack(()=>e(n||{}))}function trueFn(){return!0}const propTraps={get(e,n,i){return n===$PROXY?i:e.get(n)},has(e,n){return n===$PROXY?!0:e.has(n)},set:trueFn,deleteProperty:trueFn,getOwnPropertyDescriptor(e,n){return{configurable:!0,enumerable:!0,get(){return e.get(n)},set:trueFn,deleteProperty:trueFn}},ownKeys(e){return e.keys()}};function resolveSource(e){return(e=typeof e=="function"?e():e)?e:{}}function resolveSources(){for(let e=0,n=this.length;e<n;++e){const i=this[e]();if(i!==void 0)return i}}function mergeProps(...e){let n=!1;for(let a=0;a<e.length;a++){const l=e[a];n=n||!!l&&$PROXY in l,e[a]=typeof l=="function"?(n=!0,createMemo(l)):l}if(n)return new Proxy({get(a){for(let l=e.length-1;l>=0;l--){const p=resolveSource(e[l])[a];if(p!==void 0)return p}},has(a){for(let l=e.length-1;l>=0;l--)if(a in resolveSource(e[l]))return!0;return!1},keys(){const a=[];for(let l=0;l<e.length;l++)a.push(...Object.keys(resolveSource(e[l])));return[...new Set(a)]}},propTraps);const i={},o=Object.create(null);for(let a=e.length-1;a>=0;a--){const l=e[a];if(!l)continue;const p=Object.getOwnPropertyNames(l);for(let d=p.length-1;d>=0;d--){const w=p[d];if(w==="__proto__"||w==="constructor")continue;const y=Object.getOwnPropertyDescriptor(l,w);if(!o[w])o[w]=y.get?{enumerable:!0,configurable:!0,get:resolveSources.bind(i[w]=[y.get.bind(l)])}:y.value!==void 0?y:void 0;else{const v=i[w];v&&(y.get?v.push(y.get.bind(l)):y.value!==void 0&&v.push(()=>y.value))}}}const c={},t=Object.keys(o);for(let a=t.length-1;a>=0;a--){const l=t[a],p=o[l];p&&p.get?Object.defineProperty(c,l,p):c[l]=p?p.value:void 0}return c}function splitProps(e,...n){if($PROXY in e){const c=new Set(n.length>1?n.flat():n[0]),t=n.map(a=>new Proxy({get(l){return a.includes(l)?e[l]:void 0},has(l){return a.includes(l)&&l in e},keys(){return a.filter(l=>l in e)}},propTraps));return t.push(new Proxy({get(a){return c.has(a)?void 0:e[a]},has(a){return c.has(a)?!1:a in e},keys(){return Object.keys(e).filter(a=>!c.has(a))}},propTraps)),t}const i={},o=n.map(()=>({}));for(const c of Object.getOwnPropertyNames(e)){const t=Object.getOwnPropertyDescriptor(e,c),a=!t.get&&!t.set&&t.enumerable&&t.writable&&t.configurable;let l=!1,p=0;for(const d of n)d.includes(c)&&(l=!0,a?o[p][c]=t.value:Object.defineProperty(o[p],c,t)),++p;l||(a?i[c]=t.value:Object.defineProperty(i,c,t))}return[...o,i]}const narrowedError=e=>`Stale read from <${e}>.`;function For(e){const n="fallback"in e&&{fallback:()=>e.fallback};return createMemo(mapArray(()=>e.each,e.children,n||void 0))}function Index(e){const n="fallback"in e&&{fallback:()=>e.fallback};return createMemo(indexArray(()=>e.each,e.children,n||void 0))}function Show(e){const n=e.keyed,i=createMemo(()=>e.when,void 0,{equals:(o,c)=>n?o===c:!o==!c});return createMemo(()=>{const o=i();if(o){const c=e.children;return typeof c=="function"&&c.length>0?untrack(()=>c(n?o:()=>{if(!untrack(i))throw narrowedError("Show");return e.when})):c}return e.fallback},void 0,void 0)}function Switch(e){let n=!1;const i=(t,a)=>(n?t[1]===a[1]:!t[1]==!a[1])&&t[2]===a[2],o=children(()=>e.children),c=createMemo(()=>{let t=o();Array.isArray(t)||(t=[t]);for(let a=0;a<t.length;a++){const l=t[a].when;if(l)return n=!!t[a].keyed,[a,l,t[a]]}return[-1]},void 0,{equals:i});return createMemo(()=>{const[t,a,l]=c();if(t<0)return e.fallback;const p=l.children;return typeof p=="function"&&p.length>0?untrack(()=>p(n?a:()=>{if(untrack(c)[0]!==t)throw narrowedError("Match");return l.when})):p},void 0,void 0)}function Match(e){return e}const booleans=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],Properties=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...booleans]),ChildProperties=new Set(["innerHTML","textContent","innerText","children"]),Aliases=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),PropAliases=Object.assign(Object.create(null),{class:"className",formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}});function getPropAlias(e,n){const i=PropAliases[e];return typeof i=="object"?i[n]?i.$:void 0:i}const DelegatedEvents=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]);function reconcileArrays(e,n,i){let o=i.length,c=n.length,t=o,a=0,l=0,p=n[c-1].nextSibling,d=null;for(;a<c||l<t;){if(n[a]===i[l]){a++,l++;continue}for(;n[c-1]===i[t-1];)c--,t--;if(c===a){const w=t<o?l?i[l-1].nextSibling:i[t-l]:p;for(;l<t;)e.insertBefore(i[l++],w)}else if(t===l)for(;a<c;)(!d||!d.has(n[a]))&&n[a].remove(),a++;else if(n[a]===i[t-1]&&i[l]===n[c-1]){const w=n[--c].nextSibling;e.insertBefore(i[l++],n[a++].nextSibling),e.insertBefore(i[--t],w),n[c]=i[t]}else{if(!d){d=new Map;let y=l;for(;y<t;)d.set(i[y],y++)}const w=d.get(n[a]);if(w!=null)if(l<w&&w<t){let y=a,v=1,k;for(;++y<c&&y<t&&!((k=d.get(n[y]))==null||k!==w+v);)v++;if(v>w-l){const T=n[a];for(;l<w;)e.insertBefore(i[l++],T)}else e.replaceChild(i[l++],n[a++])}else a++;else n[a++].remove()}}}const $$EVENTS="_$DX_DELEGATE";function render(e,n,i,o={}){let c;return createRoot(t=>{c=t,n===document?e():insert(n,e(),n.firstChild?null:void 0,i)},o.owner),()=>{c(),n.textContent=""}}function template(e,n,i){let o;const c=()=>{const a=document.createElement("template");return a.innerHTML=e,a.content.firstChild},t=()=>(o||(o=c())).cloneNode(!0);return t.cloneNode=t,t}function delegateEvents(e,n=window.document){const i=n[$$EVENTS]||(n[$$EVENTS]=new Set);for(let o=0,c=e.length;o<c;o++){const t=e[o];i.has(t)||(i.add(t),n.addEventListener(t,eventHandler))}}function setAttribute(e,n,i){i==null?e.removeAttribute(n):e.setAttribute(n,i)}function className(e,n){n==null?e.removeAttribute("class"):e.className=n}function addEventListener(e,n,i,o){if(o)Array.isArray(i)?(e[`$$${n}`]=i[0],e[`$$${n}Data`]=i[1]):e[`$$${n}`]=i;else if(Array.isArray(i)){const c=i[0];e.addEventListener(n,i[0]=t=>c.call(e,i[1],t))}else e.addEventListener(n,i)}function classList(e,n,i={}){const o=Object.keys(n||{}),c=Object.keys(i);let t,a;for(t=0,a=c.length;t<a;t++){const l=c[t];!l||l==="undefined"||n[l]||(toggleClassKey(e,l,!1),delete i[l])}for(t=0,a=o.length;t<a;t++){const l=o[t],p=!!n[l];!l||l==="undefined"||i[l]===p||!p||(toggleClassKey(e,l,!0),i[l]=p)}return i}function style(e,n,i){if(!n)return i?setAttribute(e,"style"):n;const o=e.style;if(typeof n=="string")return o.cssText=n;typeof i=="string"&&(o.cssText=i=void 0),i||(i={}),n||(n={});let c,t;for(t in i)n[t]==null&&o.removeProperty(t),delete i[t];for(t in n)c=n[t],c!==i[t]&&(o.setProperty(t,c),i[t]=c);return i}function spread(e,n={},i,o){const c={};return o||createRenderEffect(()=>c.children=insertExpression(e,n.children,c.children)),createRenderEffect(()=>typeof n.ref=="function"?use(n.ref,e):n.ref=e),createRenderEffect(()=>assign(e,n,i,!0,c,!0)),c}function use(e,n,i){return untrack(()=>e(n,i))}function insert(e,n,i,o){if(i!==void 0&&!o&&(o=[]),typeof n!="function")return insertExpression(e,n,o,i);createRenderEffect(c=>insertExpression(e,n(),c,i),o)}function assign(e,n,i,o,c={},t=!1){n||(n={});for(const a in c)if(!(a in n)){if(a==="children")continue;c[a]=assignProp(e,a,null,c[a],i,t)}for(const a in n){if(a==="children")continue;const l=n[a];c[a]=assignProp(e,a,l,c[a],i,t)}}function toPropertyName(e){return e.toLowerCase().replace(/-([a-z])/g,(n,i)=>i.toUpperCase())}function toggleClassKey(e,n,i){const o=n.trim().split(/\s+/);for(let c=0,t=o.length;c<t;c++)e.classList.toggle(o[c],i)}function assignProp(e,n,i,o,c,t){let a,l,p,d,w;if(n==="style")return style(e,i,o);if(n==="classList")return classList(e,i,o);if(i===o)return o;if(n==="ref")t||i(e);else if(n.slice(0,3)==="on:"){const y=n.slice(3);o&&e.removeEventListener(y,o),i&&e.addEventListener(y,i)}else if(n.slice(0,10)==="oncapture:"){const y=n.slice(10);o&&e.removeEventListener(y,o,!0),i&&e.addEventListener(y,i,!0)}else if(n.slice(0,2)==="on"){const y=n.slice(2).toLowerCase(),v=DelegatedEvents.has(y);if(!v&&o){const k=Array.isArray(o)?o[0]:o;e.removeEventListener(y,k)}(v||i)&&(addEventListener(e,y,i,v),v&&delegateEvents([y]))}else n.slice(0,5)==="attr:"?setAttribute(e,n.slice(5),i):(w=n.slice(0,5)==="prop:")||(p=ChildProperties.has(n))||(d=getPropAlias(n,e.tagName))||(l=Properties.has(n))||(a=e.nodeName.includes("-"))?(w&&(n=n.slice(5),l=!0),n==="class"||n==="className"?className(e,i):a&&!l&&!p?e[toPropertyName(n)]=i:e[d||n]=i):setAttribute(e,Aliases[n]||n,i);return i}function eventHandler(e){const n=`$$${e.type}`;let i=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==i&&Object.defineProperty(e,"target",{configurable:!0,value:i}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return i||document}});i;){const o=i[n];if(o&&!i.disabled){const c=i[`${n}Data`];if(c!==void 0?o.call(i,c,e):o.call(i,e),e.cancelBubble)return}i=i._$host||i.parentNode||i.host}}function insertExpression(e,n,i,o,c){for(;typeof i=="function";)i=i();if(n===i)return i;const t=typeof n,a=o!==void 0;if(e=a&&i[0]&&i[0].parentNode||e,t==="string"||t==="number")if(t==="number"&&(n=n.toString()),a){let l=i[0];l&&l.nodeType===3?l.data!==n&&(l.data=n):l=document.createTextNode(n),i=cleanChildren(e,i,o,l)}else i!==""&&typeof i=="string"?i=e.firstChild.data=n:i=e.textContent=n;else if(n==null||t==="boolean")i=cleanChildren(e,i,o);else{if(t==="function")return createRenderEffect(()=>{let l=n();for(;typeof l=="function";)l=l();i=insertExpression(e,l,i,o)}),()=>i;if(Array.isArray(n)){const l=[],p=i&&Array.isArray(i);if(normalizeIncomingArray(l,n,i,c))return createRenderEffect(()=>i=insertExpression(e,l,i,o,!0)),()=>i;if(l.length===0){if(i=cleanChildren(e,i,o),a)return i}else p?i.length===0?appendNodes(e,l,o):reconcileArrays(e,i,l):(i&&cleanChildren(e),appendNodes(e,l));i=l}else if(n.nodeType){if(Array.isArray(i)){if(a)return i=cleanChildren(e,i,o,n);cleanChildren(e,i,null,n)}else i==null||i===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);i=n}}return i}function normalizeIncomingArray(e,n,i,o){let c=!1;for(let t=0,a=n.length;t<a;t++){let l=n[t],p=i&&i[e.length],d;if(!(l==null||l===!0||l===!1))if((d=typeof l)=="object"&&l.nodeType)e.push(l);else if(Array.isArray(l))c=normalizeIncomingArray(e,l,p)||c;else if(d==="function")if(o){for(;typeof l=="function";)l=l();c=normalizeIncomingArray(e,Array.isArray(l)?l:[l],Array.isArray(p)?p:[p])||c}else e.push(l),c=!0;else{const w=String(l);p&&p.nodeType===3&&p.data===w?e.push(p):e.push(document.createTextNode(w))}}return c}function appendNodes(e,n,i=null){for(let o=0,c=n.length;o<c;o++)e.insertBefore(n[o],i)}function cleanChildren(e,n,i,o){if(i===void 0)return e.textContent="";const c=o||document.createTextNode("");if(n.length){let t=!1;for(let a=n.length-1;a>=0;a--){const l=n[a];if(c!==l){const p=l.parentNode===e;!t&&!a?p?e.replaceChild(c,l):e.insertBefore(c,i):p&&l.remove()}else t=!0}}else e.insertBefore(c,i);return[c]}const __vite_glob_0_0=`MIT License

Copyright (c) 2022 bigmistqke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,__vite_glob_0_1=`<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-fs-components&background=tiles&project=%20" alt="solid-fs-components">
</p>

# solid-fs-components (WIP)

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Headless components for visualizing and interacting with reactive filesystem

**Currently implementing**

- FileTree

**Planning to implement**

- (sortable) FileList
- FileGrid
`,__vite_glob_0_2=`* {
  scrollbar-color: lightgrey transparent;
  scrollbar-width: thin;
}

.app {
  display: grid;
  grid-template-columns: 125px 125px 1fr;
  justify-content: start;
  height: 100vh;
}

.default [data-fs-selected] {
  text-decoration: underline;
}

.custom {
  display: grid;
  align-content: start;
  box-sizing: border-box;
  background-color: #23262e;
  padding: 1px;
  width: 100%;
  height: 100%;
  overflow: auto;
  color: white;
}

.dirEnt {
  display: flex;
  margin: 0px;
  border: none;
  background: transparent;
  padding: 0px 2px;
  color: inherit;
  font-size: 10pt;
  line-height: 14pt;
  text-align: left;
  white-space: nowrap;
}

.dirEnt:focus {
  z-index: 1;
  outline: 1px solid rgba(255, 255, 255, 0.5);
}

.textarea {
  padding: 10px;
}

.input {
  border: none;
  border-top: 1px solid lightgrey;
  background: black;
  padding: 10px;
  color: white;
  font-family: monospace;
  &:focus-visible {
    outline: none;
  }
}
`,__vite_glob_0_3=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📁</text></svg>"
    />
    <title>Solid Fs Components</title>
  </head>

  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <script src="./index.tsx" type="module"><\/script>
  </body>
</html>
`,__vite_glob_0_4=`import { render } from 'solid-js/web'
import './styles.css'

import App from './App'

render(() => <App />, document.getElementById('root')!)
`,__vite_glob_0_5='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 155.3"><path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="#76b3e1"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf2fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" opacity=".3" fill="url(#a)"/><path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" fill="#518ac8"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" opacity=".3" fill="url(#b)"/><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="18.4" y1="64.2" x2="144.3" y2="149.8"><stop offset="0" stop-color="#315aa9"/><stop offset=".5" stop-color="#518ac8"/><stop offset="1" stop-color="#315aa9"/></linearGradient><path d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z" fill="url(#c)"/><linearGradient id="d" gradientUnits="userSpaceOnUse" x1="75.2" y1="74.5" x2="24.4" y2="260.8"><stop offset="0" stop-color="#4377bb"/><stop offset=".5" stop-color="#1a336b"/><stop offset="1" stop-color="#1a336b"/></linearGradient><path d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z" fill="url(#d)"/></svg>',__vite_glob_0_6=`body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}
`,__vite_glob_0_7=`{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["vite/client", "@bigmistqke/vite-plugin-raw-directory/client"]
  },
  "exclude": ["node_modules", "dist"]
}
`,__vite_glob_0_8=`import path from 'node:path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
  },
  plugins: [
    solidPlugin(),
    {
      name: 'Reaplace env variables',
      transform(code, id) {
        if (id.includes('node_modules')) {
          return code
        }
        return code
          .replace(/process\\.env\\.SSR/g, 'false')
          .replace(/process\\.env\\.DEV/g, 'true')
          .replace(/process\\.env\\.PROD/g, 'false')
          .replace(/process\\.env\\.NODE_ENV/g, '"development"')
          .replace(/import\\.meta\\.env\\.SSR/g, 'false')
          .replace(/import\\.meta\\.env\\.DEV/g, 'true')
          .replace(/import\\.meta\\.env\\.PROD/g, 'false')
          .replace(/import\\.meta\\.env\\.NODE_ENV/g, '"development"')
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
`,__vite_glob_0_9=`declare global {
  interface ImportMeta {
    env: {
      NODE_ENV: 'production' | 'development'
      PROD: boolean
      DEV: boolean
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
      PROD: boolean
      DEV: boolean
    }
  }
}

export {}
`,__vite_glob_0_10=`{
  "name": "solid-fs-components",
  "version": "0.0.0",
  "description": "headless components for visualizing and interacting with reactive filesystem",
  "license": "MIT",
  "author": "bigmistqke",
  "contributors": [],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bigmistqke/solid-fs-components.git"
  },
  "homepage": "https://github.com/bigmistqke/solid-fs-components#readme",
  "bugs": {
    "url": "https://github.com/bigmistqke/solid-fs-components/issues"
  },
  "files": [
    "dist"
  ],
  "private": false,
  "sideEffects": false,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "browser": {},
  "exports": {
    "development": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "import": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "typesVersions": {},
  "scripts": {
    "dev": "vite serve dev",
    "build": "vite build",
    "build:dev": "vite build dev",
    "test": "concurrently pnpm:test:*",
    "test:client": "vitest",
    "test:ssr": "pnpm run test:client --mode ssr",
    "prepublishOnly": "pnpm build",
    "format": "prettier --ignore-path .gitignore -w \\"src/**/*.{js,ts,json,css,tsx,jsx}\\" \\"dev/**/*.{js,ts,json,css,tsx,jsx}\\"",
    "lint": "concurrently pnpm:lint:*",
    "lint:code": "eslint --ignore-path .gitignore --max-warnings 0 src/**/*.{js,ts,tsx,jsx}",
    "lint:types": "tsc --noEmit",
    "update-deps": "pnpm up -Li"
  },
  "dependencies": {
    "@solid-primitives/keyed": "^1.5.0",
    "@solid-primitives/map": "^0.6.0",
    "@solid-primitives/range": "^0.2.0",
    "clsx": "^2.1.1"
  },
  "peerDependencies": {
    "solid-js": "^1.6.0"
  },
  "devDependencies": {
    "@bigmistqke/solid-grid-split": "^0.0.2",
    "@bigmistqke/vite-plugin-raw-directory": "^0.0.2",
    "@types/node": "^20.12.12",
    "@typescript-eslint/eslint-plugin": "^7.9.0",
    "@typescript-eslint/parser": "^7.9.0",
    "concurrently": "^8.2.2",
    "esbuild": "^0.21.3",
    "esbuild-css-modules-plugin": "^3.1.4",
    "esbuild-plugin-solid": "^0.6.0",
    "eslint": "^8.56.0",
    "eslint-plugin-eslint-comments": "^3.2.0",
    "eslint-plugin-no-only-tests": "^3.1.0",
    "jsdom": "^24.0.0",
    "prettier": "3.0.0",
    "solid-js": "^1.8.17",
    "tm-textarea": "^0.1.1",
    "typescript": "^5.4.5",
    "vite": "^5.2.11",
    "vite-plugin-css-classnames": "^0.0.2",
    "vite-plugin-dts": "^4.5.3",
    "vite-plugin-dts-bundle-generator": "^2.1.0",
    "vite-plugin-lib-inject-css": "^2.2.1",
    "vite-plugin-solid": "^2.10.2",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^1.6.0"
  },
  "keywords": [
    "solid"
  ],
  "packageManager": "pnpm@9.1.1",
  "engines": {
    "node": ">=18",
    "pnpm": ">=9.0.0"
  }
}
`,__vite_glob_0_11=`lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@solid-primitives/keyed':
        specifier: ^1.5.0
        version: 1.5.0(solid-js@1.8.17)
      '@solid-primitives/map':
        specifier: ^0.6.0
        version: 0.6.0(solid-js@1.8.17)
      '@solid-primitives/range':
        specifier: ^0.2.0
        version: 0.2.0(solid-js@1.8.17)
      clsx:
        specifier: ^2.1.1
        version: 2.1.1
    devDependencies:
      '@bigmistqke/solid-grid-split':
        specifier: ^0.0.2
        version: 0.0.2(solid-js@1.8.17)
      '@bigmistqke/vite-plugin-raw-directory':
        specifier: ^0.0.2
        version: 0.0.2
      '@types/node':
        specifier: ^20.12.12
        version: 20.12.12
      '@typescript-eslint/eslint-plugin':
        specifier: ^7.9.0
        version: 7.9.0(@typescript-eslint/parser@7.9.0(eslint@8.57.0)(typescript@5.4.5))(eslint@8.57.0)(typescript@5.4.5)
      '@typescript-eslint/parser':
        specifier: ^7.9.0
        version: 7.9.0(eslint@8.57.0)(typescript@5.4.5)
      concurrently:
        specifier: ^8.2.2
        version: 8.2.2
      esbuild:
        specifier: ^0.21.3
        version: 0.21.3
      esbuild-css-modules-plugin:
        specifier: ^3.1.4
        version: 3.1.4(esbuild@0.21.3)
      esbuild-plugin-solid:
        specifier: ^0.6.0
        version: 0.6.0(esbuild@0.21.3)(solid-js@1.8.17)
      eslint:
        specifier: ^8.56.0
        version: 8.57.0
      eslint-plugin-eslint-comments:
        specifier: ^3.2.0
        version: 3.2.0(eslint@8.57.0)
      eslint-plugin-no-only-tests:
        specifier: ^3.1.0
        version: 3.1.0
      jsdom:
        specifier: ^24.0.0
        version: 24.0.0
      prettier:
        specifier: 3.0.0
        version: 3.0.0
      solid-js:
        specifier: ^1.8.17
        version: 1.8.17
      tm-textarea:
        specifier: ^0.1.1
        version: 0.1.1(@babel/core@7.24.5)(@types/react@19.0.12)(solid-js@1.8.17)
      typescript:
        specifier: ^5.4.5
        version: 5.4.5
      vite:
        specifier: ^5.2.11
        version: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
      vite-plugin-css-classnames:
        specifier: ^0.0.2
        version: 0.0.2(@types/node@20.12.12)(postcss@8.4.38)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vite-plugin-dts:
        specifier: ^4.5.3
        version: 4.5.3(@types/node@20.12.12)(rollup@4.17.2)(typescript@5.4.5)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vite-plugin-dts-bundle-generator:
        specifier: ^2.1.0
        version: 2.1.0(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vite-plugin-lib-inject-css:
        specifier: ^2.2.1
        version: 2.2.1(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vite-plugin-solid:
        specifier: ^2.10.2
        version: 2.10.2(solid-js@1.8.17)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vite-tsconfig-paths:
        specifier: ^5.1.4
        version: 5.1.4(typescript@5.4.5)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
      vitest:
        specifier: ^1.6.0
        version: 1.6.0(@types/node@20.12.12)(jsdom@24.0.0)(lightningcss@1.29.3)

packages:

  '@ampproject/remapping@2.3.0':
    resolution: {integrity: sha512-30iZtAPgz+LTIYoeivqYo853f02jBYSd5uGnGpkFV0M3xOt9aN73erkgYAmZU43x4VfqcnLxW9Kpg3R5LC4YYw==}
    engines: {node: '>=6.0.0'}

  '@ast-grep/napi-darwin-arm64@0.32.3':
    resolution: {integrity: sha512-Ifh25Ra38+5TGvO48NVcJsRarBSqJ2ppN6J+Qc8Z19rKALYb61tsWj6oh0W1CTbsYQ/HJbIff//WkUDkY0wMMg==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [darwin]

  '@ast-grep/napi-darwin-x64@0.32.3':
    resolution: {integrity: sha512-jkuXgdvBTK7aTV7IojqMCUbHE4bzJzJ/adR0segW+BpU/uh/pxNuCZAal7E7KmWgSWVSS56UCOjS0OyibZKb7Q==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [darwin]

  '@ast-grep/napi-linux-arm64-gnu@0.32.3':
    resolution: {integrity: sha512-Kso32W1K/+guK1Jkk33MpvVHhulaGF7lf6HW9Bc4VxRHWyZBXuhwwPOtf7+89qa2nEb0YyUxgQTnMUXbCKyYAQ==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]

  '@ast-grep/napi-linux-arm64-musl@0.32.3':
    resolution: {integrity: sha512-7+u7F5rzaV0/N5WdP2q+kGl3v+l8iGFRx4p7NUcbNumYqGDS2mkfRkaesRDSd7BH94ZulGtJnpmu3imX7spolQ==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]

  '@ast-grep/napi-linux-x64-gnu@0.32.3':
    resolution: {integrity: sha512-XwUjw+W1QWDAPjx+Hsa8ZwONN3MDPINdRkRM6Q1vV3pl0p9YrMpwL72xrWQA1G7r7ej9BI1fLiXWB4YEOeYzJw==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]

  '@ast-grep/napi-linux-x64-musl@0.32.3':
    resolution: {integrity: sha512-894fQNqBDUfCP/qYbrPcK6+tMTEskc+vV2IKOKqgCfDryeptaiJJTJL9+Vbj38rO1LWhY8MIZ8W5ZyjxuhDRBA==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]

  '@ast-grep/napi-win32-arm64-msvc@0.32.3':
    resolution: {integrity: sha512-T8nrZm3E+h2VgHuQ3THQLvqhou4MkSbNcyIOgLZ0l2NatHIckeHuly5fmnkd6KQsGP/AqAEGxZBoOVYvoDl7DA==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [win32]

  '@ast-grep/napi-win32-ia32-msvc@0.32.3':
    resolution: {integrity: sha512-40RdPWWgVLCx6gRSXfVXt3TuV6dZQE8K74whq56+nliJqA4TA1QCrNtbX9keFvb1JDc/iOUKc4PKA3A7TGHANQ==}
    engines: {node: '>= 10'}
    cpu: [ia32]
    os: [win32]

  '@ast-grep/napi-win32-x64-msvc@0.32.3':
    resolution: {integrity: sha512-4VKmBFhT0M8s1LbAXemPDnHyAjEi5owkqkz85akvic9u6vRI0evRk8j2sHmgEBXwyySLUHf0NfI0XqwZ0mAl7g==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [win32]

  '@ast-grep/napi@0.32.3':
    resolution: {integrity: sha512-EdgX3gnDGkKMeofSYQlmPccjnxmGGQoEKL7pVQUmenLrsUBXXcjY//6J0LJApfIzNCknjQkfWpj1IbWDkl66Iw==}
    engines: {node: '>= 10'}

  '@babel/code-frame@7.24.2':
    resolution: {integrity: sha512-y5+tLQyV8pg3fsiln67BVLD1P13Eg4lh5RW9mF0zUuvLrv9uIQ4MCL+CRT+FTsBlBjcIan6PGsLcBN0m3ClUyQ==}
    engines: {node: '>=6.9.0'}

  '@babel/compat-data@7.24.4':
    resolution: {integrity: sha512-vg8Gih2MLK+kOkHJp4gBEIkyaIi00jgWot2D9QOmmfLC8jINSOzmCLta6Bvz/JSBCqnegV0L80jhxkol5GWNfQ==}
    engines: {node: '>=6.9.0'}

  '@babel/core@7.24.5':
    resolution: {integrity: sha512-tVQRucExLQ02Boi4vdPp49svNGcfL2GhdTCT9aldhXgCJVAI21EtRfBettiuLUwce/7r6bFdgs6JFkcdTiFttA==}
    engines: {node: '>=6.9.0'}

  '@babel/generator@7.24.5':
    resolution: {integrity: sha512-x32i4hEXvr+iI0NEoEfDKzlemF8AmtOP8CcrRaEcpzysWuoEb1KknpcvMsHKPONoKZiDuItklgWhB18xEhr9PA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-annotate-as-pure@7.22.5':
    resolution: {integrity: sha512-LvBTxu8bQSQkcyKOU+a1btnNFQ1dMAd0R6PyW3arXes06F6QLWLIrd681bxRPIXlrMGR3XYnW9JyML7dP3qgxg==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-compilation-targets@7.23.6':
    resolution: {integrity: sha512-9JB548GZoQVmzrFgp8o7KxdgkTGm6xs9DW0o/Pim72UDjzr5ObUQ6ZzYPqA+g9OTS2bBQoctLJrky0RDCAWRgQ==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-create-class-features-plugin@7.24.5':
    resolution: {integrity: sha512-uRc4Cv8UQWnE4NXlYTIIdM7wfFkOqlFztcC/gVXDKohKoVB3OyonfelUBaJzSwpBntZ2KYGF/9S7asCHsXwW6g==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0

  '@babel/helper-environment-visitor@7.22.20':
    resolution: {integrity: sha512-zfedSIzFhat/gFhWfHtgWvlec0nqB9YEIVrpuwjruLlXfUSnA8cJB0miHKwqDnQ7d32aKo2xt88/xZptwxbfhA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-function-name@7.23.0':
    resolution: {integrity: sha512-OErEqsrxjZTJciZ4Oo+eoZqeW9UIiOcuYKRJA4ZAgV9myA+pOXhhmpfNCKjEH/auVfEYVFJ6y1Tc4r0eIApqiw==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-hoist-variables@7.22.5':
    resolution: {integrity: sha512-wGjk9QZVzvknA6yKIUURb8zY3grXCcOZt+/7Wcy8O2uctxhplmUPkOdlgoNhmdVee2c92JXbf1xpMtVNbfoxRw==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-member-expression-to-functions@7.24.5':
    resolution: {integrity: sha512-4owRteeihKWKamtqg4JmWSsEZU445xpFRXPEwp44HbgbxdWlUV1b4Agg4lkA806Lil5XM/e+FJyS0vj5T6vmcA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-module-imports@7.18.6':
    resolution: {integrity: sha512-0NFvs3VkuSYbFi1x2Vd6tKrywq+z/cLeYC/RJNFrIX/30Bf5aiGYbtvGXolEktzJH8o5E5KJ3tT+nkxuuZFVlA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-module-imports@7.24.3':
    resolution: {integrity: sha512-viKb0F9f2s0BCS22QSF308z/+1YWKV/76mwt61NBzS5izMzDPwdq1pTrzf+Li3npBWX9KdQbkeCt1jSAM7lZqg==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-module-transforms@7.24.5':
    resolution: {integrity: sha512-9GxeY8c2d2mdQUP1Dye0ks3VDyIMS98kt/llQ2nUId8IsWqTF0l1LkSX0/uP7l7MCDrzXS009Hyhe2gzTiGW8A==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0

  '@babel/helper-optimise-call-expression@7.22.5':
    resolution: {integrity: sha512-HBwaojN0xFRx4yIvpwGqxiV2tUfl7401jlok564NgB9EHS1y6QT17FmKWm4ztqjeVdXLuC4fSvHc5ePpQjoTbw==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-plugin-utils@7.24.5':
    resolution: {integrity: sha512-xjNLDopRzW2o6ba0gKbkZq5YWEBaK3PCyTOY1K2P/O07LGMhMqlMXPxwN4S5/RhWuCobT8z0jrlKGlYmeR1OhQ==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-replace-supers@7.24.1':
    resolution: {integrity: sha512-QCR1UqC9BzG5vZl8BMicmZ28RuUBnHhAMddD8yHFHDRH9lLTZ9uUPehX8ctVPT8l0TKblJidqcgUUKGVrePleQ==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0

  '@babel/helper-simple-access@7.24.5':
    resolution: {integrity: sha512-uH3Hmf5q5n7n8mz7arjUlDOCbttY/DW4DYhE6FUsjKJ/oYC1kQQUvwEQWxRwUpX9qQKRXeqLwWxrqilMrf32sQ==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-skip-transparent-expression-wrappers@7.22.5':
    resolution: {integrity: sha512-tK14r66JZKiC43p8Ki33yLBVJKlQDFoA8GYN67lWCDCqoL6EMMSuM9b+Iff2jHaM/RRFYl7K+iiru7hbRqNx8Q==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-split-export-declaration@7.24.5':
    resolution: {integrity: sha512-5CHncttXohrHk8GWOFCcCl4oRD9fKosWlIRgWm4ql9VYioKm52Mk2xsmoohvm7f3JoiLSM5ZgJuRaf5QZZYd3Q==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-string-parser@7.24.1':
    resolution: {integrity: sha512-2ofRCjnnA9y+wk8b9IAREroeUP02KHp431N2mhKniy2yKIDKpbrHv9eXwm8cBeWQYcJmzv5qKCu65P47eCF7CQ==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-string-parser@7.25.9':
    resolution: {integrity: sha512-4A/SCr/2KLd5jrtOMFzaKjVtAei3+2r/NChoBNoZ3EyP/+GlhoaEGoWOZUmFmoITP7zOJyHIMm+DYRd8o3PvHA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-validator-identifier@7.24.5':
    resolution: {integrity: sha512-3q93SSKX2TWCG30M2G2kwaKeTYgEUp5Snjuj8qm729SObL6nbtUldAi37qbxkD5gg3xnBio+f9nqpSepGZMvxA==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-validator-identifier@7.25.9':
    resolution: {integrity: sha512-Ed61U6XJc3CVRfkERJWDz4dJwKe7iLmmJsbOGu9wSloNSFttHV0I8g6UAgb7qnK5ly5bGLPd4oXZlxCdANBOWQ==}
    engines: {node: '>=6.9.0'}

  '@babel/helper-validator-option@7.23.5':
    resolution: {integrity: sha512-85ttAOMLsr53VgXkTbkx8oA6YTfT4q7/HzXSLEYmjcSTJPMPQtvq1BD79Byep5xMUYbGRzEpDsjUf3dyp54IKw==}
    engines: {node: '>=6.9.0'}

  '@babel/helpers@7.24.5':
    resolution: {integrity: sha512-CiQmBMMpMQHwM5m01YnrM6imUG1ebgYJ+fAIW4FZe6m4qHTPaRHti+R8cggAwkdz4oXhtO4/K9JWlh+8hIfR2Q==}
    engines: {node: '>=6.9.0'}

  '@babel/highlight@7.24.5':
    resolution: {integrity: sha512-8lLmua6AVh/8SLJRRVD6V8p73Hir9w5mJrhE+IPpILG31KKlI9iz5zmBYKcWPS59qSfgP9RaSBQSHHE81WKuEw==}
    engines: {node: '>=6.9.0'}

  '@babel/parser@7.24.5':
    resolution: {integrity: sha512-EOv5IK8arwh3LI47dz1b0tKUb/1uhHAnHJOrjgtQMIpu1uXd9mlFrJg9IUgGUgZ41Ch0K8REPTYpO7B76b4vJg==}
    engines: {node: '>=6.0.0'}
    hasBin: true

  '@babel/parser@7.27.0':
    resolution: {integrity: sha512-iaepho73/2Pz7w2eMS0Q5f83+0RKI7i4xmiYeBmDzfRVbQtTOG7Ts0S4HzJVsTMGI9keU8rNfuZr8DKfSt7Yyg==}
    engines: {node: '>=6.0.0'}
    hasBin: true

  '@babel/plugin-syntax-jsx@7.24.1':
    resolution: {integrity: sha512-2eCtxZXf+kbkMIsXS4poTvT4Yu5rXiRa+9xGVT56raghjmBTKMpFNc9R4IDiB4emao9eO22Ox7CxuJG7BgExqA==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/plugin-syntax-typescript@7.24.1':
    resolution: {integrity: sha512-Yhnmvy5HZEnHUty6i++gcfH1/l68AHnItFHnaCv6hn9dNh0hQvvQJsxpi4BMBFN5DLeHBuucT/0DgzXif/OyRw==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/plugin-transform-modules-commonjs@7.24.1':
    resolution: {integrity: sha512-szog8fFTUxBfw0b98gEWPaEqF42ZUD/T3bkynW/wtgx2p/XCP55WEsb+VosKceRSd6njipdZvNogqdtI4Q0chw==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/plugin-transform-typescript@7.24.5':
    resolution: {integrity: sha512-E0VWu/hk83BIFUWnsKZ4D81KXjN5L3MobvevOHErASk9IPwKHOkTgvqzvNo1yP/ePJWqqK2SpUR5z+KQbl6NVw==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/preset-typescript@7.24.1':
    resolution: {integrity: sha512-1DBaMmRDpuYQBPWD8Pf/WEwCrtgRHxsZnP4mIy9G/X+hFfbI47Q2G4t1Paakld84+qsk2fSsUPMKg71jkoOOaQ==}
    engines: {node: '>=6.9.0'}
    peerDependencies:
      '@babel/core': ^7.0.0-0

  '@babel/runtime@7.24.5':
    resolution: {integrity: sha512-Nms86NXrsaeU9vbBJKni6gXiEXZ4CVpYVzEjDH9Sb8vmZ3UljyA1GSOJl/6LGPO8EHLuSF9H+IxNXHPX8QHJ4g==}
    engines: {node: '>=6.9.0'}

  '@babel/template@7.24.0':
    resolution: {integrity: sha512-Bkf2q8lMB0AFpX0NFEqSbx1OkTHf0f+0j82mkw+ZpzBnkk7e9Ql0891vlfgi+kHwOk8tQjiQHpqh4LaSa0fKEA==}
    engines: {node: '>=6.9.0'}

  '@babel/traverse@7.24.5':
    resolution: {integrity: sha512-7aaBLeDQ4zYcUFDUD41lJc1fG8+5IU9DaNSJAgal866FGvmD5EbWQgnEC6kO1gGLsX0esNkfnJSndbTXA3r7UA==}
    engines: {node: '>=6.9.0'}

  '@babel/types@7.24.5':
    resolution: {integrity: sha512-6mQNsaLeXTw0nxYUYu+NSa4Hx4BlF1x1x8/PMFbiR+GBSr+2DkECc69b8hgy2frEodNcvPffeH8YfWd3LI6jhQ==}
    engines: {node: '>=6.9.0'}

  '@babel/types@7.27.0':
    resolution: {integrity: sha512-H45s8fVLYjbhFH62dIJ3WtmJ6RSPt/3DRO0ZcT2SUiYiQyz3BLVb9ADEnLl91m74aQPS3AzzeajZHYOalWe3bg==}
    engines: {node: '>=6.9.0'}

  '@bigmistqke/solid-grid-split@0.0.2':
    resolution: {integrity: sha512-SbAZrBMc+hcQsHvGT/xzIVQH5vBsA4dLzOQVgKJ+1aQOd2NtbAu1jIEaR6EpxIJwyLZ1ZJ2VQtdZw7VdRyFB2g==}
    engines: {node: '>=18', pnpm: '>=9.0.0'}
    peerDependencies:
      solid-js: ^1.6.0

  '@bigmistqke/vite-plugin-raw-directory@0.0.2':
    resolution: {integrity: sha512-sFRVTlTaHbEHxjezOQx/ckF6kjkpOWz3BBoz+HeEFKnuGTesCYTzb6XC+TdqEAZanbyYmqvuULSITardC2n5MA==}

  '@esbuild/aix-ppc64@0.20.2':
    resolution: {integrity: sha512-D+EBOJHXdNZcLJRBkhENNG8Wji2kgc9AZ9KiPr1JuZjsNtyHzrsfLRrY0tk2H2aoFu6RANO1y1iPPUCDYWkb5g==}
    engines: {node: '>=12'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/aix-ppc64@0.21.3':
    resolution: {integrity: sha512-yTgnwQpFVYfvvo4SvRFB0SwrW8YjOxEoT7wfMT7Ol5v7v5LDNvSGo67aExmxOb87nQNeWPVvaGBNfQ7BXcrZ9w==}
    engines: {node: '>=12'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/android-arm64@0.20.2':
    resolution: {integrity: sha512-mRzjLacRtl/tWU0SvD8lUEwb61yP9cqQo6noDZP/O8VkwafSYwZ4yWy24kan8jE/IMERpYncRt2dw438LP3Xmg==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm64@0.21.3':
    resolution: {integrity: sha512-c+ty9necz3zB1Y+d/N+mC6KVVkGUUOcm4ZmT5i/Fk5arOaY3i6CA3P5wo/7+XzV8cb4GrI/Zjp8NuOQ9Lfsosw==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm@0.20.2':
    resolution: {integrity: sha512-t98Ra6pw2VaDhqNWO2Oph2LXbz/EJcnLmKLGBJwEwXX/JAN83Fym1rU8l0JUWK6HkIbWONCSSatf4sf2NBRx/w==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-arm@0.21.3':
    resolution: {integrity: sha512-bviJOLMgurLJtF1/mAoJLxDZDL6oU5/ztMHnJQRejbJrSc9FFu0QoUoFhvi6qSKJEw9y5oGyvr9fuDtzJ30rNQ==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-x64@0.20.2':
    resolution: {integrity: sha512-btzExgV+/lMGDDa194CcUQm53ncxzeBrWJcncOBxuC6ndBkKxnHdFJn86mCIgTELsooUmwUm9FkhSp5HYu00Rg==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [android]

  '@esbuild/android-x64@0.21.3':
    resolution: {integrity: sha512-JReHfYCRK3FVX4Ra+y5EBH1b9e16TV2OxrPAvzMsGeES0X2Ndm9ImQRI4Ket757vhc5XBOuGperw63upesclRw==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [android]

  '@esbuild/darwin-arm64@0.20.2':
    resolution: {integrity: sha512-4J6IRT+10J3aJH3l1yzEg9y3wkTDgDk7TSDFX+wKFiWjqWp/iCfLIYzGyasx9l0SAFPT1HwSCR+0w/h1ES/MjA==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-arm64@0.21.3':
    resolution: {integrity: sha512-U3fuQ0xNiAkXOmQ6w5dKpEvXQRSpHOnbw7gEfHCRXPeTKW9sBzVck6C5Yneb8LfJm0l6le4NQfkNPnWMSlTFUQ==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-x64@0.20.2':
    resolution: {integrity: sha512-tBcXp9KNphnNH0dfhv8KYkZhjc+H3XBkF5DKtswJblV7KlT9EI2+jeA8DgBjp908WEuYll6pF+UStUCfEpdysA==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/darwin-x64@0.21.3':
    resolution: {integrity: sha512-3m1CEB7F07s19wmaMNI2KANLcnaqryJxO1fXHUV5j1rWn+wMxdUYoPyO2TnAbfRZdi7ADRwJClmOwgT13qlP3Q==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/freebsd-arm64@0.20.2':
    resolution: {integrity: sha512-d3qI41G4SuLiCGCFGUrKsSeTXyWG6yem1KcGZVS+3FYlYhtNoNgYrWcvkOoaqMhwXSMrZRl69ArHsGJ9mYdbbw==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-arm64@0.21.3':
    resolution: {integrity: sha512-fsNAAl5pU6wmKHq91cHWQT0Fz0vtyE1JauMzKotrwqIKAswwP5cpHUCxZNSTuA/JlqtScq20/5KZ+TxQdovU/g==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.20.2':
    resolution: {integrity: sha512-d+DipyvHRuqEeM5zDivKV1KuXn9WeRX6vqSqIDgwIfPQtwMP4jaDsQsDncjTDDsExT4lR/91OLjRo8bmC1e+Cw==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.21.3':
    resolution: {integrity: sha512-tci+UJ4zP5EGF4rp8XlZIdq1q1a/1h9XuronfxTMCNBslpCtmk97Q/5qqy1Mu4zIc0yswN/yP/BLX+NTUC1bXA==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/linux-arm64@0.20.2':
    resolution: {integrity: sha512-9pb6rBjGvTFNira2FLIWqDk/uaf42sSyLE8j1rnUpuzsODBq7FvpwHYZxQ/It/8b+QOS1RYfqgGFNLRI+qlq2A==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm64@0.21.3':
    resolution: {integrity: sha512-vvG6R5g5ieB4eCJBQevyDMb31LMHthLpXTc2IGkFnPWS/GzIFDnaYFp558O+XybTmYrVjxnryru7QRleJvmZ6Q==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm@0.20.2':
    resolution: {integrity: sha512-VhLPeR8HTMPccbuWWcEUD1Az68TqaTYyj6nfE4QByZIQEQVWBB8vup8PpR7y1QHL3CpcF6xd5WVBU/+SBEvGTg==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-arm@0.21.3':
    resolution: {integrity: sha512-f6kz2QpSuyHHg01cDawj0vkyMwuIvN62UAguQfnNVzbge2uWLhA7TCXOn83DT0ZvyJmBI943MItgTovUob36SQ==}
    engines: {node: '>=12'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-ia32@0.20.2':
    resolution: {integrity: sha512-o10utieEkNPFDZFQm9CoP7Tvb33UutoJqg3qKf1PWVeeJhJw0Q347PxMvBgVVFgouYLGIhFYG0UGdBumROyiig==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-ia32@0.21.3':
    resolution: {integrity: sha512-HjCWhH7K96Na+66TacDLJmOI9R8iDWDDiqe17C7znGvvE4sW1ECt9ly0AJ3dJH62jHyVqW9xpxZEU1jKdt+29A==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-loong64@0.20.2':
    resolution: {integrity: sha512-PR7sp6R/UC4CFVomVINKJ80pMFlfDfMQMYynX7t1tNTeivQ6XdX5r2XovMmha/VjR1YN/HgHWsVcTRIMkymrgQ==}
    engines: {node: '>=12'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-loong64@0.21.3':
    resolution: {integrity: sha512-BGpimEccmHBZRcAhdlRIxMp7x9PyJxUtj7apL2IuoG9VxvU/l/v1z015nFs7Si7tXUwEsvjc1rOJdZCn4QTU+Q==}
    engines: {node: '>=12'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-mips64el@0.20.2':
    resolution: {integrity: sha512-4BlTqeutE/KnOiTG5Y6Sb/Hw6hsBOZapOVF6njAESHInhlQAghVVZL1ZpIctBOoTFbQyGW+LsVYZ8lSSB3wkjA==}
    engines: {node: '>=12'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-mips64el@0.21.3':
    resolution: {integrity: sha512-5rMOWkp7FQGtAH3QJddP4w3s47iT20hwftqdm7b+loe95o8JU8ro3qZbhgMRy0VuFU0DizymF1pBKkn3YHWtsw==}
    engines: {node: '>=12'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-ppc64@0.20.2':
    resolution: {integrity: sha512-rD3KsaDprDcfajSKdn25ooz5J5/fWBylaaXkuotBDGnMnDP1Uv5DLAN/45qfnf3JDYyJv/ytGHQaziHUdyzaAg==}
    engines: {node: '>=12'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-ppc64@0.21.3':
    resolution: {integrity: sha512-h0zj1ldel89V5sjPLo5H1SyMzp4VrgN1tPkN29TmjvO1/r0MuMRwJxL8QY05SmfsZRs6TF0c/IDH3u7XYYmbAg==}
    engines: {node: '>=12'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-riscv64@0.20.2':
    resolution: {integrity: sha512-snwmBKacKmwTMmhLlz/3aH1Q9T8v45bKYGE3j26TsaOVtjIag4wLfWSiZykXzXuE1kbCE+zJRmwp+ZbIHinnVg==}
    engines: {node: '>=12'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-riscv64@0.21.3':
    resolution: {integrity: sha512-dkAKcTsTJ+CRX6bnO17qDJbLoW37npd5gSNtSzjYQr0svghLJYGYB0NF1SNcU1vDcjXLYS5pO4qOW4YbFama4A==}
    engines: {node: '>=12'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-s390x@0.20.2':
    resolution: {integrity: sha512-wcWISOobRWNm3cezm5HOZcYz1sKoHLd8VL1dl309DiixxVFoFe/o8HnwuIwn6sXre88Nwj+VwZUvJf4AFxkyrQ==}
    engines: {node: '>=12'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-s390x@0.21.3':
    resolution: {integrity: sha512-vnD1YUkovEdnZWEuMmy2X2JmzsHQqPpZElXx6dxENcIwTu+Cu5ERax6+Ke1QsE814Zf3c6rxCfwQdCTQ7tPuXA==}
    engines: {node: '>=12'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-x64@0.20.2':
    resolution: {integrity: sha512-1MdwI6OOTsfQfek8sLwgyjOXAu+wKhLEoaOLTjbijk6E2WONYpH9ZU2mNtR+lZ2B4uwr+usqGuVfFT9tMtGvGw==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [linux]

  '@esbuild/linux-x64@0.21.3':
    resolution: {integrity: sha512-IOXOIm9WaK7plL2gMhsWJd+l2bfrhfilv0uPTptoRoSb2p09RghhQQp9YY6ZJhk/kqmeRt6siRdMSLLwzuT0KQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [linux]

  '@esbuild/netbsd-x64@0.20.2':
    resolution: {integrity: sha512-K8/DhBxcVQkzYc43yJXDSyjlFeHQJBiowJ0uVL6Tor3jGQfSGHNNJcWxNbOI8v5k82prYqzPuwkzHt3J1T1iZQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/netbsd-x64@0.21.3':
    resolution: {integrity: sha512-uTgCwsvQ5+vCQnqM//EfDSuomo2LhdWhFPS8VL8xKf+PKTCrcT/2kPPoWMTs22aB63MLdGMJiE3f1PHvCDmUOw==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/openbsd-x64@0.20.2':
    resolution: {integrity: sha512-eMpKlV0SThJmmJgiVyN9jTPJ2VBPquf6Kt/nAoo6DgHAoN57K15ZghiHaMvqjCye/uU4X5u3YSMgVBI1h3vKrQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/openbsd-x64@0.21.3':
    resolution: {integrity: sha512-vNAkR17Ub2MgEud2Wag/OE4HTSI6zlb291UYzHez/psiKarp0J8PKGDnAhMBcHFoOHMXHfExzmjMojJNbAStrQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/sunos-x64@0.20.2':
    resolution: {integrity: sha512-2UyFtRC6cXLyejf/YEld4Hajo7UHILetzE1vsRcGL3earZEW77JxrFjH4Ez2qaTiEfMgAXxfAZCm1fvM/G/o8w==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/sunos-x64@0.21.3':
    resolution: {integrity: sha512-W8H9jlGiSBomkgmouaRoTXo49j4w4Kfbl6I1bIdO/vT0+0u4f20ko3ELzV3hPI6XV6JNBVX+8BC+ajHkvffIJA==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/win32-arm64@0.20.2':
    resolution: {integrity: sha512-GRibxoawM9ZCnDxnP3usoUDO9vUkpAxIIZ6GQI+IlVmr5kP3zUq+l17xELTHMWTWzjxa2guPNyrpq1GWmPvcGQ==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-arm64@0.21.3':
    resolution: {integrity: sha512-EjEomwyLSCg8Ag3LDILIqYCZAq/y3diJ04PnqGRgq8/4O3VNlXyMd54j/saShaN4h5o5mivOjAzmU6C3X4v0xw==}
    engines: {node: '>=12'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-ia32@0.20.2':
    resolution: {integrity: sha512-HfLOfn9YWmkSKRQqovpnITazdtquEW8/SoHW7pWpuEeguaZI4QnCRW6b+oZTztdBnZOS2hqJ6im/D5cPzBTTlQ==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-ia32@0.21.3':
    resolution: {integrity: sha512-WGiE/GgbsEwR33++5rzjiYsKyHywE8QSZPF7Rfx9EBfK3Qn3xyR6IjyCr5Uk38Kg8fG4/2phN7sXp4NPWd3fcw==}
    engines: {node: '>=12'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-x64@0.20.2':
    resolution: {integrity: sha512-N49X4lJX27+l9jbLKSqZ6bKNjzQvHaT8IIFUy+YIqmXQdjYCToGWwOItDrfby14c78aDd5NHQl29xingXfCdLQ==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [win32]

  '@esbuild/win32-x64@0.21.3':
    resolution: {integrity: sha512-xRxC0jaJWDLYvcUvjQmHCJSfMrgmUuvsoXgDeU/wTorQ1ngDdUBuFtgY3W1Pc5sprGAvZBtWdJX7RPg/iZZUqA==}
    engines: {node: '>=12'}
    cpu: [x64]
    os: [win32]

  '@eslint-community/eslint-utils@4.4.0':
    resolution: {integrity: sha512-1/sA4dwrzBAyeUoQ6oxahHKmrZvsnLCg4RfxW3ZFGGmQkSNQPFNLV9CUEFQP1x9EYXHTo5p6xdhZM1Ne9p/AfA==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}
    peerDependencies:
      eslint: ^6.0.0 || ^7.0.0 || >=8.0.0

  '@eslint-community/regexpp@4.10.0':
    resolution: {integrity: sha512-Cu96Sd2By9mCNTx2iyKOmq10v22jUVQv0lQnlGNy16oE9589yE+QADPbrMGCkA51cKZSg3Pu/aTJVTGfL/qjUA==}
    engines: {node: ^12.0.0 || ^14.0.0 || >=16.0.0}

  '@eslint/eslintrc@2.1.4':
    resolution: {integrity: sha512-269Z39MS6wVJtsoUl10L60WdkhJVdPG24Q4eZTH3nnF6lpvSShEK3wQjDX9JRWAUPvPh7COouPpU9IrqaZFvtQ==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}

  '@eslint/js@8.57.0':
    resolution: {integrity: sha512-Ys+3g2TaW7gADOJzPt83SJtCDhMjndcDMFVQ/Tj9iA1BfJzFKD9mAUXT3OenpuPHbI6P/myECxRJrofUsDx/5g==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}

  '@humanwhocodes/config-array@0.11.14':
    resolution: {integrity: sha512-3T8LkOmg45BV5FICb15QQMsyUSWrQ8AygVfC7ZG32zOalnqrilm018ZVCw0eapXux8FtA33q8PSRSstjee3jSg==}
    engines: {node: '>=10.10.0'}

  '@humanwhocodes/module-importer@1.0.1':
    resolution: {integrity: sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==}
    engines: {node: '>=12.22'}

  '@humanwhocodes/object-schema@2.0.3':
    resolution: {integrity: sha512-93zYdMES/c1D69yZiKDBj0V24vqNzB/koF26KPaagAfd3P/4gUlh3Dys5ogAK+Exi9QyzlD8x/08Zt7wIKcDcA==}

  '@jest/schemas@29.6.3':
    resolution: {integrity: sha512-mo5j5X+jIZmJQveBKeS/clAueipV7KgiX1vMgCxam1RNYiqE1w62n0/tJJnHtjW8ZHcQco5gY85jA3mi0L+nSA==}
    engines: {node: ^14.15.0 || ^16.10.0 || >=18.0.0}

  '@jridgewell/gen-mapping@0.3.5':
    resolution: {integrity: sha512-IzL8ZoEDIBRWEzlCcRhOaCupYyN5gdIK+Q6fbFdPDg6HqX6jpkItn7DFIpW9LQzXG6Df9sA7+OKnq0qlz/GaQg==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/resolve-uri@3.1.2':
    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/set-array@1.2.1':
    resolution: {integrity: sha512-R8gLRTZeyp03ymzP/6Lil/28tGeGEzhx1q2k703KGWRAI1VdvPIXdG70VJc2pAMw3NA6JKL5hhFu1sJX0Mnn/A==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/sourcemap-codec@1.4.15':
    resolution: {integrity: sha512-eF2rxCRulEKXHTRiDrDy6erMYWqNw4LPdQ8UQA4huuxaQsVeRPFl2oM8oDGxMFhJUWZf9McpLtJasDDZb/Bpeg==}

  '@jridgewell/sourcemap-codec@1.5.0':
    resolution: {integrity: sha512-gv3ZRaISU3fjPAgNsriBRqGWQL6quFx04YMPW/zD8XMLsU32mhCCbfbO6KZFLjvYpCZ8zyDEgqsgf+PwPaM7GQ==}

  '@jridgewell/trace-mapping@0.3.25':
    resolution: {integrity: sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==}

  '@lume/element@0.13.1':
    resolution: {integrity: sha512-IiSgUeTXX1SjnzvxB+pnoERW5YaeGEtwbR7vyFAmBvI5PvccbTv4TR6mPweHKK/XiO/ZDT1whOS8HmSkRrxMCg==}
    peerDependencies:
      '@types/react': '*'

  '@microsoft/api-extractor-model@7.30.5':
    resolution: {integrity: sha512-0ic4rcbcDZHz833RaTZWTGu+NpNgrxVNjVaor0ZDUymfDFzjA/Uuk8hYziIUIOEOSTfmIQqyzVwlzxZxPe7tOA==}

  '@microsoft/api-extractor@7.52.2':
    resolution: {integrity: sha512-RX37V5uhBBPUvrrcmIxuQ8TPsohvr6zxo7SsLPOzBYcH9nbjbvtdXrts4cxHCXGOin9JR5ar37qfxtCOuEBTHA==}
    hasBin: true

  '@microsoft/tsdoc-config@0.17.1':
    resolution: {integrity: sha512-UtjIFe0C6oYgTnad4q1QP4qXwLhe6tIpNTRStJ2RZEPIkqQPREAwE5spzVxsdn9UaEMUqhh0AqSx3X4nWAKXWw==}

  '@microsoft/tsdoc@0.15.1':
    resolution: {integrity: sha512-4aErSrCR/On/e5G2hDP0wjooqDdauzEbIq8hIkIe5pXV0rtWJZvdCEKL0ykZxex+IxIwBp0eGeV48hQN07dXtw==}

  '@nodelib/fs.scandir@2.1.5':
    resolution: {integrity: sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==}
    engines: {node: '>= 8'}

  '@nodelib/fs.stat@2.0.5':
    resolution: {integrity: sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==}
    engines: {node: '>= 8'}

  '@nodelib/fs.walk@1.2.8':
    resolution: {integrity: sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==}
    engines: {node: '>= 8'}

  '@rollup/pluginutils@5.1.4':
    resolution: {integrity: sha512-USm05zrsFxYLPdWWq+K3STlWiT/3ELn3RcV5hJMghpeAIhxfsUIg6mt12CBJBInWMV4VneoV7SfGv8xIwo2qNQ==}
    engines: {node: '>=14.0.0'}
    peerDependencies:
      rollup: ^1.20.0||^2.0.0||^3.0.0||^4.0.0
    peerDependenciesMeta:
      rollup:
        optional: true

  '@rollup/rollup-android-arm-eabi@4.17.2':
    resolution: {integrity: sha512-NM0jFxY8bB8QLkoKxIQeObCaDlJKewVlIEkuyYKm5An1tdVZ966w2+MPQ2l8LBZLjR+SgyV+nRkTIunzOYBMLQ==}
    cpu: [arm]
    os: [android]

  '@rollup/rollup-android-arm64@4.17.2':
    resolution: {integrity: sha512-yeX/Usk7daNIVwkq2uGoq2BYJKZY1JfyLTaHO/jaiSwi/lsf8fTFoQW/n6IdAsx5tx+iotu2zCJwz8MxI6D/Bw==}
    cpu: [arm64]
    os: [android]

  '@rollup/rollup-darwin-arm64@4.17.2':
    resolution: {integrity: sha512-kcMLpE6uCwls023+kknm71ug7MZOrtXo+y5p/tsg6jltpDtgQY1Eq5sGfHcQfb+lfuKwhBmEURDga9N0ol4YPw==}
    cpu: [arm64]
    os: [darwin]

  '@rollup/rollup-darwin-x64@4.17.2':
    resolution: {integrity: sha512-AtKwD0VEx0zWkL0ZjixEkp5tbNLzX+FCqGG1SvOu993HnSz4qDI6S4kGzubrEJAljpVkhRSlg5bzpV//E6ysTQ==}
    cpu: [x64]
    os: [darwin]

  '@rollup/rollup-linux-arm-gnueabihf@4.17.2':
    resolution: {integrity: sha512-3reX2fUHqN7sffBNqmEyMQVj/CKhIHZd4y631duy0hZqI8Qoqf6lTtmAKvJFYa6bhU95B1D0WgzHkmTg33In0A==}
    cpu: [arm]
    os: [linux]

  '@rollup/rollup-linux-arm-musleabihf@4.17.2':
    resolution: {integrity: sha512-uSqpsp91mheRgw96xtyAGP9FW5ChctTFEoXP0r5FAzj/3ZRv3Uxjtc7taRQSaQM/q85KEKjKsZuiZM3GyUivRg==}
    cpu: [arm]
    os: [linux]

  '@rollup/rollup-linux-arm64-gnu@4.17.2':
    resolution: {integrity: sha512-EMMPHkiCRtE8Wdk3Qhtciq6BndLtstqZIroHiiGzB3C5LDJmIZcSzVtLRbwuXuUft1Cnv+9fxuDtDxz3k3EW2A==}
    cpu: [arm64]
    os: [linux]

  '@rollup/rollup-linux-arm64-musl@4.17.2':
    resolution: {integrity: sha512-NMPylUUZ1i0z/xJUIx6VUhISZDRT+uTWpBcjdv0/zkp7b/bQDF+NfnfdzuTiB1G6HTodgoFa93hp0O1xl+/UbA==}
    cpu: [arm64]
    os: [linux]

  '@rollup/rollup-linux-powerpc64le-gnu@4.17.2':
    resolution: {integrity: sha512-T19My13y8uYXPw/L/k0JYaX1fJKFT/PWdXiHr8mTbXWxjVF1t+8Xl31DgBBvEKclw+1b00Chg0hxE2O7bTG7GQ==}
    cpu: [ppc64]
    os: [linux]

  '@rollup/rollup-linux-riscv64-gnu@4.17.2':
    resolution: {integrity: sha512-BOaNfthf3X3fOWAB+IJ9kxTgPmMqPPH5f5k2DcCsRrBIbWnaJCgX2ll77dV1TdSy9SaXTR5iDXRL8n7AnoP5cg==}
    cpu: [riscv64]
    os: [linux]

  '@rollup/rollup-linux-s390x-gnu@4.17.2':
    resolution: {integrity: sha512-W0UP/x7bnn3xN2eYMql2T/+wpASLE5SjObXILTMPUBDB/Fg/FxC+gX4nvCfPBCbNhz51C+HcqQp2qQ4u25ok6g==}
    cpu: [s390x]
    os: [linux]

  '@rollup/rollup-linux-x64-gnu@4.17.2':
    resolution: {integrity: sha512-Hy7pLwByUOuyaFC6mAr7m+oMC+V7qyifzs/nW2OJfC8H4hbCzOX07Ov0VFk/zP3kBsELWNFi7rJtgbKYsav9QQ==}
    cpu: [x64]
    os: [linux]

  '@rollup/rollup-linux-x64-musl@4.17.2':
    resolution: {integrity: sha512-h1+yTWeYbRdAyJ/jMiVw0l6fOOm/0D1vNLui9iPuqgRGnXA0u21gAqOyB5iHjlM9MMfNOm9RHCQ7zLIzT0x11Q==}
    cpu: [x64]
    os: [linux]

  '@rollup/rollup-win32-arm64-msvc@4.17.2':
    resolution: {integrity: sha512-tmdtXMfKAjy5+IQsVtDiCfqbynAQE/TQRpWdVataHmhMb9DCoJxp9vLcCBjEQWMiUYxO1QprH/HbY9ragCEFLA==}
    cpu: [arm64]
    os: [win32]

  '@rollup/rollup-win32-ia32-msvc@4.17.2':
    resolution: {integrity: sha512-7II/QCSTAHuE5vdZaQEwJq2ZACkBpQDOmQsE6D6XUbnBHW8IAhm4eTufL6msLJorzrHDFv3CF8oCA/hSIRuZeQ==}
    cpu: [ia32]
    os: [win32]

  '@rollup/rollup-win32-x64-msvc@4.17.2':
    resolution: {integrity: sha512-TGGO7v7qOq4CYmSBVEYpI1Y5xDuCEnbVC5Vth8mOsW0gDSzxNrVERPc790IGHsrT2dQSimgMr9Ub3Y1Jci5/8w==}
    cpu: [x64]
    os: [win32]

  '@rushstack/node-core-library@5.13.0':
    resolution: {integrity: sha512-IGVhy+JgUacAdCGXKUrRhwHMTzqhWwZUI+qEPcdzsb80heOw0QPbhhoVsoiMF7Klp8eYsp7hzpScMXmOa3Uhfg==}
    peerDependencies:
      '@types/node': '*'
    peerDependenciesMeta:
      '@types/node':
        optional: true

  '@rushstack/rig-package@0.5.3':
    resolution: {integrity: sha512-olzSSjYrvCNxUFZowevC3uz8gvKr3WTpHQ7BkpjtRpA3wK+T0ybep/SRUMfr195gBzJm5gaXw0ZMgjIyHqJUow==}

  '@rushstack/terminal@0.15.2':
    resolution: {integrity: sha512-7Hmc0ysK5077R/IkLS9hYu0QuNafm+TbZbtYVzCMbeOdMjaRboLKrhryjwZSRJGJzu+TV1ON7qZHeqf58XfLpA==}
    peerDependencies:
      '@types/node': '*'
    peerDependenciesMeta:
      '@types/node':
        optional: true

  '@rushstack/ts-command-line@4.23.7':
    resolution: {integrity: sha512-Gr9cB7DGe6uz5vq2wdr89WbVDKz0UeuFEn5H2CfWDe7JvjFFaiV15gi6mqDBTbHhHCWS7w8mF1h3BnIfUndqdA==}

  '@sinclair/typebox@0.27.8':
    resolution: {integrity: sha512-+Fj43pSMwJs4KRrH/938Uf+uAELIgVBmQzg/q1YG10djyfA3TnrU8N8XzqCh/okZdszqBQTZf96idMfE5lnwTA==}

  '@solid-primitives/keyed@1.5.0':
    resolution: {integrity: sha512-g04CXywgWG/7L4sTxQP6q1gdiirItVBq6ZO9YuLTqPFlkX3uD4IEjeL9cLHP6waahrnO8yL3OZl64pcKGYN5Qw==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/map@0.6.0':
    resolution: {integrity: sha512-h8uCJNxUTvzNK/aTW9vJCd/PQeBkUL8i7AyLPvTFqMgcMnJ1I5GzAi5JODzxpxQwffxoqJyQtOE1vBqFzDv0Vw==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/memo@1.4.1':
    resolution: {integrity: sha512-MzNCJNpXidQdLOZUsEkwpuq52uwT8zrFrBxEVMEr9N35yIIvGhjqwrI1M6xzPmJGzuVUe8anCk57q+N5gyRk0Q==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/range@0.2.0':
    resolution: {integrity: sha512-Dx6T4lI5voKA3D1vcswiPOqdQqnaXgLmoEmdXwUJzkpuD7ZfV+1LxMHBa3uTjb8vJE8v4o4fV3Dnwy44UMJzew==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/scheduled@1.5.0':
    resolution: {integrity: sha512-RVw24IRNh1FQ4DCMb3OahB70tXIwc5vH8nhR4nNPsXwUPQeuOkLsDI5BlxaPk0vyZgqw9lDpufgI3HnPwplgDw==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/trigger@1.2.0':
    resolution: {integrity: sha512-sW4/3cDXSjYQampn8CIFZ11BlxgNf2li8r2fXnb3b3YWE6RdZZCl8PhvpPF38Gzl0CnryrbTPJWM7OIkseCDgQ==}
    peerDependencies:
      solid-js: ^1.6.12

  '@solid-primitives/utils@6.3.0':
    resolution: {integrity: sha512-e7hTlJ1Ywh2+g/Qug+n4L1mpfxsikoIS4/sHE2EK9WatQt8UJqop/vE6bsLnXlU1xuhb/jo94Ah5Y27rd4wP7A==}
    peerDependencies:
      solid-js: ^1.6.12

  '@types/argparse@1.0.38':
    resolution: {integrity: sha512-ebDJ9b0e702Yr7pWgB0jzm+CX4Srzz8RcXtLJDJB+BSccqMa36uyH/zUsSYao5+BD1ytv3k3rPYCq4mAE1hsXA==}

  '@types/babel__core@7.20.5':
    resolution: {integrity: sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==}

  '@types/babel__generator@7.6.8':
    resolution: {integrity: sha512-ASsj+tpEDsEiFr1arWrlN6V3mdfjRMZt6LtK/Vp/kreFLnr5QH5+DhvD5nINYZXzwJvXeGq+05iUXcAzVrqWtw==}

  '@types/babel__template@7.4.4':
    resolution: {integrity: sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==}

  '@types/babel__traverse@7.20.5':
    resolution: {integrity: sha512-WXCyOcRtH37HAUkpXhUduaxdm82b4GSlyTqajXviN4EfiuPgNYR109xMCKvpl6zPIpua0DGlMEDCq+g8EdoheQ==}

  '@types/estree@1.0.5':
    resolution: {integrity: sha512-/kYRxGDLWzHOB7q+wtSUQlFrtcdUccpfy+X+9iMBpHK8QLLhx2wIPYuS5DYtR9Wa/YlZAbIovy7qVdB1Aq6Lyw==}

  '@types/node@20.12.12':
    resolution: {integrity: sha512-eWLDGF/FOSPtAvEqeRAQ4C8LSA7M1I7i0ky1I8U7kD1J5ITyW3AsRhQrKVoWf5pFKZ2kILsEGJhsI9r93PYnOw==}

  '@types/react@19.0.12':
    resolution: {integrity: sha512-V6Ar115dBDrjbtXSrS+/Oruobc+qVbbUxDFC1RSbRqLt5SYvxxyIDrSC85RWml54g+jfNeEMZhEj7wW07ONQhA==}

  '@typescript-eslint/eslint-plugin@7.9.0':
    resolution: {integrity: sha512-6e+X0X3sFe/G/54aC3jt0txuMTURqLyekmEHViqyA2VnxhLMpvA6nqmcjIy+Cr9tLDHPssA74BP5Mx9HQIxBEA==}
    engines: {node: ^18.18.0 || >=20.0.0}
    peerDependencies:
      '@typescript-eslint/parser': ^7.0.0
      eslint: ^8.56.0
      typescript: '*'
    peerDependenciesMeta:
      typescript:
        optional: true

  '@typescript-eslint/parser@7.9.0':
    resolution: {integrity: sha512-qHMJfkL5qvgQB2aLvhUSXxbK7OLnDkwPzFalg458pxQgfxKDfT1ZDbHQM/I6mDIf/svlMkj21kzKuQ2ixJlatQ==}
    engines: {node: ^18.18.0 || >=20.0.0}
    peerDependencies:
      eslint: ^8.56.0
      typescript: '*'
    peerDependenciesMeta:
      typescript:
        optional: true

  '@typescript-eslint/scope-manager@7.9.0':
    resolution: {integrity: sha512-ZwPK4DeCDxr3GJltRz5iZejPFAAr4Wk3+2WIBaj1L5PYK5RgxExu/Y68FFVclN0y6GGwH8q+KgKRCvaTmFBbgQ==}
    engines: {node: ^18.18.0 || >=20.0.0}

  '@typescript-eslint/type-utils@7.9.0':
    resolution: {integrity: sha512-6Qy8dfut0PFrFRAZsGzuLoM4hre4gjzWJB6sUvdunCYZsYemTkzZNwF1rnGea326PHPT3zn5Lmg32M/xfJfByA==}
    engines: {node: ^18.18.0 || >=20.0.0}
    peerDependencies:
      eslint: ^8.56.0
      typescript: '*'
    peerDependenciesMeta:
      typescript:
        optional: true

  '@typescript-eslint/types@7.9.0':
    resolution: {integrity: sha512-oZQD9HEWQanl9UfsbGVcZ2cGaR0YT5476xfWE0oE5kQa2sNK2frxOlkeacLOTh9po4AlUT5rtkGyYM5kew0z5w==}
    engines: {node: ^18.18.0 || >=20.0.0}

  '@typescript-eslint/typescript-estree@7.9.0':
    resolution: {integrity: sha512-zBCMCkrb2YjpKV3LA0ZJubtKCDxLttxfdGmwZvTqqWevUPN0FZvSI26FalGFFUZU/9YQK/A4xcQF9o/VVaCKAg==}
    engines: {node: ^18.18.0 || >=20.0.0}
    peerDependencies:
      typescript: '*'
    peerDependenciesMeta:
      typescript:
        optional: true

  '@typescript-eslint/utils@7.9.0':
    resolution: {integrity: sha512-5KVRQCzZajmT4Ep+NEgjXCvjuypVvYHUW7RHlXzNPuak2oWpVoD1jf5xCP0dPAuNIchjC7uQyvbdaSTFaLqSdA==}
    engines: {node: ^18.18.0 || >=20.0.0}
    peerDependencies:
      eslint: ^8.56.0

  '@typescript-eslint/visitor-keys@7.9.0':
    resolution: {integrity: sha512-iESPx2TNLDNGQLyjKhUvIKprlP49XNEK+MvIf9nIO7ZZaZdbnfWKHnXAgufpxqfA0YryH8XToi4+CjBgVnFTSQ==}
    engines: {node: ^18.18.0 || >=20.0.0}

  '@ungap/structured-clone@1.2.0':
    resolution: {integrity: sha512-zuVdFrMJiuCDQUMCzQaD6KL28MjnqqN8XnAqiEq9PNm/hCPTSGfrXCOfwj1ow4LFb/tNymJPwsNbVePc1xFqrQ==}

  '@vitest/expect@1.6.0':
    resolution: {integrity: sha512-ixEvFVQjycy/oNgHjqsL6AZCDduC+tflRluaHIzKIsdbzkLn2U/iBnVeJwB6HsIjQBdfMR8Z0tRxKUsvFJEeWQ==}

  '@vitest/runner@1.6.0':
    resolution: {integrity: sha512-P4xgwPjwesuBiHisAVz/LSSZtDjOTPYZVmNAnpHHSR6ONrf8eCJOFRvUwdHn30F5M1fxhqtl7QZQUk2dprIXAg==}

  '@vitest/snapshot@1.6.0':
    resolution: {integrity: sha512-+Hx43f8Chus+DCmygqqfetcAZrDJwvTj0ymqjQq4CvmpKFSTVteEOBzCusu1x2tt4OJcvBflyHUE0DZSLgEMtQ==}

  '@vitest/spy@1.6.0':
    resolution: {integrity: sha512-leUTap6B/cqi/bQkXUu6bQV5TZPx7pmMBKBQiI0rJA8c3pB56ZsaTbREnF7CJfmvAS4V2cXIBAh/3rVwrrCYgw==}

  '@vitest/utils@1.6.0':
    resolution: {integrity: sha512-21cPiuGMoMZwiOHa2i4LXkMkMkCGzA+MVFV70jRwHo95dL4x/ts5GZhML1QWuy7yfp3WzK3lRvZi3JnXTYqrBw==}

  '@volar/language-core@2.4.12':
    resolution: {integrity: sha512-RLrFdXEaQBWfSnYGVxvR2WrO6Bub0unkdHYIdC31HzIEqATIuuhRRzYu76iGPZ6OtA4Au1SnW0ZwIqPP217YhA==}

  '@volar/source-map@2.4.12':
    resolution: {integrity: sha512-bUFIKvn2U0AWojOaqf63ER0N/iHIBYZPpNGogfLPQ68F5Eet6FnLlyho7BS0y2HJ1jFhSif7AcuTx1TqsCzRzw==}

  '@volar/typescript@2.4.12':
    resolution: {integrity: sha512-HJB73OTJDgPc80K30wxi3if4fSsZZAOScbj2fcicMuOPoOkcf9NNAINb33o+DzhBdF9xTKC1gnPmIRDous5S0g==}

  '@vue/compiler-core@3.5.13':
    resolution: {integrity: sha512-oOdAkwqUfW1WqpwSYJce06wvt6HljgY3fGeM9NcVA1HaYOij3mZG9Rkysn0OHuyUAGMbEbARIpsG+LPVlBJ5/Q==}

  '@vue/compiler-dom@3.5.13':
    resolution: {integrity: sha512-ZOJ46sMOKUjO3e94wPdCzQ6P1Lx/vhp2RSvfaab88Ajexs0AHeV0uasYhi99WPaogmBlRHNRuly8xV75cNTMDA==}

  '@vue/compiler-vue2@2.7.16':
    resolution: {integrity: sha512-qYC3Psj9S/mfu9uVi5WvNZIzq+xnXMhOwbTFKKDD7b1lhpnn71jXSFdTQ+WsIEk0ONCd7VV2IMm7ONl6tbQ86A==}

  '@vue/language-core@2.2.0':
    resolution: {integrity: sha512-O1ZZFaaBGkKbsRfnVH1ifOK1/1BUkyK+3SQsfnh6PmMmD4qJcTU8godCeA96jjDRTL6zgnK7YzCHfaUlH2r0Mw==}
    peerDependencies:
      typescript: '*'
    peerDependenciesMeta:
      typescript:
        optional: true

  '@vue/shared@3.5.13':
    resolution: {integrity: sha512-/hnE/qP5ZoGpol0a5mDi45bOd7t3tjYJBjsgCsivow7D48cJeV5l05RD82lPqi7gRiphZM37rnhW1l6ZoCNNnQ==}

  acorn-jsx@5.3.2:
    resolution: {integrity: sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==}
    peerDependencies:
      acorn: ^6.0.0 || ^7.0.0 || ^8.0.0

  acorn-walk@8.3.2:
    resolution: {integrity: sha512-cjkyv4OtNCIeqhHrfS81QWXoCBPExR/J62oyEqepVw8WaQeSqpW2uhuLPh1m9eWhDuOo/jUXVTlifvesOWp/4A==}
    engines: {node: '>=0.4.0'}

  acorn@8.11.3:
    resolution: {integrity: sha512-Y9rRfJG5jcKOE0CLisYbojUjIrIEE7AGMzA/Sm4BslANhbS+cDMpgBdcPT91oJ7OuJ9hYJBx59RjbhxVnrF8Xg==}
    engines: {node: '>=0.4.0'}
    hasBin: true

  acorn@8.14.1:
    resolution: {integrity: sha512-OvQ/2pUDKmgfCg++xsTX1wGxfTaszcHVcTctW4UJB4hibJx2HXxxO5UmVgyjMa+ZDsiaf5wWLXYpRWMmBI0QHg==}
    engines: {node: '>=0.4.0'}
    hasBin: true

  agent-base@7.1.1:
    resolution: {integrity: sha512-H0TSyFNDMomMNJQBn8wFV5YC/2eJ+VXECwOadZJT554xP6cODZHPX3H9QMQECxvrgiSOP1pHjy1sMWQVYJOUOA==}
    engines: {node: '>= 14'}

  ajv-draft-04@1.0.0:
    resolution: {integrity: sha512-mv00Te6nmYbRp5DCwclxtt7yV/joXJPGS7nM+97GdxvuttCOfgI3K4U25zboyeX0O+myI8ERluxQe5wljMmVIw==}
    peerDependencies:
      ajv: ^8.5.0
    peerDependenciesMeta:
      ajv:
        optional: true

  ajv-formats@3.0.1:
    resolution: {integrity: sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==}
    peerDependencies:
      ajv: ^8.0.0
    peerDependenciesMeta:
      ajv:
        optional: true

  ajv@6.12.6:
    resolution: {integrity: sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==}

  ajv@8.12.0:
    resolution: {integrity: sha512-sRu1kpcO9yLtYxBKvqfTeh9KzZEwO3STyX1HT+4CaDzC6HpTGYhIhPIzj9XuKU7KYDwnaeh5hcOwjy1QuJzBPA==}

  ajv@8.13.0:
    resolution: {integrity: sha512-PRA911Blj99jR5RMeTunVbNXMF6Lp4vZXnk5GQjcnUWUTsrXtekg/pnmFFI2u/I36Y/2bITGS30GZCXei6uNkA==}

  alien-signals@0.4.14:
    resolution: {integrity: sha512-itUAVzhczTmP2U5yX67xVpsbbOiquusbWVyA9N+sy6+r6YVbFkahXvNCeEPWEOMhwDYwbVbGHFkVL03N9I5g+Q==}

  ansi-regex@5.0.1:
    resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}
    engines: {node: '>=8'}

  ansi-styles@3.2.1:
    resolution: {integrity: sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==}
    engines: {node: '>=4'}

  ansi-styles@4.3.0:
    resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}
    engines: {node: '>=8'}

  ansi-styles@5.2.0:
    resolution: {integrity: sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==}
    engines: {node: '>=10'}

  argparse@1.0.10:
    resolution: {integrity: sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==}

  argparse@2.0.1:
    resolution: {integrity: sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==}

  array-union@2.1.0:
    resolution: {integrity: sha512-HGyxoOTYUyCM6stUe6EJgnd4EoewAI7zMdfqO+kGjnlZmBDz/cR5pf8r/cR4Wq60sL/p0IkcjUEEPwS3GFrIyw==}
    engines: {node: '>=8'}

  assertion-error@1.1.0:
    resolution: {integrity: sha512-jgsaNduz+ndvGyFt3uSuWqvy4lCnIJiovtouQN5JZHOKCS2QuhEdbcQHFhVksz2N2U9hXJo8odG7ETyWlEeuDw==}

  asynckit@0.4.0:
    resolution: {integrity: sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==}

  babel-plugin-jsx-dom-expressions@0.37.20:
    resolution: {integrity: sha512-0L3aC5EFyvCgIlEYIqJb4Ym29s1IDI/U5SntZ1ZK054xe0MqBmBi2GLK3f9AOklhdY7kCC3GsHD0bILh6u0Qsg==}
    peerDependencies:
      '@babel/core': ^7.20.12

  babel-preset-solid@1.8.17:
    resolution: {integrity: sha512-s/FfTZOeds0hYxYqce90Jb+0ycN2lrzC7VP1k1JIn3wBqcaexDKdYi6xjB+hMNkL+Q6HobKbwsriqPloasR9LA==}
    peerDependencies:
      '@babel/core': ^7.0.0

  balanced-match@1.0.2:
    resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}

  brace-expansion@1.1.11:
    resolution: {integrity: sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==}

  brace-expansion@2.0.1:
    resolution: {integrity: sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==}

  braces@3.0.2:
    resolution: {integrity: sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==}
    engines: {node: '>=8'}

  browserslist@4.23.0:
    resolution: {integrity: sha512-QW8HiM1shhT2GuzkvklfjcKDiWFXHOeFCIA/huJPwHsslwcydgk7X+z2zXpEijP98UCY7HbubZt5J2Zgvf0CaQ==}
    engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
    hasBin: true

  cac@6.7.14:
    resolution: {integrity: sha512-b6Ilus+c3RrdDk+JhLKUAQfzzgLEPy6wcXqS7f/xe1EETvsDP6GORG7SFuOs6cID5YkqchW/LXZbX5bc8j7ZcQ==}
    engines: {node: '>=8'}

  callsites@3.1.0:
    resolution: {integrity: sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==}
    engines: {node: '>=6'}

  caniuse-lite@1.0.30001620:
    resolution: {integrity: sha512-WJvYsOjd1/BYUY6SNGUosK9DUidBPDTnOARHp3fSmFO1ekdxaY6nKRttEVrfMmYi80ctS0kz1wiWmm14fVc3ew==}

  chai@4.4.1:
    resolution: {integrity: sha512-13sOfMv2+DWduEU+/xbun3LScLoqN17nBeTLUsmDfKdoiC1fr0n9PU4guu4AhRcOVFk/sW8LyZWHuhWtQZiF+g==}
    engines: {node: '>=4'}

  chalk@2.4.2:
    resolution: {integrity: sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==}
    engines: {node: '>=4'}

  chalk@4.1.2:
    resolution: {integrity: sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==}
    engines: {node: '>=10'}

  check-error@1.0.3:
    resolution: {integrity: sha512-iKEoDYaRmd1mxM90a2OEfWhjsjPpYPuQ+lMYsoxB126+t8fw7ySEO48nmDg5COTjxDI65/Y2OWpeEHk3ZOe8zg==}

  classy-solid@0.4.3:
    resolution: {integrity: sha512-mJ76piJ1+E5XAfMVk+29Y0rMs7UeXTjdANTX5oYpM9e23Zy+acYRBUfdg00kLTjp0Lm0mW/yh/HKmSyTvTPlFQ==}

  cliui@8.0.1:
    resolution: {integrity: sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==}
    engines: {node: '>=12'}

  clsx@2.1.1:
    resolution: {integrity: sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==}
    engines: {node: '>=6'}

  color-convert@1.9.3:
    resolution: {integrity: sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==}

  color-convert@2.0.1:
    resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}
    engines: {node: '>=7.0.0'}

  color-name@1.1.3:
    resolution: {integrity: sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==}

  color-name@1.1.4:
    resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}

  combined-stream@1.0.8:
    resolution: {integrity: sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==}
    engines: {node: '>= 0.8'}

  compare-versions@6.1.1:
    resolution: {integrity: sha512-4hm4VPpIecmlg59CHXnRDnqGplJFrbLG4aFEl5vl6cK1u76ws3LLvX7ikFnTDl5vo39sjWD6AaDPYodJp/NNHg==}

  concat-map@0.0.1:
    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}

  concurrently@8.2.2:
    resolution: {integrity: sha512-1dP4gpXFhei8IOtlXRE/T/4H88ElHgTiUzh71YUmtjTEHMSRS2Z/fgOxHSxxusGHogsRfxNq1vyAwxSC+EVyDg==}
    engines: {node: ^14.13.0 || >=16.0.0}
    hasBin: true

  confbox@0.1.7:
    resolution: {integrity: sha512-uJcB/FKZtBMCJpK8MQji6bJHgu1tixKPxRLeGkNzBoOZzpnZUJm0jm2/sBDWcuBx1dYgxV4JU+g5hmNxCyAmdA==}

  confbox@0.1.8:
    resolution: {integrity: sha512-RMtmw0iFkeR4YV+fUOSucriAQNb9g8zFR52MWCtl+cCZOFRNL6zeB395vPzFhEjjn4fMxXudmELnl/KF/WrK6w==}

  confbox@0.2.1:
    resolution: {integrity: sha512-hkT3yDPFbs95mNCy1+7qNKC6Pro+/ibzYxtM2iqEigpf0sVw+bg4Zh9/snjsBcf990vfIsg5+1U7VyiyBb3etg==}

  convert-source-map@2.0.0:
    resolution: {integrity: sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==}

  cross-spawn@7.0.3:
    resolution: {integrity: sha512-iRDPJKUPVEND7dHPO8rkbOnPpyDygcDFtWjpeWNCgy8WP2rXcxXL8TskReQl6OrB2G7+UJrags1q15Fudc7G6w==}
    engines: {node: '>= 8'}

  cssesc@3.0.0:
    resolution: {integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==}
    engines: {node: '>=4'}
    hasBin: true

  cssstyle@4.0.1:
    resolution: {integrity: sha512-8ZYiJ3A/3OkDd093CBT/0UKDWry7ak4BdPTFP2+QEP7cmhouyq/Up709ASSj2cK02BbZiMgk7kYjZNS4QP5qrQ==}
    engines: {node: '>=18'}

  csstype@3.1.3:
    resolution: {integrity: sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==}

  data-urls@5.0.0:
    resolution: {integrity: sha512-ZYP5VBHshaDAiVZxjbRVcFJpc+4xGgT0bK3vzy1HLN8jTO975HEbuYzZJcHoQEY5K1a0z8YayJkyVETa08eNTg==}
    engines: {node: '>=18'}

  date-fns@2.30.0:
    resolution: {integrity: sha512-fnULvOpxnC5/Vg3NCiWelDsLiUc9bRwAPs/+LfTLNvetFCtCTN+yQz15C/fs4AwX1R9K5GLtLfn8QW+dWisaAw==}
    engines: {node: '>=0.11'}

  de-indent@1.0.2:
    resolution: {integrity: sha512-e/1zu3xH5MQryN2zdVaF0OrdNLUbvWxzMbi+iNA6Bky7l1RoP8a2fIbRocyHclXt/arDrrR6lL3TqFD9pMQTsg==}

  debug@4.3.4:
    resolution: {integrity: sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  debug@4.4.0:
    resolution: {integrity: sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  decimal.js@10.4.3:
    resolution: {integrity: sha512-VBBaLc1MgL5XpzgIP7ny5Z6Nx3UrRkIViUkPUdtl9aya5amy3De1gsUUSB1g3+3sExYNjCAsAznmukyxCb1GRA==}

  deep-eql@4.1.3:
    resolution: {integrity: sha512-WaEtAOpRA1MQ0eohqZjpGD8zdI0Ovsm8mmFhaDN8dvDZzyoUMcYDnf5Y6iu7HTXxf8JDS23qWa4a+hKCDyOPzw==}
    engines: {node: '>=6'}

  deep-is@0.1.4:
    resolution: {integrity: sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==}

  delayed-stream@1.0.0:
    resolution: {integrity: sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==}
    engines: {node: '>=0.4.0'}

  detect-libc@2.0.3:
    resolution: {integrity: sha512-bwy0MGW55bG41VqxxypOsdSdGqLwXPI/focwgTYCFMbdUiBAxLg9CFzG08sz2aqzknwiX7Hkl0bQENjg8iLByw==}
    engines: {node: '>=8'}

  diff-sequences@29.6.3:
    resolution: {integrity: sha512-EjePK1srD3P08o2j4f0ExnylqRs5B9tJjcp9t1krH2qRi8CCdsYfwe9JgSLurFBWwq4uOlipzfk5fHNvwFKr8Q==}
    engines: {node: ^14.15.0 || ^16.10.0 || >=18.0.0}

  dir-glob@3.0.1:
    resolution: {integrity: sha512-WkrWp9GR4KXfKGYzOLmTuGVi1UWFfws377n9cc55/tb6DuqyF6pcQ5AbiHEshaDpY9v6oaSr2XCDidGmMwdzIA==}
    engines: {node: '>=8'}

  doctrine@3.0.0:
    resolution: {integrity: sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==}
    engines: {node: '>=6.0.0'}

  dts-bundle-generator@9.5.1:
    resolution: {integrity: sha512-DxpJOb2FNnEyOzMkG11sxO2dmxPjthoVWxfKqWYJ/bI/rT1rvTMktF5EKjAYrRZu6Z6t3NhOUZ0sZ5ZXevOfbA==}
    engines: {node: '>=14.0.0'}
    hasBin: true

  electron-to-chromium@1.4.773:
    resolution: {integrity: sha512-87eHF+h3PlCRwbxVEAw9KtK3v7lWfc/sUDr0W76955AdYTG4bV/k0zrl585Qnj/skRMH2qOSiE+kqMeOQ+LOpw==}

  emoji-regex@8.0.0:
    resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}

  entities@4.5.0:
    resolution: {integrity: sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==}
    engines: {node: '>=0.12'}

  esbuild-css-modules-plugin@3.1.4:
    resolution: {integrity: sha512-/WrLny7XhGQlPQt8KD4Z37p5DRAHvZr2sqoxBO2ue1jzpqsREpexkTDhlnBmOM2c590u6Mmwf9Ylkvs82FSu/A==}
    engines: {node: '>= 20'}
    peerDependencies:
      esbuild: '*'

  esbuild-plugin-solid@0.6.0:
    resolution: {integrity: sha512-V1FvDALwLDX6K0XNYM9CMRAnMzA0+Ecu55qBUT9q/eAJh1KIDsTMFoOzMSgyHqbOfvrVfO3Mws3z7TW2GVnIZA==}
    peerDependencies:
      esbuild: '>=0.20'
      solid-js: '>= 1.0'

  esbuild@0.20.2:
    resolution: {integrity: sha512-WdOOppmUNU+IbZ0PaDiTst80zjnrOkyJNHoKupIcVyU8Lvla3Ugx94VzkQ32Ijqd7UhHJy75gNWDMUekcrSJ6g==}
    engines: {node: '>=12'}
    hasBin: true

  esbuild@0.21.3:
    resolution: {integrity: sha512-Kgq0/ZsAPzKrbOjCQcjoSmPoWhlcVnGAUo7jvaLHoxW1Drto0KGkR1xBNg2Cp43b9ImvxmPEJZ9xkfcnqPsfBw==}
    engines: {node: '>=12'}
    hasBin: true

  escalade@3.1.2:
    resolution: {integrity: sha512-ErCHMCae19vR8vQGe50xIsVomy19rg6gFu3+r3jkEO46suLMWBksvVyoGgQV+jOfl84ZSOSlmv6Gxa89PmTGmA==}
    engines: {node: '>=6'}

  escape-string-regexp@1.0.5:
    resolution: {integrity: sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==}
    engines: {node: '>=0.8.0'}

  escape-string-regexp@4.0.0:
    resolution: {integrity: sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==}
    engines: {node: '>=10'}

  eslint-plugin-eslint-comments@3.2.0:
    resolution: {integrity: sha512-0jkOl0hfojIHHmEHgmNdqv4fmh7300NdpA9FFpF7zaoLvB/QeXOGNLIo86oAveJFrfB1p05kC8hpEMHM8DwWVQ==}
    engines: {node: '>=6.5.0'}
    peerDependencies:
      eslint: '>=4.19.1'

  eslint-plugin-no-only-tests@3.1.0:
    resolution: {integrity: sha512-Lf4YW/bL6Un1R6A76pRZyE1dl1vr31G/ev8UzIc/geCgFWyrKil8hVjYqWVKGB/UIGmb6Slzs9T0wNezdSVegw==}
    engines: {node: '>=5.0.0'}

  eslint-scope@7.2.2:
    resolution: {integrity: sha512-dOt21O7lTMhDM+X9mB4GX+DZrZtCUJPL/wlcTqxyrx5IvO0IYtILdtrQGQp+8n5S0gwSVmOf9NQrjMOgfQZlIg==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}

  eslint-visitor-keys@3.4.3:
    resolution: {integrity: sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}

  eslint@8.57.0:
    resolution: {integrity: sha512-dZ6+mexnaTIbSBZWgou51U6OmzIhYM2VcNdtiTtI7qPNZm35Akpr0f6vtw3w1Kmn5PYo+tZVfh13WrhpS6oLqQ==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}
    hasBin: true

  espree@9.6.1:
    resolution: {integrity: sha512-oruZaFkjorTpF32kDSI5/75ViwGeZginGGy2NoOSg3Q9bnwlnmDm4HLnkl0RE3n+njDXR037aY1+x58Z/zFdwQ==}
    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}

  esquery@1.5.0:
    resolution: {integrity: sha512-YQLXUplAwJgCydQ78IMJywZCceoqk1oH01OERdSAJc/7U2AylwjhSCLDEtqwg811idIS/9fIU5GjG73IgjKMVg==}
    engines: {node: '>=0.10'}

  esrecurse@4.3.0:
    resolution: {integrity: sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==}
    engines: {node: '>=4.0'}

  estraverse@5.3.0:
    resolution: {integrity: sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==}
    engines: {node: '>=4.0'}

  estree-walker@2.0.2:
    resolution: {integrity: sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==}

  estree-walker@3.0.3:
    resolution: {integrity: sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==}

  esutils@2.0.3:
    resolution: {integrity: sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==}
    engines: {node: '>=0.10.0'}

  execa@8.0.1:
    resolution: {integrity: sha512-VyhnebXciFV2DESc+p6B+y0LjSm0krU4OgJN44qFAhBY0TJ+1V61tYD2+wHusZ6F9n5K+vl8k0sTy7PEfV4qpg==}
    engines: {node: '>=16.17'}

  exsolve@1.0.4:
    resolution: {integrity: sha512-xsZH6PXaER4XoV+NiT7JHp1bJodJVT+cxeSH1G0f0tlT0lJqYuHUP3bUx2HtfTDvOagMINYp8rsqusxud3RXhw==}

  fast-deep-equal@3.1.3:
    resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}

  fast-glob@3.3.2:
    resolution: {integrity: sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==}
    engines: {node: '>=8.6.0'}

  fast-json-stable-stringify@2.1.0:
    resolution: {integrity: sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==}

  fast-levenshtein@2.0.6:
    resolution: {integrity: sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==}

  fastq@1.17.1:
    resolution: {integrity: sha512-sRVD3lWVIXWg6By68ZN7vho9a1pQcN/WBFaAAsDDFzlJjvoGx0P8z7V1t72grFJfJhu3YPZBuu25f7Kaw2jN1w==}

  file-entry-cache@6.0.1:
    resolution: {integrity: sha512-7Gps/XWymbLk2QLYK4NzpMOrYjMhdIxXuIvy2QBsLE6ljuodKvdkWs/cpyJJ3CVIVpH0Oi1Hvg1ovbMzLdFBBg==}
    engines: {node: ^10.12.0 || >=12.0.0}

  fill-range@7.0.1:
    resolution: {integrity: sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==}
    engines: {node: '>=8'}

  find-up@5.0.0:
    resolution: {integrity: sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==}
    engines: {node: '>=10'}

  flat-cache@3.2.0:
    resolution: {integrity: sha512-CYcENa+FtcUKLmhhqyctpclsq7QF38pKjZHsGNiSQF5r4FtoKDWabFDl3hzaEQMvT1LHEysw5twgLvpYYb4vbw==}
    engines: {node: ^10.12.0 || >=12.0.0}

  flatted@3.3.1:
    resolution: {integrity: sha512-X8cqMLLie7KsNUDSdzeN8FYK9rEt4Dt67OsG/DNGnYTSDBG4uFAJFBnUeiV+zCVAvwFy56IjM9sH51jVaEhNxw==}

  form-data@4.0.0:
    resolution: {integrity: sha512-ETEklSGi5t0QMZuiXoA/Q6vcnxcLQP5vdugSpuAyi6SVGi2clPPp+xgEhuMaHC+zGgn31Kd235W35f7Hykkaww==}
    engines: {node: '>= 6'}

  fs-extra@11.3.0:
    resolution: {integrity: sha512-Z4XaCL6dUDHfP/jT25jJKMmtxvuwbkrD1vNSMFlo9lNLY2c5FHYSQgHPRZUjAB26TpDEoW9HCOgplrdbaPV/ew==}
    engines: {node: '>=14.14'}

  fs.realpath@1.0.0:
    resolution: {integrity: sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==}

  fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  gensync@1.0.0-beta.2:
    resolution: {integrity: sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==}
    engines: {node: '>=6.9.0'}

  get-caller-file@2.0.5:
    resolution: {integrity: sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==}
    engines: {node: 6.* || 8.* || >= 10.*}

  get-func-name@2.0.2:
    resolution: {integrity: sha512-8vXOvuE167CtIc3OyItco7N/dpRtBbYOsPsXCz7X/PMnlGjYjSGuZJgM1Y7mmew7BKf9BqvLX2tnOVy1BBUsxQ==}

  get-stream@8.0.1:
    resolution: {integrity: sha512-VaUJspBffn/LMCJVoMvSAdmscJyS1auj5Zulnn5UoYcY531UWmdwhRWkcGKnGU93m5HSXP9LP2usOryrBtQowA==}
    engines: {node: '>=16'}

  glob-parent@5.1.2:
    resolution: {integrity: sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==}
    engines: {node: '>= 6'}

  glob-parent@6.0.2:
    resolution: {integrity: sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==}
    engines: {node: '>=10.13.0'}

  glob@7.2.3:
    resolution: {integrity: sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==}

  globals@11.12.0:
    resolution: {integrity: sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==}
    engines: {node: '>=4'}

  globals@13.24.0:
    resolution: {integrity: sha512-AhO5QUcj8llrbG09iWhPU2B204J1xnPeL8kQmVorSsy+Sjj1sk8gIyh6cUocGmH4L0UuhAJy+hJMRA4mgA4mFQ==}
    engines: {node: '>=8'}

  globby@11.1.0:
    resolution: {integrity: sha512-jhIXaOzy1sb8IyocaruWSn1TjmnBVs8Ayhcy83rmxNJ8q2uWKCAj3CnJY+KpGSXCueAPc0i05kVvVKtP1t9S3g==}
    engines: {node: '>=10'}

  globrex@0.1.2:
    resolution: {integrity: sha512-uHJgbwAMwNFf5mLst7IWLNg14x1CkeqglJb/K3doi4dw6q2IvAAmM/Y81kevy83wP+Sst+nutFTYOGg3d1lsxg==}

  graceful-fs@4.2.11:
    resolution: {integrity: sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==}

  graphemer@1.4.0:
    resolution: {integrity: sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==}

  has-flag@3.0.0:
    resolution: {integrity: sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==}
    engines: {node: '>=4'}

  has-flag@4.0.0:
    resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}
    engines: {node: '>=8'}

  hasown@2.0.2:
    resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}
    engines: {node: '>= 0.4'}

  he@1.2.0:
    resolution: {integrity: sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==}
    hasBin: true

  html-encoding-sniffer@4.0.0:
    resolution: {integrity: sha512-Y22oTqIU4uuPgEemfz7NDJz6OeKf12Lsu+QC+s3BVpda64lTiMYCyGwg5ki4vFxkMwQdeZDl2adZoqUgdFuTgQ==}
    engines: {node: '>=18'}

  html-entities@2.3.3:
    resolution: {integrity: sha512-DV5Ln36z34NNTDgnz0EWGBLZENelNAtkiFA4kyNOG2tDI6Mz1uSWiq1wAKdyjnJwyDiDO7Fa2SO1CTxPXL8VxA==}

  http-proxy-agent@7.0.2:
    resolution: {integrity: sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==}
    engines: {node: '>= 14'}

  https-proxy-agent@7.0.4:
    resolution: {integrity: sha512-wlwpilI7YdjSkWaQ/7omYBMTliDcmCN8OLihO6I9B86g06lMyAoqgoDpV0XqoaPOKj+0DIdAvnsWfyAAhmimcg==}
    engines: {node: '>= 14'}

  human-signals@5.0.0:
    resolution: {integrity: sha512-AXcZb6vzzrFAUE61HnN4mpLqd/cSIwNQjtNWR0euPm6y0iqx3G4gOXaIDdtdDwZmhwe82LA6+zinmW4UBWVePQ==}
    engines: {node: '>=16.17.0'}

  iconv-lite@0.6.3:
    resolution: {integrity: sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==}
    engines: {node: '>=0.10.0'}

  ignore@5.3.1:
    resolution: {integrity: sha512-5Fytz/IraMjqpwfd34ke28PTVMjZjJG2MPn5t7OE4eUCUNf8BAa7b5WUS9/Qvr6mwOQS7Mk6vdsMno5he+T8Xw==}
    engines: {node: '>= 4'}

  import-fresh@3.3.0:
    resolution: {integrity: sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==}
    engines: {node: '>=6'}

  import-lazy@4.0.0:
    resolution: {integrity: sha512-rKtvo6a868b5Hu3heneU+L4yEQ4jYKLtjpnPeUdK7h0yzXGmyBTypknlkCvHFBqfX9YlorEiMM6Dnq/5atfHkw==}
    engines: {node: '>=8'}

  imurmurhash@0.1.4:
    resolution: {integrity: sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==}
    engines: {node: '>=0.8.19'}

  inflight@1.0.6:
    resolution: {integrity: sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==}

  inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}

  is-core-module@2.16.1:
    resolution: {integrity: sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==}
    engines: {node: '>= 0.4'}

  is-extglob@2.1.1:
    resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}
    engines: {node: '>=0.10.0'}

  is-fullwidth-code-point@3.0.0:
    resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}
    engines: {node: '>=8'}

  is-glob@4.0.3:
    resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}
    engines: {node: '>=0.10.0'}

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
    engines: {node: '>=0.12.0'}

  is-path-inside@3.0.3:
    resolution: {integrity: sha512-Fd4gABb+ycGAmKou8eMftCupSir5lRxqf4aD/vd0cD2qc4HL07OjCeuHMr8Ro4CoMaeCKDB0/ECBOVWjTwUvPQ==}
    engines: {node: '>=8'}

  is-potential-custom-element-name@1.0.1:
    resolution: {integrity: sha512-bCYeRA2rVibKZd+s2625gGnGF/t7DSqDs4dP7CrLA1m7jKWz6pps0LpYLJN8Q64HtmPKJ1hrN3nzPNKFEKOUiQ==}

  is-stream@3.0.0:
    resolution: {integrity: sha512-LnQR4bZ9IADDRSkvpqMGvt/tEJWclzklNgSw48V5EAaAeDd6qGvN8ei6k5p0tvxSR171VmGyHuTiAOfxAbr8kA==}
    engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}

  is-what@4.1.16:
    resolution: {integrity: sha512-ZhMwEosbFJkA0YhFnNDgTM4ZxDRsS6HqTo7qsZM08fehyRYIYa0yHu5R6mgo1n/8MgaPBXiPimPD77baVFYg+A==}
    engines: {node: '>=12.13'}

  isexe@2.0.0:
    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}

  jju@1.4.0:
    resolution: {integrity: sha512-8wb9Yw966OSxApiCt0K3yNJL8pnNeIv+OEq2YMidz4FKP6nonSRoOXc80iXY4JaN2FC11B9qsNmDsm+ZOfMROA==}

  js-tokens@4.0.0:
    resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}

  js-tokens@9.0.0:
    resolution: {integrity: sha512-WriZw1luRMlmV3LGJaR6QOJjWwgLUTf89OwT2lUOyjX2dJGBwgmIkbcz+7WFZjrZM635JOIR517++e/67CP9dQ==}

  js-yaml@4.1.0:
    resolution: {integrity: sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==}
    hasBin: true

  jsdom@24.0.0:
    resolution: {integrity: sha512-UDS2NayCvmXSXVP6mpTj+73JnNQadZlr9N68189xib2tx5Mls7swlTNao26IoHv46BZJFvXygyRtyXd1feAk1A==}
    engines: {node: '>=18'}
    peerDependencies:
      canvas: ^2.11.2
    peerDependenciesMeta:
      canvas:
        optional: true

  jsesc@2.5.2:
    resolution: {integrity: sha512-OYu7XEzjkCQ3C5Ps3QIZsQfNpqoJyZZA99wd9aWd05NCtC5pWOkShK2mkL6HXQR6/Cy2lbNdPlZBpuQHXE63gA==}
    engines: {node: '>=4'}
    hasBin: true

  json-buffer@3.0.1:
    resolution: {integrity: sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==}

  json-schema-traverse@0.4.1:
    resolution: {integrity: sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==}

  json-schema-traverse@1.0.0:
    resolution: {integrity: sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==}

  json-stable-stringify-without-jsonify@1.0.1:
    resolution: {integrity: sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==}

  json5@2.2.3:
    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}
    engines: {node: '>=6'}
    hasBin: true

  jsonfile@6.1.0:
    resolution: {integrity: sha512-5dgndWOriYSm5cnYaJNhalLNDKOqFwyDB/rr1E9ZsGciGvKPs8R2xYGCacuf3z6K1YKDz182fd+fY3cn3pMqXQ==}

  keyv@4.5.4:
    resolution: {integrity: sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==}

  kolorist@1.8.0:
    resolution: {integrity: sha512-Y+60/zizpJ3HRH8DCss+q95yr6145JXZo46OTpFvDZWLfRCE4qChOyk1b26nMaNpfHHgxagk9dXT5OP0Tfe+dQ==}

  levn@0.4.1:
    resolution: {integrity: sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==}
    engines: {node: '>= 0.8.0'}

  lightningcss-darwin-arm64@1.29.3:
    resolution: {integrity: sha512-fb7raKO3pXtlNbQbiMeEu8RbBVHnpyqAoxTyTRMEWFQWmscGC2wZxoHzZ+YKAepUuKT9uIW5vL2QbFivTgprZg==}
    engines: {node: '>= 12.0.0'}
    cpu: [arm64]
    os: [darwin]

  lightningcss-darwin-x64@1.29.3:
    resolution: {integrity: sha512-KF2XZ4ZdmDGGtEYmx5wpzn6u8vg7AdBHaEOvDKu8GOs7xDL/vcU2vMKtTeNe1d4dogkDdi3B9zC77jkatWBwEQ==}
    engines: {node: '>= 12.0.0'}
    cpu: [x64]
    os: [darwin]

  lightningcss-freebsd-x64@1.29.3:
    resolution: {integrity: sha512-VUWeVf+V1UM54jv9M4wen9vMlIAyT69Krl9XjI8SsRxz4tdNV/7QEPlW6JASev/pYdiynUCW0pwaFquDRYdxMw==}
    engines: {node: '>= 12.0.0'}
    cpu: [x64]
    os: [freebsd]

  lightningcss-linux-arm-gnueabihf@1.29.3:
    resolution: {integrity: sha512-UhgZ/XVNfXQVEJrMIWeK1Laj8KbhjbIz7F4znUk7G4zeGw7TRoJxhb66uWrEsonn1+O45w//0i0Fu0wIovYdYg==}
    engines: {node: '>= 12.0.0'}
    cpu: [arm]
    os: [linux]

  lightningcss-linux-arm64-gnu@1.29.3:
    resolution: {integrity: sha512-Pqau7jtgJNmQ/esugfmAT1aCFy/Gxc92FOxI+3n+LbMHBheBnk41xHDhc0HeYlx9G0xP5tK4t0Koy3QGGNqypw==}
    engines: {node: '>= 12.0.0'}
    cpu: [arm64]
    os: [linux]

  lightningcss-linux-arm64-musl@1.29.3:
    resolution: {integrity: sha512-dxakOk66pf7KLS7VRYFO7B8WOJLecE5OPL2YOk52eriFd/yeyxt2Km5H0BjLfElokIaR+qWi33gB8MQLrdAY3A==}
    engines: {node: '>= 12.0.0'}
    cpu: [arm64]
    os: [linux]

  lightningcss-linux-x64-gnu@1.29.3:
    resolution: {integrity: sha512-ySZTNCpbfbK8rqpKJeJR2S0g/8UqqV3QnzcuWvpI60LWxnFN91nxpSSwCbzfOXkzKfar9j5eOuOplf+klKtINg==}
    engines: {node: '>= 12.0.0'}
    cpu: [x64]
    os: [linux]

  lightningcss-linux-x64-musl@1.29.3:
    resolution: {integrity: sha512-3pVZhIzW09nzi10usAXfIGTTSTYQ141dk88vGFNCgawIzayiIzZQxEcxVtIkdvlEq2YuFsL9Wcj/h61JHHzuFQ==}
    engines: {node: '>= 12.0.0'}
    cpu: [x64]
    os: [linux]

  lightningcss-win32-arm64-msvc@1.29.3:
    resolution: {integrity: sha512-VRnkAvtIkeWuoBJeGOTrZxsNp4HogXtcaaLm8agmbYtLDOhQdpgxW6NjZZjDXbvGF+eOehGulXZ3C1TiwHY4QQ==}
    engines: {node: '>= 12.0.0'}
    cpu: [arm64]
    os: [win32]

  lightningcss-win32-x64-msvc@1.29.3:
    resolution: {integrity: sha512-IszwRPu2cPnDQsZpd7/EAr0x2W7jkaWqQ1SwCVIZ/tSbZVXPLt6k8s6FkcyBjViCzvB5CW0We0QbbP7zp2aBjQ==}
    engines: {node: '>= 12.0.0'}
    cpu: [x64]
    os: [win32]

  lightningcss@1.29.3:
    resolution: {integrity: sha512-GlOJwTIP6TMIlrTFsxTerwC0W6OpQpCGuX1ECRLBUVRh6fpJH3xTqjCjRgQHTb4ZXexH9rtHou1Lf03GKzmhhQ==}
    engines: {node: '>= 12.0.0'}

  local-pkg@0.5.0:
    resolution: {integrity: sha512-ok6z3qlYyCDS4ZEU27HaU6x/xZa9Whf8jD4ptH5UZTQYZVYeb9bnZ3ojVhiJNLiXK1Hfc0GNbLXcmZ5plLDDBg==}
    engines: {node: '>=14'}

  local-pkg@1.1.1:
    resolution: {integrity: sha512-WunYko2W1NcdfAFpuLUoucsgULmgDBRkdxHxWQ7mK0cQqwPiy8E1enjuRBrhLtZkB5iScJ1XIPdhVEFK8aOLSg==}
    engines: {node: '>=14'}

  locate-path@6.0.0:
    resolution: {integrity: sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==}
    engines: {node: '>=10'}

  lodash-es@4.17.21:
    resolution: {integrity: sha512-mKnC+QJ9pWVzv+C4/U3rRsHapFfHvQFoFB92e52xeyGMcX6/OlIl78je1u8vePzYZSkkogMPJ2yjxxsb89cxyw==}

  lodash.merge@4.6.2:
    resolution: {integrity: sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==}

  lodash@4.17.21:
    resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}

  loupe@2.3.7:
    resolution: {integrity: sha512-zSMINGVYkdpYSOBmLi0D1Uo7JU9nVdQKrHxC8eYlV+9YKK9WePqAlL7lSlorG/U2Fw1w0hTBmaa/jrQ3UbPHtA==}

  lowclass@8.0.2:
    resolution: {integrity: sha512-F/SMc8Kn34lNfjhlMDZYiOqmdtROR8sndSl7I/HJooxBekpgFxBcZL7LFsugc/sSGg0PV+or74+M5Q1/F4dP9g==}

  lru-cache@5.1.1:
    resolution: {integrity: sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==}

  lru-cache@6.0.0:
    resolution: {integrity: sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==}
    engines: {node: '>=10'}

  magic-string@0.30.10:
    resolution: {integrity: sha512-iIRwTIf0QKV3UAnYK4PU8uiEc4SRh5jX0mwpIwETPpHdhVM4f53RSwS/vXvN1JhGX+Cs7B8qIq3d6AH49O5fAQ==}

  magic-string@0.30.17:
    resolution: {integrity: sha512-sNPKHvyjVf7gyjwS4xGTaW/mCnF8wnjtifKBEhxfZ7E/S8tQ0rssrwGNn6q8JH/ohItJfSQp9mBtQYuTlH5QnA==}

  merge-anything@5.1.7:
    resolution: {integrity: sha512-eRtbOb1N5iyH0tkQDAoQ4Ipsp/5qSR79Dzrz8hEPxRX10RWWR/iQXdoKmBSRCThY1Fh5EhISDtpSc93fpxUniQ==}
    engines: {node: '>=12.13'}

  merge-stream@2.0.0:
    resolution: {integrity: sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==}

  merge2@1.4.1:
    resolution: {integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==}
    engines: {node: '>= 8'}

  micromatch@4.0.5:
    resolution: {integrity: sha512-DMy+ERcEW2q8Z2Po+WNXuw3c5YaUSFjAO5GsJqfEl7UjvtIuFKO6ZrKvcItdy98dwFI2N1tg3zNIdKaQT+aNdA==}
    engines: {node: '>=8.6'}

  mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}

  mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}

  mimic-fn@4.0.0:
    resolution: {integrity: sha512-vqiC06CuhBTUdZH+RYl8sFrL096vA45Ok5ISO6sE/Mr1jRbGH4Csnhi8f3wKVl7x8mO4Au7Ir9D3Oyv1VYMFJw==}
    engines: {node: '>=12'}

  minimatch@3.0.8:
    resolution: {integrity: sha512-6FsRAQsxQ61mw+qP1ZzbL9Bc78x2p5OqNgNpnoAFLTrX8n5Kxph0CsnhmKKNXTWjXqU5L0pGPR7hYk+XWZr60Q==}

  minimatch@3.1.2:
    resolution: {integrity: sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==}

  minimatch@9.0.4:
    resolution: {integrity: sha512-KqWh+VchfxcMNRAJjj2tnsSJdNbHsVgnkBhTNrW7AjVo6OvLtxw8zfT9oLw1JSohlFzJ8jCoTgaoXvJ+kHt6fw==}
    engines: {node: '>=16 || 14 >=14.17'}

  mlly@1.7.0:
    resolution: {integrity: sha512-U9SDaXGEREBYQgfejV97coK0UL1r+qnF2SyO9A3qcI8MzKnsIFKHNVEkrDyNncQTKQQumsasmeq84eNMdBfsNQ==}

  mlly@1.7.4:
    resolution: {integrity: sha512-qmdSIPC4bDJXgZTCR7XosJiNKySV7O215tsPtDN9iEO/7q/76b/ijtgRu/+epFXSJhijtTCCGp3DWS549P3xKw==}

  ms@2.1.2:
    resolution: {integrity: sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  muggle-string@0.4.1:
    resolution: {integrity: sha512-VNTrAak/KhO2i8dqqnqnAHOa3cYBwXEZe9h+D5h/1ZqFSTEFHdM65lR7RoIqq3tBBYavsOXV84NoHXZ0AkPyqQ==}

  nanoid@3.3.7:
    resolution: {integrity: sha512-eSRppjcPIatRIMC1U6UngP8XFcz8MQWGQdt1MTBQ7NaAmvXDfvNxbvWV3x2y6CdEUciCSsDHDQZbhYaB8QEo2g==}
    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
    hasBin: true

  natural-compare@1.4.0:
    resolution: {integrity: sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==}

  node-releases@2.0.14:
    resolution: {integrity: sha512-y10wOWt8yZpqXmOgRo77WaHEmhYQYGNA6y421PKsKYWEK8aW+cqAphborZDhqfyKrbZEN92CN1X2KbafY2s7Yw==}

  npm-run-path@5.3.0:
    resolution: {integrity: sha512-ppwTtiJZq0O/ai0z7yfudtBpWIoxM8yE6nHi1X47eFR2EWORqfbu6CnPlNsjeN683eT0qG6H/Pyf9fCcvjnnnQ==}
    engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}

  nwsapi@2.2.10:
    resolution: {integrity: sha512-QK0sRs7MKv0tKe1+5uZIQk/C8XGza4DAnztJG8iD+TpJIORARrCxczA738awHrZoHeTjSSoHqao2teO0dC/gFQ==}

  once@1.4.0:
    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}

  onetime@6.0.0:
    resolution: {integrity: sha512-1FlR+gjXK7X+AsAHso35MnyN5KqGwJRi/31ft6x0M194ht7S+rWAvd7PHss9xSKMzE0asv1pyIHaJYq+BbacAQ==}
    engines: {node: '>=12'}

  optionator@0.9.4:
    resolution: {integrity: sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==}
    engines: {node: '>= 0.8.0'}

  p-limit@3.1.0:
    resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}
    engines: {node: '>=10'}

  p-limit@5.0.0:
    resolution: {integrity: sha512-/Eaoq+QyLSiXQ4lyYV23f14mZRQcXnxfHrN0vCai+ak9G0pp9iEQukIIZq5NccEvwRB8PUnZT0KsOoDCINS1qQ==}
    engines: {node: '>=18'}

  p-locate@5.0.0:
    resolution: {integrity: sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==}
    engines: {node: '>=10'}

  parent-module@1.0.1:
    resolution: {integrity: sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==}
    engines: {node: '>=6'}

  parse5@7.1.2:
    resolution: {integrity: sha512-Czj1WaSVpaoj0wbhMzLmWD69anp2WH7FXMB9n1Sy8/ZFF9jolSQVMu1Ij5WIyGmcBmhk7EOndpO4mIpihVqAXw==}

  path-browserify@1.0.1:
    resolution: {integrity: sha512-b7uo2UCUOYZcnF/3ID0lulOJi/bafxa1xPe7ZPsammBSpjSWQkjNxlt635YGS2MiR9GjvuXCtz2emr3jbsz98g==}

  path-exists@4.0.0:
    resolution: {integrity: sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==}
    engines: {node: '>=8'}

  path-is-absolute@1.0.1:
    resolution: {integrity: sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==}
    engines: {node: '>=0.10.0'}

  path-key@3.1.1:
    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
    engines: {node: '>=8'}

  path-key@4.0.0:
    resolution: {integrity: sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==}
    engines: {node: '>=12'}

  path-parse@1.0.7:
    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}

  path-type@4.0.0:
    resolution: {integrity: sha512-gDKb8aZMDeD/tZWs9P6+q0J9Mwkdl6xMV8TjnGP3qJVJ06bdMgkbBlLU8IdfOsIsFz2BW1rNVT3XuNEl8zPAvw==}
    engines: {node: '>=8'}

  pathe@1.1.2:
    resolution: {integrity: sha512-whLdWMYL2TwI08hn8/ZqAbrVemu0LNaNNJZX73O6qaIdCTfXutsLhMkjdENX0qhsQ9uIimo4/aQOmXkoon2nDQ==}

  pathe@2.0.3:
    resolution: {integrity: sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==}

  pathval@1.1.1:
    resolution: {integrity: sha512-Dp6zGqpTdETdR63lehJYPeIOqpiNBNtc7BpWSLrOje7UaIsE5aY92r/AunQA7rsXvet3lrJ3JnZX29UPTKXyKQ==}

  picocolors@1.0.1:
    resolution: {integrity: sha512-anP1Z8qwhkbmu7MFP5iTt+wQKXgwzf7zTyGlcdzabySa9vd0Xt392U0rVmz9poOaBj0uHJKyyo9/upk0HrEQew==}

  picocolors@1.1.1:
    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}

  picomatch@2.3.1:
    resolution: {integrity: sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==}
    engines: {node: '>=8.6'}

  picomatch@4.0.2:
    resolution: {integrity: sha512-M7BAV6Rlcy5u+m6oPhAPFgJTzAioX/6B0DxyvDlo9l8+T3nLKbrczg2WLUyzd45L8RqfUMyGPzekbMvX2Ldkwg==}
    engines: {node: '>=12'}

  pkg-types@1.1.1:
    resolution: {integrity: sha512-ko14TjmDuQJ14zsotODv7dBlwxKhUKQEhuhmbqo1uCi9BB0Z2alo/wAXg6q1dTR5TyuqYyWhjtfe/Tsh+X28jQ==}

  pkg-types@1.3.1:
    resolution: {integrity: sha512-/Jm5M4RvtBFVkKWRu2BLUTNP8/M2a+UwuAX+ae4770q1qVGtfjG+WTCupoZixokjmHiry8uI+dlY8KXYV5HVVQ==}

  pkg-types@2.1.0:
    resolution: {integrity: sha512-wmJwA+8ihJixSoHKxZJRBQG1oY8Yr9pGLzRmSsNms0iNWyHHAlZCa7mmKiFR10YPZuz/2k169JiS/inOjBCZ2A==}

  postcss-selector-parser@6.1.2:
    resolution: {integrity: sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==}
    engines: {node: '>=4'}

  postcss@8.4.38:
    resolution: {integrity: sha512-Wglpdk03BSfXkHoQa3b/oulrotAkwrlLDRSOb9D0bN86FdRyE9lppSp33aHNPgBa0JKCoB+drFLZkQoRRYae5A==}
    engines: {node: ^10 || ^12 || >=14}

  prelude-ls@1.2.1:
    resolution: {integrity: sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==}
    engines: {node: '>= 0.8.0'}

  prettier@3.0.0:
    resolution: {integrity: sha512-zBf5eHpwHOGPC47h0zrPyNn+eAEIdEzfywMoYn2XPi0P44Zp0tSq64rq0xAREh4auw2cJZHo9QUob+NqCQky4g==}
    engines: {node: '>=14'}
    hasBin: true

  pretty-format@29.7.0:
    resolution: {integrity: sha512-Pdlw/oPxN+aXdmM9R00JVC9WVFoCLTKJvDVLgmJ+qAffBMxsV85l/Lu7sNx4zSzPyoL2euImuEwHhOXdEgNFZQ==}
    engines: {node: ^14.15.0 || ^16.10.0 || >=18.0.0}

  psl@1.9.0:
    resolution: {integrity: sha512-E/ZsdU4HLs/68gYzgGTkMicWTLPdAftJLfJFlLUAAKZGkStNU72sZjT66SnMDVOfOWY/YAoiD7Jxa9iHvngcag==}

  punycode@2.3.1:
    resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}
    engines: {node: '>=6'}

  quansync@0.2.10:
    resolution: {integrity: sha512-t41VRkMYbkHyCYmOvx/6URnN80H7k4X0lLdBMGsz+maAwrJQYB1djpV6vHrQIBE0WBSGqhtEHrK9U3DWWH8v7A==}

  querystringify@2.2.0:
    resolution: {integrity: sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==}

  queue-microtask@1.2.3:
    resolution: {integrity: sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==}

  react-is@18.3.1:
    resolution: {integrity: sha512-/LLMVyas0ljjAtoYiPqYiL8VWXzUUdThrmU5+n20DZv+a+ClRoevUzw5JxU+Ieh5/c87ytoTBV9G1FiKfNJdmg==}

  regenerator-runtime@0.14.1:
    resolution: {integrity: sha512-dYnhHh0nJoMfnkZs6GmmhFknAGRrLznOu5nc9ML+EJxGvrx6H7teuevqVqCuPcPK//3eDrrjQhehXVx9cnkGdw==}

  require-directory@2.1.1:
    resolution: {integrity: sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==}
    engines: {node: '>=0.10.0'}

  require-from-string@2.0.2:
    resolution: {integrity: sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==}
    engines: {node: '>=0.10.0'}

  requires-port@1.0.0:
    resolution: {integrity: sha512-KigOCHcocU3XODJxsu8i/j8T9tzT4adHiecwORRQ0ZZFcp7ahwXuRU1m+yuO90C5ZUyGeGfocHDI14M3L3yDAQ==}

  resolve-from@4.0.0:
    resolution: {integrity: sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==}
    engines: {node: '>=4'}

  resolve@1.22.10:
    resolution: {integrity: sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==}
    engines: {node: '>= 0.4'}
    hasBin: true

  reusify@1.0.4:
    resolution: {integrity: sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==}
    engines: {iojs: '>=1.0.0', node: '>=0.10.0'}

  rimraf@3.0.2:
    resolution: {integrity: sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==}
    hasBin: true

  rollup@4.17.2:
    resolution: {integrity: sha512-/9ClTJPByC0U4zNLowV1tMBe8yMEAxewtR3cUNX5BoEpGH3dQEWpJLr6CLp0fPdYRF/fzVOgvDb1zXuakwF5kQ==}
    engines: {node: '>=18.0.0', npm: '>=8.0.0'}
    hasBin: true

  rrweb-cssom@0.6.0:
    resolution: {integrity: sha512-APM0Gt1KoXBz0iIkkdB/kfvGOwC4UuJFeG/c+yV7wSc7q96cG/kJ0HiYCnzivD9SB53cLV1MlHFNfOuPaadYSw==}

  run-parallel@1.2.0:
    resolution: {integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==}

  rxjs@7.8.1:
    resolution: {integrity: sha512-AA3TVj+0A2iuIoQkWEK/tqFjBq2j+6PO6Y0zJcvzLAFhEFIO3HL0vls9hWLncZbAAbK0mar7oZ4V079I/qPMxg==}

  safer-buffer@2.1.2:
    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}

  saxes@6.0.0:
    resolution: {integrity: sha512-xAg7SOnEhrm5zI3puOOKyy1OMcMlIJZYNJY7xLBwSze0UjhPLnWfj2GF2EpT0jmzaJKIWKHLsaSSajf35bcYnA==}
    engines: {node: '>=v12.22.7'}

  semver@6.3.1:
    resolution: {integrity: sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==}
    hasBin: true

  semver@7.5.4:
    resolution: {integrity: sha512-1bCSESV6Pv+i21Hvpxp3Dx+pSD8lIPt8uVjRrxAUt/nbswYc+tK6Y2btiULjd4+fnq15PX+nqQDC7Oft7WkwcA==}
    engines: {node: '>=10'}
    hasBin: true

  semver@7.6.2:
    resolution: {integrity: sha512-FNAIBWCx9qcRhoHcgcJ0gvU7SN1lYU2ZXuSfl04bSC5OpvDHFyJCjdNHomPXxjQlCBU67YW64PzY7/VIEH7F2w==}
    engines: {node: '>=10'}
    hasBin: true

  seroval-plugins@1.0.7:
    resolution: {integrity: sha512-GO7TkWvodGp6buMEX9p7tNyIkbwlyuAWbI6G9Ec5bhcm7mQdu3JOK1IXbEUwb3FVzSc363GraG/wLW23NSavIw==}
    engines: {node: '>=10'}
    peerDependencies:
      seroval: ^1.0

  seroval@1.0.7:
    resolution: {integrity: sha512-n6ZMQX5q0Vn19Zq7CIKNIo7E75gPkGCFUEqDpa8jgwpYr/vScjqnQ6H09t1uIiZ0ZSK0ypEGvrYK2bhBGWsGdw==}
    engines: {node: '>=10'}

  shebang-command@2.0.0:
    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
    engines: {node: '>=8'}

  shebang-regex@3.0.0:
    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
    engines: {node: '>=8'}

  shell-quote@1.8.1:
    resolution: {integrity: sha512-6j1W9l1iAs/4xYBI1SYOVZyFcCis9b4KCLQ8fgAGG07QvzaRLVVRQvAy85yNmmZSjYjg4MWh4gNvlPujU/5LpA==}

  siginfo@2.0.0:
    resolution: {integrity: sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==}

  signal-exit@4.1.0:
    resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}
    engines: {node: '>=14'}

  slash@3.0.0:
    resolution: {integrity: sha512-g9Q1haeby36OSStwb4ntCGGGaKsaVSjQ68fBxoQcutl5fS1vuY18H3wSt3jFyFtrkx+Kz0V1G85A4MyAdDMi2Q==}
    engines: {node: '>=8'}

  solid-js@1.8.17:
    resolution: {integrity: sha512-E0FkUgv9sG/gEBWkHr/2XkBluHb1fkrHywUgA6o6XolPDCJ4g1HaLmQufcBBhiF36ee40q+HpG/vCZu7fLpI3Q==}

  solid-refresh@0.6.3:
    resolution: {integrity: sha512-F3aPsX6hVw9ttm5LYlth8Q15x6MlI/J3Dn+o3EQyRTtTxidepSTwAYdozt01/YA+7ObcciagGEyXIopGZzQtbA==}
    peerDependencies:
      solid-js: ^1.3

  source-map-js@1.2.0:
    resolution: {integrity: sha512-itJW8lvSA0TXEphiRoawsCksnlf8SyvmFzIhltqAHluXd88pkCd+cXJVHTDwdCr0IzwptSm035IHQktUu1QUMg==}
    engines: {node: '>=0.10.0'}

  source-map@0.6.1:
    resolution: {integrity: sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==}
    engines: {node: '>=0.10.0'}

  spawn-command@0.0.2:
    resolution: {integrity: sha512-zC8zGoGkmc8J9ndvml8Xksr1Amk9qBujgbF0JAIWO7kXr43w0h/0GJNM/Vustixu+YE8N/MTrQ7N31FvHUACxQ==}

  sprintf-js@1.0.3:
    resolution: {integrity: sha512-D9cPgkvLlV3t3IzL0D0YLvGA9Ahk4PcvVwUbN0dSGr1aP0Nrt4AEnTUbuGvquEC0mA64Gqt1fzirlRs5ibXx8g==}

  stackback@0.0.2:
    resolution: {integrity: sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==}

  std-env@3.7.0:
    resolution: {integrity: sha512-JPbdCEQLj1w5GilpiHAx3qJvFndqybBysA3qUOnznweH4QbNYUsW/ea8QzSrnh0vNsezMMw5bcVool8lM0gwzg==}

  string-argv@0.3.2:
    resolution: {integrity: sha512-aqD2Q0144Z+/RqG52NeHEkZauTAUWJO8c6yTftGJKO3Tja5tUgIfmIl6kExvhtxSDP7fXB6DvzkfMpCd/F3G+Q==}
    engines: {node: '>=0.6.19'}

  string-width@4.2.3:
    resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}
    engines: {node: '>=8'}

  strip-ansi@6.0.1:
    resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}
    engines: {node: '>=8'}

  strip-final-newline@3.0.0:
    resolution: {integrity: sha512-dOESqjYr96iWYylGObzd39EuNTa5VJxyvVAEm5Jnh7KGo75V43Hk1odPQkNDyXNmUR6k+gEiDVXnjB8HJ3crXw==}
    engines: {node: '>=12'}

  strip-json-comments@3.1.1:
    resolution: {integrity: sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==}
    engines: {node: '>=8'}

  strip-literal@2.1.0:
    resolution: {integrity: sha512-Op+UycaUt/8FbN/Z2TWPBLge3jWrP3xj10f3fnYxf052bKuS3EKs1ZQcVGjnEMdsNVAM+plXRdmjrZ/KgG3Skw==}

  supports-color@5.5.0:
    resolution: {integrity: sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==}
    engines: {node: '>=4'}

  supports-color@7.2.0:
    resolution: {integrity: sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==}
    engines: {node: '>=8'}

  supports-color@8.1.1:
    resolution: {integrity: sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==}
    engines: {node: '>=10'}

  supports-preserve-symlinks-flag@1.0.0:
    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
    engines: {node: '>= 0.4'}

  symbol-tree@3.2.4:
    resolution: {integrity: sha512-9QNk5KwDF+Bvz+PyObkmSYjI5ksVUYtjW7AU22r2NKcfLJcXp96hkDWU3+XndOsUb+AQ9QhfzfCT2O+CNWT5Tw==}

  text-table@0.2.0:
    resolution: {integrity: sha512-N+8UisAXDGk8PFXP4HAzVR9nbfmVJ3zYLAWiTIoqC5v5isinhr+r5uaO8+7r3BMfuNIufIsA7RdpVgacC2cSpw==}

  tinybench@2.8.0:
    resolution: {integrity: sha512-1/eK7zUnIklz4JUUlL+658n58XO2hHLQfSk1Zf2LKieUjxidN16eKFEoDEfjHc3ohofSSqK3X5yO6VGb6iW8Lw==}

  tinypool@0.8.4:
    resolution: {integrity: sha512-i11VH5gS6IFeLY3gMBQ00/MmLncVP7JLXOw1vlgkytLmJK7QnEr7NXf0LBdxfmNPAeyetukOk0bOYrJrFGjYJQ==}
    engines: {node: '>=14.0.0'}

  tinyspy@2.2.1:
    resolution: {integrity: sha512-KYad6Vy5VDWV4GH3fjpseMQ/XU2BhIYP7Vzd0LG44qRWm/Yt2WCOTicFdvmgo6gWaqooMQCawTtILVQJupKu7A==}
    engines: {node: '>=14.0.0'}

  tm-textarea@0.1.1:
    resolution: {integrity: sha512-9zUlMnkGn8VtaCBrmPx8vTDzW7mseGbeI40v+6kznP8PqmuqgNz9p/uBj9aNk7Fz3cM7d9bJa06xemAdEP33dQ==}
    engines: {node: '>=18', pnpm: '>=9.0.0'}
    peerDependencies:
      solid-js: ^1.6.0

  to-fast-properties@2.0.0:
    resolution: {integrity: sha512-/OaKK0xYrs3DmxRYqL/yDc+FxFUVYhDlXMhRmv3z915w2HF1tnN1omB354j8VUGO/hbRzyD6Y3sA7v7GS/ceog==}
    engines: {node: '>=4'}

  to-regex-range@5.0.1:
    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
    engines: {node: '>=8.0'}

  tough-cookie@4.1.4:
    resolution: {integrity: sha512-Loo5UUvLD9ScZ6jh8beX1T6sO1w2/MpCRpEP7V280GKMVUQ0Jzar2U3UJPsrdbziLEMMhu3Ujnq//rhiFuIeag==}
    engines: {node: '>=6'}

  tr46@5.0.0:
    resolution: {integrity: sha512-tk2G5R2KRwBd+ZN0zaEXpmzdKyOYksXwywulIX95MBODjSzMIuQnQ3m8JxgbhnL1LeVo7lqQKsYa1O3Htl7K5g==}
    engines: {node: '>=18'}

  tree-kill@1.2.2:
    resolution: {integrity: sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==}
    hasBin: true

  ts-api-utils@1.3.0:
    resolution: {integrity: sha512-UQMIo7pb8WRomKR1/+MFVLTroIvDVtMX3K6OUir8ynLyzB8Jeriont2bTAtmNPa1ekAgN7YPDyf6V+ygrdU+eQ==}
    engines: {node: '>=16'}
    peerDependencies:
      typescript: '>=4.2.0'

  tsconfck@3.1.5:
    resolution: {integrity: sha512-CLDfGgUp7XPswWnezWwsCRxNmgQjhYq3VXHM0/XIRxhVrKw0M1if9agzryh1QS3nxjCROvV+xWxoJO1YctzzWg==}
    engines: {node: ^18 || >=20}
    hasBin: true
    peerDependencies:
      typescript: ^5.0.0
    peerDependenciesMeta:
      typescript:
        optional: true

  tslib@2.6.2:
    resolution: {integrity: sha512-AEYxH93jGFPn/a2iVAwW87VuUIkR1FVUKB77NwMF7nBTDkDrrT/Hpt/IrCJ0QXhW27jTBDcf5ZY7w6RiqTMw2Q==}

  type-check@0.4.0:
    resolution: {integrity: sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==}
    engines: {node: '>= 0.8.0'}

  type-detect@4.0.8:
    resolution: {integrity: sha512-0fr/mIH1dlO+x7TlcMy+bIDqKPsw/70tVyeHW787goQjhmqaZe10uwLujubK9q9Lg6Fiho1KUKDYz0Z7k7g5/g==}
    engines: {node: '>=4'}

  type-fest@0.20.2:
    resolution: {integrity: sha512-Ne+eE4r0/iWnpAxD852z3A+N0Bt5RN//NjJwRd2VFHEmrywxf5vsZlh4R6lixl6B+wz/8d+maTSAkN1FIkI3LQ==}
    engines: {node: '>=10'}

  typescript@5.4.5:
    resolution: {integrity: sha512-vcI4UpRgg81oIRUFwR0WSIHKt11nJ7SAVlYNIu+QpqeyXP+gpQJy/Z4+F0aGxSE4MqwjyXvW/TzgkLAx2AGHwQ==}
    engines: {node: '>=14.17'}
    hasBin: true

  typescript@5.8.2:
    resolution: {integrity: sha512-aJn6wq13/afZp/jT9QZmwEjDqqvSGp1VT5GVg+f/t6/oVyrgXM6BY1h9BRh/O5p3PlUPAe+WuiEZOmb/49RqoQ==}
    engines: {node: '>=14.17'}
    hasBin: true

  ufo@1.5.3:
    resolution: {integrity: sha512-Y7HYmWaFwPUmkoQCUIAYpKqkOf+SbVj/2fJJZ4RJMCfZp0rTGwRbzQD+HghfnhKOjL9E01okqz+ncJskGYfBNw==}

  ufo@1.5.4:
    resolution: {integrity: sha512-UsUk3byDzKd04EyoZ7U4DOlxQaD14JUKQl6/P7wiX4FNvUfm3XL246n9W5AmqwW5RSFJ27NAuM0iLscAOYUiGQ==}

  undici-types@5.26.5:
    resolution: {integrity: sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA==}

  universalify@0.2.0:
    resolution: {integrity: sha512-CJ1QgKmNg3CwvAv/kOFmtnEN05f0D/cn9QntgNOQlQF9dgvVTHj3t+8JPdjqawCHk7V/KA+fbUqzZ9XWhcqPUg==}
    engines: {node: '>= 4.0.0'}

  universalify@2.0.1:
    resolution: {integrity: sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==}
    engines: {node: '>= 10.0.0'}

  update-browserslist-db@1.0.16:
    resolution: {integrity: sha512-KVbTxlBYlckhF5wgfyZXTWnMn7MMZjMu9XG8bPlliUOP9ThaF4QnhP8qrjrH7DRzHfSk0oQv1wToW+iA5GajEQ==}
    hasBin: true
    peerDependencies:
      browserslist: '>= 4.21.0'

  uri-js@4.4.1:
    resolution: {integrity: sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==}

  url-parse@1.5.10:
    resolution: {integrity: sha512-WypcfiRhfeUP9vvF0j6rw0J3hrWrw6iZv3+22h6iRMJ/8z1Tj6XfLP4DsUix5MhMPnXpiHDoKyoZ/bdCkwBCiQ==}

  util-deprecate@1.0.2:
    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}

  validate-html-nesting@1.2.2:
    resolution: {integrity: sha512-hGdgQozCsQJMyfK5urgFcWEqsSSrK63Awe0t/IMR0bZ0QMtnuaiHzThW81guu3qx9abLi99NEuiaN6P9gVYsNg==}

  vite-node@1.6.0:
    resolution: {integrity: sha512-de6HJgzC+TFzOu0NTC4RAIsyf/DY/ibWDYQUcuEA84EMHhcefTUGkjFHKKEJhQN4A+6I0u++kr3l36ZF2d7XRw==}
    engines: {node: ^18.0.0 || >=20.0.0}
    hasBin: true

  vite-plugin-css-classnames@0.0.2:
    resolution: {integrity: sha512-2suhK3sr/TRqAeiiN6r0lNxoXxhqiY9r9iCrywLitdKOLmacBQHW6f6RJuzK8VjtV6bsAbF28tYxb4ZViWa1Zw==}
    peerDependencies:
      '@types/node': ^20.12.12
      postcss: ^8.4.45
      vite: ^5.2.11

  vite-plugin-dts-bundle-generator@2.1.0:
    resolution: {integrity: sha512-ZsIkeR0htvRe33MjhJbEHwvLoiVGCQLpT/JzYV3/jT1bmACG8a4emZx3iAa4Pc4otjcx06a1CPzMgY0/jlQB1Q==}
    engines: {node: '>=22.12.0', npm: '>=10.0.0'}
    peerDependencies:
      vite: ^6.1.1

  vite-plugin-dts@4.5.3:
    resolution: {integrity: sha512-P64VnD00dR+e8S26ESoFELqc17+w7pKkwlBpgXteOljFyT0zDwD8hH4zXp49M/kciy//7ZbVXIwQCekBJjfWzA==}
    peerDependencies:
      typescript: '*'
      vite: '*'
    peerDependenciesMeta:
      vite:
        optional: true

  vite-plugin-lib-inject-css@2.2.1:
    resolution: {integrity: sha512-PW3n/zRacr7bwNagHOnJfaVLoZyGDCPuFMJTyTFqjk4Xi0HKd1cK5+WlBidBBeWK8QE3SV0i+FsWmN+frBLCVQ==}
    peerDependencies:
      vite: '*'

  vite-plugin-solid@2.10.2:
    resolution: {integrity: sha512-AOEtwMe2baBSXMXdo+BUwECC8IFHcKS6WQV/1NEd+Q7vHPap5fmIhLcAzr+DUJ04/KHx/1UBU0l1/GWP+rMAPQ==}
    peerDependencies:
      '@testing-library/jest-dom': ^5.16.6 || ^5.17.0 || ^6.*
      solid-js: ^1.7.2
      vite: ^3.0.0 || ^4.0.0 || ^5.0.0
    peerDependenciesMeta:
      '@testing-library/jest-dom':
        optional: true

  vite-tsconfig-paths@5.1.4:
    resolution: {integrity: sha512-cYj0LRuLV2c2sMqhqhGpaO3LretdtMn/BVX4cPLanIZuwwrkVl+lK84E/miEXkCHWXuq65rhNN4rXsBcOB3S4w==}
    peerDependencies:
      vite: '*'
    peerDependenciesMeta:
      vite:
        optional: true

  vite@5.2.11:
    resolution: {integrity: sha512-HndV31LWW05i1BLPMUCE1B9E9GFbOu1MbenhS58FuK6owSO5qHm7GiCotrNY1YE5rMeQSFBGmT5ZaLEjFizgiQ==}
    engines: {node: ^18.0.0 || >=20.0.0}
    hasBin: true
    peerDependencies:
      '@types/node': ^18.0.0 || >=20.0.0
      less: '*'
      lightningcss: ^1.21.0
      sass: '*'
      stylus: '*'
      sugarss: '*'
      terser: ^5.4.0
    peerDependenciesMeta:
      '@types/node':
        optional: true
      less:
        optional: true
      lightningcss:
        optional: true
      sass:
        optional: true
      stylus:
        optional: true
      sugarss:
        optional: true
      terser:
        optional: true

  vitefu@0.2.5:
    resolution: {integrity: sha512-SgHtMLoqaeeGnd2evZ849ZbACbnwQCIwRH57t18FxcXoZop0uQu0uzlIhJBlF/eWVzuce0sHeqPcDo+evVcg8Q==}
    peerDependencies:
      vite: ^3.0.0 || ^4.0.0 || ^5.0.0
    peerDependenciesMeta:
      vite:
        optional: true

  vitest@1.6.0:
    resolution: {integrity: sha512-H5r/dN06swuFnzNFhq/dnz37bPXnq8xB2xB5JOVk8K09rUtoeNN+LHWkoQ0A/i3hvbUKKcCei9KpbxqHMLhLLA==}
    engines: {node: ^18.0.0 || >=20.0.0}
    hasBin: true
    peerDependencies:
      '@edge-runtime/vm': '*'
      '@types/node': ^18.0.0 || >=20.0.0
      '@vitest/browser': 1.6.0
      '@vitest/ui': 1.6.0
      happy-dom: '*'
      jsdom: '*'
    peerDependenciesMeta:
      '@edge-runtime/vm':
        optional: true
      '@types/node':
        optional: true
      '@vitest/browser':
        optional: true
      '@vitest/ui':
        optional: true
      happy-dom:
        optional: true
      jsdom:
        optional: true

  vscode-oniguruma@2.0.1:
    resolution: {integrity: sha512-poJU8iHIWnC3vgphJnrLZyI3YdqRlR27xzqDmpPXYzA93R4Gk8z7T6oqDzDoHjoikA2aS82crdXFkjELCdJsjQ==}

  vscode-textmate@9.2.0:
    resolution: {integrity: sha512-rkvG4SraZQaPSN/5XjwKswdU0OP9MF28QjrYzUBbhb8QyG3ljB1Ky996m++jiI7KdiAP2CkBiQZd9pqEDTClqA==}

  vscode-uri@3.1.0:
    resolution: {integrity: sha512-/BpdSx+yCQGnCvecbyXdxHDkuk55/G3xwnC0GqY4gmQ3j+A+g8kzzgB4Nk/SINjqn6+waqw3EgbVF2QKExkRxQ==}

  w3c-xmlserializer@5.0.0:
    resolution: {integrity: sha512-o8qghlI8NZHU1lLPrpi2+Uq7abh4GGPpYANlalzWxyWteJOCsr/P+oPBA49TOLu5FTZO4d3F9MnWJfiMo4BkmA==}
    engines: {node: '>=18'}

  webidl-conversions@7.0.0:
    resolution: {integrity: sha512-VwddBukDzu71offAQR975unBIGqfKZpM+8ZX6ySk8nYhVoo5CYaZyzt3YBvYtRtO+aoGlqxPg/B87NGVZ/fu6g==}
    engines: {node: '>=12'}

  whatwg-encoding@3.1.1:
    resolution: {integrity: sha512-6qN4hJdMwfYBtE3YBTTHhoeuUrDBPZmbQaxWAqSALV/MeEnR5z1xd8UKud2RAkFoPkmB+hli1TZSnyi84xz1vQ==}
    engines: {node: '>=18'}

  whatwg-mimetype@4.0.0:
    resolution: {integrity: sha512-QaKxh0eNIi2mE9p2vEdzfagOKHCcj1pJ56EEHGQOVxp8r9/iszLUUV7v89x9O1p/T+NlTM5W7jW6+cz4Fq1YVg==}
    engines: {node: '>=18'}

  whatwg-url@14.0.0:
    resolution: {integrity: sha512-1lfMEm2IEr7RIV+f4lUNPOqfFL+pO+Xw3fJSqmjX9AbXcXcYOkCe1P6+9VBZB6n94af16NfZf+sSk0JCBZC9aw==}
    engines: {node: '>=18'}

  which@2.0.2:
    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
    engines: {node: '>= 8'}
    hasBin: true

  why-is-node-running@2.2.2:
    resolution: {integrity: sha512-6tSwToZxTOcotxHeA+qGCq1mVzKR3CwcJGmVcY+QE8SHy6TnpFnh8PAvPNHYr7EcuVeG0QSMxtYCuO1ta/G/oA==}
    engines: {node: '>=8'}
    hasBin: true

  word-wrap@1.2.5:
    resolution: {integrity: sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==}
    engines: {node: '>=0.10.0'}

  wrap-ansi@7.0.0:
    resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}
    engines: {node: '>=10'}

  wrappy@1.0.2:
    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}

  ws@8.17.0:
    resolution: {integrity: sha512-uJq6108EgZMAl20KagGkzCKfMEjxmKvZHG7Tlq0Z6nOky7YF7aq4mOx6xK8TJ/i1LeK4Qus7INktacctDgY8Ow==}
    engines: {node: '>=10.0.0'}
    peerDependencies:
      bufferutil: ^4.0.1
      utf-8-validate: '>=5.0.2'
    peerDependenciesMeta:
      bufferutil:
        optional: true
      utf-8-validate:
        optional: true

  xml-name-validator@5.0.0:
    resolution: {integrity: sha512-EvGK8EJ3DhaHfbRlETOWAS5pO9MZITeauHKJyb8wyajUfQUenkIg2MvLDTZ4T/TgIcm3HU0TFBgWWboAZ30UHg==}
    engines: {node: '>=18'}

  xmlchars@2.2.0:
    resolution: {integrity: sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==}

  y18n@5.0.8:
    resolution: {integrity: sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==}
    engines: {node: '>=10'}

  yallist@3.1.1:
    resolution: {integrity: sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==}

  yallist@4.0.0:
    resolution: {integrity: sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==}

  yargs-parser@21.1.1:
    resolution: {integrity: sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==}
    engines: {node: '>=12'}

  yargs@17.7.2:
    resolution: {integrity: sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==}
    engines: {node: '>=12'}

  yocto-queue@0.1.0:
    resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}
    engines: {node: '>=10'}

  yocto-queue@1.0.0:
    resolution: {integrity: sha512-9bnSc/HEW2uRy67wc+T8UwauLuPJVn28jb+GtJY16iiKWyvmYJRXVT4UamsAEGQfPohgr2q4Tq0sQbQlxTfi1g==}
    engines: {node: '>=12.20'}

snapshots:

  '@ampproject/remapping@2.3.0':
    dependencies:
      '@jridgewell/gen-mapping': 0.3.5
      '@jridgewell/trace-mapping': 0.3.25

  '@ast-grep/napi-darwin-arm64@0.32.3':
    optional: true

  '@ast-grep/napi-darwin-x64@0.32.3':
    optional: true

  '@ast-grep/napi-linux-arm64-gnu@0.32.3':
    optional: true

  '@ast-grep/napi-linux-arm64-musl@0.32.3':
    optional: true

  '@ast-grep/napi-linux-x64-gnu@0.32.3':
    optional: true

  '@ast-grep/napi-linux-x64-musl@0.32.3':
    optional: true

  '@ast-grep/napi-win32-arm64-msvc@0.32.3':
    optional: true

  '@ast-grep/napi-win32-ia32-msvc@0.32.3':
    optional: true

  '@ast-grep/napi-win32-x64-msvc@0.32.3':
    optional: true

  '@ast-grep/napi@0.32.3':
    optionalDependencies:
      '@ast-grep/napi-darwin-arm64': 0.32.3
      '@ast-grep/napi-darwin-x64': 0.32.3
      '@ast-grep/napi-linux-arm64-gnu': 0.32.3
      '@ast-grep/napi-linux-arm64-musl': 0.32.3
      '@ast-grep/napi-linux-x64-gnu': 0.32.3
      '@ast-grep/napi-linux-x64-musl': 0.32.3
      '@ast-grep/napi-win32-arm64-msvc': 0.32.3
      '@ast-grep/napi-win32-ia32-msvc': 0.32.3
      '@ast-grep/napi-win32-x64-msvc': 0.32.3

  '@babel/code-frame@7.24.2':
    dependencies:
      '@babel/highlight': 7.24.5
      picocolors: 1.0.1

  '@babel/compat-data@7.24.4': {}

  '@babel/core@7.24.5':
    dependencies:
      '@ampproject/remapping': 2.3.0
      '@babel/code-frame': 7.24.2
      '@babel/generator': 7.24.5
      '@babel/helper-compilation-targets': 7.23.6
      '@babel/helper-module-transforms': 7.24.5(@babel/core@7.24.5)
      '@babel/helpers': 7.24.5
      '@babel/parser': 7.24.5
      '@babel/template': 7.24.0
      '@babel/traverse': 7.24.5
      '@babel/types': 7.24.5
      convert-source-map: 2.0.0
      debug: 4.3.4
      gensync: 1.0.0-beta.2
      json5: 2.2.3
      semver: 6.3.1
    transitivePeerDependencies:
      - supports-color

  '@babel/generator@7.24.5':
    dependencies:
      '@babel/types': 7.24.5
      '@jridgewell/gen-mapping': 0.3.5
      '@jridgewell/trace-mapping': 0.3.25
      jsesc: 2.5.2

  '@babel/helper-annotate-as-pure@7.22.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-compilation-targets@7.23.6':
    dependencies:
      '@babel/compat-data': 7.24.4
      '@babel/helper-validator-option': 7.23.5
      browserslist: 4.23.0
      lru-cache: 5.1.1
      semver: 6.3.1

  '@babel/helper-create-class-features-plugin@7.24.5(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-annotate-as-pure': 7.22.5
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-function-name': 7.23.0
      '@babel/helper-member-expression-to-functions': 7.24.5
      '@babel/helper-optimise-call-expression': 7.22.5
      '@babel/helper-replace-supers': 7.24.1(@babel/core@7.24.5)
      '@babel/helper-skip-transparent-expression-wrappers': 7.22.5
      '@babel/helper-split-export-declaration': 7.24.5
      semver: 6.3.1

  '@babel/helper-environment-visitor@7.22.20': {}

  '@babel/helper-function-name@7.23.0':
    dependencies:
      '@babel/template': 7.24.0
      '@babel/types': 7.24.5

  '@babel/helper-hoist-variables@7.22.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-member-expression-to-functions@7.24.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-module-imports@7.18.6':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-module-imports@7.24.3':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-module-transforms@7.24.5(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-module-imports': 7.24.3
      '@babel/helper-simple-access': 7.24.5
      '@babel/helper-split-export-declaration': 7.24.5
      '@babel/helper-validator-identifier': 7.24.5

  '@babel/helper-optimise-call-expression@7.22.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-plugin-utils@7.24.5': {}

  '@babel/helper-replace-supers@7.24.1(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-member-expression-to-functions': 7.24.5
      '@babel/helper-optimise-call-expression': 7.22.5

  '@babel/helper-simple-access@7.24.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-skip-transparent-expression-wrappers@7.22.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-split-export-declaration@7.24.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/helper-string-parser@7.24.1': {}

  '@babel/helper-string-parser@7.25.9': {}

  '@babel/helper-validator-identifier@7.24.5': {}

  '@babel/helper-validator-identifier@7.25.9': {}

  '@babel/helper-validator-option@7.23.5': {}

  '@babel/helpers@7.24.5':
    dependencies:
      '@babel/template': 7.24.0
      '@babel/traverse': 7.24.5
      '@babel/types': 7.24.5
    transitivePeerDependencies:
      - supports-color

  '@babel/highlight@7.24.5':
    dependencies:
      '@babel/helper-validator-identifier': 7.24.5
      chalk: 2.4.2
      js-tokens: 4.0.0
      picocolors: 1.0.1

  '@babel/parser@7.24.5':
    dependencies:
      '@babel/types': 7.24.5

  '@babel/parser@7.27.0':
    dependencies:
      '@babel/types': 7.27.0

  '@babel/plugin-syntax-jsx@7.24.1(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-plugin-utils': 7.24.5

  '@babel/plugin-syntax-typescript@7.24.1(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-plugin-utils': 7.24.5

  '@babel/plugin-transform-modules-commonjs@7.24.1(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-module-transforms': 7.24.5(@babel/core@7.24.5)
      '@babel/helper-plugin-utils': 7.24.5
      '@babel/helper-simple-access': 7.24.5

  '@babel/plugin-transform-typescript@7.24.5(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-annotate-as-pure': 7.22.5
      '@babel/helper-create-class-features-plugin': 7.24.5(@babel/core@7.24.5)
      '@babel/helper-plugin-utils': 7.24.5
      '@babel/plugin-syntax-typescript': 7.24.1(@babel/core@7.24.5)

  '@babel/preset-typescript@7.24.1(@babel/core@7.24.5)':
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-plugin-utils': 7.24.5
      '@babel/helper-validator-option': 7.23.5
      '@babel/plugin-syntax-jsx': 7.24.1(@babel/core@7.24.5)
      '@babel/plugin-transform-modules-commonjs': 7.24.1(@babel/core@7.24.5)
      '@babel/plugin-transform-typescript': 7.24.5(@babel/core@7.24.5)

  '@babel/runtime@7.24.5':
    dependencies:
      regenerator-runtime: 0.14.1

  '@babel/template@7.24.0':
    dependencies:
      '@babel/code-frame': 7.24.2
      '@babel/parser': 7.24.5
      '@babel/types': 7.24.5

  '@babel/traverse@7.24.5':
    dependencies:
      '@babel/code-frame': 7.24.2
      '@babel/generator': 7.24.5
      '@babel/helper-environment-visitor': 7.22.20
      '@babel/helper-function-name': 7.23.0
      '@babel/helper-hoist-variables': 7.22.5
      '@babel/helper-split-export-declaration': 7.24.5
      '@babel/parser': 7.24.5
      '@babel/types': 7.24.5
      debug: 4.3.4
      globals: 11.12.0
    transitivePeerDependencies:
      - supports-color

  '@babel/types@7.24.5':
    dependencies:
      '@babel/helper-string-parser': 7.24.1
      '@babel/helper-validator-identifier': 7.24.5
      to-fast-properties: 2.0.0

  '@babel/types@7.27.0':
    dependencies:
      '@babel/helper-string-parser': 7.25.9
      '@babel/helper-validator-identifier': 7.25.9

  '@bigmistqke/solid-grid-split@0.0.2(solid-js@1.8.17)':
    dependencies:
      solid-js: 1.8.17

  '@bigmistqke/vite-plugin-raw-directory@0.0.2': {}

  '@esbuild/aix-ppc64@0.20.2':
    optional: true

  '@esbuild/aix-ppc64@0.21.3':
    optional: true

  '@esbuild/android-arm64@0.20.2':
    optional: true

  '@esbuild/android-arm64@0.21.3':
    optional: true

  '@esbuild/android-arm@0.20.2':
    optional: true

  '@esbuild/android-arm@0.21.3':
    optional: true

  '@esbuild/android-x64@0.20.2':
    optional: true

  '@esbuild/android-x64@0.21.3':
    optional: true

  '@esbuild/darwin-arm64@0.20.2':
    optional: true

  '@esbuild/darwin-arm64@0.21.3':
    optional: true

  '@esbuild/darwin-x64@0.20.2':
    optional: true

  '@esbuild/darwin-x64@0.21.3':
    optional: true

  '@esbuild/freebsd-arm64@0.20.2':
    optional: true

  '@esbuild/freebsd-arm64@0.21.3':
    optional: true

  '@esbuild/freebsd-x64@0.20.2':
    optional: true

  '@esbuild/freebsd-x64@0.21.3':
    optional: true

  '@esbuild/linux-arm64@0.20.2':
    optional: true

  '@esbuild/linux-arm64@0.21.3':
    optional: true

  '@esbuild/linux-arm@0.20.2':
    optional: true

  '@esbuild/linux-arm@0.21.3':
    optional: true

  '@esbuild/linux-ia32@0.20.2':
    optional: true

  '@esbuild/linux-ia32@0.21.3':
    optional: true

  '@esbuild/linux-loong64@0.20.2':
    optional: true

  '@esbuild/linux-loong64@0.21.3':
    optional: true

  '@esbuild/linux-mips64el@0.20.2':
    optional: true

  '@esbuild/linux-mips64el@0.21.3':
    optional: true

  '@esbuild/linux-ppc64@0.20.2':
    optional: true

  '@esbuild/linux-ppc64@0.21.3':
    optional: true

  '@esbuild/linux-riscv64@0.20.2':
    optional: true

  '@esbuild/linux-riscv64@0.21.3':
    optional: true

  '@esbuild/linux-s390x@0.20.2':
    optional: true

  '@esbuild/linux-s390x@0.21.3':
    optional: true

  '@esbuild/linux-x64@0.20.2':
    optional: true

  '@esbuild/linux-x64@0.21.3':
    optional: true

  '@esbuild/netbsd-x64@0.20.2':
    optional: true

  '@esbuild/netbsd-x64@0.21.3':
    optional: true

  '@esbuild/openbsd-x64@0.20.2':
    optional: true

  '@esbuild/openbsd-x64@0.21.3':
    optional: true

  '@esbuild/sunos-x64@0.20.2':
    optional: true

  '@esbuild/sunos-x64@0.21.3':
    optional: true

  '@esbuild/win32-arm64@0.20.2':
    optional: true

  '@esbuild/win32-arm64@0.21.3':
    optional: true

  '@esbuild/win32-ia32@0.20.2':
    optional: true

  '@esbuild/win32-ia32@0.21.3':
    optional: true

  '@esbuild/win32-x64@0.20.2':
    optional: true

  '@esbuild/win32-x64@0.21.3':
    optional: true

  '@eslint-community/eslint-utils@4.4.0(eslint@8.57.0)':
    dependencies:
      eslint: 8.57.0
      eslint-visitor-keys: 3.4.3

  '@eslint-community/regexpp@4.10.0': {}

  '@eslint/eslintrc@2.1.4':
    dependencies:
      ajv: 6.12.6
      debug: 4.3.4
      espree: 9.6.1
      globals: 13.24.0
      ignore: 5.3.1
      import-fresh: 3.3.0
      js-yaml: 4.1.0
      minimatch: 3.1.2
      strip-json-comments: 3.1.1
    transitivePeerDependencies:
      - supports-color

  '@eslint/js@8.57.0': {}

  '@humanwhocodes/config-array@0.11.14':
    dependencies:
      '@humanwhocodes/object-schema': 2.0.3
      debug: 4.3.4
      minimatch: 3.1.2
    transitivePeerDependencies:
      - supports-color

  '@humanwhocodes/module-importer@1.0.1': {}

  '@humanwhocodes/object-schema@2.0.3': {}

  '@jest/schemas@29.6.3':
    dependencies:
      '@sinclair/typebox': 0.27.8

  '@jridgewell/gen-mapping@0.3.5':
    dependencies:
      '@jridgewell/set-array': 1.2.1
      '@jridgewell/sourcemap-codec': 1.4.15
      '@jridgewell/trace-mapping': 0.3.25

  '@jridgewell/resolve-uri@3.1.2': {}

  '@jridgewell/set-array@1.2.1': {}

  '@jridgewell/sourcemap-codec@1.4.15': {}

  '@jridgewell/sourcemap-codec@1.5.0': {}

  '@jridgewell/trace-mapping@0.3.25':
    dependencies:
      '@jridgewell/resolve-uri': 3.1.2
      '@jridgewell/sourcemap-codec': 1.4.15

  '@lume/element@0.13.1(@babel/core@7.24.5)(@types/react@19.0.12)':
    dependencies:
      '@types/react': 19.0.12
      babel-preset-solid: 1.8.17(@babel/core@7.24.5)
      classy-solid: 0.4.3
      lowclass: 8.0.2
      solid-js: 1.8.17
    transitivePeerDependencies:
      - '@babel/core'

  '@microsoft/api-extractor-model@7.30.5(@types/node@20.12.12)':
    dependencies:
      '@microsoft/tsdoc': 0.15.1
      '@microsoft/tsdoc-config': 0.17.1
      '@rushstack/node-core-library': 5.13.0(@types/node@20.12.12)
    transitivePeerDependencies:
      - '@types/node'

  '@microsoft/api-extractor@7.52.2(@types/node@20.12.12)':
    dependencies:
      '@microsoft/api-extractor-model': 7.30.5(@types/node@20.12.12)
      '@microsoft/tsdoc': 0.15.1
      '@microsoft/tsdoc-config': 0.17.1
      '@rushstack/node-core-library': 5.13.0(@types/node@20.12.12)
      '@rushstack/rig-package': 0.5.3
      '@rushstack/terminal': 0.15.2(@types/node@20.12.12)
      '@rushstack/ts-command-line': 4.23.7(@types/node@20.12.12)
      lodash: 4.17.21
      minimatch: 3.0.8
      resolve: 1.22.10
      semver: 7.5.4
      source-map: 0.6.1
      typescript: 5.8.2
    transitivePeerDependencies:
      - '@types/node'

  '@microsoft/tsdoc-config@0.17.1':
    dependencies:
      '@microsoft/tsdoc': 0.15.1
      ajv: 8.12.0
      jju: 1.4.0
      resolve: 1.22.10

  '@microsoft/tsdoc@0.15.1': {}

  '@nodelib/fs.scandir@2.1.5':
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      run-parallel: 1.2.0

  '@nodelib/fs.stat@2.0.5': {}

  '@nodelib/fs.walk@1.2.8':
    dependencies:
      '@nodelib/fs.scandir': 2.1.5
      fastq: 1.17.1

  '@rollup/pluginutils@5.1.4(rollup@4.17.2)':
    dependencies:
      '@types/estree': 1.0.5
      estree-walker: 2.0.2
      picomatch: 4.0.2
    optionalDependencies:
      rollup: 4.17.2

  '@rollup/rollup-android-arm-eabi@4.17.2':
    optional: true

  '@rollup/rollup-android-arm64@4.17.2':
    optional: true

  '@rollup/rollup-darwin-arm64@4.17.2':
    optional: true

  '@rollup/rollup-darwin-x64@4.17.2':
    optional: true

  '@rollup/rollup-linux-arm-gnueabihf@4.17.2':
    optional: true

  '@rollup/rollup-linux-arm-musleabihf@4.17.2':
    optional: true

  '@rollup/rollup-linux-arm64-gnu@4.17.2':
    optional: true

  '@rollup/rollup-linux-arm64-musl@4.17.2':
    optional: true

  '@rollup/rollup-linux-powerpc64le-gnu@4.17.2':
    optional: true

  '@rollup/rollup-linux-riscv64-gnu@4.17.2':
    optional: true

  '@rollup/rollup-linux-s390x-gnu@4.17.2':
    optional: true

  '@rollup/rollup-linux-x64-gnu@4.17.2':
    optional: true

  '@rollup/rollup-linux-x64-musl@4.17.2':
    optional: true

  '@rollup/rollup-win32-arm64-msvc@4.17.2':
    optional: true

  '@rollup/rollup-win32-ia32-msvc@4.17.2':
    optional: true

  '@rollup/rollup-win32-x64-msvc@4.17.2':
    optional: true

  '@rushstack/node-core-library@5.13.0(@types/node@20.12.12)':
    dependencies:
      ajv: 8.13.0
      ajv-draft-04: 1.0.0(ajv@8.13.0)
      ajv-formats: 3.0.1(ajv@8.13.0)
      fs-extra: 11.3.0
      import-lazy: 4.0.0
      jju: 1.4.0
      resolve: 1.22.10
      semver: 7.5.4
    optionalDependencies:
      '@types/node': 20.12.12

  '@rushstack/rig-package@0.5.3':
    dependencies:
      resolve: 1.22.10
      strip-json-comments: 3.1.1

  '@rushstack/terminal@0.15.2(@types/node@20.12.12)':
    dependencies:
      '@rushstack/node-core-library': 5.13.0(@types/node@20.12.12)
      supports-color: 8.1.1
    optionalDependencies:
      '@types/node': 20.12.12

  '@rushstack/ts-command-line@4.23.7(@types/node@20.12.12)':
    dependencies:
      '@rushstack/terminal': 0.15.2(@types/node@20.12.12)
      '@types/argparse': 1.0.38
      argparse: 1.0.10
      string-argv: 0.3.2
    transitivePeerDependencies:
      - '@types/node'

  '@sinclair/typebox@0.27.8': {}

  '@solid-primitives/keyed@1.5.0(solid-js@1.8.17)':
    dependencies:
      solid-js: 1.8.17

  '@solid-primitives/map@0.6.0(solid-js@1.8.17)':
    dependencies:
      '@solid-primitives/trigger': 1.2.0(solid-js@1.8.17)
      solid-js: 1.8.17

  '@solid-primitives/memo@1.4.1(solid-js@1.8.17)':
    dependencies:
      '@solid-primitives/scheduled': 1.5.0(solid-js@1.8.17)
      '@solid-primitives/utils': 6.3.0(solid-js@1.8.17)
      solid-js: 1.8.17

  '@solid-primitives/range@0.2.0(solid-js@1.8.17)':
    dependencies:
      '@solid-primitives/utils': 6.3.0(solid-js@1.8.17)
      solid-js: 1.8.17

  '@solid-primitives/scheduled@1.5.0(solid-js@1.8.17)':
    dependencies:
      solid-js: 1.8.17

  '@solid-primitives/trigger@1.2.0(solid-js@1.8.17)':
    dependencies:
      '@solid-primitives/utils': 6.3.0(solid-js@1.8.17)
      solid-js: 1.8.17

  '@solid-primitives/utils@6.3.0(solid-js@1.8.17)':
    dependencies:
      solid-js: 1.8.17

  '@types/argparse@1.0.38': {}

  '@types/babel__core@7.20.5':
    dependencies:
      '@babel/parser': 7.24.5
      '@babel/types': 7.24.5
      '@types/babel__generator': 7.6.8
      '@types/babel__template': 7.4.4
      '@types/babel__traverse': 7.20.5

  '@types/babel__generator@7.6.8':
    dependencies:
      '@babel/types': 7.24.5

  '@types/babel__template@7.4.4':
    dependencies:
      '@babel/parser': 7.24.5
      '@babel/types': 7.24.5

  '@types/babel__traverse@7.20.5':
    dependencies:
      '@babel/types': 7.24.5

  '@types/estree@1.0.5': {}

  '@types/node@20.12.12':
    dependencies:
      undici-types: 5.26.5

  '@types/react@19.0.12':
    dependencies:
      csstype: 3.1.3

  '@typescript-eslint/eslint-plugin@7.9.0(@typescript-eslint/parser@7.9.0(eslint@8.57.0)(typescript@5.4.5))(eslint@8.57.0)(typescript@5.4.5)':
    dependencies:
      '@eslint-community/regexpp': 4.10.0
      '@typescript-eslint/parser': 7.9.0(eslint@8.57.0)(typescript@5.4.5)
      '@typescript-eslint/scope-manager': 7.9.0
      '@typescript-eslint/type-utils': 7.9.0(eslint@8.57.0)(typescript@5.4.5)
      '@typescript-eslint/utils': 7.9.0(eslint@8.57.0)(typescript@5.4.5)
      '@typescript-eslint/visitor-keys': 7.9.0
      eslint: 8.57.0
      graphemer: 1.4.0
      ignore: 5.3.1
      natural-compare: 1.4.0
      ts-api-utils: 1.3.0(typescript@5.4.5)
    optionalDependencies:
      typescript: 5.4.5
    transitivePeerDependencies:
      - supports-color

  '@typescript-eslint/parser@7.9.0(eslint@8.57.0)(typescript@5.4.5)':
    dependencies:
      '@typescript-eslint/scope-manager': 7.9.0
      '@typescript-eslint/types': 7.9.0
      '@typescript-eslint/typescript-estree': 7.9.0(typescript@5.4.5)
      '@typescript-eslint/visitor-keys': 7.9.0
      debug: 4.3.4
      eslint: 8.57.0
    optionalDependencies:
      typescript: 5.4.5
    transitivePeerDependencies:
      - supports-color

  '@typescript-eslint/scope-manager@7.9.0':
    dependencies:
      '@typescript-eslint/types': 7.9.0
      '@typescript-eslint/visitor-keys': 7.9.0

  '@typescript-eslint/type-utils@7.9.0(eslint@8.57.0)(typescript@5.4.5)':
    dependencies:
      '@typescript-eslint/typescript-estree': 7.9.0(typescript@5.4.5)
      '@typescript-eslint/utils': 7.9.0(eslint@8.57.0)(typescript@5.4.5)
      debug: 4.3.4
      eslint: 8.57.0
      ts-api-utils: 1.3.0(typescript@5.4.5)
    optionalDependencies:
      typescript: 5.4.5
    transitivePeerDependencies:
      - supports-color

  '@typescript-eslint/types@7.9.0': {}

  '@typescript-eslint/typescript-estree@7.9.0(typescript@5.4.5)':
    dependencies:
      '@typescript-eslint/types': 7.9.0
      '@typescript-eslint/visitor-keys': 7.9.0
      debug: 4.3.4
      globby: 11.1.0
      is-glob: 4.0.3
      minimatch: 9.0.4
      semver: 7.6.2
      ts-api-utils: 1.3.0(typescript@5.4.5)
    optionalDependencies:
      typescript: 5.4.5
    transitivePeerDependencies:
      - supports-color

  '@typescript-eslint/utils@7.9.0(eslint@8.57.0)(typescript@5.4.5)':
    dependencies:
      '@eslint-community/eslint-utils': 4.4.0(eslint@8.57.0)
      '@typescript-eslint/scope-manager': 7.9.0
      '@typescript-eslint/types': 7.9.0
      '@typescript-eslint/typescript-estree': 7.9.0(typescript@5.4.5)
      eslint: 8.57.0
    transitivePeerDependencies:
      - supports-color
      - typescript

  '@typescript-eslint/visitor-keys@7.9.0':
    dependencies:
      '@typescript-eslint/types': 7.9.0
      eslint-visitor-keys: 3.4.3

  '@ungap/structured-clone@1.2.0': {}

  '@vitest/expect@1.6.0':
    dependencies:
      '@vitest/spy': 1.6.0
      '@vitest/utils': 1.6.0
      chai: 4.4.1

  '@vitest/runner@1.6.0':
    dependencies:
      '@vitest/utils': 1.6.0
      p-limit: 5.0.0
      pathe: 1.1.2

  '@vitest/snapshot@1.6.0':
    dependencies:
      magic-string: 0.30.10
      pathe: 1.1.2
      pretty-format: 29.7.0

  '@vitest/spy@1.6.0':
    dependencies:
      tinyspy: 2.2.1

  '@vitest/utils@1.6.0':
    dependencies:
      diff-sequences: 29.6.3
      estree-walker: 3.0.3
      loupe: 2.3.7
      pretty-format: 29.7.0

  '@volar/language-core@2.4.12':
    dependencies:
      '@volar/source-map': 2.4.12

  '@volar/source-map@2.4.12': {}

  '@volar/typescript@2.4.12':
    dependencies:
      '@volar/language-core': 2.4.12
      path-browserify: 1.0.1
      vscode-uri: 3.1.0

  '@vue/compiler-core@3.5.13':
    dependencies:
      '@babel/parser': 7.27.0
      '@vue/shared': 3.5.13
      entities: 4.5.0
      estree-walker: 2.0.2
      source-map-js: 1.2.0

  '@vue/compiler-dom@3.5.13':
    dependencies:
      '@vue/compiler-core': 3.5.13
      '@vue/shared': 3.5.13

  '@vue/compiler-vue2@2.7.16':
    dependencies:
      de-indent: 1.0.2
      he: 1.2.0

  '@vue/language-core@2.2.0(typescript@5.4.5)':
    dependencies:
      '@volar/language-core': 2.4.12
      '@vue/compiler-dom': 3.5.13
      '@vue/compiler-vue2': 2.7.16
      '@vue/shared': 3.5.13
      alien-signals: 0.4.14
      minimatch: 9.0.4
      muggle-string: 0.4.1
      path-browserify: 1.0.1
    optionalDependencies:
      typescript: 5.4.5

  '@vue/shared@3.5.13': {}

  acorn-jsx@5.3.2(acorn@8.11.3):
    dependencies:
      acorn: 8.11.3

  acorn-walk@8.3.2: {}

  acorn@8.11.3: {}

  acorn@8.14.1: {}

  agent-base@7.1.1:
    dependencies:
      debug: 4.3.4
    transitivePeerDependencies:
      - supports-color

  ajv-draft-04@1.0.0(ajv@8.13.0):
    optionalDependencies:
      ajv: 8.13.0

  ajv-formats@3.0.1(ajv@8.13.0):
    optionalDependencies:
      ajv: 8.13.0

  ajv@6.12.6:
    dependencies:
      fast-deep-equal: 3.1.3
      fast-json-stable-stringify: 2.1.0
      json-schema-traverse: 0.4.1
      uri-js: 4.4.1

  ajv@8.12.0:
    dependencies:
      fast-deep-equal: 3.1.3
      json-schema-traverse: 1.0.0
      require-from-string: 2.0.2
      uri-js: 4.4.1

  ajv@8.13.0:
    dependencies:
      fast-deep-equal: 3.1.3
      json-schema-traverse: 1.0.0
      require-from-string: 2.0.2
      uri-js: 4.4.1

  alien-signals@0.4.14: {}

  ansi-regex@5.0.1: {}

  ansi-styles@3.2.1:
    dependencies:
      color-convert: 1.9.3

  ansi-styles@4.3.0:
    dependencies:
      color-convert: 2.0.1

  ansi-styles@5.2.0: {}

  argparse@1.0.10:
    dependencies:
      sprintf-js: 1.0.3

  argparse@2.0.1: {}

  array-union@2.1.0: {}

  assertion-error@1.1.0: {}

  asynckit@0.4.0: {}

  babel-plugin-jsx-dom-expressions@0.37.20(@babel/core@7.24.5):
    dependencies:
      '@babel/core': 7.24.5
      '@babel/helper-module-imports': 7.18.6
      '@babel/plugin-syntax-jsx': 7.24.1(@babel/core@7.24.5)
      '@babel/types': 7.24.5
      html-entities: 2.3.3
      validate-html-nesting: 1.2.2

  babel-preset-solid@1.8.17(@babel/core@7.24.5):
    dependencies:
      '@babel/core': 7.24.5
      babel-plugin-jsx-dom-expressions: 0.37.20(@babel/core@7.24.5)

  balanced-match@1.0.2: {}

  brace-expansion@1.1.11:
    dependencies:
      balanced-match: 1.0.2
      concat-map: 0.0.1

  brace-expansion@2.0.1:
    dependencies:
      balanced-match: 1.0.2

  braces@3.0.2:
    dependencies:
      fill-range: 7.0.1

  browserslist@4.23.0:
    dependencies:
      caniuse-lite: 1.0.30001620
      electron-to-chromium: 1.4.773
      node-releases: 2.0.14
      update-browserslist-db: 1.0.16(browserslist@4.23.0)

  cac@6.7.14: {}

  callsites@3.1.0: {}

  caniuse-lite@1.0.30001620: {}

  chai@4.4.1:
    dependencies:
      assertion-error: 1.1.0
      check-error: 1.0.3
      deep-eql: 4.1.3
      get-func-name: 2.0.2
      loupe: 2.3.7
      pathval: 1.1.1
      type-detect: 4.0.8

  chalk@2.4.2:
    dependencies:
      ansi-styles: 3.2.1
      escape-string-regexp: 1.0.5
      supports-color: 5.5.0

  chalk@4.1.2:
    dependencies:
      ansi-styles: 4.3.0
      supports-color: 7.2.0

  check-error@1.0.3:
    dependencies:
      get-func-name: 2.0.2

  classy-solid@0.4.3:
    dependencies:
      lowclass: 8.0.2
      solid-js: 1.8.17

  cliui@8.0.1:
    dependencies:
      string-width: 4.2.3
      strip-ansi: 6.0.1
      wrap-ansi: 7.0.0

  clsx@2.1.1: {}

  color-convert@1.9.3:
    dependencies:
      color-name: 1.1.3

  color-convert@2.0.1:
    dependencies:
      color-name: 1.1.4

  color-name@1.1.3: {}

  color-name@1.1.4: {}

  combined-stream@1.0.8:
    dependencies:
      delayed-stream: 1.0.0

  compare-versions@6.1.1: {}

  concat-map@0.0.1: {}

  concurrently@8.2.2:
    dependencies:
      chalk: 4.1.2
      date-fns: 2.30.0
      lodash: 4.17.21
      rxjs: 7.8.1
      shell-quote: 1.8.1
      spawn-command: 0.0.2
      supports-color: 8.1.1
      tree-kill: 1.2.2
      yargs: 17.7.2

  confbox@0.1.7: {}

  confbox@0.1.8: {}

  confbox@0.2.1: {}

  convert-source-map@2.0.0: {}

  cross-spawn@7.0.3:
    dependencies:
      path-key: 3.1.1
      shebang-command: 2.0.0
      which: 2.0.2

  cssesc@3.0.0: {}

  cssstyle@4.0.1:
    dependencies:
      rrweb-cssom: 0.6.0

  csstype@3.1.3: {}

  data-urls@5.0.0:
    dependencies:
      whatwg-mimetype: 4.0.0
      whatwg-url: 14.0.0

  date-fns@2.30.0:
    dependencies:
      '@babel/runtime': 7.24.5

  de-indent@1.0.2: {}

  debug@4.3.4:
    dependencies:
      ms: 2.1.2

  debug@4.4.0:
    dependencies:
      ms: 2.1.3

  decimal.js@10.4.3: {}

  deep-eql@4.1.3:
    dependencies:
      type-detect: 4.0.8

  deep-is@0.1.4: {}

  delayed-stream@1.0.0: {}

  detect-libc@2.0.3: {}

  diff-sequences@29.6.3: {}

  dir-glob@3.0.1:
    dependencies:
      path-type: 4.0.0

  doctrine@3.0.0:
    dependencies:
      esutils: 2.0.3

  dts-bundle-generator@9.5.1:
    dependencies:
      typescript: 5.8.2
      yargs: 17.7.2

  electron-to-chromium@1.4.773: {}

  emoji-regex@8.0.0: {}

  entities@4.5.0: {}

  esbuild-css-modules-plugin@3.1.4(esbuild@0.21.3):
    dependencies:
      esbuild: 0.21.3
      lightningcss: 1.29.3
      lodash-es: 4.17.21

  esbuild-plugin-solid@0.6.0(esbuild@0.21.3)(solid-js@1.8.17):
    dependencies:
      '@babel/core': 7.24.5
      '@babel/preset-typescript': 7.24.1(@babel/core@7.24.5)
      babel-preset-solid: 1.8.17(@babel/core@7.24.5)
      esbuild: 0.21.3
      solid-js: 1.8.17
    transitivePeerDependencies:
      - supports-color

  esbuild@0.20.2:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.20.2
      '@esbuild/android-arm': 0.20.2
      '@esbuild/android-arm64': 0.20.2
      '@esbuild/android-x64': 0.20.2
      '@esbuild/darwin-arm64': 0.20.2
      '@esbuild/darwin-x64': 0.20.2
      '@esbuild/freebsd-arm64': 0.20.2
      '@esbuild/freebsd-x64': 0.20.2
      '@esbuild/linux-arm': 0.20.2
      '@esbuild/linux-arm64': 0.20.2
      '@esbuild/linux-ia32': 0.20.2
      '@esbuild/linux-loong64': 0.20.2
      '@esbuild/linux-mips64el': 0.20.2
      '@esbuild/linux-ppc64': 0.20.2
      '@esbuild/linux-riscv64': 0.20.2
      '@esbuild/linux-s390x': 0.20.2
      '@esbuild/linux-x64': 0.20.2
      '@esbuild/netbsd-x64': 0.20.2
      '@esbuild/openbsd-x64': 0.20.2
      '@esbuild/sunos-x64': 0.20.2
      '@esbuild/win32-arm64': 0.20.2
      '@esbuild/win32-ia32': 0.20.2
      '@esbuild/win32-x64': 0.20.2

  esbuild@0.21.3:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.21.3
      '@esbuild/android-arm': 0.21.3
      '@esbuild/android-arm64': 0.21.3
      '@esbuild/android-x64': 0.21.3
      '@esbuild/darwin-arm64': 0.21.3
      '@esbuild/darwin-x64': 0.21.3
      '@esbuild/freebsd-arm64': 0.21.3
      '@esbuild/freebsd-x64': 0.21.3
      '@esbuild/linux-arm': 0.21.3
      '@esbuild/linux-arm64': 0.21.3
      '@esbuild/linux-ia32': 0.21.3
      '@esbuild/linux-loong64': 0.21.3
      '@esbuild/linux-mips64el': 0.21.3
      '@esbuild/linux-ppc64': 0.21.3
      '@esbuild/linux-riscv64': 0.21.3
      '@esbuild/linux-s390x': 0.21.3
      '@esbuild/linux-x64': 0.21.3
      '@esbuild/netbsd-x64': 0.21.3
      '@esbuild/openbsd-x64': 0.21.3
      '@esbuild/sunos-x64': 0.21.3
      '@esbuild/win32-arm64': 0.21.3
      '@esbuild/win32-ia32': 0.21.3
      '@esbuild/win32-x64': 0.21.3

  escalade@3.1.2: {}

  escape-string-regexp@1.0.5: {}

  escape-string-regexp@4.0.0: {}

  eslint-plugin-eslint-comments@3.2.0(eslint@8.57.0):
    dependencies:
      escape-string-regexp: 1.0.5
      eslint: 8.57.0
      ignore: 5.3.1

  eslint-plugin-no-only-tests@3.1.0: {}

  eslint-scope@7.2.2:
    dependencies:
      esrecurse: 4.3.0
      estraverse: 5.3.0

  eslint-visitor-keys@3.4.3: {}

  eslint@8.57.0:
    dependencies:
      '@eslint-community/eslint-utils': 4.4.0(eslint@8.57.0)
      '@eslint-community/regexpp': 4.10.0
      '@eslint/eslintrc': 2.1.4
      '@eslint/js': 8.57.0
      '@humanwhocodes/config-array': 0.11.14
      '@humanwhocodes/module-importer': 1.0.1
      '@nodelib/fs.walk': 1.2.8
      '@ungap/structured-clone': 1.2.0
      ajv: 6.12.6
      chalk: 4.1.2
      cross-spawn: 7.0.3
      debug: 4.3.4
      doctrine: 3.0.0
      escape-string-regexp: 4.0.0
      eslint-scope: 7.2.2
      eslint-visitor-keys: 3.4.3
      espree: 9.6.1
      esquery: 1.5.0
      esutils: 2.0.3
      fast-deep-equal: 3.1.3
      file-entry-cache: 6.0.1
      find-up: 5.0.0
      glob-parent: 6.0.2
      globals: 13.24.0
      graphemer: 1.4.0
      ignore: 5.3.1
      imurmurhash: 0.1.4
      is-glob: 4.0.3
      is-path-inside: 3.0.3
      js-yaml: 4.1.0
      json-stable-stringify-without-jsonify: 1.0.1
      levn: 0.4.1
      lodash.merge: 4.6.2
      minimatch: 3.1.2
      natural-compare: 1.4.0
      optionator: 0.9.4
      strip-ansi: 6.0.1
      text-table: 0.2.0
    transitivePeerDependencies:
      - supports-color

  espree@9.6.1:
    dependencies:
      acorn: 8.11.3
      acorn-jsx: 5.3.2(acorn@8.11.3)
      eslint-visitor-keys: 3.4.3

  esquery@1.5.0:
    dependencies:
      estraverse: 5.3.0

  esrecurse@4.3.0:
    dependencies:
      estraverse: 5.3.0

  estraverse@5.3.0: {}

  estree-walker@2.0.2: {}

  estree-walker@3.0.3:
    dependencies:
      '@types/estree': 1.0.5

  esutils@2.0.3: {}

  execa@8.0.1:
    dependencies:
      cross-spawn: 7.0.3
      get-stream: 8.0.1
      human-signals: 5.0.0
      is-stream: 3.0.0
      merge-stream: 2.0.0
      npm-run-path: 5.3.0
      onetime: 6.0.0
      signal-exit: 4.1.0
      strip-final-newline: 3.0.0

  exsolve@1.0.4: {}

  fast-deep-equal@3.1.3: {}

  fast-glob@3.3.2:
    dependencies:
      '@nodelib/fs.stat': 2.0.5
      '@nodelib/fs.walk': 1.2.8
      glob-parent: 5.1.2
      merge2: 1.4.1
      micromatch: 4.0.5

  fast-json-stable-stringify@2.1.0: {}

  fast-levenshtein@2.0.6: {}

  fastq@1.17.1:
    dependencies:
      reusify: 1.0.4

  file-entry-cache@6.0.1:
    dependencies:
      flat-cache: 3.2.0

  fill-range@7.0.1:
    dependencies:
      to-regex-range: 5.0.1

  find-up@5.0.0:
    dependencies:
      locate-path: 6.0.0
      path-exists: 4.0.0

  flat-cache@3.2.0:
    dependencies:
      flatted: 3.3.1
      keyv: 4.5.4
      rimraf: 3.0.2

  flatted@3.3.1: {}

  form-data@4.0.0:
    dependencies:
      asynckit: 0.4.0
      combined-stream: 1.0.8
      mime-types: 2.1.35

  fs-extra@11.3.0:
    dependencies:
      graceful-fs: 4.2.11
      jsonfile: 6.1.0
      universalify: 2.0.1

  fs.realpath@1.0.0: {}

  fsevents@2.3.3:
    optional: true

  function-bind@1.1.2: {}

  gensync@1.0.0-beta.2: {}

  get-caller-file@2.0.5: {}

  get-func-name@2.0.2: {}

  get-stream@8.0.1: {}

  glob-parent@5.1.2:
    dependencies:
      is-glob: 4.0.3

  glob-parent@6.0.2:
    dependencies:
      is-glob: 4.0.3

  glob@7.2.3:
    dependencies:
      fs.realpath: 1.0.0
      inflight: 1.0.6
      inherits: 2.0.4
      minimatch: 3.1.2
      once: 1.4.0
      path-is-absolute: 1.0.1

  globals@11.12.0: {}

  globals@13.24.0:
    dependencies:
      type-fest: 0.20.2

  globby@11.1.0:
    dependencies:
      array-union: 2.1.0
      dir-glob: 3.0.1
      fast-glob: 3.3.2
      ignore: 5.3.1
      merge2: 1.4.1
      slash: 3.0.0

  globrex@0.1.2: {}

  graceful-fs@4.2.11: {}

  graphemer@1.4.0: {}

  has-flag@3.0.0: {}

  has-flag@4.0.0: {}

  hasown@2.0.2:
    dependencies:
      function-bind: 1.1.2

  he@1.2.0: {}

  html-encoding-sniffer@4.0.0:
    dependencies:
      whatwg-encoding: 3.1.1

  html-entities@2.3.3: {}

  http-proxy-agent@7.0.2:
    dependencies:
      agent-base: 7.1.1
      debug: 4.3.4
    transitivePeerDependencies:
      - supports-color

  https-proxy-agent@7.0.4:
    dependencies:
      agent-base: 7.1.1
      debug: 4.3.4
    transitivePeerDependencies:
      - supports-color

  human-signals@5.0.0: {}

  iconv-lite@0.6.3:
    dependencies:
      safer-buffer: 2.1.2

  ignore@5.3.1: {}

  import-fresh@3.3.0:
    dependencies:
      parent-module: 1.0.1
      resolve-from: 4.0.0

  import-lazy@4.0.0: {}

  imurmurhash@0.1.4: {}

  inflight@1.0.6:
    dependencies:
      once: 1.4.0
      wrappy: 1.0.2

  inherits@2.0.4: {}

  is-core-module@2.16.1:
    dependencies:
      hasown: 2.0.2

  is-extglob@2.1.1: {}

  is-fullwidth-code-point@3.0.0: {}

  is-glob@4.0.3:
    dependencies:
      is-extglob: 2.1.1

  is-number@7.0.0: {}

  is-path-inside@3.0.3: {}

  is-potential-custom-element-name@1.0.1: {}

  is-stream@3.0.0: {}

  is-what@4.1.16: {}

  isexe@2.0.0: {}

  jju@1.4.0: {}

  js-tokens@4.0.0: {}

  js-tokens@9.0.0: {}

  js-yaml@4.1.0:
    dependencies:
      argparse: 2.0.1

  jsdom@24.0.0:
    dependencies:
      cssstyle: 4.0.1
      data-urls: 5.0.0
      decimal.js: 10.4.3
      form-data: 4.0.0
      html-encoding-sniffer: 4.0.0
      http-proxy-agent: 7.0.2
      https-proxy-agent: 7.0.4
      is-potential-custom-element-name: 1.0.1
      nwsapi: 2.2.10
      parse5: 7.1.2
      rrweb-cssom: 0.6.0
      saxes: 6.0.0
      symbol-tree: 3.2.4
      tough-cookie: 4.1.4
      w3c-xmlserializer: 5.0.0
      webidl-conversions: 7.0.0
      whatwg-encoding: 3.1.1
      whatwg-mimetype: 4.0.0
      whatwg-url: 14.0.0
      ws: 8.17.0
      xml-name-validator: 5.0.0
    transitivePeerDependencies:
      - bufferutil
      - supports-color
      - utf-8-validate

  jsesc@2.5.2: {}

  json-buffer@3.0.1: {}

  json-schema-traverse@0.4.1: {}

  json-schema-traverse@1.0.0: {}

  json-stable-stringify-without-jsonify@1.0.1: {}

  json5@2.2.3: {}

  jsonfile@6.1.0:
    dependencies:
      universalify: 2.0.1
    optionalDependencies:
      graceful-fs: 4.2.11

  keyv@4.5.4:
    dependencies:
      json-buffer: 3.0.1

  kolorist@1.8.0: {}

  levn@0.4.1:
    dependencies:
      prelude-ls: 1.2.1
      type-check: 0.4.0

  lightningcss-darwin-arm64@1.29.3:
    optional: true

  lightningcss-darwin-x64@1.29.3:
    optional: true

  lightningcss-freebsd-x64@1.29.3:
    optional: true

  lightningcss-linux-arm-gnueabihf@1.29.3:
    optional: true

  lightningcss-linux-arm64-gnu@1.29.3:
    optional: true

  lightningcss-linux-arm64-musl@1.29.3:
    optional: true

  lightningcss-linux-x64-gnu@1.29.3:
    optional: true

  lightningcss-linux-x64-musl@1.29.3:
    optional: true

  lightningcss-win32-arm64-msvc@1.29.3:
    optional: true

  lightningcss-win32-x64-msvc@1.29.3:
    optional: true

  lightningcss@1.29.3:
    dependencies:
      detect-libc: 2.0.3
    optionalDependencies:
      lightningcss-darwin-arm64: 1.29.3
      lightningcss-darwin-x64: 1.29.3
      lightningcss-freebsd-x64: 1.29.3
      lightningcss-linux-arm-gnueabihf: 1.29.3
      lightningcss-linux-arm64-gnu: 1.29.3
      lightningcss-linux-arm64-musl: 1.29.3
      lightningcss-linux-x64-gnu: 1.29.3
      lightningcss-linux-x64-musl: 1.29.3
      lightningcss-win32-arm64-msvc: 1.29.3
      lightningcss-win32-x64-msvc: 1.29.3

  local-pkg@0.5.0:
    dependencies:
      mlly: 1.7.0
      pkg-types: 1.1.1

  local-pkg@1.1.1:
    dependencies:
      mlly: 1.7.4
      pkg-types: 2.1.0
      quansync: 0.2.10

  locate-path@6.0.0:
    dependencies:
      p-locate: 5.0.0

  lodash-es@4.17.21: {}

  lodash.merge@4.6.2: {}

  lodash@4.17.21: {}

  loupe@2.3.7:
    dependencies:
      get-func-name: 2.0.2

  lowclass@8.0.2: {}

  lru-cache@5.1.1:
    dependencies:
      yallist: 3.1.1

  lru-cache@6.0.0:
    dependencies:
      yallist: 4.0.0

  magic-string@0.30.10:
    dependencies:
      '@jridgewell/sourcemap-codec': 1.4.15

  magic-string@0.30.17:
    dependencies:
      '@jridgewell/sourcemap-codec': 1.5.0

  merge-anything@5.1.7:
    dependencies:
      is-what: 4.1.16

  merge-stream@2.0.0: {}

  merge2@1.4.1: {}

  micromatch@4.0.5:
    dependencies:
      braces: 3.0.2
      picomatch: 2.3.1

  mime-db@1.52.0: {}

  mime-types@2.1.35:
    dependencies:
      mime-db: 1.52.0

  mimic-fn@4.0.0: {}

  minimatch@3.0.8:
    dependencies:
      brace-expansion: 1.1.11

  minimatch@3.1.2:
    dependencies:
      brace-expansion: 1.1.11

  minimatch@9.0.4:
    dependencies:
      brace-expansion: 2.0.1

  mlly@1.7.0:
    dependencies:
      acorn: 8.11.3
      pathe: 1.1.2
      pkg-types: 1.1.1
      ufo: 1.5.3

  mlly@1.7.4:
    dependencies:
      acorn: 8.14.1
      pathe: 2.0.3
      pkg-types: 1.3.1
      ufo: 1.5.4

  ms@2.1.2: {}

  ms@2.1.3: {}

  muggle-string@0.4.1: {}

  nanoid@3.3.7: {}

  natural-compare@1.4.0: {}

  node-releases@2.0.14: {}

  npm-run-path@5.3.0:
    dependencies:
      path-key: 4.0.0

  nwsapi@2.2.10: {}

  once@1.4.0:
    dependencies:
      wrappy: 1.0.2

  onetime@6.0.0:
    dependencies:
      mimic-fn: 4.0.0

  optionator@0.9.4:
    dependencies:
      deep-is: 0.1.4
      fast-levenshtein: 2.0.6
      levn: 0.4.1
      prelude-ls: 1.2.1
      type-check: 0.4.0
      word-wrap: 1.2.5

  p-limit@3.1.0:
    dependencies:
      yocto-queue: 0.1.0

  p-limit@5.0.0:
    dependencies:
      yocto-queue: 1.0.0

  p-locate@5.0.0:
    dependencies:
      p-limit: 3.1.0

  parent-module@1.0.1:
    dependencies:
      callsites: 3.1.0

  parse5@7.1.2:
    dependencies:
      entities: 4.5.0

  path-browserify@1.0.1: {}

  path-exists@4.0.0: {}

  path-is-absolute@1.0.1: {}

  path-key@3.1.1: {}

  path-key@4.0.0: {}

  path-parse@1.0.7: {}

  path-type@4.0.0: {}

  pathe@1.1.2: {}

  pathe@2.0.3: {}

  pathval@1.1.1: {}

  picocolors@1.0.1: {}

  picocolors@1.1.1: {}

  picomatch@2.3.1: {}

  picomatch@4.0.2: {}

  pkg-types@1.1.1:
    dependencies:
      confbox: 0.1.7
      mlly: 1.7.0
      pathe: 1.1.2

  pkg-types@1.3.1:
    dependencies:
      confbox: 0.1.8
      mlly: 1.7.4
      pathe: 2.0.3

  pkg-types@2.1.0:
    dependencies:
      confbox: 0.2.1
      exsolve: 1.0.4
      pathe: 2.0.3

  postcss-selector-parser@6.1.2:
    dependencies:
      cssesc: 3.0.0
      util-deprecate: 1.0.2

  postcss@8.4.38:
    dependencies:
      nanoid: 3.3.7
      picocolors: 1.0.1
      source-map-js: 1.2.0

  prelude-ls@1.2.1: {}

  prettier@3.0.0: {}

  pretty-format@29.7.0:
    dependencies:
      '@jest/schemas': 29.6.3
      ansi-styles: 5.2.0
      react-is: 18.3.1

  psl@1.9.0: {}

  punycode@2.3.1: {}

  quansync@0.2.10: {}

  querystringify@2.2.0: {}

  queue-microtask@1.2.3: {}

  react-is@18.3.1: {}

  regenerator-runtime@0.14.1: {}

  require-directory@2.1.1: {}

  require-from-string@2.0.2: {}

  requires-port@1.0.0: {}

  resolve-from@4.0.0: {}

  resolve@1.22.10:
    dependencies:
      is-core-module: 2.16.1
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0

  reusify@1.0.4: {}

  rimraf@3.0.2:
    dependencies:
      glob: 7.2.3

  rollup@4.17.2:
    dependencies:
      '@types/estree': 1.0.5
    optionalDependencies:
      '@rollup/rollup-android-arm-eabi': 4.17.2
      '@rollup/rollup-android-arm64': 4.17.2
      '@rollup/rollup-darwin-arm64': 4.17.2
      '@rollup/rollup-darwin-x64': 4.17.2
      '@rollup/rollup-linux-arm-gnueabihf': 4.17.2
      '@rollup/rollup-linux-arm-musleabihf': 4.17.2
      '@rollup/rollup-linux-arm64-gnu': 4.17.2
      '@rollup/rollup-linux-arm64-musl': 4.17.2
      '@rollup/rollup-linux-powerpc64le-gnu': 4.17.2
      '@rollup/rollup-linux-riscv64-gnu': 4.17.2
      '@rollup/rollup-linux-s390x-gnu': 4.17.2
      '@rollup/rollup-linux-x64-gnu': 4.17.2
      '@rollup/rollup-linux-x64-musl': 4.17.2
      '@rollup/rollup-win32-arm64-msvc': 4.17.2
      '@rollup/rollup-win32-ia32-msvc': 4.17.2
      '@rollup/rollup-win32-x64-msvc': 4.17.2
      fsevents: 2.3.3

  rrweb-cssom@0.6.0: {}

  run-parallel@1.2.0:
    dependencies:
      queue-microtask: 1.2.3

  rxjs@7.8.1:
    dependencies:
      tslib: 2.6.2

  safer-buffer@2.1.2: {}

  saxes@6.0.0:
    dependencies:
      xmlchars: 2.2.0

  semver@6.3.1: {}

  semver@7.5.4:
    dependencies:
      lru-cache: 6.0.0

  semver@7.6.2: {}

  seroval-plugins@1.0.7(seroval@1.0.7):
    dependencies:
      seroval: 1.0.7

  seroval@1.0.7: {}

  shebang-command@2.0.0:
    dependencies:
      shebang-regex: 3.0.0

  shebang-regex@3.0.0: {}

  shell-quote@1.8.1: {}

  siginfo@2.0.0: {}

  signal-exit@4.1.0: {}

  slash@3.0.0: {}

  solid-js@1.8.17:
    dependencies:
      csstype: 3.1.3
      seroval: 1.0.7
      seroval-plugins: 1.0.7(seroval@1.0.7)

  solid-refresh@0.6.3(solid-js@1.8.17):
    dependencies:
      '@babel/generator': 7.24.5
      '@babel/helper-module-imports': 7.24.3
      '@babel/types': 7.24.5
      solid-js: 1.8.17

  source-map-js@1.2.0: {}

  source-map@0.6.1: {}

  spawn-command@0.0.2: {}

  sprintf-js@1.0.3: {}

  stackback@0.0.2: {}

  std-env@3.7.0: {}

  string-argv@0.3.2: {}

  string-width@4.2.3:
    dependencies:
      emoji-regex: 8.0.0
      is-fullwidth-code-point: 3.0.0
      strip-ansi: 6.0.1

  strip-ansi@6.0.1:
    dependencies:
      ansi-regex: 5.0.1

  strip-final-newline@3.0.0: {}

  strip-json-comments@3.1.1: {}

  strip-literal@2.1.0:
    dependencies:
      js-tokens: 9.0.0

  supports-color@5.5.0:
    dependencies:
      has-flag: 3.0.0

  supports-color@7.2.0:
    dependencies:
      has-flag: 4.0.0

  supports-color@8.1.1:
    dependencies:
      has-flag: 4.0.0

  supports-preserve-symlinks-flag@1.0.0: {}

  symbol-tree@3.2.4: {}

  text-table@0.2.0: {}

  tinybench@2.8.0: {}

  tinypool@0.8.4: {}

  tinyspy@2.2.1: {}

  tm-textarea@0.1.1(@babel/core@7.24.5)(@types/react@19.0.12)(solid-js@1.8.17):
    dependencies:
      '@lume/element': 0.13.1(@babel/core@7.24.5)(@types/react@19.0.12)
      '@solid-primitives/memo': 1.4.1(solid-js@1.8.17)
      classy-solid: 0.4.3
      clsx: 2.1.1
      solid-js: 1.8.17
      vscode-oniguruma: 2.0.1
      vscode-textmate: 9.2.0
    transitivePeerDependencies:
      - '@babel/core'
      - '@types/react'

  to-fast-properties@2.0.0: {}

  to-regex-range@5.0.1:
    dependencies:
      is-number: 7.0.0

  tough-cookie@4.1.4:
    dependencies:
      psl: 1.9.0
      punycode: 2.3.1
      universalify: 0.2.0
      url-parse: 1.5.10

  tr46@5.0.0:
    dependencies:
      punycode: 2.3.1

  tree-kill@1.2.2: {}

  ts-api-utils@1.3.0(typescript@5.4.5):
    dependencies:
      typescript: 5.4.5

  tsconfck@3.1.5(typescript@5.4.5):
    optionalDependencies:
      typescript: 5.4.5

  tslib@2.6.2: {}

  type-check@0.4.0:
    dependencies:
      prelude-ls: 1.2.1

  type-detect@4.0.8: {}

  type-fest@0.20.2: {}

  typescript@5.4.5: {}

  typescript@5.8.2: {}

  ufo@1.5.3: {}

  ufo@1.5.4: {}

  undici-types@5.26.5: {}

  universalify@0.2.0: {}

  universalify@2.0.1: {}

  update-browserslist-db@1.0.16(browserslist@4.23.0):
    dependencies:
      browserslist: 4.23.0
      escalade: 3.1.2
      picocolors: 1.0.1

  uri-js@4.4.1:
    dependencies:
      punycode: 2.3.1

  url-parse@1.5.10:
    dependencies:
      querystringify: 2.2.0
      requires-port: 1.0.0

  util-deprecate@1.0.2: {}

  validate-html-nesting@1.2.2: {}

  vite-node@1.6.0(@types/node@20.12.12)(lightningcss@1.29.3):
    dependencies:
      cac: 6.7.14
      debug: 4.3.4
      pathe: 1.1.2
      picocolors: 1.0.1
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
    transitivePeerDependencies:
      - '@types/node'
      - less
      - lightningcss
      - sass
      - stylus
      - sugarss
      - supports-color
      - terser

  vite-plugin-css-classnames@0.0.2(@types/node@20.12.12)(postcss@8.4.38)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      '@types/node': 20.12.12
      postcss: 8.4.38
      postcss-selector-parser: 6.1.2
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)

  vite-plugin-dts-bundle-generator@2.1.0(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      dts-bundle-generator: 9.5.1
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)

  vite-plugin-dts@4.5.3(@types/node@20.12.12)(rollup@4.17.2)(typescript@5.4.5)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      '@microsoft/api-extractor': 7.52.2(@types/node@20.12.12)
      '@rollup/pluginutils': 5.1.4(rollup@4.17.2)
      '@volar/typescript': 2.4.12
      '@vue/language-core': 2.2.0(typescript@5.4.5)
      compare-versions: 6.1.1
      debug: 4.4.0
      kolorist: 1.8.0
      local-pkg: 1.1.1
      magic-string: 0.30.17
      typescript: 5.4.5
    optionalDependencies:
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
    transitivePeerDependencies:
      - '@types/node'
      - rollup
      - supports-color

  vite-plugin-lib-inject-css@2.2.1(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      '@ast-grep/napi': 0.32.3
      magic-string: 0.30.17
      picocolors: 1.1.1
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)

  vite-plugin-solid@2.10.2(solid-js@1.8.17)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      '@babel/core': 7.24.5
      '@types/babel__core': 7.20.5
      babel-preset-solid: 1.8.17(@babel/core@7.24.5)
      merge-anything: 5.1.7
      solid-js: 1.8.17
      solid-refresh: 0.6.3(solid-js@1.8.17)
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
      vitefu: 0.2.5(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3))
    transitivePeerDependencies:
      - supports-color

  vite-tsconfig-paths@5.1.4(typescript@5.4.5)(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    dependencies:
      debug: 4.3.4
      globrex: 0.1.2
      tsconfck: 3.1.5(typescript@5.4.5)
    optionalDependencies:
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
    transitivePeerDependencies:
      - supports-color
      - typescript

  vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3):
    dependencies:
      esbuild: 0.20.2
      postcss: 8.4.38
      rollup: 4.17.2
    optionalDependencies:
      '@types/node': 20.12.12
      fsevents: 2.3.3
      lightningcss: 1.29.3

  vitefu@0.2.5(vite@5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)):
    optionalDependencies:
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)

  vitest@1.6.0(@types/node@20.12.12)(jsdom@24.0.0)(lightningcss@1.29.3):
    dependencies:
      '@vitest/expect': 1.6.0
      '@vitest/runner': 1.6.0
      '@vitest/snapshot': 1.6.0
      '@vitest/spy': 1.6.0
      '@vitest/utils': 1.6.0
      acorn-walk: 8.3.2
      chai: 4.4.1
      debug: 4.3.4
      execa: 8.0.1
      local-pkg: 0.5.0
      magic-string: 0.30.10
      pathe: 1.1.2
      picocolors: 1.0.1
      std-env: 3.7.0
      strip-literal: 2.1.0
      tinybench: 2.8.0
      tinypool: 0.8.4
      vite: 5.2.11(@types/node@20.12.12)(lightningcss@1.29.3)
      vite-node: 1.6.0(@types/node@20.12.12)(lightningcss@1.29.3)
      why-is-node-running: 2.2.2
    optionalDependencies:
      '@types/node': 20.12.12
      jsdom: 24.0.0
    transitivePeerDependencies:
      - less
      - lightningcss
      - sass
      - stylus
      - sugarss
      - supports-color
      - terser

  vscode-oniguruma@2.0.1: {}

  vscode-textmate@9.2.0: {}

  vscode-uri@3.1.0: {}

  w3c-xmlserializer@5.0.0:
    dependencies:
      xml-name-validator: 5.0.0

  webidl-conversions@7.0.0: {}

  whatwg-encoding@3.1.1:
    dependencies:
      iconv-lite: 0.6.3

  whatwg-mimetype@4.0.0: {}

  whatwg-url@14.0.0:
    dependencies:
      tr46: 5.0.0
      webidl-conversions: 7.0.0

  which@2.0.2:
    dependencies:
      isexe: 2.0.0

  why-is-node-running@2.2.2:
    dependencies:
      siginfo: 2.0.0
      stackback: 0.0.2

  word-wrap@1.2.5: {}

  wrap-ansi@7.0.0:
    dependencies:
      ansi-styles: 4.3.0
      string-width: 4.2.3
      strip-ansi: 6.0.1

  wrappy@1.0.2: {}

  ws@8.17.0: {}

  xml-name-validator@5.0.0: {}

  xmlchars@2.2.0: {}

  y18n@5.0.8: {}

  yallist@3.1.1: {}

  yallist@4.0.0: {}

  yargs-parser@21.1.1: {}

  yargs@17.7.2:
    dependencies:
      cliui: 8.0.1
      escalade: 3.1.2
      get-caller-file: 2.0.5
      require-directory: 2.1.1
      string-width: 4.2.3
      y18n: 5.0.8
      yargs-parser: 21.1.1

  yocto-queue@0.1.0: {}

  yocto-queue@1.0.0: {}
`,__vite_glob_0_12=`import { createSignal, type Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { PathUtils } from './utils'

/**********************************************************************************/
/*                                                                                */
/*                                      Types                                     */
/*                                                                                */
/**********************************************************************************/

interface File<T> {
  type: 'file'
  get: Accessor<T>
  set(value: T): void
}
interface Dir {
  type: 'dir'
}

type DirEnt<T> = File<T> | Dir

export type FileSystem<T> = ReturnType<typeof createFileSystem<T>>

/**********************************************************************************/
/*                                                                                */
/*                                   Create File                                  */
/*                                                                                */
/**********************************************************************************/

export function createFile<T>(initial: T): File<T> {
  const [get, set] = createSignal<T>(initial)

  return {
    type: 'file',
    get,
    set,
  }
}

/**********************************************************************************/
/*                                                                                */
/*                               Create File System                               */
/*                                                                                */
/**********************************************************************************/

export function createFileSystem<T = string>() {
  const [dirEnts, setDirEnts] = createStore<Record<string, DirEnt<T>>>({})

  function assertPathExists(path: string) {
    const parts = path.split('/')
    const pathExists = parts
      .map((_, index) => parts.slice(0, index + 1).join('/'))
      .filter(Boolean)
      .every(path => path in dirEnts)

    if (!pathExists) {
      throw \`Path is invalid \${path}\`
    }
  }

  function readdir(
    path: string,
    options: { withFileTypes: true },
  ): Array<{ type: 'dir' | 'file'; path: string }>
  function readdir(path: string): Array<string>
  function readdir(path: string, options?: { withFileTypes?: boolean }) {
    path = PathUtils.normalize(path)

    assertPathExists(path)

    if (options?.withFileTypes) {
      return Object.entries(dirEnts)
        .filter(([_path]) => PathUtils.getParent(_path) === path && _path !== path)
        .map(([path, file]) => ({
          type: file.type,
          path,
        }))
    }

    return Object.keys(dirEnts).filter(_path => PathUtils.getParent(_path) === path)
  }

  const fs = {
    exists(path: string) {
      return path in dirEnts
    },
    getType(path: string): DirEnt<T>['type'] {
      path = PathUtils.normalize(path)

      assertPathExists(path)

      return dirEnts[path]!.type
    },
    readdir,
    mkdir(path: string, options?: { recursive?: boolean }) {
      path = PathUtils.normalize(path)

      if (options?.recursive) {
        const parts = path.split('/')
        parts.forEach((_, index) => {
          setDirEnts(parts.slice(0, index).join('/'), { type: 'dir' })
        })
        return
      }

      assertPathExists(PathUtils.getParent(path))

      setDirEnts(path, { type: 'dir' })
    },
    readFile(path: string) {
      path = PathUtils.normalize(path)

      assertPathExists(path)

      const dirEnt = dirEnts[path]!

      if (dirEnt.type === 'dir') {
        throw \`Path is not a file \${path}\`
      }

      return dirEnt.get()
    },
    rename(previous: string, next: string) {
      previous = PathUtils.normalize(previous)
      next = PathUtils.normalize(next)

      if (fs.exists(next)) {
        console.error(dirEnts)
        throw \`Path \${next} already exists.\`
      }

      if (!fs.exists(previous)) {
        console.error(\`Path does not exist: \${previous}\`)
        return
      }

      setDirEnts(
        produce(files => {
          Object.keys(dirEnts).forEach(path => {
            if (PathUtils.isAncestor(path, previous) || path === previous) {
              const newPath = path.replace(previous, next)
              const file = files[path]!
              files[newPath] = file
              delete files[path]
            }
          })
        }),
      )
    },
    rm(path: string, options?: { force?: boolean; recursive?: boolean }) {
      path = PathUtils.normalize(path)

      if (!options || !options.force) {
        assertPathExists(path)
      }

      if (!options || !options.recursive) {
        const _dirEnts = Object.keys(dirEnts).filter(value => {
          if (value === path) return false
          return value.includes(path)
        })

        if (_dirEnts.length > 0) {
          throw \`Directory is not empty \${_dirEnts}\`
        }
      }

      setDirEnts(
        produce(files => {
          Object.keys(files)
            .filter(value => value.includes(path))
            .forEach(path => delete files[path])
        }),
      )
    },
    writeFile(path: string, source: T) {
      path = PathUtils.normalize(path)
      assertPathExists(PathUtils.getParent(path))

      const dirEnt = dirEnts[path]

      if (dirEnt?.type === 'dir') {
        throw \`A directory already exist with the same name: \${path}\`
      }

      if (dirEnt) {
        dirEnt.set(source)
      } else {
        setDirEnts(path, createFile(source))
      }
    },
  }

  return fs
}
`,__vite_glob_0_13=`.container {
  position: relative;
}

.elbow {
  position: absolute;
  left: calc(50% - 0.5px);
  border-bottom: 1px solid var(--color);
  border-left: 1px solid var(--color);
  border-bottom-left-radius: 2px;
  width: calc(50% - 0.5px);
  height: 50%;
}

.pipe {
  position: absolute;
  left: calc(50% - 0.5px);
  border-left: 1px solid var(--color);
  width: calc(50% - 0.5px);
  height: 100%;
}

.arm {
  position: absolute;
  left: calc(50% - 0.5px);
  border-bottom: 1px solid var(--color);
  width: calc(50% - 0.5px);
  height: 50%;
}
`,__vite_glob_0_14=`import { Match, Switch } from 'solid-js'
import { useIndentGuide } from '.'
import styles from './defaults.module.css'

export function DefaultIndentGuide(props: { color: string; width: number }) {
  const indentGuide = useIndentGuide()
  return (
    <span class={styles.container} style={{ '--color': props.color, width: \`\${props.width}px\` }}>
      <Switch>
        <Match when={indentGuide() === 'elbow'}>
          <span class={styles.elbow} />
        </Match>
        <Match when={indentGuide() === 'tee'}>
          <span class={styles.pipe} />
          <span class={styles.arm} />
        </Match>
        <Match when={indentGuide() === 'pipe'}>
          <span class={styles.pipe} />
        </Match>
      </Switch>
    </span>
  )
}
`,__vite_glob_0_15=`import { Key, keyArray } from '@solid-primitives/keyed'
import { ReactiveMap } from '@solid-primitives/map'
import {
  type Accessor,
  batch,
  type ComponentProps,
  createComputed,
  createContext,
  createEffect,
  createMemo,
  createSelector,
  createSignal,
  Index,
  type JSX,
  mapArray,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
  untrack,
  useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { CTRL_KEY, Overwrite, PathUtils, type WrapEvent } from 'src/utils'
import { type FileSystem } from '../create-file-system'

interface DirEntBase {
  id: string
  path: string
  indentation: number
  name: string
  select(): void
  shiftSelect(): void
  deselect(): void
  rename(path: string): void
  selected: boolean
  focus(): void
  blur(): void
  focused: boolean
}

interface File extends DirEntBase {
  type: 'file'
}

interface Dir extends DirEntBase {
  type: 'dir'
  expand(): void
  collapse(): void
  expanded: boolean
}

type DirEnt = File | Dir

/**********************************************************************************/
/*                                                                                */
/*                                    Contexts                                    */
/*                                                                                */
/**********************************************************************************/

interface FileTreeContext<T> {
  fs: Pick<FileSystem<T>, 'readdir' | 'rename' | 'exists'>
  base: string
  getDirEntsOfDirId(path: string): Array<DirEnt>
  // Expand/Collapse
  expandDirById(id: string): void
  collapseDirById(id: string): void
  isDirExpandedById(id: string): boolean
  // Selection
  resetSelectedDirEntIds(): void
  moveSelectedDirEntsToPath(path: string): void
  selectDirEntById(id: string): void
  shiftSelectDirEntById(id: string): void
  deselectDirEntById(id: string): void
  // Focus
  focusDirEnt(path: string): void
  blurDirEnt(path: string): void
  isDirEntFocused(path: string): boolean
  // Id Generator
  pathToId(path: string): string
}

const FileTreeContext = createContext<FileTreeContext<any>>()
export function useFileTree() {
  const context = useContext(FileTreeContext)
  if (!context) throw \`FileTreeContext is undefined\`
  return context
}

const DirEntContext = createContext<Accessor<DirEnt>>()
export function useDirEnt() {
  const context = useContext(DirEntContext)
  if (!context) throw \`DirEntContext is undefined\`
  return context
}

type IndentGuideKind = 'pipe' | 'tee' | 'elbow' | 'spacer'

const IndentGuideContext = createContext<Accessor<IndentGuideKind>>()
export function useIndentGuide() {
  const context = useContext(IndentGuideContext)
  if (!context) throw \`IndentGuideContext is undefined\`
  return context
}

/**********************************************************************************/
/*                                                                                */
/*                                createIdMiddleware                              */
/*                                                                                */
/**********************************************************************************/

type IdNode = {
  refCount: number
  id: string
}

// ID Generation Middleware
function createIdGenerator() {
  const freeIds: Array<string> = []
  const nodeMap = new ReactiveMap<string, IdNode>()
  const idToPathMap = new ReactiveMap<string, string>()
  let nextId = 0

  function createIdNode(path: string) {
    const node = {
      id: allocId(),
      refCount: 1,
    }
    nodeMap.set(path, node)
    idToPathMap.set(node.id, path)
    return node
  }
  function allocId() {
    return freeIds.pop() ?? (nextId++).toString()
  }
  function disposeId(id: string) {
    freeIds.push(id)
  }
  function addCleanup(node: IdNode, path: string) {
    onCleanup(() => {
      queueMicrotask(() => {
        node.refCount--
        if (node.refCount === 0) {
          disposeId(node.id)
          nodeMap.delete(path)
          idToPathMap.delete(node.id)
        }
      })
    })
  }

  return {
    beforeRename(oldPath: string, newPath: string) {
      let renamesToDo: { oldPath: string; newPath: string }[] = []
      for (let path of nodeMap.keys()) {
        if (
          path.length > oldPath.length &&
          path.slice(0, oldPath.length) == oldPath &&
          path[oldPath.length] == '/'
        ) {
          let postfix = path.slice(oldPath.length)
          let oldPath2 = oldPath + postfix
          let newPath2 = newPath + postfix
          renamesToDo.push({ oldPath: oldPath2, newPath: newPath2 })
        }
      }
      renamesToDo.push({ oldPath, newPath })
      for (let { oldPath: oldPath2, newPath: newPath2 } of renamesToDo) {
        const node = nodeMap.get(oldPath2)
        if (node === undefined) {
          return
        }
        nodeMap.delete(oldPath2)
        nodeMap.set(newPath2, node)
        idToPathMap.set(node.id, newPath2)
      }
    },
    obtainId(path: string): string {
      let node = nodeMap.get(path)
      if (node) {
        node.refCount++
      } else {
        node = createIdNode(path)
      }
      addCleanup(node, path)
      return node.id
    },
    freezeId(id: string) {
      const path = untrack(() => idToPathMap.get(id))
      const node = path ? nodeMap.get(path) : undefined
      if (path == undefined) {
        return
      }
      if (node !== undefined) {
        node.refCount++
        addCleanup(node, path)
      }
    },
    /**
     * Reactively converts an ID back to a path
     */
    idToPath(id: string): string {
      const path = idToPathMap.get(id)
      if (path == undefined) {
        throw new Error(\`path not found for id: \${id}\`)
      }
      return path
    },
    pathToId(path: string): string {
      let node = nodeMap.get(path)
      if (node == undefined) {
        throw new Error(\`node not found for path: \${path}\`)
      }
      return node.id
    },
  }
}

/**********************************************************************************/
/*                                                                                */
/*                                    FileTree                                    */
/*                                                                                */
/**********************************************************************************/

export type FileTreeProps<T> = Overwrite<
  ComponentProps<'div'>,
  {
    base?: string
    children: (dirEnt: Accessor<DirEnt>, fileTree: FileTreeContext<T>) => JSX.Element
    fs: Pick<FileSystem<T>, 'readdir' | 'rename' | 'exists'>
    onDragOver?(event: WrapEvent<DragEvent, HTMLDivElement>): void
    onDrop?(event: WrapEvent<DragEvent, HTMLDivElement>): void
    onRename?(oldPath: string, newPath: string): void
    onSelection?(paths: string[]): void
    selection?: Array<string>
    sort?(dirEnt1: DirEnt, dirEnt2: DirEnt): number
  }
>

export function FileTree<T>(props: FileTreeProps<T>) {
  const [config, rest] = splitProps(mergeProps({ base: '' }, props), ['fs', 'base'])

  const { obtainId, freezeId, beforeRename, idToPath, pathToId } = createIdGenerator()

  const baseId = createMemo(() => obtainId(config.base))

  // Focused DirEnt
  const [focusedDirEntId, setFocusedDirEntId] = createSignal<string | undefined>()
  const isDirEntFocusedById = createSelector(focusedDirEntId)

  function focusDirEntById(id: string) {
    setFocusedDirEntId(id)
  }
  function blurDirEntById(id: string) {
    if (focusedDirEntId() === id) {
      setFocusedDirEntId()
    }
  }

  // Selected DirEnts
  const [selectedDirEntRanges, setSelectedDirEntRanges] = createSignal<
    Array<[start: string, end?: string]>
  >([], { equals: false })

  const selectedDirEntIds = createMemo(() => {
    return selectedDirEntRanges()
      .flatMap(([start, end]) => {
        if (end) {
          const startIndex = flatTree().findIndex(dir => dir.id === start)
          const endIndex = flatTree().findIndex(dir => dir.id === end)

          return flatTree()
            .slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)
            .map(dirEnt => dirEnt.id)
        }
        return start
      })
      .sort((a, b) => (a < b ? -1 : 1))
  })

  const isDirEntSelectedById = createSelector(selectedDirEntIds, (id: string, dirs) =>
    dirs.includes(id),
  )

  // Selection-methods
  function selectDirEntById(id: string) {
    setSelectedDirEntRanges(dirEnts => [...dirEnts, [id]])
  }
  function deselectDirEntById(id: string) {
    setSelectedDirEntRanges(
      pairs =>
        pairs
          .map(dirEnts => dirEnts.filter(dirEnt => dirEnt !== id))
          .filter(pair => pair.length > 0) as [string, string?][],
    )
  }
  function shiftSelectDirEntById(id: string) {
    setSelectedDirEntRanges(dirEnts => {
      if (dirEnts.length > 0) {
        dirEnts[dirEnts.length - 1] = [dirEnts[dirEnts.length - 1]![0], id]
        return [...dirEnts]
      }
      return [[id]]
    })
  }
  function resetSelectedDirEntIds() {
    setSelectedDirEntRanges([])
  }

  // Expand/Collapse Dirs
  const [expandedDirIds, setExpandedDirIds] = createSignal<Array<string>>(new Array(), {
    equals: false,
  })

  const isDirExpandedById = createSelector(expandedDirIds, (id: string, expandedDirs) =>
    expandedDirs.includes(id),
  )

  function collapseDirById(id: string) {
    setExpandedDirIds(dirs => dirs.filter(dir => dir !== id))
  }
  function expandDirById(id: string) {
    if (id !== baseId() && !expandedDirIds().includes(id)) {
      setExpandedDirIds(ids => [...ids, id])
    }
  }

  // Record<Dir, Accessor<DirEnts>>
  const [dirEntsByDirId, setDirEntsByDirId] = createStore<Record<string, Accessor<Array<DirEnt>>>>(
    {},
  )

  function getDirEntsOfDirId(id: string) {
    return dirEntsByDirId[id]?.() || []
  }

  // Populate dirEntsByDir
  createEffect(
    mapArray(
      () => [baseId(), ...expandedDirIds()],
      id => {
        const unsortedDirEnts = createMemo<Array<Dir | File>>(
          keyArray(
            () =>
              props.fs.readdir(idToPath(id), { withFileTypes: true }).map(dirEnt => ({
                id: obtainId(dirEnt.path),
                type: dirEnt.type,
              })),
            dirEnt => dirEnt.id,
            dirEnt => {
              const indentation = createMemo(() => getIndentationFromPath(idToPath(dirEnt().id)))
              const name = createMemo(() => PathUtils.getName(idToPath(dirEnt().id))!)

              return {
                id: dirEnt().id,
                get type() {
                  return dirEnt().type
                },
                get path() {
                  return idToPath(dirEnt().id)
                },
                get indentation() {
                  return indentation()
                },
                get name() {
                  return name()
                },
                select() {
                  selectDirEntById(dirEnt().id)
                },
                deselect() {
                  deselectDirEntById(dirEnt().id)
                },
                shiftSelect() {
                  shiftSelectDirEntById(dirEnt().id)
                },
                get selected() {
                  return isDirEntSelectedById(dirEnt().id)
                },
                rename(newPath: string) {
                  renameDirEnt(idToPath(dirEnt().id), newPath)
                },
                focus() {
                  focusDirEntById(dirEnt().id)
                },
                blur() {
                  blurDirEntById(dirEnt().id)
                },
                get focused() {
                  return isDirEntFocusedById(dirEnt().id)
                },
                // Dir-specific API
                get expand() {
                  if (dirEnt().type === 'file') return undefined
                  return () => expandDirById(dirEnt().id)
                },
                get collapse() {
                  if (dirEnt().type === 'file') return undefined
                  return () => collapseDirById(dirEnt().id)
                },
                get expanded() {
                  if (dirEnt().type === 'file') return undefined
                  return isDirExpandedById(dirEnt().id)
                },
              } as DirEnt
            },
          ),
        )

        const sortedDirEnts = createMemo(() =>
          unsortedDirEnts().toSorted(
            props.sort ??
              ((a, b) => {
                if (a.type !== b.type) {
                  return a.type === 'dir' ? -1 : 1
                }
                return a.path.toLowerCase() < b.path.toLowerCase() ? -1 : 1
              }),
          ),
        )

        setDirEntsByDirId(id, () => sortedDirEnts)
        onCleanup(() => setDirEntsByDirId(id, undefined!))

        // Remove path from opened paths if it ceases to fs.exist
        createComputed(() => {
          if (!props.fs.exists(idToPath(id))) {
            setExpandedDirIds(dirs => dirs.filter(dir => dir !== id))
          }
        })
      },
    ),
  )

  // DirEnts as a flat list
  const flatTree = createMemo(() => {
    const list = new Array<DirEnt>()
    const idStack = [baseId()]
    while (idStack.length > 0) {
      const id = idStack.shift()!
      const dirEnts = getDirEntsOfDirId(id)
      idStack.push(
        ...dirEnts.filter(dirEnt => dirEnt.type === 'dir' && dirEnt.expanded).map(dir => dir.id),
      )
      list.splice(list.findIndex(dirEnt => dirEnt.id === id) + 1, 0, ...dirEnts)
    }
    return list
  })

  function getIndentationFromPath(path: string) {
    return path.split('/').length - config.base.split('/').length
  }

  function renameDirEnt(oldPath: string, newPath: string) {
    batch(() => {
      beforeRename(oldPath, newPath)
      props.fs.rename(oldPath, newPath)
      props.onRename?.(oldPath, newPath)
    })
  }

  function moveSelectedDirEntsToPath(targetPath: string) {
    const targetId = pathToId(targetPath)
    const ids = selectedDirEntIds()
    const paths = ids.map(idToPath)
    const existingPaths = new Array<{ newPath: string; oldPath: string }>()

    // Validate if any of the selected paths are ancestor of the target path
    for (const path of paths) {
      if (path === targetPath) {
        throw \`Cannot move \${path} into itself.\`
      }
      if (PathUtils.isAncestor(targetPath, path)) {
        throw \`Cannot move because \${path} is ancestor of \${targetPath}.\`
      }
    }

    const transforms = paths
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
      .map((oldPath, index, arr) => {
        const ancestor = arr.slice(0, index).find(path => PathUtils.isAncestor(oldPath, path))

        const newPath = (
          ancestor
            ? // If the selection contains an ancestor of the current path
              // the path is renamed relative to the ancestor
              [targetPath, PathUtils.getName(ancestor), oldPath.replace(\`\${ancestor}/\`, '')]
            : [targetPath, PathUtils.getName(oldPath)]
        )
          .filter(Boolean)
          .join('/')

        if (props.fs.exists(newPath)) {
          existingPaths.push({ oldPath, newPath })
        }

        return { oldPath, newPath, shouldRename: !ancestor }
      })

    if (existingPaths.length > 0) {
      throw \`Paths already exist: \${existingPaths.map(({ newPath }) => newPath)}\`
    }

    // Apply transforms
    batch(() => {
      // Rename the dirEnt in the fileSystem
      transforms.forEach(({ oldPath, newPath, shouldRename }) => {
        if (!shouldRename) return
        renameDirEnt(oldPath, newPath)
      })

      // Expand the target-dir (if it wasn't opened yet)
      if (!isDirExpandedById(targetId)) {
        expandDirById(targetId)
      }
    })
  }

  const fileTreeContext: FileTreeContext<T> = {
    get fs() {
      return config.fs
    },
    get base() {
      return config.base
    },
    expandDirById,
    collapseDirById,
    isDirExpandedById,
    moveSelectedDirEntsToPath,
    resetSelectedDirEntIds,
    selectDirEntById,
    deselectDirEntById,
    shiftSelectDirEntById,
    getDirEntsOfDirId,
    focusDirEnt: focusDirEntById,
    blurDirEnt: blurDirEntById,
    isDirEntFocused: isDirEntFocusedById,
    pathToId,
  }

  // Call event handler with current selection
  createEffect(() => props.onSelection?.(selectedDirEntIds()))

  // Update selection from props
  createComputed(() => {
    batch(() => {
      if (!props.selection) return
      setSelectedDirEntRanges(
        props.selection.filter(id => props.fs.exists(idToPath(id))).map(id => [id] as [string]),
      )
    })
  })

  // Freeze ID numbers for selected entries
  createComputed(() => selectedDirEntIds().forEach(freezeId))
  // Freeze ID numbers for expanded dirs
  createComputed(() => expandedDirIds().forEach(freezeId))

  return (
    <div
      {...rest}
      onDragOver={event => {
        event.preventDefault()
        props.onDragOver?.(event)
      }}
      onDrop={event => {
        moveSelectedDirEntsToPath(config.base)
        props.onDrop?.(event)
      }}
    >
      <FileTreeContext.Provider value={fileTreeContext}>
        <Key each={flatTree()} by={item => item.id}>
          {dirEnt => (
            <DirEntContext.Provider value={dirEnt}>
              {untrack(() => props.children(dirEnt, fileTreeContext))}
            </DirEntContext.Provider>
          )}
        </Key>
      </FileTreeContext.Provider>
    </div>
  )
}

FileTree.DirEnt = function (
  props: Overwrite<
    ComponentProps<'button'>,
    {
      ref?(element: HTMLButtonElement): void
      onDragOver?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onDragStart?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onDrop?(event: WrapEvent<DragEvent, HTMLButtonElement>): void
      onMove?(parent: string): void
      onPointerDown?(event: WrapEvent<PointerEvent, HTMLButtonElement>): void
      onPointerUp?(event: WrapEvent<PointerEvent, HTMLButtonElement>): void
      onFocus?(event: WrapEvent<FocusEvent, HTMLButtonElement>): void
      onBlur?(event: WrapEvent<FocusEvent, HTMLButtonElement>): void
    }
  >,
) {
  const config = mergeProps({ draggable: true }, props)
  const fileTree = useFileTree()
  const dirEnt = useDirEnt()

  const handlers = {
    ref(element: HTMLButtonElement) {
      createEffect(() => {
        if (dirEnt().focused) {
          element.focus()
        }
      })
      props.ref?.(element)
    },
    onPointerDown(event: WrapEvent<PointerEvent, HTMLButtonElement>) {
      batch(() => {
        if (event.shiftKey) {
          dirEnt().shiftSelect()
        } else {
          if (!dirEnt().selected) {
            if (!event[CTRL_KEY]) {
              fileTree.resetSelectedDirEntIds()
            }
            dirEnt().select()
          } else if (event[CTRL_KEY]) {
            dirEnt().deselect()
          }
        }
      })
      props.onPointerDown?.(event)
    },
    onPointerUp(event: WrapEvent<PointerEvent, HTMLButtonElement>) {
      const _dirEnt = dirEnt()
      if (_dirEnt.type === 'dir') {
        if (_dirEnt.expanded) {
          _dirEnt.collapse()
        } else {
          _dirEnt.expand()
        }
      }
      props.onPointerUp?.(event)
    },
    onDragOver: (event: WrapEvent<DragEvent, HTMLButtonElement>) => {
      event.preventDefault()
      props.onDragOver?.(event)
    },
    onDrop: (event: WrapEvent<DragEvent, HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const _dirEnt = dirEnt()

      if (_dirEnt.type === 'dir') {
        fileTree.moveSelectedDirEntsToPath(_dirEnt.path)
      } else {
        fileTree.moveSelectedDirEntsToPath(PathUtils.getParent(_dirEnt.path))
      }

      props.onDrop?.(event)
    },
    onFocus(event: WrapEvent<FocusEvent, HTMLButtonElement>) {
      dirEnt().focus()
      props.onFocus?.(event)
    },
    onBlur(event: WrapEvent<FocusEvent, HTMLButtonElement>) {
      dirEnt().blur()
      props.onBlur?.(event)
    },
  }

  return (
    <Show
      when={dirEnt().type === 'dir'}
      fallback={<button {...config} {...handlers} />}
      children={_ => (
        <Show when={dirEnt().path}>
          <button {...config} {...handlers}>
            {props.children}
          </button>
        </Show>
      )}
    />
  )
}

FileTree.IndentGuides = function (props: {
  render: (type: Accessor<IndentGuideKind>) => JSX.Element
}) {
  const dirEnt = useDirEnt()
  const fileTree = useFileTree()

  function isLastChild(path: string) {
    const parentPath = PathUtils.getParent(path)

    if (parentPath === fileTree.base) {
      return false
    }

    const dirEnts = fileTree.getDirEntsOfDirId(fileTree.pathToId(parentPath))
    const index = dirEnts.findIndex(dirEnt => dirEnt.path === path)

    return index === dirEnts.length - 1
  }

  function getAncestorAtLevel(index: number) {
    return dirEnt()
      .path.split('/')
      .slice(0, index + 2)
      .join('/')
  }

  function getGuideKind(index: number) {
    const isLastGuide = dirEnt().indentation - index === 1

    return isLastGuide && isLastChild(dirEnt().path)
      ? 'elbow'
      : isLastChild(getAncestorAtLevel(index))
      ? 'spacer'
      : isLastGuide
      ? 'tee'
      : 'pipe'
  }

  return (
    <Index each={Array.from({ length: dirEnt().indentation }, (_, index) => getGuideKind(index))}>
      {kind => (
        <IndentGuideContext.Provider value={kind}>{props.render(kind)}</IndentGuideContext.Provider>
      )}
    </Index>
  )
}

FileTree.Expanded = function (
  props: ComponentProps<'span'> & {
    expanded: JSX.Element
    collapsed: JSX.Element
  },
) {
  const [, rest] = splitProps(props, ['expanded', 'collapsed'])
  const dirEnt = useDirEnt()
  return (
    <Show when={dirEnt().type === 'dir'}>
      <span {...rest}>
        <Show when={(dirEnt() as Dir).expanded} fallback={props.expanded}>
          {props.collapsed}
        </Show>
      </span>
    </Show>
  )
}

FileTree.Name = function (props: {
  editable?: boolean
  style?: JSX.CSSProperties
  class?: string
  onBlur?(event: WrapEvent<FocusEvent, HTMLInputElement>): void
}) {
  const dirEnt = useDirEnt()
  const fileTree = useFileTree()

  function rename(element: HTMLInputElement) {
    const newPath = PathUtils.rename(dirEnt().path, element.value)

    if (newPath === dirEnt().path) {
      return
    }

    if (fileTree.fs.exists(newPath)) {
      element.value = dirEnt().name
      throw \`Path \${newPath} already exists.\`
    }

    dirEnt().rename(newPath)
    dirEnt().focus()
  }

  return (
    <Show
      when={props.editable}
      fallback={
        <span class={props.class} style={props.style}>
          {dirEnt().name} [ID = {dirEnt().id}]
        </span>
      }
    >
      <input
        ref={element => {
          onMount(() => {
            element.focus()
            const value = element.value
            const dotIndex = value.indexOf('.')
            const end = dotIndex === -1 ? value.length : dotIndex
            element.setSelectionRange(0, end)
          })
        }}
        class={props.class}
        style={{ all: 'unset', ...props.style }}
        value={dirEnt().name}
        spellcheck={false}
        onKeyDown={event => {
          if (event.code === 'Enter') {
            rename(event.currentTarget)
          }
        }}
        onBlur={event => {
          if (fileTree.fs.exists(dirEnt().path)) {
            rename(event.currentTarget)
          }
          props.onBlur?.(event)
        }}
      />
    </Show>
  )
}
`,__vite_glob_0_16=`export * from './create-file-system'
export * from './file-tree'
export * from './file-tree/defaults'
`,__vite_glob_0_17=`export const PathUtils = {
  normalize(path: string) {
    return path.replace(/^\\/+/, '')
  },
  getParent(path: string) {
    return path.split('/').slice(0, -1).join('/')
  },
  getName(path: string) {
    return lastItem(path.split('/'))
  },
  isAncestor(path: string, ancestor: string) {
    if (path === ancestor) return false
    const pathParts = path.split('/')
    const ancestorParts = ancestor.split('/')
    return ancestorParts.every((part, index) => part === pathParts[index])
  },
  rebase(path: string, from: string, to: string) {
    if (PathUtils.isAncestor(path, from) || path === from) {
      return path.replace(from, to)
    }
    return path
  },
  rename(path: string, name: string) {
    return [...path.split('/').slice(0, -1), name].join('/')
  },
}

export function lastItem<T>(arr: Array<T>): T | undefined {
  return arr[arr.length - 1]
}

export const isMac = navigator.platform.startsWith('Mac')
export const CTRL_KEY = isMac ? 'metaKey' : 'ctrlKey'

export type WrapEvent<TEvent, TCurrentTarget> = TEvent & {
  currentTarget: TCurrentTarget
  target: Element
}

export type Overwrite<TTarget, TSource extends Record<string, unknown>> = Omit<
  TTarget,
  keyof TSource
> &
  TSource
`,__vite_glob_0_18=`
`,__vite_glob_0_19="",__vite_glob_0_20=`{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"],
    "baseUrl": "."
  },
  "exclude": ["node_modules", "dist", "./dev"]
}
`,__vite_glob_0_21=`import path from 'path'
import { defineConfig, normalizePath } from 'vite'
import cssClassnames from 'vite-plugin-css-classnames'
import dtsBundle from 'vite-plugin-dts-bundle-generator'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    cssClassnames(),
    tsconfigPaths(),
    solid(),
    libInjectCss(),
    dtsBundle({ fileName: 'index.d.ts' }),
  ],
  server: { port: 3000 },
  build: {
    lib: {
      entry: {
        index: normalizePath(path.resolve(__dirname, 'src/index.ts')),
      },
      name: 'solid-fs-components',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: ['solid-js', 'solid-js/store', 'solid-js/web'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
        },
      },
    },
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
})
`,__vite_glob_0_22=`import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  // to test in server environment, run with "--mode ssr" or "--mode test:ssr" flag
  // loads only server.test.ts file
  const testSSR = mode === 'test:ssr' || mode === 'ssr'

  return {
    plugins: [
      solidPlugin({
        // https://github.com/solidjs/solid-refresh/issues/29
        hot: false,
        // For testing SSR we need to do a SSR JSX transform
        solid: { generate: testSSR ? 'ssr' : 'dom' },
      }),
    ],
    test: {
      watch: false,
      isolate: !testSSR,
      env: {
        NODE_ENV: testSSR ? 'production' : 'development',
        DEV: testSSR ? '' : '1',
        SSR: testSSR ? '1' : '',
        PROD: testSSR ? '1' : '',
      },
      environment: testSSR ? 'node' : 'jsdom',
      transformMode: { web: [/\\.[jt]sx$/] },
      ...(testSSR
        ? {
            include: ['test/server.test.{ts,tsx}'],
          }
        : {
            include: ['test/*.test.{ts,tsx}'],
            exclude: ['test/server.test.{ts,tsx}'],
          }),
    },
    resolve: {
      conditions: testSSR ? ['node'] : ['browser', 'development'],
    },
  }
})
`;var _tmpl$$4=template("<span>"),cursor=(e,n)=>new Promise(i=>{const o={x:e.clientX,y:e.clientY};let c=o;const t=performance.now();function a(p){const d={x:p.clientX,y:p.clientY},w={x:d.x-c.x,y:d.y-c.y},y={x:o.x-d.x,y:o.y-d.y};c=d;const v={total:y,delta:w,event:p,timespan:performance.now()-t};return n(v),v}const l=p=>{window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",l),i(a(p))};window.addEventListener("mousemove",a),window.addEventListener("mouseup",l)});function mergeRefs(...e){return n=>{e.forEach(i=>{typeof i=="function"?i(n):"ref"in i&&i.ref&&(typeof i.ref=="function"?i.ref(n):i.ref=n)})}}function withContext(e,n,i){let o;return n.Provider({value:i,children:()=>(o=e(),"")}),()=>o}var propsMap=new WeakMap,handleSet=new WeakSet,NO_OVERFLOW=Symbol("no-overflow"),isPercentageSize=e=>e.endsWith("%"),isFractionSize=e=>e.endsWith("fr"),isPixelSize=e=>e.endsWith("px"),isPixelProps=e=>isPixelSize(e.size),isFractionProps=e=>isFractionSize(e.size),getProps=e=>propsMap.get(e),isNotHandle=e=>!handleSet.has(e);function resolveNode(e){if(typeof e=="function"){const n=e();return resolveNode(n)}return e}function getNeigboringPanes(e,n){const i=e.indexOf(n);if(i===-1||i===0||i===e.length-1)return;const o=e.slice(0,i).findLast(isNotHandle),c=e.slice(i).find(isNotHandle);if(!(!o||!c))return[o,c]}function Base(e){const n=useSplit(),i=mergeProps({size:"1fr"},e),[,o]=splitProps(e,["size","min","max","style","ref"]);let c;const t=(()=>{var a=_tmpl$$4(),l=mergeRefs(e,p=>c=p);return typeof l=="function"&&use(l,a),spread(a,mergeProps({get style(){return{overflow:"hidden",...e.style}}},o,{get"data-active-pane"(){return n?.isActivePane(c)||void 0}}),!1,!0),insert(a,()=>e.children),a})();return propsMap.set(t,i),t}var splitContext=createContext();function useSplit(){return useContext(splitContext)}function Split(e){const n=mergeProps({type:"column"},e),[,i]=splitProps(e,["type","style","ref"]),[o,c]=createSignal(),[t,a]=createSignal(void 0),[l,p]=createSignal(new WeakMap,{equals:!1}),[d,w]=createSignal(),y=()=>(n.type==="column"?o()?.width:o()?.height)||0;function v(E,D){p(O=>(O.set(E,(O.get(E)||0)-D),O))}function k(E,D=0){return isPercentageSize(E)?(parseFloat(E)-D)/100*y():parseFloat(E)-D}function T(E){const D=getProps(E),O=S(E);return!D||isFractionProps(D)?0:k(D.size,O)}function _(){const E=x(),D=b().reduce((O,j)=>O+parseFloat(getProps(j).size),0);if(D===0)return 0;if(D<1){const O=E-E*D;return E/(D+O/E)}else return E/D}function N(E){const D=getProps(E),O=S(E);return!D||!isFractionProps(D)?0:(parseFloat(D.size)-O)*_()}function S(E){return l().get(E)||0}function I(){return m().reduce((E,D)=>E+T(D),0)}function x(){return y()-I()}function P(E,D,O){const j=b(),z=j.indexOf(E),V=j.map(N);let M=isPixelProps(getProps(D))?O:O/y()*100;v(D,M),(V[z]-=O)<0&&(v(D,-M),V[z]=0);const J=V.reduce((q,ie)=>q+ie,0),Q=j.map(getProps).reduce((q,ie)=>q+parseFloat(ie.size),0),$=V.map(q=>q*Q/J).map((q,ie)=>parseFloat(getProps(j[ie]).size)-q);p(q=>($.forEach((ie,L)=>{q.set(j[L],ie)}),q))}function h(E,D){const O=getProps(E),j=S(E);if(!isFractionProps(O))return 0;const z=parseFloat(O.size)-j+D;return z<0?z:0}function s(E,D){const O=getProps(E),j=S(E);if(isFractionProps(O))return 0;const V=k(O.size,j)+D;if(O.max){const M=k(O.max);if(V<M)return V-M}if(O.min){const M=k(O.min);if(V>M)return V-M}return V>0?0:V}const g={isActivePane:createSelector(t,(E,D)=>isNotHandle(E)&&!!D?.includes(E)),get type(){return n.type},dragHandleStart(E){return a(getNeigboringPanes(u(),E))},dragHandle([E,D],O){if(O===0)return NO_OVERFLOW;const j=getProps(E),z=getProps(D),V=isFractionProps(j),M=isFractionProps(z);let U=O/_();const J=V?h(E,U)*_():s(E,O),Q=M?h(D,-U)*_():s(D,-O);return O=J?O-J:Q?O+Q:O,U=O/_(),V&&M?(v(E,U),v(D,-U)):!V&&!M?(v(E,isPixelProps(j)?O:O/y()*100),v(D,isPixelProps(z)?-O:-O/y()*100)):V?P(E,D,-O):P(D,E,O),!J&&!Q?NO_OVERFLOW:Math.abs(J)>Math.abs(Q)?J:-Q},dragHandleEnd(){a(void 0)}},f=children(withContext(()=>e.children,splitContext,g)),u=createMemo(()=>f.toArray().filter(E=>propsMap.has(E))),b=()=>u().filter(E=>isFractionProps(getProps(E))),m=()=>u().filter(E=>!isFractionProps(getProps(E))),A=()=>u().map(E=>{const D=getProps(E),O=S(E);if(isFractionProps(D))return O?`${parseFloat(D.size)-O}fr`:D.size;const j=O?`calc(${parseFloat(D.size)-O}${isPixelProps(D)?"px":"%"})`:D.size;return D.min?D.max?`min(${D.min}, max(${D.max}, ${j}))`:`min(${D.min}, ${j})`:D.max?`max(${D.max}, ${j})`:j}).join(" ");return createEffect(()=>{const E=d();if(!E)return;const D=new ResizeObserver(O=>{for(let j of O)c(j.contentRect),e.onResize?.(j.contentRect,E)});D.observe(E),onCleanup(()=>D.disconnect())}),createSignal(mapArray(u,E=>{createEffect(on(()=>getProps(E)?.size,()=>{p(D=>(D.set(E,0),D))}))})),createEffect(()=>e.onTemplate?.(A())),createComponent(Base,mergeProps({ref(E){var D=mergeRefs(w,e);typeof D=="function"&&D(E)},get style(){return{display:"grid",...e.style,[`grid-template-${n.type}s`]:A()}}},i,{get children(){return u()}}))}function Pane(e){if(!useSplit())throw"Split.Pane should be used within a Split-component";return createComponent(Base,e)}function Handle(e){const n=useSplit();if(!n)throw"Split.Handle should be used within a Split-component";const[i,o]=createSignal(!1),c=createComponent(Base,mergeProps(e,{get"data-active-handle"(){return i()||void 0},onPointerDown:async t=>{let a={x:0,y:0};o(!0);const l=n.dragHandleStart(resolveNode(c));l&&(await cursor(t,({delta:p})=>{const d=n.dragHandle(l,n.type==="column"?p.x+a.x:p.y+a.y);d===NO_OVERFLOW?a={x:0,y:0}:(a.x+=n.type==="column"?p.x:d,a.y+=n.type!=="column"?p.y:d)}),n.dragHandleEnd(),o(!1))}}));return handleSet.add(resolveNode(c)),c}Split.Handle=Handle;Split.Pane=Pane;const PathUtils={normalize(e){return e.replace(/^\/+/,"")},getParent(e){return e.split("/").slice(0,-1).join("/")},getName(e){return lastItem(e.split("/"))},isAncestor(e,n){if(e===n)return!1;const i=e.split("/");return n.split("/").every((c,t)=>c===i[t])},rebase(e,n,i){return PathUtils.isAncestor(e,n)||e===n?e.replace(n,i):e},rename(e,n){return[...e.split("/").slice(0,-1),n].join("/")}};function lastItem(e){return e[e.length-1]}const isMac=navigator.platform.startsWith("Mac"),CTRL_KEY=isMac?"metaKey":"ctrlKey";let CDN="https://esm.sh";const CACHE={theme:{},grammar:{}};function urlFromCDN(e,n){switch(e){case"theme":return`${CDN}/tm-themes/themes/${n}.json`;case"grammar":return`${CDN}/tm-grammars/grammars/${n}.json`;case"oniguruma":return`${CDN}/vscode-oniguruma/release/onig.wasm`}}async function fetchFromCDN(e,n){if(n in CACHE[e])return CACHE[e][n];const i=urlFromCDN(e,n);return CACHE[e][n]=typeof i!="string"?i:fetch(i).then(o=>o.ok?o.json():null).catch(console.error)}var define_process_env_default={},__defProp=Object.defineProperty,__defNormalProp=(e,n,i)=>n in e?__defProp(e,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[n]=i,__publicField=(e,n,i)=>(__defNormalProp(e,n+"",i),i),__accessCheck=(e,n,i)=>{if(!n.has(e))throw TypeError("Cannot "+i)},__privateGet=(e,n,i)=>(__accessCheck(e,n,"read from private field"),i?i.call(e):n.get(e)),__privateAdd=(e,n,i)=>{if(n.has(e))throw TypeError("Cannot add the same private member more than once");n instanceof WeakSet?n.add(e):n.set(e,i)},_array,_scopes;function _mergeNamespaces(e,n){for(var i=0;i<n.length;i++){const o=n[i];if(typeof o!="string"&&!Array.isArray(o)){for(const c in o)if(c!=="default"&&!(c in e)){const t=Object.getOwnPropertyDescriptor(o,c);t&&Object.defineProperty(e,c,t.get?t:{enumerable:!0,get:()=>o[c]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var EQUALS_FALSE_OPTIONS={equals:!1};function createLazyMemo(e,n,i){let o=!1,c=!0;const[t,a]=createSignal(void 0,EQUALS_FALSE_OPTIONS),l=createMemo(p=>o?e(p):(c=!t(),p),n,EQUALS_FALSE_OPTIONS);return()=>{o=!0,c&&(c=a());const p=l();return o=!1,p}}function r(e){var n,i,o="";if(typeof e=="string"||typeof e=="number")o+=e;else if(typeof e=="object")if(Array.isArray(e)){var c=e.length;for(n=0;n<c;n++)e[n]&&(i=r(e[n]))&&(o&&(o+=" "),o+=i)}else for(i in e)e[i]&&(o&&(o+=" "),o+=i);return o}function clsx(){for(var e,n,i=0,o="",c=arguments.length;i<c;i++)(e=arguments[i])&&(n=r(e))&&(o&&(o+=" "),o+=n);return o}var commonjsGlobal=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var main$2={exports:{}};(function(e,n){(function(i,o){e.exports=o()})(commonjsGlobal,()=>{return i={770:function(c,t,a){var l=this&&this.__importDefault||function(N){return N&&N.__esModule?N:{default:N}};Object.defineProperty(t,"__esModule",{value:!0}),t.setDefaultDebugCall=t.createOnigScanner=t.createOnigString=t.loadWASM=t.OnigScanner=t.OnigString=void 0;const p=l(a(418));let d=null,w=!1;class y{static _utf8ByteLength(S){let I=0;for(let x=0,P=S.length;x<P;x++){const h=S.charCodeAt(x);let s=h,g=!1;if(h>=55296&&h<=56319&&x+1<P){const f=S.charCodeAt(x+1);f>=56320&&f<=57343&&(s=65536+(h-55296<<10)|f-56320,g=!0)}I+=s<=127?1:s<=2047?2:s<=65535?3:4,g&&x++}return I}constructor(S){const I=S.length,x=y._utf8ByteLength(S),P=x!==I,h=P?new Uint32Array(I+1):null;P&&(h[I]=x);const s=P?new Uint32Array(x+1):null;P&&(s[x]=I);const g=new Uint8Array(x);let f=0;for(let u=0;u<I;u++){const b=S.charCodeAt(u);let m=b,A=!1;if(b>=55296&&b<=56319&&u+1<I){const E=S.charCodeAt(u+1);E>=56320&&E<=57343&&(m=65536+(b-55296<<10)|E-56320,A=!0)}P&&(h[u]=f,A&&(h[u+1]=f),m<=127?s[f+0]=u:m<=2047?(s[f+0]=u,s[f+1]=u):m<=65535?(s[f+0]=u,s[f+1]=u,s[f+2]=u):(s[f+0]=u,s[f+1]=u,s[f+2]=u,s[f+3]=u)),m<=127?g[f++]=m:m<=2047?(g[f++]=192|(1984&m)>>>6,g[f++]=128|(63&m)>>>0):m<=65535?(g[f++]=224|(61440&m)>>>12,g[f++]=128|(4032&m)>>>6,g[f++]=128|(63&m)>>>0):(g[f++]=240|(1835008&m)>>>18,g[f++]=128|(258048&m)>>>12,g[f++]=128|(4032&m)>>>6,g[f++]=128|(63&m)>>>0),A&&u++}this.utf16Length=I,this.utf8Length=x,this.utf16Value=S,this.utf8Value=g,this.utf16OffsetToUtf8=h,this.utf8OffsetToUtf16=s}createString(S){const I=S._omalloc(this.utf8Length);return S.HEAPU8.set(this.utf8Value,I),I}}class v{constructor(S){if(this.id=++v.LAST_ID,!d)throw new Error("Must invoke loadWASM first.");this._onigBinding=d,this.content=S;const I=new y(S);this.utf16Length=I.utf16Length,this.utf8Length=I.utf8Length,this.utf16OffsetToUtf8=I.utf16OffsetToUtf8,this.utf8OffsetToUtf16=I.utf8OffsetToUtf16,this.utf8Length<1e4&&!v._sharedPtrInUse?(v._sharedPtr||(v._sharedPtr=d._omalloc(1e4)),v._sharedPtrInUse=!0,d.HEAPU8.set(I.utf8Value,v._sharedPtr),this.ptr=v._sharedPtr):this.ptr=I.createString(d)}convertUtf8OffsetToUtf16(S){return this.utf8OffsetToUtf16?S<0?0:S>this.utf8Length?this.utf16Length:this.utf8OffsetToUtf16[S]:S}convertUtf16OffsetToUtf8(S){return this.utf16OffsetToUtf8?S<0?0:S>this.utf16Length?this.utf8Length:this.utf16OffsetToUtf8[S]:S}dispose(){this.ptr===v._sharedPtr?v._sharedPtrInUse=!1:this._onigBinding._ofree(this.ptr)}}t.OnigString=v,v.LAST_ID=0,v._sharedPtr=0,v._sharedPtrInUse=!1;class k{constructor(S,I){var x,P;if(!d)throw new Error("Must invoke loadWASM first.");const h=[],s=[];for(let A=0,E=S.length;A<E;A++){const D=new y(S[A]);h[A]=D.createString(d),s[A]=D.utf8Length}const g=d._omalloc(4*S.length);d.HEAPU32.set(h,g/4);const f=d._omalloc(4*S.length);d.HEAPU32.set(s,f/4),this._onigBinding=d,this._options=(x=I?.options)!==null&&x!==void 0?x:[10];const u=this.onigOptions(this._options),b=this.onigSyntax((P=I?.syntax)!==null&&P!==void 0?P:0),m=d._createOnigScanner(g,f,S.length,u,b);this._ptr=m;for(let A=0,E=S.length;A<E;A++)d._ofree(h[A]);d._ofree(f),d._ofree(g),m===0&&function(A){throw new Error(A.UTF8ToString(A._getLastOnigError()))}(d)}dispose(){this._onigBinding._freeOnigScanner(this._ptr)}findNextMatchSync(S,I,x){let P=w,h=this._options;if(Array.isArray(x)?(x.includes(25)&&(P=!0),h=h.concat(x)):typeof x=="boolean"&&(P=x),typeof S=="string"){S=new v(S);const s=this._findNextMatchSync(S,I,P,h);return S.dispose(),s}return this._findNextMatchSync(S,I,P,h)}_findNextMatchSync(S,I,x,P){const h=this._onigBinding,s=this.onigOptions(P);let g;if(g=x?h._findNextOnigScannerMatchDbg(this._ptr,S.id,S.ptr,S.utf8Length,S.convertUtf16OffsetToUtf8(I),s):h._findNextOnigScannerMatch(this._ptr,S.id,S.ptr,S.utf8Length,S.convertUtf16OffsetToUtf8(I),s),g===0)return null;const f=h.HEAPU32;let u=g/4;const b=f[u++],m=f[u++];let A=[];for(let E=0;E<m;E++){const D=S.convertUtf8OffsetToUtf16(f[u++]),O=S.convertUtf8OffsetToUtf16(f[u++]);A[E]={start:D,end:O,length:O-D}}return{index:b,captureIndices:A}}onigOptions(S){return S.map(I=>this.onigOption(I)).reduce((I,x)=>I|x,this._onigBinding.ONIG_OPTION_NONE)}onigSyntax(S){switch(S){case 0:return this._onigBinding.ONIG_SYNTAX_DEFAULT;case 1:return this._onigBinding.ONIG_SYNTAX_ASIS;case 2:return this._onigBinding.ONIG_SYNTAX_POSIX_BASIC;case 3:return this._onigBinding.ONIG_SYNTAX_POSIX_EXTENDED;case 4:return this._onigBinding.ONIG_SYNTAX_EMACS;case 5:return this._onigBinding.ONIG_SYNTAX_GREP;case 6:return this._onigBinding.ONIG_SYNTAX_GNU_REGEX;case 7:return this._onigBinding.ONIG_SYNTAX_JAVA;case 8:return this._onigBinding.ONIG_SYNTAX_PERL;case 9:return this._onigBinding.ONIG_SYNTAX_PERL_NG;case 10:return this._onigBinding.ONIG_SYNTAX_RUBY;case 11:return this._onigBinding.ONIG_SYNTAX_PYTHON;case 12:return this._onigBinding.ONIG_SYNTAX_ONIGURUMA}}onigOption(S){switch(S){case 1:return this._onigBinding.ONIG_OPTION_NONE;case 0:case 25:return this._onigBinding.ONIG_OPTION_DEFAULT;case 2:return this._onigBinding.ONIG_OPTION_IGNORECASE;case 3:return this._onigBinding.ONIG_OPTION_EXTEND;case 4:return this._onigBinding.ONIG_OPTION_MULTILINE;case 5:return this._onigBinding.ONIG_OPTION_SINGLELINE;case 6:return this._onigBinding.ONIG_OPTION_FIND_LONGEST;case 7:return this._onigBinding.ONIG_OPTION_FIND_NOT_EMPTY;case 8:return this._onigBinding.ONIG_OPTION_NEGATE_SINGLELINE;case 9:return this._onigBinding.ONIG_OPTION_DONT_CAPTURE_GROUP;case 10:return this._onigBinding.ONIG_OPTION_CAPTURE_GROUP;case 11:return this._onigBinding.ONIG_OPTION_NOTBOL;case 12:return this._onigBinding.ONIG_OPTION_NOTEOL;case 13:return this._onigBinding.ONIG_OPTION_CHECK_VALIDITY_OF_STRING;case 14:return this._onigBinding.ONIG_OPTION_IGNORECASE_IS_ASCII;case 15:return this._onigBinding.ONIG_OPTION_WORD_IS_ASCII;case 16:return this._onigBinding.ONIG_OPTION_DIGIT_IS_ASCII;case 17:return this._onigBinding.ONIG_OPTION_SPACE_IS_ASCII;case 18:return this._onigBinding.ONIG_OPTION_POSIX_IS_ASCII;case 19:return this._onigBinding.ONIG_OPTION_TEXT_SEGMENT_EXTENDED_GRAPHEME_CLUSTER;case 20:return this._onigBinding.ONIG_OPTION_TEXT_SEGMENT_WORD;case 21:return this._onigBinding.ONIG_OPTION_NOT_BEGIN_STRING;case 22:return this._onigBinding.ONIG_OPTION_NOT_END_STRING;case 23:return this._onigBinding.ONIG_OPTION_NOT_BEGIN_POSITION;case 24:return this._onigBinding.ONIG_OPTION_CALLBACK_EACH_MATCH}}}t.OnigScanner=k;let T=!1,_=null;t.loadWASM=function(N){if(T)return _;let S,I,x,P;if(T=!0,function(h){return typeof h.instantiator=="function"}(N))S=N.instantiator,I=N.print;else{let h;(function(s){return s.data!==void 0})(N)?(h=N.data,I=N.print):h=N,S=function(s){return typeof Response<"u"&&s instanceof Response}(h)?typeof WebAssembly.instantiateStreaming=="function"?function(s){return g=>WebAssembly.instantiateStreaming(s,g)}(h):function(s){return async g=>{const f=await s.arrayBuffer();return WebAssembly.instantiate(f,g)}}(h):function(s){return g=>WebAssembly.instantiate(s,g)}(h)}return _=new Promise((h,s)=>{x=h,P=s}),function(h,s,g,f){(0,p.default)({print:s,instantiateWasm:(u,b)=>{if(typeof performance>"u"){const m=()=>Date.now();u.env.emscripten_get_now=m,u.wasi_snapshot_preview1.emscripten_get_now=m}return h(u).then(m=>b(m.instance),f),{}}}).then(u=>{d=u,g()})}(S,I,x,P),_},t.createOnigString=function(N){return new v(N)},t.createOnigScanner=function(N){return new k(N)},t.setDefaultDebugCall=function(N){w=N}},418:c=>{var t=(typeof document<"u"&&document.currentScript&&document.currentScript.src,function(a={}){var l,p,d=a;d.ready=new Promise((C,R)=>{l=C,p=R});var w,y=Object.assign({},d);typeof read<"u"&&read,w=C=>{if(typeof readbuffer=="function")return new Uint8Array(readbuffer(C));let R=read(C,"binary");return typeof R=="object"||O(B),R;var B},typeof clearTimeout>"u"&&(globalThis.clearTimeout=C=>{}),typeof setTimeout>"u"&&(globalThis.setTimeout=C=>typeof C=="function"?C():O()),typeof scriptArgs<"u"&&scriptArgs,typeof onig_print<"u"&&(typeof console>"u"&&(console={}),console.log=onig_print,console.warn=console.error=typeof printErr<"u"?printErr:onig_print);var v,k,T=d.print||console.log.bind(console),_=d.printErr||console.error.bind(console);Object.assign(d,y),y=null,d.arguments&&d.arguments,d.thisProgram&&d.thisProgram,d.quit&&d.quit,d.wasmBinary&&(v=d.wasmBinary),d.noExitRuntime,typeof WebAssembly!="object"&&O("no native wasm support detected");var N,S,I,x,P,h,s,g,f=!1;function u(){var C=k.buffer;d.HEAP8=N=new Int8Array(C),d.HEAP16=I=new Int16Array(C),d.HEAPU8=S=new Uint8Array(C),d.HEAPU16=x=new Uint16Array(C),d.HEAP32=P=new Int32Array(C),d.HEAPU32=h=new Uint32Array(C),d.HEAPF32=s=new Float32Array(C),d.HEAPF64=g=new Float64Array(C)}var b=[],m=[],A=[],E=0,D=null;function O(C){d.onAbort&&d.onAbort(C),_(C="Aborted("+C+")"),f=!0,C+=". Build with -sASSERTIONS for more info.";var R=new WebAssembly.RuntimeError(C);throw p(R),R}var j,z;function V(C){return C.startsWith("data:application/octet-stream;base64,")}function M(C){if(C==j&&v)return new Uint8Array(v);if(w)return w(C);throw"both async and sync fetching of the wasm failed"}function U(C,R,B){return function(F){return Promise.resolve().then(()=>M(F))}(C).then(F=>WebAssembly.instantiate(F,R)).then(F=>F).then(B,F=>{_(`failed to asynchronously prepare wasm: ${F}`),O(F)})}V(j="onig.wasm")||(z=j,j=d.locateFile?d.locateFile(z,""):""+z);var J=C=>{for(;C.length>0;)C.shift()(d)},Q=void 0,H=C=>{for(var R="",B=C;S[B];)R+=Q[S[B++]];return R},$={},q={},ie={},L=void 0,ee=C=>{throw new L(C)},ne=void 0,de=(C,R,B)=>{function F(Y){var X=B(Y);X.length!==C.length&&(oe=>{throw new ne(oe)})("Mismatched type converter count");for(var Z=0;Z<C.length;++Z)ce(C[Z],X[Z])}C.forEach(function(Y){ie[Y]=R});var G=new Array(R.length),W=[],K=0;R.forEach((Y,X)=>{q.hasOwnProperty(Y)?G[X]=q[Y]:(W.push(Y),$.hasOwnProperty(Y)||($[Y]=[]),$[Y].push(()=>{G[X]=q[Y],++K===W.length&&F(G)}))}),W.length===0&&F(G)};function ce(C,R,B={}){if(!("argPackAdvance"in R))throw new TypeError("registerType registeredInstance requires argPackAdvance");return function(F,G,W={}){var K=G.name;if(F||ee(`type "${K}" must have a positive integer typeid pointer`),q.hasOwnProperty(F)){if(W.ignoreDuplicateRegistrations)return;ee(`Cannot register type '${K}' twice`)}if(q[F]=G,delete ie[F],$.hasOwnProperty(F)){var Y=$[F];delete $[F],Y.forEach(X=>X())}}(C,R,B)}function Ee(){this.allocated=[void 0],this.freelist=[]}var ae=new Ee,ge=()=>{for(var C=0,R=ae.reserved;R<ae.allocated.length;++R)ae.allocated[R]!==void 0&&++C;return C},Se=C=>(C||ee("Cannot use deleted val. handle = "+C),ae.get(C).value),be=C=>{switch(C){case void 0:return 1;case null:return 2;case!0:return 3;case!1:return 4;default:return ae.allocate({refcount:1,value:C})}};function fe(C){return this.fromWireType(P[C>>2])}var ve=(C,R)=>{switch(R){case 4:return function(B){return this.fromWireType(s[B>>2])};case 8:return function(B){return this.fromWireType(g[B>>3])};default:throw new TypeError(`invalid float width (${R}): ${C}`)}},me=(C,R,B)=>{switch(R){case 1:return B?F=>N[F>>0]:F=>S[F>>0];case 2:return B?F=>I[F>>1]:F=>x[F>>1];case 4:return B?F=>P[F>>2]:F=>h[F>>2];default:throw new TypeError(`invalid integer width (${R}): ${C}`)}};function pe(C){return this.fromWireType(h[C>>2])}var we,Pe=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,Te=(C,R,B)=>{for(var F=R+B,G=R;C[G]&&!(G>=F);)++G;if(G-R>16&&C.buffer&&Pe)return Pe.decode(C.subarray(R,G));for(var W="";R<G;){var K=C[R++];if(128&K){var Y=63&C[R++];if((224&K)!=192){var X=63&C[R++];if((K=(240&K)==224?(15&K)<<12|Y<<6|X:(7&K)<<18|Y<<12|X<<6|63&C[R++])<65536)W+=String.fromCharCode(K);else{var Z=K-65536;W+=String.fromCharCode(55296|Z>>10,56320|1023&Z)}}else W+=String.fromCharCode((31&K)<<6|Y)}else W+=String.fromCharCode(K)}return W},xe=(C,R)=>C?Te(S,C,R):"",Ie=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Ce=(C,R)=>{for(var B=C,F=B>>1,G=F+R/2;!(F>=G)&&x[F];)++F;if((B=F<<1)-C>32&&Ie)return Ie.decode(S.subarray(C,B));for(var W="",K=0;!(K>=R/2);++K){var Y=I[C+2*K>>1];if(Y==0)break;W+=String.fromCharCode(Y)}return W},Ne=(C,R,B)=>{if(B===void 0&&(B=2147483647),B<2)return 0;for(var F=R,G=(B-=2)<2*C.length?B/2:C.length,W=0;W<G;++W){var K=C.charCodeAt(W);I[R>>1]=K,R+=2}return I[R>>1]=0,R-F},Ae=C=>2*C.length,De=(C,R)=>{for(var B=0,F="";!(B>=R/4);){var G=P[C+4*B>>2];if(G==0)break;if(++B,G>=65536){var W=G-65536;F+=String.fromCharCode(55296|W>>10,56320|1023&W)}else F+=String.fromCharCode(G)}return F},Fe=(C,R,B)=>{if(B===void 0&&(B=2147483647),B<4)return 0;for(var F=R,G=F+B-4,W=0;W<C.length;++W){var K=C.charCodeAt(W);if(K>=55296&&K<=57343&&(K=65536+((1023&K)<<10)|1023&C.charCodeAt(++W)),P[R>>2]=K,(R+=4)+4>G)break}return P[R>>2]=0,R-F},Be=C=>{for(var R=0,B=0;B<C.length;++B){var F=C.charCodeAt(B);F>=55296&&F<=57343&&++B,R+=4}return R};we=()=>performance.now();var Ge=C=>{var R=(C-k.buffer.byteLength+65535)/65536;try{return k.grow(R),u(),1}catch{}},Ue=[null,[],[]];(()=>{for(var C=new Array(256),R=0;R<256;++R)C[R]=String.fromCharCode(R);Q=C})(),L=d.BindingError=class extends Error{constructor(C){super(C),this.name="BindingError"}},ne=d.InternalError=class extends Error{constructor(C){super(C),this.name="InternalError"}},Object.assign(Ee.prototype,{get(C){return this.allocated[C]},has(C){return this.allocated[C]!==void 0},allocate(C){var R=this.freelist.pop()||this.allocated.length;return this.allocated[R]=C,R},free(C){this.allocated[C]=void 0,this.freelist.push(C)}}),ae.allocated.push({value:void 0},{value:null},{value:!0},{value:!1}),ae.reserved=ae.allocated.length,d.count_emval_handles=ge;var ke,je={_embind_register_bigint:(C,R,B,F,G)=>{},_embind_register_bool:(C,R,B,F)=>{ce(C,{name:R=H(R),fromWireType:function(G){return!!G},toWireType:function(G,W){return W?B:F},argPackAdvance:8,readValueFromPointer:function(G){return this.fromWireType(S[G])},destructorFunction:null})},_embind_register_constant:(C,R,B)=>{C=H(C),de([],[R],function(F){return F=F[0],d[C]=F.fromWireType(B),[]})},_embind_register_emval:(C,R)=>{ce(C,{name:R=H(R),fromWireType:B=>{var F=Se(B);return(G=>{G>=ae.reserved&&--ae.get(G).refcount==0&&ae.free(G)})(B),F},toWireType:(B,F)=>be(F),argPackAdvance:8,readValueFromPointer:fe,destructorFunction:null})},_embind_register_float:(C,R,B)=>{ce(C,{name:R=H(R),fromWireType:F=>F,toWireType:(F,G)=>G,argPackAdvance:8,readValueFromPointer:ve(R,B),destructorFunction:null})},_embind_register_integer:(C,R,B,F,G)=>{R=H(R);var W=X=>X;if(F===0){var K=32-8*B;W=X=>X<<K>>>K}var Y=R.includes("unsigned");ce(C,{name:R,fromWireType:W,toWireType:Y?function(X,Z){return this.name,Z>>>0}:function(X,Z){return this.name,Z},argPackAdvance:8,readValueFromPointer:me(R,B,F!==0),destructorFunction:null})},_embind_register_memory_view:(C,R,B)=>{var F=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array][R];function G(W){var K=h[W>>2],Y=h[W+4>>2];return new F(N.buffer,Y,K)}ce(C,{name:B=H(B),fromWireType:G,argPackAdvance:8,readValueFromPointer:G},{ignoreDuplicateRegistrations:!0})},_embind_register_std_string:(C,R)=>{var B=(R=H(R))==="std::string";ce(C,{name:R,fromWireType:F=>{var G,W=h[F>>2],K=F+4;if(B)for(var Y=K,X=0;X<=W;++X){var Z=K+X;if(X==W||S[Z]==0){var oe=xe(Y,Z-Y);G===void 0?G=oe:(G+="\0",G+=oe),Y=Z+1}}else{var se=new Array(W);for(X=0;X<W;++X)se[X]=String.fromCharCode(S[K+X]);G=se.join("")}return ye(F),G},toWireType:(F,G)=>{var W;G instanceof ArrayBuffer&&(G=new Uint8Array(G));var K=typeof G=="string";K||G instanceof Uint8Array||G instanceof Uint8ClampedArray||G instanceof Int8Array||ee("Cannot pass non-string to std::string"),W=B&&K?(se=>{for(var re=0,te=0;te<se.length;++te){var he=se.charCodeAt(te);he<=127?re++:he<=2047?re+=2:he>=55296&&he<=57343?(re+=4,++te):re+=3}return re})(G):G.length;var Y=Re(4+W+1),X=Y+4;if(h[Y>>2]=W,B&&K)((se,re,te,he)=>{if(!(he>0))return 0;for(var Me=te,_e=te+he-1,Oe=0;Oe<se.length;++Oe){var le=se.charCodeAt(Oe);if(le>=55296&&le<=57343&&(le=65536+((1023&le)<<10)|1023&se.charCodeAt(++Oe)),le<=127){if(te>=_e)break;re[te++]=le}else if(le<=2047){if(te+1>=_e)break;re[te++]=192|le>>6,re[te++]=128|63&le}else if(le<=65535){if(te+2>=_e)break;re[te++]=224|le>>12,re[te++]=128|le>>6&63,re[te++]=128|63&le}else{if(te+3>=_e)break;re[te++]=240|le>>18,re[te++]=128|le>>12&63,re[te++]=128|le>>6&63,re[te++]=128|63&le}}re[te]=0})(G,S,X,W+1);else if(K)for(var Z=0;Z<W;++Z){var oe=G.charCodeAt(Z);oe>255&&(ye(X),ee("String has UTF-16 code units that do not fit in 8 bits")),S[X+Z]=oe}else for(Z=0;Z<W;++Z)S[X+Z]=G[Z];return F!==null&&F.push(ye,Y),Y},argPackAdvance:8,readValueFromPointer:pe,destructorFunction:F=>ye(F)})},_embind_register_std_wstring:(C,R,B)=>{var F,G,W,K,Y;B=H(B),R===2?(F=Ce,G=Ne,K=Ae,W=()=>x,Y=1):R===4&&(F=De,G=Fe,K=Be,W=()=>h,Y=2),ce(C,{name:B,fromWireType:X=>{for(var Z,oe=h[X>>2],se=W(),re=X+4,te=0;te<=oe;++te){var he=X+4+te*R;if(te==oe||se[he>>Y]==0){var Me=F(re,he-re);Z===void 0?Z=Me:(Z+="\0",Z+=Me),re=he+R}}return ye(X),Z},toWireType:(X,Z)=>{typeof Z!="string"&&ee(`Cannot pass non-string to C++ string type ${B}`);var oe=K(Z),se=Re(4+oe+R);return h[se>>2]=oe>>Y,G(Z,se+4,oe+R),X!==null&&X.push(ye,se),se},argPackAdvance:8,readValueFromPointer:fe,destructorFunction:X=>ye(X)})},_embind_register_void:(C,R)=>{ce(C,{isVoid:!0,name:R=H(R),argPackAdvance:0,fromWireType:()=>{},toWireType:(B,F)=>{}})},emscripten_get_now:we,emscripten_memcpy_big:(C,R,B)=>S.copyWithin(C,R,R+B),emscripten_resize_heap:C=>{var R=S.length,B=2147483648;if((C>>>=0)>B)return!1;for(var F,G=1;G<=4;G*=2){var W=R*(1+.2/G);W=Math.min(W,C+100663296);var K=Math.min(B,(F=Math.max(C,W))+(65536-F%65536)%65536);if(Ge(K))return!0}return!1},fd_write:(C,R,B,F)=>{for(var G=0,W=0;W<B;W++){var K=h[R>>2],Y=h[R+4>>2];R+=8;for(var X=0;X<Y;X++)Z=C,oe=S[K+X],se=void 0,se=Ue[Z],oe===0||oe===10?((Z===1?T:_)(Te(se,0)),se.length=0):se.push(oe);G+=Y}var Z,oe,se;return h[F>>2]=G,0}},ue=function(){var C,R,B,F,G={env:je,wasi_snapshot_preview1:je};function W(K,Y){var X,Z=K.exports;return k=(ue=Z).memory,u(),ue.__indirect_function_table,X=ue.__wasm_call_ctors,m.unshift(X),function(oe){if(E--,d.monitorRunDependencies&&d.monitorRunDependencies(E),E==0&&D){var se=D;D=null,se()}}(),Z}if(E++,d.monitorRunDependencies&&d.monitorRunDependencies(E),d.instantiateWasm)try{return d.instantiateWasm(G,W)}catch(K){_(`Module.instantiateWasm callback failed with error: ${K}`),p(K)}return(C=v,R=j,B=G,F=function(K){W(K.instance)},C||typeof WebAssembly.instantiateStreaming!="function"||V(R)||typeof fetch!="function"?U(R,B,F):fetch(R,{credentials:"same-origin"}).then(K=>WebAssembly.instantiateStreaming(K,B).then(F,function(Y){return _(`wasm streaming compile failed: ${Y}`),_("falling back to ArrayBuffer instantiation"),U(R,B,F)}))).catch(p),{}}(),Re=C=>(Re=ue.malloc)(C),ye=C=>(ye=ue.free)(C);function Le(){function C(){ke||(ke=!0,d.calledRun=!0,f||(J(m),l(d),d.onRuntimeInitialized&&d.onRuntimeInitialized(),function(){if(d.postRun)for(typeof d.postRun=="function"&&(d.postRun=[d.postRun]);d.postRun.length;)R=d.postRun.shift(),A.unshift(R);var R;J(A)}()))}E>0||(function(){if(d.preRun)for(typeof d.preRun=="function"&&(d.preRun=[d.preRun]);d.preRun.length;)R=d.preRun.shift(),b.unshift(R);var R;J(b)}(),E>0||(d.setStatus?(d.setStatus("Running..."),setTimeout(function(){setTimeout(function(){d.setStatus("")},1),C()},1)):C()))}if(d._omalloc=C=>(d._omalloc=ue.omalloc)(C),d._ofree=C=>(d._ofree=ue.ofree)(C),d._getLastOnigError=()=>(d._getLastOnigError=ue.getLastOnigError)(),d._createOnigScanner=(C,R,B,F,G)=>(d._createOnigScanner=ue.createOnigScanner)(C,R,B,F,G),d._freeOnigScanner=C=>(d._freeOnigScanner=ue.freeOnigScanner)(C),d._findNextOnigScannerMatch=(C,R,B,F,G,W)=>(d._findNextOnigScannerMatch=ue.findNextOnigScannerMatch)(C,R,B,F,G,W),d._findNextOnigScannerMatchDbg=(C,R,B,F,G,W)=>(d._findNextOnigScannerMatchDbg=ue.findNextOnigScannerMatchDbg)(C,R,B,F,G,W),d.__embind_initialize_bindings=()=>(d.__embind_initialize_bindings=ue._embind_initialize_bindings)(),d.dynCall_jiji=(C,R,B,F,G)=>(d.dynCall_jiji=ue.dynCall_jiji)(C,R,B,F,G),d.UTF8ToString=xe,D=function C(){ke||Le(),ke||(D=C)},d.preInit)for(typeof d.preInit=="function"&&(d.preInit=[d.preInit]);d.preInit.length>0;)d.preInit.pop()();return Le(),a.ready});c.exports=t}},o={},function c(t){var a=o[t];if(a!==void 0)return a.exports;var l=o[t]={exports:{}};return i[t].call(l.exports,l,l.exports,c),l.exports}(770);var i,o})})(main$2);var mainExports$1=main$2.exports;const main$1=getDefaultExportFromCjs(mainExports$1),oniguruma=_mergeNamespaces({__proto__:null,default:main$1},[mainExports$1]);var main={exports:{}};(function(e,n){(function(i,o){e.exports=o()})(commonjsGlobal,()=>(()=>{var i={350:(c,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UseOnigurumaFindOptions=t.DebugFlags=void 0,t.DebugFlags={InDebugMode:typeof process<"u"&&!!define_process_env_default.VSCODE_TEXTMATE_DEBUG},t.UseOnigurumaFindOptions=!1},442:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.applyStateStackDiff=t.diffStateStacksRefEq=void 0;const l=a(391);t.diffStateStacksRefEq=function(p,d){let w=0;const y=[];let v=p,k=d;for(;v!==k;)v&&(!k||v.depth>=k.depth)?(w++,v=v.parent):(y.push(k.toStateStackFrame()),k=k.parent);return{pops:w,newFrames:y.reverse()}},t.applyStateStackDiff=function(p,d){let w=p;for(let y=0;y<d.pops;y++)w=w.parent;for(const y of d.newFrames)w=l.StateStackImpl.pushFrame(w,y);return w}},36:(c,t)=>{var a;Object.defineProperty(t,"__esModule",{value:!0}),t.toOptionalTokenType=t.EncodedTokenAttributes=void 0,(a=t.EncodedTokenAttributes||(t.EncodedTokenAttributes={})).toBinaryStr=function(l){return l.toString(2).padStart(32,"0")},a.print=function(l){const p=a.getLanguageId(l),d=a.getTokenType(l),w=a.getFontStyle(l),y=a.getForeground(l),v=a.getBackground(l);console.log({languageId:p,tokenType:d,fontStyle:w,foreground:y,background:v})},a.getLanguageId=function(l){return(255&l)>>>0},a.getTokenType=function(l){return(768&l)>>>8},a.containsBalancedBrackets=function(l){return(1024&l)!=0},a.getFontStyle=function(l){return(30720&l)>>>11},a.getForeground=function(l){return(16744448&l)>>>15},a.getBackground=function(l){return(4278190080&l)>>>24},a.set=function(l,p,d,w,y,v,k){let T=a.getLanguageId(l),_=a.getTokenType(l),N=a.containsBalancedBrackets(l)?1:0,S=a.getFontStyle(l),I=a.getForeground(l),x=a.getBackground(l);return p!==0&&(T=p),d!==8&&(_=d),w!==null&&(N=w?1:0),y!==-1&&(S=y),v!==0&&(I=v),k!==0&&(x=k),(T<<0|_<<8|N<<10|S<<11|I<<15|x<<24)>>>0},t.toOptionalTokenType=function(l){return l}},996:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BasicScopeAttributesProvider=t.BasicScopeAttributes=void 0;const l=a(878);class p{constructor(v,k){this.languageId=v,this.tokenType=k}}t.BasicScopeAttributes=p;class d{constructor(v,k){this._getBasicScopeAttributes=new l.CachedFn(T=>{const _=this._scopeToLanguage(T),N=this._toStandardTokenType(T);return new p(_,N)}),this._defaultAttributes=new p(v,8),this._embeddedLanguagesMatcher=new w(Object.entries(k||{}))}getDefaultAttributes(){return this._defaultAttributes}getBasicScopeAttributes(v){return v===null?d._NULL_SCOPE_METADATA:this._getBasicScopeAttributes.get(v)}_scopeToLanguage(v){return this._embeddedLanguagesMatcher.match(v)||0}_toStandardTokenType(v){const k=v.match(d.STANDARD_TOKEN_TYPE_REGEXP);if(!k)return 8;switch(k[1]){case"comment":return 1;case"string":return 2;case"regex":return 3;case"meta.embedded":return 0}throw new Error("Unexpected match for standard token type!")}}t.BasicScopeAttributesProvider=d,d._NULL_SCOPE_METADATA=new p(0,0),d.STANDARD_TOKEN_TYPE_REGEXP=/\b(comment|string|regex|meta\.embedded)\b/;class w{constructor(v){if(v.length===0)this.values=null,this.scopesRegExp=null;else{this.values=new Map(v);const k=v.map(([T,_])=>l.escapeRegExpCharacters(T));k.sort(),k.reverse(),this.scopesRegExp=new RegExp(`^((${k.join(")|(")}))($|\\.)`,"")}}match(v){if(!this.scopesRegExp)return;const k=v.match(this.scopesRegExp);return k?this.values.get(k[1]):void 0}}},947:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LineTokens=t.BalancedBracketSelectors=t.StateStackImpl=t.AttributedScopeStack=t.Grammar=t.createGrammar=void 0;const l=a(350),p=a(36),d=a(736),w=a(44),y=a(792),v=a(583),k=a(878),T=a(996),_=a(47);function N(f,u,b,m,A){const E=d.createMatchers(u,S),D=y.RuleFactory.getCompiledRuleId(b,m,A.repository);for(const O of E)f.push({debugSelector:u,matcher:O.matcher,ruleId:D,grammar:A,priority:O.priority})}function S(f,u){if(u.length<f.length)return!1;let b=0;return f.every(m=>{for(let A=b;A<u.length;A++)if(I(u[A],m))return b=A+1,!0;return!1})}function I(f,u){if(!f)return!1;if(f===u)return!0;const b=u.length;return f.length>b&&f.substr(0,b)===u&&f[b]==="."}t.createGrammar=function(f,u,b,m,A,E,D,O){return new x(f,u,b,m,A,E,D,O)};class x{constructor(u,b,m,A,E,D,O,j){if(this._rootScopeName=u,this.balancedBracketSelectors=D,this._onigLib=j,this._basicScopeAttributesProvider=new T.BasicScopeAttributesProvider(m,A),this._rootId=-1,this._lastRuleId=0,this._ruleId2desc=[null],this._includedGrammars={},this._grammarRepository=O,this._grammar=P(b,null),this._injections=null,this._tokenTypeMatchers=[],E)for(const z of Object.keys(E)){const V=d.createMatchers(z,S);for(const M of V)this._tokenTypeMatchers.push({matcher:M.matcher,type:E[z]})}}get themeProvider(){return this._grammarRepository}dispose(){for(const u of this._ruleId2desc)u&&u.dispose()}createOnigScanner(u){return this._onigLib.createOnigScanner(u)}createOnigString(u){return this._onigLib.createOnigString(u)}getMetadataForScope(u){return this._basicScopeAttributesProvider.getBasicScopeAttributes(u)}_collectInjections(){const u=[],b=this._rootScopeName,m=(A=>A===this._rootScopeName?this._grammar:this.getExternalGrammar(A))(b);if(m){const A=m.injections;if(A)for(let D in A)N(u,D,A[D],this,m);const E=this._grammarRepository.injections(b);E&&E.forEach(D=>{const O=this.getExternalGrammar(D);if(O){const j=O.injectionSelector;j&&N(u,j,O,this,O)}})}return u.sort((A,E)=>A.priority-E.priority),u}getInjections(){if(this._injections===null&&(this._injections=this._collectInjections(),l.DebugFlags.InDebugMode&&this._injections.length>0)){console.log(`Grammar ${this._rootScopeName} contains the following injections:`);for(const u of this._injections)console.log(`  - ${u.debugSelector}`)}return this._injections}registerRule(u){const b=++this._lastRuleId,m=u(y.ruleIdFromNumber(b));return this._ruleId2desc[b]=m,m}getRule(u){return this._ruleId2desc[y.ruleIdToNumber(u)]}getExternalGrammar(u,b){if(this._includedGrammars[u])return this._includedGrammars[u];if(this._grammarRepository){const m=this._grammarRepository.lookup(u);if(m)return this._includedGrammars[u]=P(m,b&&b.$base),this._includedGrammars[u]}}tokenizeLine(u,b,m=0){const A=this._tokenize(u,b,!1,m);return{tokens:A.lineTokens.getResult(A.ruleStack,A.lineLength),ruleStack:A.ruleStack,stoppedEarly:A.stoppedEarly}}tokenizeLine2(u,b,m=0){const A=this._tokenize(u,b,!0,m);return{tokens:A.lineTokens.getBinaryResult(A.ruleStack,A.lineLength),ruleStack:A.ruleStack,stoppedEarly:A.stoppedEarly}}_tokenize(u,b,m,A){let E;if(this._rootId===-1&&(this._rootId=y.RuleFactory.getCompiledRuleId(this._grammar.repository.$self,this,this._grammar.repository),this.getInjections()),b&&b!==s.NULL)E=!1,b.reset();else{E=!0;const V=this._basicScopeAttributesProvider.getDefaultAttributes(),M=this.themeProvider.getDefaults(),U=p.EncodedTokenAttributes.set(0,V.languageId,V.tokenType,null,M.fontStyle,M.foregroundId,M.backgroundId),J=this.getRule(this._rootId).getName(null,null);let Q;Q=J?h.createRootAndLookUpScopeName(J,U,this):h.createRoot("unknown",U),b=new s(null,this._rootId,-1,-1,!1,null,Q,Q)}u+=`
`;const D=this.createOnigString(u),O=D.content.length,j=new g(m,u,this._tokenTypeMatchers,this.balancedBracketSelectors),z=_._tokenizeString(this,D,E,0,b,j,!0,A);return w.disposeOnigString(D),{lineLength:O,lineTokens:j,ruleStack:z.stack,stoppedEarly:z.stoppedEarly}}}function P(f,u){return(f=k.clone(f)).repository=f.repository||{},f.repository.$self={$vscodeTextmateLocation:f.$vscodeTextmateLocation,patterns:f.patterns,name:f.scopeName},f.repository.$base=u||f.repository.$self,f}t.Grammar=x;class h{constructor(u,b,m){this.parent=u,this.scopePath=b,this.tokenAttributes=m}static fromExtension(u,b){let m=u,A=u?.scopePath??null;for(const E of b)A=v.ScopeStack.push(A,E.scopeNames),m=new h(m,A,E.encodedTokenAttributes);return m}static createRoot(u,b){return new h(null,new v.ScopeStack(null,u),b)}static createRootAndLookUpScopeName(u,b,m){const A=m.getMetadataForScope(u),E=new v.ScopeStack(null,u),D=m.themeProvider.themeMatch(E),O=h.mergeAttributes(b,A,D);return new h(null,E,O)}get scopeName(){return this.scopePath.scopeName}toString(){return this.getScopeNames().join(" ")}equals(u){return h.equals(this,u)}static equals(u,b){for(;;){if(u===b||!u&&!b)return!0;if(!u||!b||u.scopeName!==b.scopeName||u.tokenAttributes!==b.tokenAttributes)return!1;u=u.parent,b=b.parent}}static mergeAttributes(u,b,m){let A=-1,E=0,D=0;return m!==null&&(A=m.fontStyle,E=m.foregroundId,D=m.backgroundId),p.EncodedTokenAttributes.set(u,b.languageId,b.tokenType,null,A,E,D)}pushAttributed(u,b){if(u===null)return this;if(u.indexOf(" ")===-1)return h._pushAttributed(this,u,b);const m=u.split(/ /g);let A=this;for(const E of m)A=h._pushAttributed(A,E,b);return A}static _pushAttributed(u,b,m){const A=m.getMetadataForScope(b),E=u.scopePath.push(b),D=m.themeProvider.themeMatch(E),O=h.mergeAttributes(u.tokenAttributes,A,D);return new h(u,E,O)}getScopeNames(){return this.scopePath.getSegments()}getExtensionIfDefined(u){var b;const m=[];let A=this;for(;A&&A!==u;)m.push({encodedTokenAttributes:A.tokenAttributes,scopeNames:A.scopePath.getExtensionIfDefined(((b=A.parent)==null?void 0:b.scopePath)??null)}),A=A.parent;return A===u?m.reverse():void 0}}t.AttributedScopeStack=h;class s{constructor(u,b,m,A,E,D,O,j){this.parent=u,this.ruleId=b,this.beginRuleCapturedEOL=E,this.endRule=D,this.nameScopesList=O,this.contentNameScopesList=j,this._stackElementBrand=void 0,this.depth=this.parent?this.parent.depth+1:1,this._enterPos=m,this._anchorPos=A}equals(u){return u!==null&&s._equals(this,u)}static _equals(u,b){return u===b||!!this._structuralEquals(u,b)&&h.equals(u.contentNameScopesList,b.contentNameScopesList)}static _structuralEquals(u,b){for(;;){if(u===b||!u&&!b)return!0;if(!u||!b||u.depth!==b.depth||u.ruleId!==b.ruleId||u.endRule!==b.endRule)return!1;u=u.parent,b=b.parent}}clone(){return this}static _reset(u){for(;u;)u._enterPos=-1,u._anchorPos=-1,u=u.parent}reset(){s._reset(this)}pop(){return this.parent}safePop(){return this.parent?this.parent:this}push(u,b,m,A,E,D,O){return new s(this,u,b,m,A,E,D,O)}getEnterPos(){return this._enterPos}getAnchorPos(){return this._anchorPos}getRule(u){return u.getRule(this.ruleId)}toString(){const u=[];return this._writeString(u,0),"["+u.join(",")+"]"}_writeString(u,b){var m,A;return this.parent&&(b=this.parent._writeString(u,b)),u[b++]=`(${this.ruleId}, ${(m=this.nameScopesList)==null?void 0:m.toString()}, ${(A=this.contentNameScopesList)==null?void 0:A.toString()})`,b}withContentNameScopesList(u){return this.contentNameScopesList===u?this:this.parent.push(this.ruleId,this._enterPos,this._anchorPos,this.beginRuleCapturedEOL,this.endRule,this.nameScopesList,u)}withEndRule(u){return this.endRule===u?this:new s(this.parent,this.ruleId,this._enterPos,this._anchorPos,this.beginRuleCapturedEOL,u,this.nameScopesList,this.contentNameScopesList)}hasSameRuleAs(u){let b=this;for(;b&&b._enterPos===u._enterPos;){if(b.ruleId===u.ruleId)return!0;b=b.parent}return!1}toStateStackFrame(){var u,b,m;return{ruleId:y.ruleIdToNumber(this.ruleId),beginRuleCapturedEOL:this.beginRuleCapturedEOL,endRule:this.endRule,nameScopesList:((b=this.nameScopesList)==null?void 0:b.getExtensionIfDefined(((u=this.parent)==null?void 0:u.nameScopesList)??null))??[],contentNameScopesList:((m=this.contentNameScopesList)==null?void 0:m.getExtensionIfDefined(this.nameScopesList))??[]}}static pushFrame(u,b){const m=h.fromExtension(u?.nameScopesList??null,b.nameScopesList);return new s(u,y.ruleIdFromNumber(b.ruleId),b.enterPos??-1,b.anchorPos??-1,b.beginRuleCapturedEOL,b.endRule,m,h.fromExtension(m,b.contentNameScopesList))}}t.StateStackImpl=s,s.NULL=new s(null,0,0,0,!1,null,null,null),t.BalancedBracketSelectors=class{constructor(f,u){this.allowAny=!1,this.balancedBracketScopes=f.flatMap(b=>b==="*"?(this.allowAny=!0,[]):d.createMatchers(b,S).map(m=>m.matcher)),this.unbalancedBracketScopes=u.flatMap(b=>d.createMatchers(b,S).map(m=>m.matcher))}get matchesAlways(){return this.allowAny&&this.unbalancedBracketScopes.length===0}get matchesNever(){return this.balancedBracketScopes.length===0&&!this.allowAny}match(f){for(const u of this.unbalancedBracketScopes)if(u(f))return!1;for(const u of this.balancedBracketScopes)if(u(f))return!0;return this.allowAny}};class g{constructor(u,b,m,A){this.balancedBracketSelectors=A,this._emitBinaryTokens=u,this._tokenTypeOverrides=m,l.DebugFlags.InDebugMode?this._lineText=b:this._lineText=null,this._tokens=[],this._binaryTokens=[],this._lastTokenEndIndex=0}produce(u,b){this.produceFromScopes(u.contentNameScopesList,b)}produceFromScopes(u,b){var m;if(this._lastTokenEndIndex>=b)return;if(this._emitBinaryTokens){let E=u?.tokenAttributes??0,D=!1;if((m=this.balancedBracketSelectors)!=null&&m.matchesAlways&&(D=!0),this._tokenTypeOverrides.length>0||this.balancedBracketSelectors&&!this.balancedBracketSelectors.matchesAlways&&!this.balancedBracketSelectors.matchesNever){const O=u?.getScopeNames()??[];for(const j of this._tokenTypeOverrides)j.matcher(O)&&(E=p.EncodedTokenAttributes.set(E,0,p.toOptionalTokenType(j.type),null,-1,0,0));this.balancedBracketSelectors&&(D=this.balancedBracketSelectors.match(O))}if(D&&(E=p.EncodedTokenAttributes.set(E,0,8,D,-1,0,0)),this._binaryTokens.length>0&&this._binaryTokens[this._binaryTokens.length-1]===E)return void(this._lastTokenEndIndex=b);if(l.DebugFlags.InDebugMode){const O=u?.getScopeNames()??[];console.log("  token: |"+this._lineText.substring(this._lastTokenEndIndex,b).replace(/\n$/,"\\n")+"|");for(let j=0;j<O.length;j++)console.log("      * "+O[j])}return this._binaryTokens.push(this._lastTokenEndIndex),this._binaryTokens.push(E),void(this._lastTokenEndIndex=b)}const A=u?.getScopeNames()??[];if(l.DebugFlags.InDebugMode){console.log("  token: |"+this._lineText.substring(this._lastTokenEndIndex,b).replace(/\n$/,"\\n")+"|");for(let E=0;E<A.length;E++)console.log("      * "+A[E])}this._tokens.push({startIndex:this._lastTokenEndIndex,endIndex:b,scopes:A}),this._lastTokenEndIndex=b}getResult(u,b){return this._tokens.length>0&&this._tokens[this._tokens.length-1].startIndex===b-1&&this._tokens.pop(),this._tokens.length===0&&(this._lastTokenEndIndex=-1,this.produce(u,b),this._tokens[this._tokens.length-1].startIndex=0),this._tokens}getBinaryResult(u,b){this._binaryTokens.length>0&&this._binaryTokens[this._binaryTokens.length-2]===b-1&&(this._binaryTokens.pop(),this._binaryTokens.pop()),this._binaryTokens.length===0&&(this._lastTokenEndIndex=-1,this.produce(u,b),this._binaryTokens[this._binaryTokens.length-2]=0);const m=new Uint32Array(this._binaryTokens.length);for(let A=0,E=this._binaryTokens.length;A<E;A++)m[A]=this._binaryTokens[A];return m}}t.LineTokens=g},965:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.parseInclude=t.TopLevelRepositoryReference=t.TopLevelReference=t.RelativeReference=t.SelfReference=t.BaseReference=t.ScopeDependencyProcessor=t.ExternalReferenceCollector=t.TopLevelRepositoryRuleReference=t.TopLevelRuleReference=void 0;const l=a(878);class p{constructor(s){this.scopeName=s}toKey(){return this.scopeName}}t.TopLevelRuleReference=p;class d{constructor(s,g){this.scopeName=s,this.ruleName=g}toKey(){return`${this.scopeName}#${this.ruleName}`}}t.TopLevelRepositoryRuleReference=d;class w{constructor(){this._references=[],this._seenReferenceKeys=new Set,this.visitedRule=new Set}get references(){return this._references}add(s){const g=s.toKey();this._seenReferenceKeys.has(g)||(this._seenReferenceKeys.add(g),this._references.push(s))}}function y(h,s,g,f){const u=g.lookup(h.scopeName);if(!u){if(h.scopeName===s)throw new Error(`No grammar provided for <${s}>`);return}const b=g.lookup(s);h instanceof p?k({baseGrammar:b,selfGrammar:u},f):v(h.ruleName,{baseGrammar:b,selfGrammar:u,repository:u.repository},f);const m=g.injections(h.scopeName);if(m)for(const A of m)f.add(new p(A))}function v(h,s,g){s.repository&&s.repository[h]&&T([s.repository[h]],s,g)}function k(h,s){h.selfGrammar.patterns&&Array.isArray(h.selfGrammar.patterns)&&T(h.selfGrammar.patterns,{...h,repository:h.selfGrammar.repository},s),h.selfGrammar.injections&&T(Object.values(h.selfGrammar.injections),{...h,repository:h.selfGrammar.repository},s)}function T(h,s,g){for(const f of h){if(g.visitedRule.has(f))continue;g.visitedRule.add(f);const u=f.repository?l.mergeObjects({},s.repository,f.repository):s.repository;Array.isArray(f.patterns)&&T(f.patterns,{...s,repository:u},g);const b=f.include;if(!b)continue;const m=P(b);switch(m.kind){case 0:k({...s,selfGrammar:s.baseGrammar},g);break;case 1:k(s,g);break;case 2:v(m.ruleName,{...s,repository:u},g);break;case 3:case 4:const A=m.scopeName===s.selfGrammar.scopeName?s.selfGrammar:m.scopeName===s.baseGrammar.scopeName?s.baseGrammar:void 0;if(A){const E={baseGrammar:s.baseGrammar,selfGrammar:A,repository:u};m.kind===4?v(m.ruleName,E,g):k(E,g)}else m.kind===4?g.add(new d(m.scopeName,m.ruleName)):g.add(new p(m.scopeName))}}}t.ExternalReferenceCollector=w,t.ScopeDependencyProcessor=class{constructor(h,s){this.repo=h,this.initialScopeName=s,this.seenFullScopeRequests=new Set,this.seenPartialScopeRequests=new Set,this.seenFullScopeRequests.add(this.initialScopeName),this.Q=[new p(this.initialScopeName)]}processQueue(){const h=this.Q;this.Q=[];const s=new w;for(const g of h)y(g,this.initialScopeName,this.repo,s);for(const g of s.references)if(g instanceof p){if(this.seenFullScopeRequests.has(g.scopeName))continue;this.seenFullScopeRequests.add(g.scopeName),this.Q.push(g)}else{if(this.seenFullScopeRequests.has(g.scopeName)||this.seenPartialScopeRequests.has(g.toKey()))continue;this.seenPartialScopeRequests.add(g.toKey()),this.Q.push(g)}}};class _{constructor(){this.kind=0}}t.BaseReference=_;class N{constructor(){this.kind=1}}t.SelfReference=N;class S{constructor(s){this.ruleName=s,this.kind=2}}t.RelativeReference=S;class I{constructor(s){this.scopeName=s,this.kind=3}}t.TopLevelReference=I;class x{constructor(s,g){this.scopeName=s,this.ruleName=g,this.kind=4}}function P(h){if(h==="$base")return new _;if(h==="$self")return new N;const s=h.indexOf("#");if(s===-1)return new I(h);if(s===0)return new S(h.substring(1));{const g=h.substring(0,s),f=h.substring(s+1);return new x(g,f)}}t.TopLevelRepositoryReference=x,t.parseInclude=P},391:function(c,t,a){var l=this&&this.__createBinding||(Object.create?function(d,w,y,v){v===void 0&&(v=y),Object.defineProperty(d,v,{enumerable:!0,get:function(){return w[y]}})}:function(d,w,y,v){v===void 0&&(v=y),d[v]=w[y]}),p=this&&this.__exportStar||function(d,w){for(var y in d)y==="default"||Object.prototype.hasOwnProperty.call(w,y)||l(w,d,y)};Object.defineProperty(t,"__esModule",{value:!0}),p(a(947),t)},47:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LocalStackElement=t._tokenizeString=void 0;const l=a(350),p=a(44),d=a(792),w=a(878);class y{constructor(x,P){this.stack=x,this.stoppedEarly=P}}function v(I,x,P,h,s,g,f,u){const b=x.content.length;let m=!1,A=-1;if(f){const O=function(j,z,V,M,U,J){let Q=U.beginRuleCapturedEOL?0:-1;const H=[];for(let $=U;$;$=$.pop()){const q=$.getRule(j);q instanceof d.BeginWhileRule&&H.push({rule:q,stack:$})}for(let $=H.pop();$;$=H.pop()){const{ruleScanner:q,findOptions:ie}=T($.rule,j,$.stack.endRule,V,M===Q),L=q.findNextMatchSync(z,M,ie);if(l.DebugFlags.InDebugMode&&(console.log("  scanning for while rule"),console.log(q.toString())),!L){l.DebugFlags.InDebugMode&&console.log("  popping "+$.rule.debugName+" - "+$.rule.debugWhileRegExp),U=$.stack.pop();break}if(L.ruleId!==d.whileRuleId){U=$.stack.pop();break}L.captureIndices&&L.captureIndices.length&&(J.produce($.stack,L.captureIndices[0].start),N(j,z,V,$.stack,J,$.rule.whileCaptures,L.captureIndices),J.produce($.stack,L.captureIndices[0].end),Q=L.captureIndices[0].end,L.captureIndices[0].end>M&&(M=L.captureIndices[0].end,V=!1))}return{stack:U,linePos:M,anchorPosition:Q,isFirstLine:V}}(I,x,P,h,s,g);s=O.stack,h=O.linePos,P=O.isFirstLine,A=O.anchorPosition}const E=Date.now();for(;!m;){if(u!==0&&Date.now()-E>u)return new y(s,!0);D()}return new y(s,!1);function D(){l.DebugFlags.InDebugMode&&(console.log(""),console.log(`@@scanNext ${h}: |${x.content.substr(h).replace(/\n$/,"\\n")}|`));const O=function(M,U,J,Q,H,$){const q=function(de,ce,Ee,ae,ge,Se){const be=ge.getRule(de),{ruleScanner:fe,findOptions:ve}=k(be,de,ge.endRule,Ee,ae===Se);let me=0;l.DebugFlags.InDebugMode&&(me=w.performanceNow());const pe=fe.findNextMatchSync(ce,ae,ve);if(l.DebugFlags.InDebugMode){const we=w.performanceNow()-me;we>5&&console.warn(`Rule ${be.debugName} (${be.id}) matching took ${we} against '${ce}'`),console.log(`  scanning for (linePos: ${ae}, anchorPosition: ${Se})`),console.log(fe.toString()),pe&&console.log(`matched rule id: ${pe.ruleId} from ${pe.captureIndices[0].start} to ${pe.captureIndices[0].end}`)}return pe?{captureIndices:pe.captureIndices,matchedRuleId:pe.ruleId}:null}(M,U,J,Q,H,$),ie=M.getInjections();if(ie.length===0)return q;const L=function(de,ce,Ee,ae,ge,Se,be){let fe,ve=Number.MAX_VALUE,me=null,pe=0;const we=Se.contentNameScopesList.getScopeNames();for(let Pe=0,Te=de.length;Pe<Te;Pe++){const xe=de[Pe];if(!xe.matcher(we))continue;const Ie=ce.getRule(xe.ruleId),{ruleScanner:Ce,findOptions:Ne}=k(Ie,ce,null,ae,ge===be),Ae=Ce.findNextMatchSync(Ee,ge,Ne);if(!Ae)continue;l.DebugFlags.InDebugMode&&(console.log(`  matched injection: ${xe.debugSelector}`),console.log(Ce.toString()));const De=Ae.captureIndices[0].start;if(!(De>=ve)&&(ve=De,me=Ae.captureIndices,fe=Ae.ruleId,pe=xe.priority,ve===ge))break}return me?{priorityMatch:pe===-1,captureIndices:me,matchedRuleId:fe}:null}(ie,M,U,J,Q,H,$);if(!L)return q;if(!q)return L;const ee=q.captureIndices[0].start,ne=L.captureIndices[0].start;return ne<ee||L.priorityMatch&&ne===ee?L:q}(I,x,P,h,s,A);if(!O)return l.DebugFlags.InDebugMode&&console.log("  no more matches."),g.produce(s,b),void(m=!0);const j=O.captureIndices,z=O.matchedRuleId,V=!!(j&&j.length>0)&&j[0].end>h;if(z===d.endRuleId){const M=s.getRule(I);l.DebugFlags.InDebugMode&&console.log("  popping "+M.debugName+" - "+M.debugEndRegExp),g.produce(s,j[0].start),s=s.withContentNameScopesList(s.nameScopesList),N(I,x,P,s,g,M.endCaptures,j),g.produce(s,j[0].end);const U=s;if(s=s.parent,A=U.getAnchorPos(),!V&&U.getEnterPos()===h)return l.DebugFlags.InDebugMode&&console.error("[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"),s=U,g.produce(s,b),void(m=!0)}else{const M=I.getRule(z);g.produce(s,j[0].start);const U=s,J=M.getName(x.content,j),Q=s.contentNameScopesList.pushAttributed(J,I);if(s=s.push(z,h,A,j[0].end===b,null,Q,Q),M instanceof d.BeginEndRule){const H=M;l.DebugFlags.InDebugMode&&console.log("  pushing "+H.debugName+" - "+H.debugBeginRegExp),N(I,x,P,s,g,H.beginCaptures,j),g.produce(s,j[0].end),A=j[0].end;const $=H.getContentName(x.content,j),q=Q.pushAttributed($,I);if(s=s.withContentNameScopesList(q),H.endHasBackReferences&&(s=s.withEndRule(H.getEndWithResolvedBackReferences(x.content,j))),!V&&U.hasSameRuleAs(s))return l.DebugFlags.InDebugMode&&console.error("[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"),s=s.pop(),g.produce(s,b),void(m=!0)}else if(M instanceof d.BeginWhileRule){const H=M;l.DebugFlags.InDebugMode&&console.log("  pushing "+H.debugName),N(I,x,P,s,g,H.beginCaptures,j),g.produce(s,j[0].end),A=j[0].end;const $=H.getContentName(x.content,j),q=Q.pushAttributed($,I);if(s=s.withContentNameScopesList(q),H.whileHasBackReferences&&(s=s.withEndRule(H.getWhileWithResolvedBackReferences(x.content,j))),!V&&U.hasSameRuleAs(s))return l.DebugFlags.InDebugMode&&console.error("[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"),s=s.pop(),g.produce(s,b),void(m=!0)}else{const H=M;if(l.DebugFlags.InDebugMode&&console.log("  matched "+H.debugName+" - "+H.debugMatchRegExp),N(I,x,P,s,g,H.captures,j),g.produce(s,j[0].end),s=s.pop(),!V)return l.DebugFlags.InDebugMode&&console.error("[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"),s=s.safePop(),g.produce(s,b),void(m=!0)}}j[0].end>h&&(h=j[0].end,P=!1)}}function k(I,x,P,h,s){return l.UseOnigurumaFindOptions?{ruleScanner:I.compile(x,P),findOptions:_(h,s)}:{ruleScanner:I.compileAG(x,P,h,s),findOptions:0}}function T(I,x,P,h,s){return l.UseOnigurumaFindOptions?{ruleScanner:I.compileWhile(x,P),findOptions:_(h,s)}:{ruleScanner:I.compileWhileAG(x,P,h,s),findOptions:0}}function _(I,x){let P=0;return I||(P|=1),x||(P|=4),P}function N(I,x,P,h,s,g,f){if(g.length===0)return;const u=x.content,b=Math.min(g.length,f.length),m=[],A=f[0].end;for(let E=0;E<b;E++){const D=g[E];if(D===null)continue;const O=f[E];if(O.length===0)continue;if(O.start>A)break;for(;m.length>0&&m[m.length-1].endPos<=O.start;)s.produceFromScopes(m[m.length-1].scopes,m[m.length-1].endPos),m.pop();if(m.length>0?s.produceFromScopes(m[m.length-1].scopes,O.start):s.produce(h,O.start),D.retokenizeCapturedWithRuleId){const z=D.getName(u,f),V=h.contentNameScopesList.pushAttributed(z,I),M=D.getContentName(u,f),U=V.pushAttributed(M,I),J=h.push(D.retokenizeCapturedWithRuleId,O.start,-1,!1,null,V,U),Q=I.createOnigString(u.substring(0,O.end));v(I,Q,P&&O.start===0,O.start,J,s,!1,0),p.disposeOnigString(Q);continue}const j=D.getName(u,f);if(j!==null){const z=(m.length>0?m[m.length-1].scopes:h.contentNameScopesList).pushAttributed(j,I);m.push(new S(z,O.end))}}for(;m.length>0;)s.produceFromScopes(m[m.length-1].scopes,m[m.length-1].endPos),m.pop()}t._tokenizeString=v;class S{constructor(x,P){this.scopes=x,this.endPos=P}}t.LocalStackElement=S},974:(c,t)=>{function a(w,y){throw new Error("Near offset "+w.pos+": "+y+" ~~~"+w.source.substr(w.pos,50)+"~~~")}Object.defineProperty(t,"__esModule",{value:!0}),t.parseJSON=void 0,t.parseJSON=function(w,y,v){let k=new l(w),T=new p,_=0,N=null,S=[],I=[];function x(){S.push(_),I.push(N)}function P(){_=S.pop(),N=I.pop()}function h(s){a(k,s)}for(;d(k,T);){if(_===0){if(N!==null&&h("too many constructs in root"),T.type===3){N={},v&&(N.$vscodeTextmateLocation=T.toLocation(y)),x(),_=1;continue}if(T.type===2){N=[],x(),_=4;continue}h("unexpected token in root")}if(_===2){if(T.type===5){P();continue}if(T.type===7){_=3;continue}h("expected , or }")}if(_===1||_===3){if(_===1&&T.type===5){P();continue}if(T.type===1){let s=T.value;if(d(k,T)&&T.type===6||h("expected colon"),d(k,T)||h("expected value"),_=2,T.type===1){N[s]=T.value;continue}if(T.type===8){N[s]=null;continue}if(T.type===9){N[s]=!0;continue}if(T.type===10){N[s]=!1;continue}if(T.type===11){N[s]=parseFloat(T.value);continue}if(T.type===2){let g=[];N[s]=g,x(),_=4,N=g;continue}if(T.type===3){let g={};v&&(g.$vscodeTextmateLocation=T.toLocation(y)),N[s]=g,x(),_=1,N=g;continue}}h("unexpected token in dict")}if(_===5){if(T.type===4){P();continue}if(T.type===7){_=6;continue}h("expected , or ]")}if(_===4||_===6){if(_===4&&T.type===4){P();continue}if(_=5,T.type===1){N.push(T.value);continue}if(T.type===8){N.push(null);continue}if(T.type===9){N.push(!0);continue}if(T.type===10){N.push(!1);continue}if(T.type===11){N.push(parseFloat(T.value));continue}if(T.type===2){let s=[];N.push(s),x(),_=4,N=s;continue}if(T.type===3){let s={};v&&(s.$vscodeTextmateLocation=T.toLocation(y)),N.push(s),x(),_=1,N=s;continue}h("unexpected token in array")}h("unknown state")}return I.length!==0&&h("unclosed constructs"),N};class l{constructor(y){this.source=y,this.pos=0,this.len=y.length,this.line=1,this.char=0}}class p{constructor(){this.value=null,this.type=0,this.offset=-1,this.len=-1,this.line=-1,this.char=-1}toLocation(y){return{filename:y,line:this.line,char:this.char}}}function d(w,y){y.value=null,y.type=0,y.offset=-1,y.len=-1,y.line=-1,y.char=-1;let v,k=w.source,T=w.pos,_=w.len,N=w.line,S=w.char;for(;;){if(T>=_)return!1;if(v=k.charCodeAt(T),v!==32&&v!==9&&v!==13){if(v!==10)break;T++,N++,S=0}else T++,S++}if(y.offset=T,y.line=N,y.char=S,v===34){for(y.type=1,T++,S++;;){if(T>=_)return!1;if(v=k.charCodeAt(T),T++,S++,v!==92){if(v===34)break}else T++,S++}y.value=k.substring(y.offset+1,T-1).replace(/\\u([0-9A-Fa-f]{4})/g,(I,x)=>String.fromCodePoint(parseInt(x,16))).replace(/\\(.)/g,(I,x)=>{switch(x){case'"':return'"';case"\\":return"\\";case"/":return"/";case"b":return"\b";case"f":return"\f";case"n":return`
`;case"r":return"\r";case"t":return"	";default:a(w,"invalid escape sequence")}throw new Error("unreachable")})}else if(v===91)y.type=2,T++,S++;else if(v===123)y.type=3,T++,S++;else if(v===93)y.type=4,T++,S++;else if(v===125)y.type=5,T++,S++;else if(v===58)y.type=6,T++,S++;else if(v===44)y.type=7,T++,S++;else if(v===110){if(y.type=8,T++,S++,v=k.charCodeAt(T),v!==117||(T++,S++,v=k.charCodeAt(T),v!==108)||(T++,S++,v=k.charCodeAt(T),v!==108))return!1;T++,S++}else if(v===116){if(y.type=9,T++,S++,v=k.charCodeAt(T),v!==114||(T++,S++,v=k.charCodeAt(T),v!==117)||(T++,S++,v=k.charCodeAt(T),v!==101))return!1;T++,S++}else if(v===102){if(y.type=10,T++,S++,v=k.charCodeAt(T),v!==97||(T++,S++,v=k.charCodeAt(T),v!==108)||(T++,S++,v=k.charCodeAt(T),v!==115)||(T++,S++,v=k.charCodeAt(T),v!==101))return!1;T++,S++}else for(y.type=11;;){if(T>=_)return!1;if(v=k.charCodeAt(T),!(v===46||v>=48&&v<=57||v===101||v===69||v===45||v===43))break;T++,S++}return y.len=T-y.offset,y.value===null&&(y.value=k.substr(y.offset,y.len)),w.pos=T,w.line=N,w.char=S,!0}},787:function(c,t,a){var l=this&&this.__createBinding||(Object.create?function(_,N,S,I){I===void 0&&(I=S),Object.defineProperty(_,I,{enumerable:!0,get:function(){return N[S]}})}:function(_,N,S,I){I===void 0&&(I=S),_[I]=N[S]}),p=this&&this.__exportStar||function(_,N){for(var S in _)S==="default"||Object.prototype.hasOwnProperty.call(N,S)||l(N,_,S)};Object.defineProperty(t,"__esModule",{value:!0}),t.applyStateStackDiff=t.diffStateStacksRefEq=t.parseRawGrammar=t.INITIAL=t.Registry=void 0;const d=a(391),w=a(50),y=a(652),v=a(583),k=a(965),T=a(442);Object.defineProperty(t,"applyStateStackDiff",{enumerable:!0,get:function(){return T.applyStateStackDiff}}),Object.defineProperty(t,"diffStateStacksRefEq",{enumerable:!0,get:function(){return T.diffStateStacksRefEq}}),p(a(44),t),t.Registry=class{constructor(_){this._options=_,this._syncRegistry=new y.SyncRegistry(v.Theme.createFromRawTheme(_.theme,_.colorMap),_.onigLib),this._ensureGrammarCache=new Map}dispose(){this._syncRegistry.dispose()}setTheme(_,N){this._syncRegistry.setTheme(v.Theme.createFromRawTheme(_,N))}getColorMap(){return this._syncRegistry.getColorMap()}loadGrammarWithEmbeddedLanguages(_,N,S){return this.loadGrammarWithConfiguration(_,N,{embeddedLanguages:S})}loadGrammarWithConfiguration(_,N,S){return this._loadGrammar(_,N,S.embeddedLanguages,S.tokenTypes,new d.BalancedBracketSelectors(S.balancedBracketSelectors||[],S.unbalancedBracketSelectors||[]))}loadGrammar(_){return this._loadGrammar(_,0,null,null,null)}async _loadGrammar(_,N,S,I,x){const P=new k.ScopeDependencyProcessor(this._syncRegistry,_);for(;P.Q.length>0;)await Promise.all(P.Q.map(h=>this._loadSingleGrammar(h.scopeName))),P.processQueue();return this._grammarForScopeName(_,N,S,I,x)}async _loadSingleGrammar(_){return this._ensureGrammarCache.has(_)||this._ensureGrammarCache.set(_,this._doLoadSingleGrammar(_)),this._ensureGrammarCache.get(_)}async _doLoadSingleGrammar(_){const N=await this._options.loadGrammar(_);if(N){const S=typeof this._options.getInjections=="function"?this._options.getInjections(_):void 0;this._syncRegistry.addGrammar(N,S)}}async addGrammar(_,N=[],S=0,I=null){return this._syncRegistry.addGrammar(_,N),await this._grammarForScopeName(_.scopeName,S,I)}_grammarForScopeName(_,N=0,S=null,I=null,x=null){return this._syncRegistry.grammarForScopeName(_,N,S,I,x)}},t.INITIAL=d.StateStackImpl.NULL,t.parseRawGrammar=w.parseRawGrammar},736:(c,t)=>{function a(l){return!!l&&!!l.match(/[\w\.:]+/)}Object.defineProperty(t,"__esModule",{value:!0}),t.createMatchers=void 0,t.createMatchers=function(l,p){const d=[],w=function(T){let _=/([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g,N=_.exec(T);return{next:()=>{if(!N)return null;const S=N[0];return N=_.exec(T),S}}}(l);let y=w.next();for(;y!==null;){let T=0;if(y.length===2&&y.charAt(1)===":"){switch(y.charAt(0)){case"R":T=1;break;case"L":T=-1;break;default:console.log(`Unknown priority ${y} in scope selector`)}y=w.next()}let _=k();if(d.push({matcher:_,priority:T}),y!==",")break;y=w.next()}return d;function v(){if(y==="-"){y=w.next();const T=v();return _=>!!T&&!T(_)}if(y==="("){y=w.next();const T=function(){const _=[];let N=k();for(;N&&(_.push(N),y==="|"||y===",");){do y=w.next();while(y==="|"||y===",");N=k()}return S=>_.some(I=>I(S))}();return y===")"&&(y=w.next()),T}if(a(y)){const T=[];do T.push(y),y=w.next();while(a(y));return _=>p(T,_)}return null}function k(){const T=[];let _=v();for(;_;)T.push(_),_=v();return N=>T.every(S=>S(N))}}},44:(c,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.disposeOnigString=void 0,t.disposeOnigString=function(a){typeof a.dispose=="function"&&a.dispose()}},50:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.parseRawGrammar=void 0;const l=a(69),p=a(350),d=a(974);t.parseRawGrammar=function(w,y=null){return y!==null&&/\.json$/.test(y)?(v=w,k=y,p.DebugFlags.InDebugMode?d.parseJSON(v,k,!0):JSON.parse(v)):function(T,_){return p.DebugFlags.InDebugMode?l.parseWithLocation(T,_,"$vscodeTextmateLocation"):l.parsePLIST(T)}(w,y);var v,k}},69:(c,t)=>{function a(l,p,d){const w=l.length;let y=0,v=1,k=0;function T(L){if(d===null)y+=L;else for(;L>0;)l.charCodeAt(y)===10?(y++,v++,k=0):(y++,k++),L--}function _(L){d===null?y=L:T(L-y)}function N(){for(;y<w;){let L=l.charCodeAt(y);if(L!==32&&L!==9&&L!==13&&L!==10)break;T(1)}}function S(L){return l.substr(y,L.length)===L&&(T(L.length),!0)}function I(L){let ee=l.indexOf(L,y);_(ee!==-1?ee+L.length:w)}function x(L){let ee=l.indexOf(L,y);if(ee!==-1){let ne=l.substring(y,ee);return _(ee+L.length),ne}{let ne=l.substr(y);return _(w),ne}}w>0&&l.charCodeAt(0)===65279&&(y=1);let P=0,h=null,s=[],g=[],f=null;function u(L,ee){s.push(P),g.push(h),P=L,h=ee}function b(){if(s.length===0)return m("illegal state stack");P=s.pop(),h=g.pop()}function m(L){throw new Error("Near offset "+y+": "+L+" ~~~"+l.substr(y,50)+"~~~")}const A=function(){if(f===null)return m("missing <key>");let L={};d!==null&&(L[d]={filename:p,line:v,char:k}),h[f]=L,f=null,u(1,L)},E=function(){if(f===null)return m("missing <key>");let L=[];h[f]=L,f=null,u(2,L)},D=function(){let L={};d!==null&&(L[d]={filename:p,line:v,char:k}),h.push(L),u(1,L)},O=function(){let L=[];h.push(L),u(2,L)};function j(){if(P!==1)return m("unexpected </dict>");b()}function z(){return P===1||P!==2?m("unexpected </array>"):void b()}function V(L){if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function M(L){if(isNaN(L))return m("cannot parse float");if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function U(L){if(isNaN(L))return m("cannot parse integer");if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function J(L){if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function Q(L){if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function H(L){if(P===1){if(f===null)return m("missing <key>");h[f]=L,f=null}else P===2?h.push(L):h=L}function $(){let L=x(">"),ee=!1;return L.charCodeAt(L.length-1)===47&&(ee=!0,L=L.substring(0,L.length-1)),{name:L.trim(),isClosed:ee}}function q(L){if(L.isClosed)return"";let ee=x("</");return I(">"),ee.replace(/&#([0-9]+);/g,function(ne,de){return String.fromCodePoint(parseInt(de,10))}).replace(/&#x([0-9a-f]+);/g,function(ne,de){return String.fromCodePoint(parseInt(de,16))}).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g,function(ne){switch(ne){case"&amp;":return"&";case"&lt;":return"<";case"&gt;":return">";case"&quot;":return'"';case"&apos;":return"'"}return ne})}for(;y<w&&(N(),!(y>=w));){const L=l.charCodeAt(y);if(T(1),L!==60)return m("expected <");if(y>=w)return m("unexpected end of input");const ee=l.charCodeAt(y);if(ee===63){T(1),I("?>");continue}if(ee===33){if(T(1),S("--")){I("-->");continue}I(">");continue}if(ee===47){if(T(1),N(),S("plist")){I(">");continue}if(S("dict")){I(">"),j();continue}if(S("array")){I(">"),z();continue}return m("unexpected closed tag")}let ne=$();switch(ne.name){case"dict":P===1?A():P===2?D():(h={},d!==null&&(h[d]={filename:p,line:v,char:k}),u(1,h)),ne.isClosed&&j();continue;case"array":P===1?E():P===2?O():(h=[],u(2,h)),ne.isClosed&&z();continue;case"key":ie=q(ne),P!==1?m("unexpected <key>"):f!==null?m("too many <key>"):f=ie;continue;case"string":V(q(ne));continue;case"real":M(parseFloat(q(ne)));continue;case"integer":U(parseInt(q(ne),10));continue;case"date":J(new Date(q(ne)));continue;case"data":Q(q(ne));continue;case"true":q(ne),H(!0);continue;case"false":q(ne),H(!1);continue}if(!/^plist/.test(ne.name))return m("unexpected opened tag "+ne.name)}var ie;return h}Object.defineProperty(t,"__esModule",{value:!0}),t.parsePLIST=t.parseWithLocation=void 0,t.parseWithLocation=function(l,p,d){return a(l,p,d)},t.parsePLIST=function(l){return a(l,null,null)}},652:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SyncRegistry=void 0;const l=a(391);t.SyncRegistry=class{constructor(p,d){this._onigLibPromise=d,this._grammars=new Map,this._rawGrammars=new Map,this._injectionGrammars=new Map,this._theme=p}dispose(){for(const p of this._grammars.values())p.dispose()}setTheme(p){this._theme=p}getColorMap(){return this._theme.getColorMap()}addGrammar(p,d){this._rawGrammars.set(p.scopeName,p),d&&this._injectionGrammars.set(p.scopeName,d)}lookup(p){return this._rawGrammars.get(p)}injections(p){return this._injectionGrammars.get(p)}getDefaults(){return this._theme.getDefaults()}themeMatch(p){return this._theme.match(p)}async grammarForScopeName(p,d,w,y,v){if(!this._grammars.has(p)){let k=this._rawGrammars.get(p);if(!k)return null;this._grammars.set(p,l.createGrammar(p,k,d,w,y,v,this,await this._onigLibPromise))}return this._grammars.get(p)}}},792:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CompiledRule=t.RegExpSourceList=t.RegExpSource=t.RuleFactory=t.BeginWhileRule=t.BeginEndRule=t.IncludeOnlyRule=t.MatchRule=t.CaptureRule=t.Rule=t.ruleIdToNumber=t.ruleIdFromNumber=t.whileRuleId=t.endRuleId=void 0;const l=a(878),p=a(965),d=/\\(\d+)/,w=/\\(\d+)/g;t.endRuleId=-1,t.whileRuleId=-2,t.ruleIdFromNumber=function(h){return h},t.ruleIdToNumber=function(h){return h};class y{constructor(s,g,f,u){this.$location=s,this.id=g,this._name=f||null,this._nameIsCapturing=l.RegexSource.hasCaptures(this._name),this._contentName=u||null,this._contentNameIsCapturing=l.RegexSource.hasCaptures(this._contentName)}get debugName(){const s=this.$location?`${l.basename(this.$location.filename)}:${this.$location.line}`:"unknown";return`${this.constructor.name}#${this.id} @ ${s}`}getName(s,g){return this._nameIsCapturing&&this._name!==null&&s!==null&&g!==null?l.RegexSource.replaceCaptures(this._name,s,g):this._name}getContentName(s,g){return this._contentNameIsCapturing&&this._contentName!==null?l.RegexSource.replaceCaptures(this._contentName,s,g):this._contentName}}t.Rule=y;class v extends y{constructor(s,g,f,u,b){super(s,g,f,u),this.retokenizeCapturedWithRuleId=b}dispose(){}collectPatterns(s,g){throw new Error("Not supported!")}compile(s,g){throw new Error("Not supported!")}compileAG(s,g,f,u){throw new Error("Not supported!")}}t.CaptureRule=v;class k extends y{constructor(s,g,f,u,b){super(s,g,f,null),this._match=new I(u,this.id),this.captures=b,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}get debugMatchRegExp(){return`${this._match.source}`}collectPatterns(s,g){g.push(this._match)}compile(s,g){return this._getCachedCompiledPatterns(s).compile(s)}compileAG(s,g,f,u){return this._getCachedCompiledPatterns(s).compileAG(s,f,u)}_getCachedCompiledPatterns(s){return this._cachedCompiledPatterns||(this._cachedCompiledPatterns=new x,this.collectPatterns(s,this._cachedCompiledPatterns)),this._cachedCompiledPatterns}}t.MatchRule=k;class T extends y{constructor(s,g,f,u,b){super(s,g,f,u),this.patterns=b.patterns,this.hasMissingPatterns=b.hasMissingPatterns,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}collectPatterns(s,g){for(const f of this.patterns)s.getRule(f).collectPatterns(s,g)}compile(s,g){return this._getCachedCompiledPatterns(s).compile(s)}compileAG(s,g,f,u){return this._getCachedCompiledPatterns(s).compileAG(s,f,u)}_getCachedCompiledPatterns(s){return this._cachedCompiledPatterns||(this._cachedCompiledPatterns=new x,this.collectPatterns(s,this._cachedCompiledPatterns)),this._cachedCompiledPatterns}}t.IncludeOnlyRule=T;class _ extends y{constructor(s,g,f,u,b,m,A,E,D,O){super(s,g,f,u),this._begin=new I(b,this.id),this.beginCaptures=m,this._end=new I(A||"￿",-1),this.endHasBackReferences=this._end.hasBackReferences,this.endCaptures=E,this.applyEndPatternLast=D||!1,this.patterns=O.patterns,this.hasMissingPatterns=O.hasMissingPatterns,this._cachedCompiledPatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null)}get debugBeginRegExp(){return`${this._begin.source}`}get debugEndRegExp(){return`${this._end.source}`}getEndWithResolvedBackReferences(s,g){return this._end.resolveBackReferences(s,g)}collectPatterns(s,g){g.push(this._begin)}compile(s,g){return this._getCachedCompiledPatterns(s,g).compile(s)}compileAG(s,g,f,u){return this._getCachedCompiledPatterns(s,g).compileAG(s,f,u)}_getCachedCompiledPatterns(s,g){if(!this._cachedCompiledPatterns){this._cachedCompiledPatterns=new x;for(const f of this.patterns)s.getRule(f).collectPatterns(s,this._cachedCompiledPatterns);this.applyEndPatternLast?this._cachedCompiledPatterns.push(this._end.hasBackReferences?this._end.clone():this._end):this._cachedCompiledPatterns.unshift(this._end.hasBackReferences?this._end.clone():this._end)}return this._end.hasBackReferences&&(this.applyEndPatternLast?this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length()-1,g):this._cachedCompiledPatterns.setSource(0,g)),this._cachedCompiledPatterns}}t.BeginEndRule=_;class N extends y{constructor(s,g,f,u,b,m,A,E,D){super(s,g,f,u),this._begin=new I(b,this.id),this.beginCaptures=m,this.whileCaptures=E,this._while=new I(A,t.whileRuleId),this.whileHasBackReferences=this._while.hasBackReferences,this.patterns=D.patterns,this.hasMissingPatterns=D.hasMissingPatterns,this._cachedCompiledPatterns=null,this._cachedCompiledWhilePatterns=null}dispose(){this._cachedCompiledPatterns&&(this._cachedCompiledPatterns.dispose(),this._cachedCompiledPatterns=null),this._cachedCompiledWhilePatterns&&(this._cachedCompiledWhilePatterns.dispose(),this._cachedCompiledWhilePatterns=null)}get debugBeginRegExp(){return`${this._begin.source}`}get debugWhileRegExp(){return`${this._while.source}`}getWhileWithResolvedBackReferences(s,g){return this._while.resolveBackReferences(s,g)}collectPatterns(s,g){g.push(this._begin)}compile(s,g){return this._getCachedCompiledPatterns(s).compile(s)}compileAG(s,g,f,u){return this._getCachedCompiledPatterns(s).compileAG(s,f,u)}_getCachedCompiledPatterns(s){if(!this._cachedCompiledPatterns){this._cachedCompiledPatterns=new x;for(const g of this.patterns)s.getRule(g).collectPatterns(s,this._cachedCompiledPatterns)}return this._cachedCompiledPatterns}compileWhile(s,g){return this._getCachedCompiledWhilePatterns(s,g).compile(s)}compileWhileAG(s,g,f,u){return this._getCachedCompiledWhilePatterns(s,g).compileAG(s,f,u)}_getCachedCompiledWhilePatterns(s,g){return this._cachedCompiledWhilePatterns||(this._cachedCompiledWhilePatterns=new x,this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences?this._while.clone():this._while)),this._while.hasBackReferences&&this._cachedCompiledWhilePatterns.setSource(0,g||"￿"),this._cachedCompiledWhilePatterns}}t.BeginWhileRule=N;class S{static createCaptureRule(s,g,f,u,b){return s.registerRule(m=>new v(g,m,f,u,b))}static getCompiledRuleId(s,g,f){return s.id||g.registerRule(u=>{if(s.id=u,s.match)return new k(s.$vscodeTextmateLocation,s.id,s.name,s.match,S._compileCaptures(s.captures,g,f));if(s.begin===void 0){s.repository&&(f=l.mergeObjects({},f,s.repository));let b=s.patterns;return b===void 0&&s.include&&(b=[{include:s.include}]),new T(s.$vscodeTextmateLocation,s.id,s.name,s.contentName,S._compilePatterns(b,g,f))}return s.while?new N(s.$vscodeTextmateLocation,s.id,s.name,s.contentName,s.begin,S._compileCaptures(s.beginCaptures||s.captures,g,f),s.while,S._compileCaptures(s.whileCaptures||s.captures,g,f),S._compilePatterns(s.patterns,g,f)):new _(s.$vscodeTextmateLocation,s.id,s.name,s.contentName,s.begin,S._compileCaptures(s.beginCaptures||s.captures,g,f),s.end,S._compileCaptures(s.endCaptures||s.captures,g,f),s.applyEndPatternLast,S._compilePatterns(s.patterns,g,f))}),s.id}static _compileCaptures(s,g,f){let u=[];if(s){let b=0;for(const m in s){if(m==="$vscodeTextmateLocation")continue;const A=parseInt(m,10);A>b&&(b=A)}for(let m=0;m<=b;m++)u[m]=null;for(const m in s){if(m==="$vscodeTextmateLocation")continue;const A=parseInt(m,10);let E=0;s[m].patterns&&(E=S.getCompiledRuleId(s[m],g,f)),u[A]=S.createCaptureRule(g,s[m].$vscodeTextmateLocation,s[m].name,s[m].contentName,E)}}return u}static _compilePatterns(s,g,f){let u=[];if(s)for(let b=0,m=s.length;b<m;b++){const A=s[b];let E=-1;if(A.include){const D=p.parseInclude(A.include);switch(D.kind){case 0:case 1:E=S.getCompiledRuleId(f[A.include],g,f);break;case 2:let O=f[D.ruleName];O&&(E=S.getCompiledRuleId(O,g,f));break;case 3:case 4:const j=D.scopeName,z=D.kind===4?D.ruleName:null,V=g.getExternalGrammar(j,f);if(V)if(z){let M=V.repository[z];M&&(E=S.getCompiledRuleId(M,g,V.repository))}else E=S.getCompiledRuleId(V.repository.$self,g,V.repository)}}else E=S.getCompiledRuleId(A,g,f);if(E!==-1){const D=g.getRule(E);let O=!1;if((D instanceof T||D instanceof _||D instanceof N)&&D.hasMissingPatterns&&D.patterns.length===0&&(O=!0),O)continue;u.push(E)}}return{patterns:u,hasMissingPatterns:(s?s.length:0)!==u.length}}}t.RuleFactory=S;class I{constructor(s,g){if(s){const f=s.length;let u=0,b=[],m=!1;for(let A=0;A<f;A++)if(s.charAt(A)==="\\"&&A+1<f){const E=s.charAt(A+1);E==="z"?(b.push(s.substring(u,A)),b.push("$(?!\\n)(?<!\\n)"),u=A+2):E!=="A"&&E!=="G"||(m=!0),A++}this.hasAnchor=m,u===0?this.source=s:(b.push(s.substring(u,f)),this.source=b.join(""))}else this.hasAnchor=!1,this.source=s;this.hasAnchor?this._anchorCache=this._buildAnchorCache():this._anchorCache=null,this.ruleId=g,this.hasBackReferences=d.test(this.source)}clone(){return new I(this.source,this.ruleId)}setSource(s){this.source!==s&&(this.source=s,this.hasAnchor&&(this._anchorCache=this._buildAnchorCache()))}resolveBackReferences(s,g){let f=g.map(u=>s.substring(u.start,u.end));return w.lastIndex=0,this.source.replace(w,(u,b)=>l.escapeRegExpCharacters(f[parseInt(b,10)]||""))}_buildAnchorCache(){let s,g,f,u,b=[],m=[],A=[],E=[];for(s=0,g=this.source.length;s<g;s++)f=this.source.charAt(s),b[s]=f,m[s]=f,A[s]=f,E[s]=f,f==="\\"&&s+1<g&&(u=this.source.charAt(s+1),u==="A"?(b[s+1]="￿",m[s+1]="￿",A[s+1]="A",E[s+1]="A"):u==="G"?(b[s+1]="￿",m[s+1]="G",A[s+1]="￿",E[s+1]="G"):(b[s+1]=u,m[s+1]=u,A[s+1]=u,E[s+1]=u),s++);return{A0_G0:b.join(""),A0_G1:m.join(""),A1_G0:A.join(""),A1_G1:E.join("")}}resolveAnchors(s,g){return this.hasAnchor&&this._anchorCache?s?g?this._anchorCache.A1_G1:this._anchorCache.A1_G0:g?this._anchorCache.A0_G1:this._anchorCache.A0_G0:this.source}}t.RegExpSource=I;class x{constructor(){this._items=[],this._hasAnchors=!1,this._cached=null,this._anchorCache={A0_G0:null,A0_G1:null,A1_G0:null,A1_G1:null}}dispose(){this._disposeCaches()}_disposeCaches(){this._cached&&(this._cached.dispose(),this._cached=null),this._anchorCache.A0_G0&&(this._anchorCache.A0_G0.dispose(),this._anchorCache.A0_G0=null),this._anchorCache.A0_G1&&(this._anchorCache.A0_G1.dispose(),this._anchorCache.A0_G1=null),this._anchorCache.A1_G0&&(this._anchorCache.A1_G0.dispose(),this._anchorCache.A1_G0=null),this._anchorCache.A1_G1&&(this._anchorCache.A1_G1.dispose(),this._anchorCache.A1_G1=null)}push(s){this._items.push(s),this._hasAnchors=this._hasAnchors||s.hasAnchor}unshift(s){this._items.unshift(s),this._hasAnchors=this._hasAnchors||s.hasAnchor}length(){return this._items.length}setSource(s,g){this._items[s].source!==g&&(this._disposeCaches(),this._items[s].setSource(g))}compile(s){if(!this._cached){let g=this._items.map(f=>f.source);this._cached=new P(s,g,this._items.map(f=>f.ruleId))}return this._cached}compileAG(s,g,f){return this._hasAnchors?g?f?(this._anchorCache.A1_G1||(this._anchorCache.A1_G1=this._resolveAnchors(s,g,f)),this._anchorCache.A1_G1):(this._anchorCache.A1_G0||(this._anchorCache.A1_G0=this._resolveAnchors(s,g,f)),this._anchorCache.A1_G0):f?(this._anchorCache.A0_G1||(this._anchorCache.A0_G1=this._resolveAnchors(s,g,f)),this._anchorCache.A0_G1):(this._anchorCache.A0_G0||(this._anchorCache.A0_G0=this._resolveAnchors(s,g,f)),this._anchorCache.A0_G0):this.compile(s)}_resolveAnchors(s,g,f){let u=this._items.map(b=>b.resolveAnchors(g,f));return new P(s,u,this._items.map(b=>b.ruleId))}}t.RegExpSourceList=x;class P{constructor(s,g,f){this.regExps=g,this.rules=f,this.scanner=s.createOnigScanner(g)}dispose(){typeof this.scanner.dispose=="function"&&this.scanner.dispose()}toString(){const s=[];for(let g=0,f=this.rules.length;g<f;g++)s.push("   - "+this.rules[g]+": "+this.regExps[g]);return s.join(`
`)}findNextMatchSync(s,g,f){const u=this.scanner.findNextMatchSync(s,g,f);return u?{ruleId:this.rules[u.index],captureIndices:u.captureIndices}:null}}t.CompiledRule=P},583:(c,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ThemeTrieElement=t.ThemeTrieElementRule=t.ColorMap=t.fontStyleToString=t.ParsedThemeRule=t.parseTheme=t.StyleAttributes=t.ScopeStack=t.Theme=void 0;const l=a(878);class p{constructor(x,P,h){this._colorMap=x,this._defaults=P,this._root=h,this._cachedMatchRoot=new l.CachedFn(s=>this._root.match(s))}static createFromRawTheme(x,P){return this.createFromParsedTheme(v(x),P)}static createFromParsedTheme(x,P){return function(h,s){h.sort((E,D)=>{let O=l.strcmp(E.scope,D.scope);return O!==0?O:(O=l.strArrCmp(E.parentScopes,D.parentScopes),O!==0?O:E.index-D.index)});let g=0,f="#000000",u="#ffffff";for(;h.length>=1&&h[0].scope==="";){let E=h.shift();E.fontStyle!==-1&&(g=E.fontStyle),E.foreground!==null&&(f=E.foreground),E.background!==null&&(u=E.background)}let b=new T(s),m=new y(g,b.getId(f),b.getId(u)),A=new S(new N(0,null,-1,0,0),[]);for(let E=0,D=h.length;E<D;E++){let O=h[E];A.insert(0,O.scope,O.parentScopes,O.fontStyle,b.getId(O.foreground),b.getId(O.background))}return new p(b,m,A)}(x,P)}getColorMap(){return this._colorMap.getColorMap()}getDefaults(){return this._defaults}match(x){if(x===null)return this._defaults;const P=x.scopeName,h=this._cachedMatchRoot.get(P).find(s=>function(g,f){if(f.length===0)return!0;for(let u=0;u<f.length;u++){let b=f[u],m=!1;if(b===">"){if(u===f.length-1)return!1;b=f[++u],m=!0}for(;g&&!w(g.scopeName,b);){if(m)return!1;g=g.parent}if(!g)return!1;g=g.parent}return!0}(x.parent,s.parentScopes));return h?new y(h.fontStyle,h.foreground,h.background):null}}t.Theme=p;class d{constructor(x,P){this.parent=x,this.scopeName=P}static push(x,P){for(const h of P)x=new d(x,h);return x}static from(...x){let P=null;for(let h=0;h<x.length;h++)P=new d(P,x[h]);return P}push(x){return new d(this,x)}getSegments(){let x=this;const P=[];for(;x;)P.push(x.scopeName),x=x.parent;return P.reverse(),P}toString(){return this.getSegments().join(" ")}extends(x){return this===x||this.parent!==null&&this.parent.extends(x)}getExtensionIfDefined(x){const P=[];let h=this;for(;h&&h!==x;)P.push(h.scopeName),h=h.parent;return h===x?P.reverse():void 0}}function w(I,x){return x===I||I.startsWith(x)&&I[x.length]==="."}t.ScopeStack=d;class y{constructor(x,P,h){this.fontStyle=x,this.foregroundId=P,this.backgroundId=h}}function v(I){if(!I)return[];if(!I.settings||!Array.isArray(I.settings))return[];let x=I.settings,P=[],h=0;for(let s=0,g=x.length;s<g;s++){let f,u=x[s];if(!u.settings)continue;if(typeof u.scope=="string"){let E=u.scope;E=E.replace(/^[,]+/,""),E=E.replace(/[,]+$/,""),f=E.split(",")}else f=Array.isArray(u.scope)?u.scope:[""];let b=-1;if(typeof u.settings.fontStyle=="string"){b=0;let E=u.settings.fontStyle.split(" ");for(let D=0,O=E.length;D<O;D++)switch(E[D]){case"italic":b|=1;break;case"bold":b|=2;break;case"underline":b|=4;break;case"strikethrough":b|=8}}let m=null;typeof u.settings.foreground=="string"&&l.isValidHexColor(u.settings.foreground)&&(m=u.settings.foreground);let A=null;typeof u.settings.background=="string"&&l.isValidHexColor(u.settings.background)&&(A=u.settings.background);for(let E=0,D=f.length;E<D;E++){let O=f[E].trim().split(" "),j=O[O.length-1],z=null;O.length>1&&(z=O.slice(0,O.length-1),z.reverse()),P[h++]=new k(j,z,s,b,m,A)}}return P}t.StyleAttributes=y,t.parseTheme=v;class k{constructor(x,P,h,s,g,f){this.scope=x,this.parentScopes=P,this.index=h,this.fontStyle=s,this.foreground=g,this.background=f}}t.ParsedThemeRule=k,t.fontStyleToString=function(I){if(I===-1)return"not set";let x="";return 1&I&&(x+="italic "),2&I&&(x+="bold "),4&I&&(x+="underline "),8&I&&(x+="strikethrough "),x===""&&(x="none"),x.trim()};class T{constructor(x){if(this._lastColorId=0,this._id2color=[],this._color2id=Object.create(null),Array.isArray(x)){this._isFrozen=!0;for(let P=0,h=x.length;P<h;P++)this._color2id[x[P]]=P,this._id2color[P]=x[P]}else this._isFrozen=!1}getId(x){if(x===null)return 0;x=x.toUpperCase();let P=this._color2id[x];if(P)return P;if(this._isFrozen)throw new Error(`Missing color in color map - ${x}`);return P=++this._lastColorId,this._color2id[x]=P,this._id2color[P]=x,P}getColorMap(){return this._id2color.slice(0)}}t.ColorMap=T;const _=Object.freeze([]);class N{constructor(x,P,h,s,g){this.scopeDepth=x,this.parentScopes=P||_,this.fontStyle=h,this.foreground=s,this.background=g}clone(){return new N(this.scopeDepth,this.parentScopes,this.fontStyle,this.foreground,this.background)}static cloneArr(x){let P=[];for(let h=0,s=x.length;h<s;h++)P[h]=x[h].clone();return P}acceptOverwrite(x,P,h,s){this.scopeDepth>x?console.log("how did this happen?"):this.scopeDepth=x,P!==-1&&(this.fontStyle=P),h!==0&&(this.foreground=h),s!==0&&(this.background=s)}}t.ThemeTrieElementRule=N;class S{constructor(x,P=[],h={}){this._mainRule=x,this._children=h,this._rulesWithParentScopes=P}static _cmpBySpecificity(x,P){if(x.scopeDepth!==P.scopeDepth)return P.scopeDepth-x.scopeDepth;let h=0,s=0;for(;x.parentScopes[h]===">"&&h++,P.parentScopes[s]===">"&&s++,!(h>=x.parentScopes.length||s>=P.parentScopes.length);){const g=P.parentScopes[s].length-x.parentScopes[h].length;if(g!==0)return g;h++,s++}return P.parentScopes.length-x.parentScopes.length}match(x){if(x!==""){let h,s,g=x.indexOf(".");if(g===-1?(h=x,s=""):(h=x.substring(0,g),s=x.substring(g+1)),this._children.hasOwnProperty(h))return this._children[h].match(s)}const P=this._rulesWithParentScopes.concat(this._mainRule);return P.sort(S._cmpBySpecificity),P}insert(x,P,h,s,g,f){if(P==="")return void this._doInsertHere(x,h,s,g,f);let u,b,m,A=P.indexOf(".");A===-1?(u=P,b=""):(u=P.substring(0,A),b=P.substring(A+1)),this._children.hasOwnProperty(u)?m=this._children[u]:(m=new S(this._mainRule.clone(),N.cloneArr(this._rulesWithParentScopes)),this._children[u]=m),m.insert(x+1,b,h,s,g,f)}_doInsertHere(x,P,h,s,g){if(P!==null){for(let f=0,u=this._rulesWithParentScopes.length;f<u;f++){let b=this._rulesWithParentScopes[f];if(l.strArrCmp(b.parentScopes,P)===0)return void b.acceptOverwrite(x,h,s,g)}h===-1&&(h=this._mainRule.fontStyle),s===0&&(s=this._mainRule.foreground),g===0&&(g=this._mainRule.background),this._rulesWithParentScopes.push(new N(x,P,h,s,g))}else this._mainRule.acceptOverwrite(x,h,s,g)}}t.ThemeTrieElement=S},878:(c,t)=>{function a(d){return Array.isArray(d)?function(w){let y=[];for(let v=0,k=w.length;v<k;v++)y[v]=a(w[v]);return y}(d):typeof d=="object"?function(w){let y={};for(let v in w)y[v]=a(w[v]);return y}(d):d}Object.defineProperty(t,"__esModule",{value:!0}),t.performanceNow=t.CachedFn=t.escapeRegExpCharacters=t.isValidHexColor=t.strArrCmp=t.strcmp=t.RegexSource=t.basename=t.mergeObjects=t.clone=void 0,t.clone=function(d){return a(d)},t.mergeObjects=function(d,...w){return w.forEach(y=>{for(let v in y)d[v]=y[v]}),d},t.basename=function d(w){const y=~w.lastIndexOf("/")||~w.lastIndexOf("\\");return y===0?w:~y==w.length-1?d(w.substring(0,w.length-1)):w.substr(1+~y)};let l=/\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;function p(d,w){return d<w?-1:d>w?1:0}t.RegexSource=class{static hasCaptures(d){return d!==null&&(l.lastIndex=0,l.test(d))}static replaceCaptures(d,w,y){return d.replace(l,(v,k,T,_)=>{let N=y[parseInt(k||T,10)];if(!N)return v;{let S=w.substring(N.start,N.end);for(;S[0]===".";)S=S.substring(1);switch(_){case"downcase":return S.toLowerCase();case"upcase":return S.toUpperCase();default:return S}}})}},t.strcmp=p,t.strArrCmp=function(d,w){if(d===null&&w===null)return 0;if(!d)return-1;if(!w)return 1;let y=d.length,v=w.length;if(y===v){for(let k=0;k<y;k++){let T=p(d[k],w[k]);if(T!==0)return T}return 0}return y-v},t.isValidHexColor=function(d){return!!(/^#[0-9a-f]{6}$/i.test(d)||/^#[0-9a-f]{8}$/i.test(d)||/^#[0-9a-f]{3}$/i.test(d)||/^#[0-9a-f]{4}$/i.test(d))},t.escapeRegExpCharacters=function(d){return d.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g,"\\$&")},t.CachedFn=class{constructor(d){this.fn=d,this.cache=new Map}get(d){if(this.cache.has(d))return this.cache.get(d);const w=this.fn(d);return this.cache.set(d,w),w}},t.performanceNow=typeof performance>"u"?function(){return Date.now()}:function(){return performance.now()}}},o={};return function c(t){var a=o[t];if(a!==void 0)return a.exports;var l=o[t]={exports:{}};return i[t].call(l.exports,l,l.exports,c),l.exports}(787)})())})(main);var mainExports=main.exports;function applyStyle(e,n,i){let o;createRenderEffect(()=>{var c;const t=(c=n.style)==null?void 0:c[i];t!==o&&((o=t)!=null?e.style.setProperty(i,typeof t>"u"?null:t.toString()):e.style.removeProperty(i))})}function hexToRgb(e){let n=parseInt(e.slice(1),16),i=n>>16&255,o=n>>8&255,c=n&255;return[i,o,c]}function luminance(e,n,i){const o=[e,n,i].map(c=>(c/=255,c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)));return o[0]*.2126+o[1]*.7152+o[2]*.0722}function once(e,n,i){const o=typeof e=="function"?e():e;return o?n(o):i?i():void 0}function when(e,n,i){return()=>once(e,n,i)}function every(...e){function n(){const i=new Array(e.length);for(let o=0;o<e.length;o++){const c=typeof e[o]=="function"?e[o]():e[o];if(!c)return;i[o]=c}return i}return n}function countDigits(e){return e===0?1:Math.floor(Math.log10(Math.abs(e)))+1}function escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function getLongestLineSize(e){let n=0;for(const i of e)i.length>n&&(n=i.length);return n}class Stack{constructor(){__privateAdd(this,_array,[])}peek(){return __privateGet(this,_array)[__privateGet(this,_array).length-1]}push(n){__privateGet(this,_array).push(n)}pop(){return __privateGet(this,_array).pop()}}_array=new WeakMap;var _tmpl$$3=template("<pre part=line>"),_tmpl$2$1=template("<div part=root><code part=code></code><textarea part=textarea autocomplete=off inputmode=none></textarea><code aria-hidden>&nbsp;");const SEGMENT_SIZE=100,WINDOW=50,TOKENIZER_CACHE={},REGISTRY=new mainExports.Registry({onigLib:oniguruma,loadGrammar:e=>fetchFromCDN("grammar",e).then(n=>(n.scopeName=e,n))}),[WASM_LOADED]=createRoot(()=>createResource(async()=>fetch(urlFromCDN("oniguruma",null)).then(e=>e.arrayBuffer()).then(e=>mainExports$1.loadWASM(e)).then(()=>!0)));class ThemeManager{constructor(n){__publicField(this,"themeData"),__privateAdd(this,_scopes,{}),this.themeData=n}resolveScope(n){const i=n.join("-");if(__privateGet(this,_scopes)[i])return __privateGet(this,_scopes)[i];let o={};for(let c=0;c<n.length;c++){const t=n[c];for(const a of this.themeData.tokenColors){const l=Array.isArray(a.scope)?a.scope:[a.scope];for(const p of l)t.startsWith(p||"")&&(o={...o,...a.settings})}}return __privateGet(this,_scopes)[i]=o}getBackgroundColor(){var n;return((n=this.themeData.colors)==null?void 0:n["editor.background"])||void 0}getForegroundColor(){var n;return((n=this.themeData.colors)==null?void 0:n["editor.foreground"])||void 0}}_scopes=new WeakMap;function compareStacks(e,n){let i=!1;return e===n?!0:!e||!n?!1:(e.ruleId!==n.ruleId&&(i=!0),e.depth!==n.depth&&(i=!0),compareScopes(e.nameScopesList,n.nameScopesList)||(i=!0),compareScopes(e.contentNameScopesList,n.contentNameScopesList)||(i=!0),!i)}function compareScopes(e,n){var i,o;return!e&&!n?!0:!(!e||!n||((i=e.scopePath)==null?void 0:i.scopeName)!==((o=n.scopePath)==null?void 0:o.scopeName)||e.tokenAttributes!==n.tokenAttributes)}const TmTextareaContext=createContext(null);function useTmTextarea(){const e=useContext(TmTextareaContext);if(!e)throw"useTextarea should be used in a descendant of TmTextarea";return e}function createTmTextarea(e){function n(i){const o=useTmTextarea(),c=o.segments.peek(),[t,a]=createSignal(c?.stack||mainExports.INITIAL,{equals:compareStacks}),l=i.index*SEGMENT_SIZE,p=l+SEGMENT_SIZE,d=createLazyMemo(when(every(()=>o.tokenizer,()=>o.theme),([w,y])=>{let v=c?.stack||mainExports.INITIAL;const k=o.lines.slice(l,p).map(T=>{const{ruleStack:_,tokens:N}=w.tokenizeLine(T,v);return v=_,N.map(S=>{const I=y.resolveScope(S.scopes),x=T.slice(S.startIndex,S.endIndex);return`<span style="${I.foreground?`color:${I.foreground};`:""}${I.fontStyle?`text-decoration:${I.fontStyle}`:""}">${escapeHTML(x)}</span>`}).join("")});return a(v),k},()=>o.lines.slice(l,p).map(escapeHTML)));return o.segments.push({get stack(){return t()}}),onCleanup(()=>o.segments.pop()),createComponent(Show,{get when(){return o.isSegmentVisible(i.index*SEGMENT_SIZE)},get children(){return createComponent(For,{get each(){return d()},children:(w,y)=>createComponent(Show,{get when(){return o.isVisible(i.index*SEGMENT_SIZE+y())},get children(){var v=_tmpl$$3();return v.innerHTML=w,createRenderEffect(k=>{var T=e.line,_=i.index*SEGMENT_SIZE+y();return T!==k.e&&className(v,k.e=T),_!==k.t&&((k.t=_)!=null?v.style.setProperty("--tm-line-number",_):v.style.removeProperty("--tm-line-number")),k},{e:void 0,t:void 0}),v}})})}})}return function(o){const[c,t]=splitProps(mergeProps({editable:!0},o),["class","grammar","onInput","value","style","theme","editable","onScroll","textareaRef"]),[a,l]=splitProps(t,["onKeyDown","onKeyPress","onKeyUp","onChange"]);let p;const[d,w]=createSignal(),[y,v]=createSignal(),[k,T]=createSignal(0),[_,N]=createSignal(o.value),[S]=createResource(every(()=>o.grammar,WASM_LOADED),async([m])=>m in TOKENIZER_CACHE?TOKENIZER_CACHE[m]:TOKENIZER_CACHE[m]=await REGISTRY.loadGrammar(m)),[I]=createResource(()=>o.theme,async m=>fetchFromCDN("theme",m).then(A=>new ThemeManager(A))),x=createMemo(()=>_().split(`
`)),P=createMemo(()=>getLongestLineSize(x())),h=createMemo(()=>{var m;return Math.floor(k()/(((m=d())==null?void 0:m.height)||1))}),s=createMemo(()=>{var m,A;return Math.floor((k()+(((m=y())==null?void 0:m.height)||0))/(((A=d())==null?void 0:A.height)||1))}),g=createMemo(()=>Math.floor(h()/SEGMENT_SIZE)),f=createMemo(()=>Math.ceil(s()/SEGMENT_SIZE)),u=when(I,m=>{const A=m.getBackgroundColor(),E=luminance(...hexToRgb(A));return`rgba(98, 114, 164, ${E>.9?.1:E<.1?.25:.175})`}),b=when(()=>c.style,m=>splitProps(m,["width","height"])[1]);return onMount(()=>new ResizeObserver(([m])=>v(m?.contentRect)).observe(p)),createRenderEffect(()=>N(o.value)),createRenderEffect(()=>{var m;return console.log((m=I())==null?void 0:m.getForegroundColor())}),createComponent(TmTextareaContext.Provider,{get value(){return{get viewport(){return y()},get character(){return d()},get scrollTop(){return k()},get lines(){return x()},get theme(){return I()},get tokenizer(){return S()},segments:new Stack,isVisible:createSelector(()=>[h(),s()],(m,[A,E])=>m>x().length-1?!1:m+WINDOW>A&&m-WINDOW<E),isSegmentVisible:createSelector(()=>[g(),f()],m=>{const A=Math.floor((m-WINDOW)/SEGMENT_SIZE),E=Math.ceil((m+WINDOW)/SEGMENT_SIZE);return A<=g()&&E>=f()||A>=g()&&A<=f()||E>=g()&&E<=f()})}},get children(){var m=_tmpl$2$1(),A=m.firstChild,E=A.nextSibling,D=E.nextSibling;m.addEventListener("scroll",j=>{var z;T(j.currentTarget.scrollTop),(z=o.onScroll)==null||z.call(o,j)}),use(j=>{p=j,applyStyle(j,o,"width"),applyStyle(j,o,"height")},m),spread(m,mergeProps({get class(){return clsx(e.container,c.class)},get style(){var j,z,V,M;return{"--tm-background-color":(j=I())==null?void 0:j.getBackgroundColor(),"--tm-char-height":`${((z=d())==null?void 0:z.height)||0}px`,"--tm-char-width":`${((V=d())==null?void 0:V.width)||0}px`,"--tm-foreground-color":(M=I())==null?void 0:M.getForegroundColor(),"--tm-line-count":x().length,"--tm-line-size":P(),"--tm-selection-color":u(),"--tm-line-digits":countDigits(x().length),...b()}}},l),!1,!0),insert(A,createComponent(Index,{get each(){return Array.from({length:Math.ceil(x().length/SEGMENT_SIZE)})},children:(j,z)=>createComponent(n,{index:z})})),E.addEventListener("scroll",j=>{j.preventDefault(),j.stopPropagation()});var O=c.textareaRef;return typeof O=="function"?use(O,E):c.textareaRef=E,setAttribute(E,"spellcheck",!1),E.addEventListener("input",j=>{var z;const M=j.currentTarget.value;N(M),(z=c.onInput)==null||z.call(c,j)}),spread(E,mergeProps({get class(){return e.textarea},get disabled(){return!c.editable},get value(){return c.value},get rows(){return x().length}},a),!1,!1),use(j=>{new ResizeObserver(([z])=>{const{height:V,width:M}=getComputedStyle(z.target);w({height:Number(V.replace("px","")),width:Number(M.replace("px",""))})}).observe(j)},D),createRenderEffect(j=>{var z=e.code,V=e.character;return z!==j.e&&className(A,j.e=z),V!==j.t&&className(D,j.t=V),j},{e:void 0,t:void 0}),m}})}}const container$1="index-module__container___GdQY1",code="index-module__code___B9PCM",line="index-module__line___n1EGr",character="index-module__character___mhd0f",textarea$1="index-module__textarea___cMW-q",styles$2={container:container$1,code,line,character,textarea:textarea$1},TmTextarea=createTmTextarea(styles$2),$RAW=Symbol("store-raw"),$NODE=Symbol("store-node"),$HAS=Symbol("store-has"),$SELF=Symbol("store-self");function wrap$1(e){let n=e[$PROXY];if(!n&&(Object.defineProperty(e,$PROXY,{value:n=new Proxy(e,proxyTraps$1)}),!Array.isArray(e))){const i=Object.keys(e),o=Object.getOwnPropertyDescriptors(e);for(let c=0,t=i.length;c<t;c++){const a=i[c];o[a].get&&Object.defineProperty(e,a,{enumerable:o[a].enumerable,get:o[a].get.bind(n)})}}return n}function isWrappable(e){let n;return e!=null&&typeof e=="object"&&(e[$PROXY]||!(n=Object.getPrototypeOf(e))||n===Object.prototype||Array.isArray(e))}function unwrap(e,n=new Set){let i,o,c,t;if(i=e!=null&&e[$RAW])return i;if(!isWrappable(e)||n.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):n.add(e);for(let a=0,l=e.length;a<l;a++)c=e[a],(o=unwrap(c,n))!==c&&(e[a]=o)}else{Object.isFrozen(e)?e=Object.assign({},e):n.add(e);const a=Object.keys(e),l=Object.getOwnPropertyDescriptors(e);for(let p=0,d=a.length;p<d;p++)t=a[p],!l[t].get&&(c=e[t],(o=unwrap(c,n))!==c&&(e[t]=o))}return e}function getNodes(e,n){let i=e[n];return i||Object.defineProperty(e,n,{value:i=Object.create(null)}),i}function getNode(e,n,i){if(e[n])return e[n];const[o,c]=createSignal(i,{equals:!1,internal:!0});return o.$=c,e[n]=o}function proxyDescriptor$1(e,n){const i=Reflect.getOwnPropertyDescriptor(e,n);return!i||i.get||!i.configurable||n===$PROXY||n===$NODE||(delete i.value,delete i.writable,i.get=()=>e[$PROXY][n]),i}function trackSelf(e){getListener()&&getNode(getNodes(e,$NODE),$SELF)()}function ownKeys(e){return trackSelf(e),Reflect.ownKeys(e)}const proxyTraps$1={get(e,n,i){if(n===$RAW)return e;if(n===$PROXY)return i;if(n===$TRACK)return trackSelf(e),i;const o=getNodes(e,$NODE),c=o[n];let t=c?c():e[n];if(n===$NODE||n===$HAS||n==="__proto__")return t;if(!c){const a=Object.getOwnPropertyDescriptor(e,n);getListener()&&(typeof t!="function"||e.hasOwnProperty(n))&&!(a&&a.get)&&(t=getNode(o,n,t)())}return isWrappable(t)?wrap$1(t):t},has(e,n){return n===$RAW||n===$PROXY||n===$TRACK||n===$NODE||n===$HAS||n==="__proto__"?!0:(getListener()&&getNode(getNodes(e,$HAS),n)(),n in e)},set(){return!0},deleteProperty(){return!0},ownKeys,getOwnPropertyDescriptor:proxyDescriptor$1};function setProperty(e,n,i,o=!1){if(!o&&e[n]===i)return;const c=e[n],t=e.length;i===void 0?(delete e[n],e[$HAS]&&e[$HAS][n]&&c!==void 0&&e[$HAS][n].$()):(e[n]=i,e[$HAS]&&e[$HAS][n]&&c===void 0&&e[$HAS][n].$());let a=getNodes(e,$NODE),l;if((l=getNode(a,n,c))&&l.$(()=>i),Array.isArray(e)&&e.length!==t){for(let p=e.length;p<t;p++)(l=a[p])&&l.$();(l=getNode(a,"length",t))&&l.$(e.length)}(l=a[$SELF])&&l.$()}function mergeStoreNode(e,n){const i=Object.keys(n);for(let o=0;o<i.length;o+=1){const c=i[o];setProperty(e,c,n[c])}}function updateArray(e,n){if(typeof n=="function"&&(n=n(e)),n=unwrap(n),Array.isArray(n)){if(e===n)return;let i=0,o=n.length;for(;i<o;i++){const c=n[i];e[i]!==c&&setProperty(e,i,c)}setProperty(e,"length",o)}else mergeStoreNode(e,n)}function updatePath(e,n,i=[]){let o,c=e;if(n.length>1){o=n.shift();const a=typeof o,l=Array.isArray(e);if(Array.isArray(o)){for(let p=0;p<o.length;p++)updatePath(e,[o[p]].concat(n),i);return}else if(l&&a==="function"){for(let p=0;p<e.length;p++)o(e[p],p)&&updatePath(e,[p].concat(n),i);return}else if(l&&a==="object"){const{from:p=0,to:d=e.length-1,by:w=1}=o;for(let y=p;y<=d;y+=w)updatePath(e,[y].concat(n),i);return}else if(n.length>1){updatePath(e[o],n,[o].concat(i));return}c=e[o],i=[o].concat(i)}let t=n[0];typeof t=="function"&&(t=t(c,i),t===c)||o===void 0&&t==null||(t=unwrap(t),o===void 0||isWrappable(c)&&isWrappable(t)&&!Array.isArray(t)?mergeStoreNode(c,t):setProperty(e,o,t))}function createStore(...[e,n]){const i=unwrap(e||{}),o=Array.isArray(i),c=wrap$1(i);function t(...a){batch(()=>{o&&a.length===1?updateArray(i,a[0]):updatePath(i,a)})}return[c,t]}const producers=new WeakMap,setterTraps={get(e,n){if(n===$RAW)return e;const i=e[n];let o;return isWrappable(i)?producers.get(i)||(producers.set(i,o=new Proxy(i,setterTraps)),o):i},set(e,n,i){return setProperty(e,n,unwrap(i)),!0},deleteProperty(e,n){return setProperty(e,n,void 0,!0),!0}};function produce(e){return n=>{if(isWrappable(n)){let i;(i=producers.get(n))||producers.set(n,i=new Proxy(n,setterTraps)),e(i)}return n}}function createFile(e){const[n,i]=createSignal(e);return{type:"file",get:n,set:i}}function createFileSystem(){const[e,n]=createStore({});function i(t){const a=t.split("/");if(!a.map((p,d)=>a.slice(0,d+1).join("/")).filter(Boolean).every(p=>p in e))throw`Path is invalid ${t}`}function o(t,a){return t=PathUtils.normalize(t),i(t),a?.withFileTypes?Object.entries(e).filter(([l])=>PathUtils.getParent(l)===t&&l!==t).map(([l,p])=>({type:p.type,path:l})):Object.keys(e).filter(l=>PathUtils.getParent(l)===t)}const c={exists(t){return t in e},getType(t){return t=PathUtils.normalize(t),i(t),e[t].type},readdir:o,mkdir(t,a){if(t=PathUtils.normalize(t),a?.recursive){const l=t.split("/");l.forEach((p,d)=>{n(l.slice(0,d).join("/"),{type:"dir"})});return}i(PathUtils.getParent(t)),n(t,{type:"dir"})},readFile(t){t=PathUtils.normalize(t),i(t);const a=e[t];if(a.type==="dir")throw`Path is not a file ${t}`;return a.get()},rename(t,a){if(t=PathUtils.normalize(t),a=PathUtils.normalize(a),c.exists(a))throw console.error(e),`Path ${a} already exists.`;if(!c.exists(t)){console.error(`Path does not exist: ${t}`);return}n(produce(l=>{Object.keys(e).forEach(p=>{if(PathUtils.isAncestor(p,t)||p===t){const d=p.replace(t,a),w=l[p];l[d]=w,delete l[p]}})}))},rm(t,a){if(t=PathUtils.normalize(t),(!a||!a.force)&&i(t),!a||!a.recursive){const l=Object.keys(e).filter(p=>p===t?!1:p.includes(t));if(l.length>0)throw`Directory is not empty ${l}`}n(produce(l=>{Object.keys(l).filter(p=>p.includes(t)).forEach(p=>delete l[p])}))},writeFile(t,a){t=PathUtils.normalize(t),i(PathUtils.getParent(t));const l=e[t];if(l?.type==="dir")throw`A directory already exist with the same name: ${t}`;l?l.set(a):n(t,createFile(a))}};return c}const FALLBACK=Symbol("fallback");function dispose(e){for(const n of e)n.dispose()}function keyArray(e,n,i,o={}){const c=new Map;return onCleanup(()=>dispose(c.values())),()=>{const a=e()||[];return a[$TRACK],untrack(()=>{if(!a.length)return dispose(c.values()),c.clear(),o.fallback?[createRoot(y=>(c.set(FALLBACK,{dispose:y}),o.fallback()))]:[];const l=new Array(a.length),p=c.get(FALLBACK);if(!c.size||p){p?.dispose(),c.delete(FALLBACK);for(let w=0;w<a.length;w++){const y=a[w],v=n(y,w);t(l,y,w,v)}return l}const d=new Set(c.keys());for(let w=0;w<a.length;w++){const y=a[w],v=n(y,w);d.delete(v);const k=c.get(v);k?(l[w]=k.mapped,k.setIndex?.(w),k.setItem(()=>y)):t(l,y,w,v)}for(const w of d)c.get(w)?.dispose(),c.delete(w);return l})};function t(a,l,p,d){createRoot(w=>{const[y,v]=createSignal(l),k={setItem:v,dispose:w};if(i.length>1){const[T,_]=createSignal(p);k.setIndex=_,k.mapped=i(y,T)}else k.mapped=i(y);c.set(d,k),a[p]=k.mapped})}}function Key(e){const{by:n}=e;return createMemo(keyArray(()=>e.each,typeof n=="function"?n:i=>i[n],e.children,"fallback"in e?{fallback:()=>e.fallback}:void 0))}const triggerOptions={equals:!1},triggerCacheOptions=triggerOptions;class TriggerCache{#e;constructor(n=Map){this.#e=new n}dirty(n){this.#e.get(n)?.$$()}dirtyAll(){for(const n of this.#e.values())n.$$()}track(n){if(!getListener())return;let i=this.#e.get(n);if(i)i.n++;else{const[o,c]=createSignal(void 0,triggerCacheOptions);this.#e.set(n,i={$:o,$$:c,n:1})}onCleanup(()=>{--i.n===0&&queueMicrotask(()=>i.n===0&&this.#e.delete(n))}),i.$()}}const $OBJECT=Symbol("track-object");class ReactiveMap extends Map{#e=new TriggerCache;#n=new TriggerCache;[Symbol.iterator](){return this.entries()}constructor(n){if(super(),n)for(const i of n)super.set(...i)}get size(){return this.#e.track($OBJECT),super.size}*keys(){this.#e.track($OBJECT);for(const n of super.keys())yield n}*values(){this.#n.track($OBJECT);for(const n of super.values())yield n}*entries(){this.#e.track($OBJECT),this.#n.track($OBJECT);for(const n of super.entries())yield n}forEach(n,i){this.#e.track($OBJECT),this.#n.track($OBJECT),super.forEach(n,i)}has(n){return this.#e.track(n),super.has(n)}get(n){return this.#n.track(n),super.get(n)}set(n,i){const o=!super.has(n),c=super.get(n)!==i,t=super.set(n,i);return(c||o)&&batch(()=>{o&&(this.#e.dirty($OBJECT),this.#e.dirty(n)),c&&(this.#n.dirty($OBJECT),this.#n.dirty(n))}),t}delete(n){const i=super.get(n)!==void 0,o=super.delete(n);return o&&batch(()=>{this.#e.dirty($OBJECT),this.#n.dirty($OBJECT),this.#e.dirty(n),i&&this.#n.dirty(n)}),o}clear(){super.size&&(super.clear(),batch(()=>{this.#e.dirtyAll(),this.#n.dirtyAll()}))}}var _tmpl$$2=template("<div>"),_tmpl$2=template("<button>"),_tmpl$3=template("<span>"),_tmpl$4=template("<input>"),_tmpl$5=template("<span> [ID = <!>]");const FileTreeContext=createContext();function useFileTree(){const e=useContext(FileTreeContext);if(!e)throw"FileTreeContext is undefined";return e}const DirEntContext=createContext();function useDirEnt(){const e=useContext(DirEntContext);if(!e)throw"DirEntContext is undefined";return e}const IndentGuideContext=createContext();function useIndentGuide(){const e=useContext(IndentGuideContext);if(!e)throw"IndentGuideContext is undefined";return e}function createIdGenerator(){const e=[],n=new ReactiveMap,i=new ReactiveMap;let o=0;function c(p){const d={id:t(),refCount:1};return n.set(p,d),i.set(d.id,p),d}function t(){return e.pop()??(o++).toString()}function a(p){e.push(p)}function l(p,d){onCleanup(()=>{queueMicrotask(()=>{p.refCount--,p.refCount===0&&(a(p.id),n.delete(d),i.delete(p.id))})})}return{beforeRename(p,d){let w=[];for(let y of n.keys())if(y.length>p.length&&y.slice(0,p.length)==p&&y[p.length]=="/"){let v=y.slice(p.length),k=p+v,T=d+v;w.push({oldPath:k,newPath:T})}w.push({oldPath:p,newPath:d});for(let{oldPath:y,newPath:v}of w){const k=n.get(y);if(k===void 0)return;n.delete(y),n.set(v,k),i.set(k.id,v)}},obtainId(p){let d=n.get(p);return d?d.refCount++:d=c(p),l(d,p),d.id},freezeId(p){const d=untrack(()=>i.get(p)),w=d?n.get(d):void 0;d!=null&&w!==void 0&&(w.refCount++,l(w,d))},idToPath(p){const d=i.get(p);if(d==null)throw new Error(`path not found for id: ${p}`);return d},pathToId(p){let d=n.get(p);if(d==null)throw new Error(`node not found for path: ${p}`);return d.id}}}function FileTree(e){const[n,i]=splitProps(mergeProps({base:""},e),["fs","base"]),{obtainId:o,freezeId:c,beforeRename:t,idToPath:a,pathToId:l}=createIdGenerator(),p=createMemo(()=>o(n.base)),[d,w]=createSignal(),y=createSelector(d);function v(M){w(M)}function k(M){d()===M&&w()}const[T,_]=createSignal([],{equals:!1}),N=createMemo(()=>T().flatMap(([M,U])=>{if(U){const J=D().findIndex(H=>H.id===M),Q=D().findIndex(H=>H.id===U);return D().slice(Math.min(J,Q),Math.max(J,Q)+1).map(H=>H.id)}return M}).sort((M,U)=>M<U?-1:1)),S=createSelector(N,(M,U)=>U.includes(M));function I(M){_(U=>[...U,[M]])}function x(M){_(U=>U.map(J=>J.filter(Q=>Q!==M)).filter(J=>J.length>0))}function P(M){_(U=>U.length>0?(U[U.length-1]=[U[U.length-1][0],M],[...U]):[[M]])}function h(){_([])}const[s,g]=createSignal(new Array,{equals:!1}),f=createSelector(s,(M,U)=>U.includes(M));function u(M){g(U=>U.filter(J=>J!==M))}function b(M){M!==p()&&!s().includes(M)&&g(U=>[...U,M])}const[m,A]=createStore({});function E(M){return m[M]?.()||[]}createEffect(mapArray(()=>[p(),...s()],M=>{const U=createMemo(keyArray(()=>e.fs.readdir(a(M),{withFileTypes:!0}).map(Q=>({id:o(Q.path),type:Q.type})),Q=>Q.id,Q=>{const H=createMemo(()=>O(a(Q().id))),$=createMemo(()=>PathUtils.getName(a(Q().id)));return{id:Q().id,get type(){return Q().type},get path(){return a(Q().id)},get indentation(){return H()},get name(){return $()},select(){I(Q().id)},deselect(){x(Q().id)},shiftSelect(){P(Q().id)},get selected(){return S(Q().id)},rename(q){j(a(Q().id),q)},focus(){v(Q().id)},blur(){k(Q().id)},get focused(){return y(Q().id)},get expand(){if(Q().type!=="file")return()=>b(Q().id)},get collapse(){if(Q().type!=="file")return()=>u(Q().id)},get expanded(){if(Q().type!=="file")return f(Q().id)}}})),J=createMemo(()=>U().toSorted(e.sort??((Q,H)=>Q.type!==H.type?Q.type==="dir"?-1:1:Q.path.toLowerCase()<H.path.toLowerCase()?-1:1)));A(M,()=>J),onCleanup(()=>A(M,void 0)),createComputed(()=>{e.fs.exists(a(M))||g(Q=>Q.filter(H=>H!==M))})}));const D=createMemo(()=>{const M=new Array,U=[p()];for(;U.length>0;){const J=U.shift(),Q=E(J);U.push(...Q.filter(H=>H.type==="dir"&&H.expanded).map(H=>H.id)),M.splice(M.findIndex(H=>H.id===J)+1,0,...Q)}return M});function O(M){return M.split("/").length-n.base.split("/").length}function j(M,U){batch(()=>{t(M,U),e.fs.rename(M,U),e.onRename?.(M,U)})}function z(M){const U=l(M),Q=N().map(a),H=new Array;for(const q of Q){if(q===M)throw`Cannot move ${q} into itself.`;if(PathUtils.isAncestor(M,q))throw`Cannot move because ${q} is ancestor of ${M}.`}const $=Q.sort((q,ie)=>q.toLowerCase()<ie.toLowerCase()?-1:1).map((q,ie,L)=>{const ee=L.slice(0,ie).find(de=>PathUtils.isAncestor(q,de)),ne=(ee?[M,PathUtils.getName(ee),q.replace(`${ee}/`,"")]:[M,PathUtils.getName(q)]).filter(Boolean).join("/");return e.fs.exists(ne)&&H.push({oldPath:q,newPath:ne}),{oldPath:q,newPath:ne,shouldRename:!ee}});if(H.length>0)throw`Paths already exist: ${H.map(({newPath:q})=>q)}`;batch(()=>{$.forEach(({oldPath:q,newPath:ie,shouldRename:L})=>{L&&j(q,ie)}),f(U)||b(U)})}const V={get fs(){return n.fs},get base(){return n.base},expandDirById:b,collapseDirById:u,isDirExpandedById:f,moveSelectedDirEntsToPath:z,resetSelectedDirEntIds:h,selectDirEntById:I,deselectDirEntById:x,shiftSelectDirEntById:P,getDirEntsOfDirId:E,focusDirEnt:v,blurDirEnt:k,isDirEntFocused:y,pathToId:l};return createEffect(()=>e.onSelection?.(N())),createComputed(()=>{batch(()=>{e.selection&&_(e.selection.filter(M=>e.fs.exists(a(M))).map(M=>[M]))})}),createComputed(()=>N().forEach(c)),createComputed(()=>s().forEach(c)),(()=>{var M=_tmpl$$2();return spread(M,mergeProps(i,{onDragOver:U=>{U.preventDefault(),e.onDragOver?.(U)},onDrop:U=>{z(n.base),e.onDrop?.(U)}}),!1,!0),insert(M,createComponent(FileTreeContext.Provider,{value:V,get children(){return createComponent(Key,{get each(){return D()},by:U=>U.id,children:U=>createComponent(DirEntContext.Provider,{value:U,get children(){return untrack(()=>e.children(U,V))}})})}})),M})()}FileTree.DirEnt=function(e){const n=mergeProps({draggable:!0},e),i=useFileTree(),o=useDirEnt(),c={ref(t){createEffect(()=>{o().focused&&t.focus()}),e.ref?.(t)},onPointerDown(t){batch(()=>{t.shiftKey?o().shiftSelect():o().selected?t[CTRL_KEY]&&o().deselect():(t[CTRL_KEY]||i.resetSelectedDirEntIds(),o().select())}),e.onPointerDown?.(t)},onPointerUp(t){const a=o();a.type==="dir"&&(a.expanded?a.collapse():a.expand()),e.onPointerUp?.(t)},onDragOver:t=>{t.preventDefault(),e.onDragOver?.(t)},onDrop:t=>{t.preventDefault(),t.stopPropagation();const a=o();a.type==="dir"?i.moveSelectedDirEntsToPath(a.path):i.moveSelectedDirEntsToPath(PathUtils.getParent(a.path)),e.onDrop?.(t)},onFocus(t){o().focus(),e.onFocus?.(t)},onBlur(t){o().blur(),e.onBlur?.(t)}};return createComponent(Show,{get when(){return o().type==="dir"},get fallback(){return(()=>{var t=_tmpl$2();return spread(t,mergeProps(n,c),!1,!1),t})()},children:t=>createComponent(Show,{get when(){return o().path},get children(){var a=_tmpl$2();return spread(a,mergeProps(n,c),!1,!0),insert(a,()=>e.children),a}})})};FileTree.IndentGuides=function(e){const n=useDirEnt(),i=useFileTree();function o(a){const l=PathUtils.getParent(a);if(l===i.base)return!1;const p=i.getDirEntsOfDirId(i.pathToId(l));return p.findIndex(w=>w.path===a)===p.length-1}function c(a){return n().path.split("/").slice(0,a+2).join("/")}function t(a){const l=n().indentation-a===1;return l&&o(n().path)?"elbow":o(c(a))?"spacer":l?"tee":"pipe"}return createComponent(Index,{get each(){return Array.from({length:n().indentation},(a,l)=>t(l))},children:a=>createComponent(IndentGuideContext.Provider,{value:a,get children(){return e.render(a)}})})};FileTree.Expanded=function(e){const[,n]=splitProps(e,["expanded","collapsed"]),i=useDirEnt();return createComponent(Show,{get when(){return i().type==="dir"},get children(){var o=_tmpl$3();return spread(o,n,!1,!0),insert(o,createComponent(Show,{get when(){return i().expanded},get fallback(){return e.expanded},get children(){return e.collapsed}})),o}})};FileTree.Name=function(e){const n=useDirEnt(),i=useFileTree();function o(c){const t=PathUtils.rename(n().path,c.value);if(t!==n().path){if(i.fs.exists(t))throw c.value=n().name,`Path ${t} already exists.`;n().rename(t),n().focus()}}return createComponent(Show,{get when(){return e.editable},get fallback(){return(()=>{var c=_tmpl$5(),t=c.firstChild,a=t.nextSibling;return a.nextSibling,insert(c,()=>n().name,t),insert(c,()=>n().id,a),createRenderEffect(l=>{var p=e.class,d=e.style;return p!==l.e&&className(c,l.e=p),l.t=style(c,d,l.t),l},{e:void 0,t:void 0}),c})()},get children(){var c=_tmpl$4();return c.addEventListener("blur",t=>{i.fs.exists(n().path)&&o(t.currentTarget),e.onBlur?.(t)}),c.$$keydown=t=>{t.code==="Enter"&&o(t.currentTarget)},use(t=>{onMount(()=>{t.focus();const a=t.value,l=a.indexOf("."),p=l===-1?a.length:l;t.setSelectionRange(0,p)})},c),setAttribute(c,"spellcheck",!1),createRenderEffect(t=>{var a=e.class,l={all:"unset",...e.style};return a!==t.e&&className(c,t.e=a),t.t=style(c,l,t.t),t},{e:void 0,t:void 0}),createRenderEffect(()=>c.value=n().name),c}})};delegateEvents(["keydown"]);const container="_container_1y72d_1",elbow="_elbow_1y72d_5",pipe="_pipe_1y72d_15",arm="_arm_1y72d_23",styles$1={container,elbow,pipe,arm};var _tmpl$$1=template("<span>");function DefaultIndentGuide(e){const n=useIndentGuide();return(()=>{var i=_tmpl$$1();return insert(i,createComponent(Switch,{get children(){return[createComponent(Match,{get when(){return n()==="elbow"},get children(){var o=_tmpl$$1();return createRenderEffect(()=>className(o,styles$1.elbow)),o}}),createComponent(Match,{get when(){return n()==="tee"},get children(){return[(()=>{var o=_tmpl$$1();return createRenderEffect(()=>className(o,styles$1.pipe)),o})(),(()=>{var o=_tmpl$$1();return createRenderEffect(()=>className(o,styles$1.arm)),o})()]}}),createComponent(Match,{get when(){return n()==="pipe"},get children(){var o=_tmpl$$1();return createRenderEffect(()=>className(o,styles$1.pipe)),o}})]}})),createRenderEffect(o=>{var c=styles$1.container,t=e.color,a=`${e.width}px`;return c!==o.e&&className(i,o.e=c),t!==o.t&&((o.t=t)!=null?i.style.setProperty("--color",t):i.style.removeProperty("--color")),a!==o.a&&((o.a=a)!=null?i.style.setProperty("width",a):i.style.removeProperty("width")),o},{e:void 0,t:void 0,a:void 0}),i})()}const app="_app_1w08q_6",custom="_custom_1w08q_17",dirEnt="_dirEnt_1w08q_29",textarea="_textarea_1w08q_47",input="_input_1w08q_51",styles={app,default:"_default_1w08q_13",custom,dirEnt,textarea,input};var _tmpl$=template(`<input placeholder="p.ex fs.writeFile('test2.ts', 'Hello World!')">`);const project=Object.assign({"../LICENSE":__vite_glob_0_0,"../README.md":__vite_glob_0_1,"./App.module.css":__vite_glob_0_2,"./index.html":__vite_glob_0_3,"./index.tsx":__vite_glob_0_4,"./logo.svg":__vite_glob_0_5,"./styles.css":__vite_glob_0_6,"./tsconfig.json":__vite_glob_0_7,"./vite.config.ts":__vite_glob_0_8,"../env.d.ts":__vite_glob_0_9,"../package.json":__vite_glob_0_10,"../pnpm-lock.yaml":__vite_glob_0_11,"../src/create-file-system.ts":__vite_glob_0_12,"../src/file-tree/defaults.module.css":__vite_glob_0_13,"../src/file-tree/defaults.tsx":__vite_glob_0_14,"../src/file-tree/index.tsx":__vite_glob_0_15,"../src/index.ts":__vite_glob_0_16,"../src/utils.ts":__vite_glob_0_17,"../test/index.test.tsx":__vite_glob_0_18,"../test/server.test.tsx":__vite_glob_0_19,"../tsconfig.json":__vite_glob_0_20,"../vite.config.ts":__vite_glob_0_21,"../vitest.config.ts":__vite_glob_0_22});function transform(e,n){const i=new URL(n+"/","file:///"),o=new URL("../",i),t=new URL(e,i).pathname.slice(o.pathname.length);return decodeURIComponent(t)}const App=()=>{const[selectedFile,setSelectedFile]=createSignal("index0.ts"),fs=createFileSystem();async function populate(){for(const e of Object.keys(project)){const n=transform(e,"dev"),o=n.split("/").slice(0,-1);for(let c=0;c<=o.length;c++){const t=o.slice(0,c).join("/");fs.exists(t)||fs.mkdir(t)}fs.writeFile(n,project[e])}}populate();const grammar=()=>{const e=selectedFile();return e?.endsWith("css")?"css":e?.endsWith("html")?"html":"tsx"},currentFile=()=>{const e=selectedFile();return e&&fs.exists(e)?fs.readFile(e):""};return createComponent(Split,{get class(){return styles.app},get children(){return[createComponent(Split.Pane,{size:"175px",get children(){return createComponent(FileTree,{fs,get class(){return styles.custom},onRename:(e,n)=>setSelectedFile(i=>PathUtils.rebase(i,e,n)),children:e=>{const[n,i]=createSignal(!1);return onMount(()=>{e().focused&&e().type==="file"&&setSelectedFile(e().path)}),createComponent(FileTree.DirEnt,{get class(){return styles.dirEnt},get style(){return{background:e().selected?"#484f6c":void 0}},onDblClick:()=>i(!0),onMouseDown:()=>{e().type==="file"&&setSelectedFile(e().path)},onKeyDown:o=>{const c=e();switch(o.code){case"Enter":i(t=>!t);break;case"Space":c.type==="dir"?c.expanded?c.collapse():c.expand():setSelectedFile(c.path);break}},get children(){return[createComponent(FileTree.IndentGuides,{render:()=>createComponent(DefaultIndentGuide,{color:"white",width:15})}),createComponent(FileTree.Expanded,{collapsed:"-",expanded:"+",style:{width:"15px","text-align":"center"}}),createComponent(FileTree.Name,{get editable(){return n()},get style(){return{"margin-left":e().type==="file"?"7.5px":void 0}},onBlur:()=>i(!1)})]}})}})}}),createComponent(Split.Handle,{size:"5px",style:{background:"lightgrey",cursor:"ew-resize"}}),createComponent(Split.Pane,{size:"1fr",style:{display:"grid","grid-template-rows":"1fr auto"},get children(){return[createComponent(TmTextarea,{get value(){return currentFile()},get grammar(){return grammar()},get class(){return styles.textarea},theme:"andromeeda",onInput:e=>fs.writeFile(selectedFile(),e.currentTarget.value)}),(()=>{var _el$=_tmpl$();return _el$.$$keydown=event=>{event.code==="Enter"&&(eval(event.currentTarget.value),event.currentTarget.value="")},createRenderEffect(()=>className(_el$,styles.input)),_el$})()]}})]}})};delegateEvents(["keydown"]);render(()=>createComponent(App,{}),document.getElementById("root"));
