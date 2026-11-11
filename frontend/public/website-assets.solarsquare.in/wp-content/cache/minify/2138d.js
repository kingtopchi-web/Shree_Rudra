(function(){'use strict';var FOCUSABLE=['a[href]','button:not([disabled])','select:not([disabled])','input:not([disabled]):not([type="hidden"])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'].join(',');var EXIT_DURATION=240;var SWIPE_CLOSE_RATIO=0.28;var SWIPE_CLOSE_VELOCITY=0.5;var SWIPE_MIN_DISTANCE=48;function prefersReducedMotion(){return!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
function isSheet(){return!!(window.matchMedia&&window.matchMedia('(max-width: 767px)').matches);}
function formatInr(value){var amount=Number(value);if(!isFinite(amount)){amount=0;}
var sign=amount<0?'-':'';var digits=String(Math.round(Math.abs(amount)));if(digits.length>3){var last3=digits.slice(-3);var rest=digits.slice(0,-3).replace(/\B(?=(\d{2})+(?!\d))/g,',');digits=rest+','+last3;}
return sign+'₹'+digits;}
function setText(el,text){if(el){el.textContent=text;}}
function initCalculator(root){var panel=root.querySelector('.pm-surya-calc__panel');var backdrop=root.querySelector('[data-calc-close-backdrop]');var handle=root.querySelector('[data-calc-handle]');var citySelect=root.querySelector('[data-calc="city"]');var dotsWrap=root.querySelector('[data-calc="dots"]');if(!panel||!citySelect||!dotsWrap){return;}
var dots=Array.prototype.slice.call(dotsWrap.querySelectorAll('[data-calc-index]'));var matrix=[];try{matrix=JSON.parse(root.getAttribute('data-calc-matrix')||'[]')||[];}catch(e){matrix=[];}
if(!dots.length){return;}
var out={chip:root.querySelector('[data-calc="size-chip"]'),cityLabel:root.querySelector('[data-calc="city-label"]'),total:root.querySelector('[data-calc="total"]'),costLabel:root.querySelector('[data-calc="cost-label"]'),cost:root.querySelector('[data-calc="cost"]'),central:root.querySelector('[data-calc="central"]'),stateLabel:root.querySelector('[data-calc="state-label"]'),state:root.querySelector('[data-calc="state"]'),after:root.querySelector('[data-calc="after"]')};var costTemplate=root.getAttribute('data-cost-label')||'';var stateTemplate=root.getAttribute('data-state-label')||'';var prevArrow=root.querySelector('[data-calc-step="-1"]');var nextArrow=root.querySelector('[data-calc-step="1"]');var current=parseInt(root.getAttribute('data-start-index'),10);if(isNaN(current)||current<0||current>=dots.length){current=0;}
var lastTrigger=null;var exitTimer=null;var scrollY=0;function selectedCityName(){var option=citySelect.options[citySelect.selectedIndex];return option?option.text:'';}
function selectedStateSubsidy(){var dot=dots[current];return dot?parseFloat(dot.getAttribute('data-state'))||0:0;}
function rebuildDots(cityIndex){var city=matrix[cityIndex];if(!city||!city.sizes||!city.sizes.length||!dots.length){return;}
var template=dots[0].cloneNode(true);dotsWrap.innerHTML='';city.sizes.forEach(function(size,index){var dot=template.cloneNode(true);dot.setAttribute('data-calc-index',index);dot.setAttribute('data-size',size.kw);dot.setAttribute('data-cost',size.cost);dot.setAttribute('data-central',size.central);dot.setAttribute('data-state',size.state);dot.setAttribute('data-after',size.after);var label=dot.querySelector('.pm-surya-calc__sr');if(label){label.textContent=size.kw;}
dotsWrap.appendChild(dot);});dots=Array.prototype.slice.call(dotsWrap.querySelectorAll('[data-calc-index]'));if(current>dots.length-1){current=dots.length-1;}}
function revealActiveDot(){var dot=dots[current];var left=dot.offsetLeft-((dotsWrap.clientWidth-dot.offsetWidth)/2);dotsWrap.scrollLeft=Math.max(0,left);}
function render(){var dot=dots[current];var size=dot.getAttribute('data-size')||'';var cost=parseFloat(dot.getAttribute('data-cost'))||0;var central=parseFloat(dot.getAttribute('data-central'))||0;var after=parseFloat(dot.getAttribute('data-after'))||0;var city=selectedCityName();var state=selectedStateSubsidy();var i;for(i=0;i<dots.length;i++){var active=i===current;dots[i].classList.toggle('is-active',active);dots[i].setAttribute('aria-checked',active?'true':'false');dots[i].setAttribute('tabindex',active?'0':'-1');}
if(prevArrow){prevArrow.disabled=current<=0;}
if(nextArrow){nextArrow.disabled=current>=dots.length-1;}
setText(out.chip,size);setText(out.cityLabel,city);setText(out.total,formatInr(central+state));setText(out.costLabel,costTemplate.replace('{size}',size));setText(out.cost,formatInr(cost));setText(out.central,formatInr(central));setText(out.stateLabel,stateTemplate.replace('{city}',city));setText(out.state,formatInr(state));setText(out.after,formatInr(after));revealActiveDot();}
function select(index,focusDot){var next=Math.max(0,Math.min(dots.length-1,index));if(next===current){return;}
current=next;render();if(focusDot){dots[current].focus();}}
function focusable(){return Array.prototype.filter.call(panel.querySelectorAll(FOCUSABLE),function(el){if(el.tabIndex<0){return false;}
return el.offsetWidth>0||el.offsetHeight>0||el===document.activeElement;});}
function onKeydown(event){if(event.key==='Escape'||event.key==='Esc'){event.preventDefault();close();return;}
if(event.key!=='Tab'){return;}
var items=focusable();if(!items.length){event.preventDefault();panel.focus();return;}
var first=items[0];var last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}else if(items.indexOf(document.activeElement)===-1){event.preventDefault();first.focus();}}
function lockScroll(){scrollY=window.pageYOffset||document.documentElement.scrollTop||0;var gap=window.innerWidth-document.documentElement.clientWidth;document.body.style.overflow='hidden';if(gap>0){document.body.style.paddingRight=gap+'px';}}
function unlockScroll(){document.body.style.overflow='';document.body.style.paddingRight='';window.scrollTo(0,scrollY);}
function open(trigger){if(!root.hasAttribute('hidden')){return;}
if(exitTimer){clearTimeout(exitTimer);exitTimer=null;}
lastTrigger=trigger||null;panel.classList.remove('is-dragging');panel.style.transform='';root.removeAttribute('hidden');lockScroll();void panel.offsetWidth;root.classList.add('is-open');render();document.addEventListener('keydown',onKeydown,true);var closeBtn=root.querySelector('[data-calc-close]');if(closeBtn&&closeBtn.offsetParent!==null){closeBtn.focus();}else if(dots[current]){dots[current].focus();}else{panel.focus();}}
function finishClose(){exitTimer=null;root.setAttribute('hidden','');panel.classList.remove('is-dragging');panel.style.transform='';unlockScroll();if(lastTrigger&&document.contains(lastTrigger)){lastTrigger.focus();}
lastTrigger=null;}
function close(){if(root.hasAttribute('hidden')){return;}
root.classList.remove('is-open');document.removeEventListener('keydown',onKeydown,true);if(prefersReducedMotion()||document.hidden){finishClose();return;}
if(exitTimer){clearTimeout(exitTimer);}
exitTimer=setTimeout(finishClose,EXIT_DURATION);}
function initSwipe(){if(!handle||typeof window.PointerEvent==='undefined'){return;}
var startY=0;var startedAt=0;var offset=0;var dragging=false;function onMove(event){if(!dragging){return;}
offset=Math.max(0,event.clientY-startY);panel.style.transform='translateY('+offset+'px)';}
function onUp(event){if(!dragging){return;}
dragging=false;panel.classList.remove('is-dragging');if(handle.releasePointerCapture&&event.pointerId!==undefined){try{handle.releasePointerCapture(event.pointerId);}catch(err){}}
document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);document.removeEventListener('pointercancel',onUp);var elapsed=Math.max(1,Date.now()-startedAt);var velocity=offset/elapsed;var threshold=panel.offsetHeight*SWIPE_CLOSE_RATIO;if(offset>threshold||(offset>SWIPE_MIN_DISTANCE&&velocity>SWIPE_CLOSE_VELOCITY)){close();return;}
panel.style.transform='';offset=0;}
handle.addEventListener('pointerdown',function(event){if(!isSheet()||root.hasAttribute('hidden')){return;}
dragging=true;startY=event.clientY;startedAt=Date.now();offset=0;panel.classList.add('is-dragging');if(handle.setPointerCapture){try{handle.setPointerCapture(event.pointerId);}catch(err){}}
document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',onUp);event.preventDefault();});}
dotsWrap.addEventListener('click',function(event){var dot=event.target.closest('[data-calc-index]');if(!dot){return;}
select(parseInt(dot.getAttribute('data-calc-index'),10),false);});dotsWrap.addEventListener('keydown',function(event){var delta=0;if(event.key==='ArrowRight'||event.key==='ArrowDown'){delta=1;}else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){delta=-1;}else if(event.key==='Home'){event.preventDefault();select(0,true);return;}else if(event.key==='End'){event.preventDefault();select(dots.length-1,true);return;}
if(!delta){return;}
event.preventDefault();select(current+delta,true);});[prevArrow,nextArrow].forEach(function(button){if(!button){return;}
button.addEventListener('click',function(){select(current+(parseInt(button.getAttribute('data-calc-step'),10)||0),false);});});citySelect.addEventListener('change',function(){rebuildDots(citySelect.selectedIndex);render();});Array.prototype.forEach.call(root.querySelectorAll('[data-calc-close]'),function(button){button.addEventListener('click',close);});if(backdrop){backdrop.addEventListener('click',close);}
window.addEventListener('resize',function(){if(!root.hasAttribute('hidden')){revealActiveDot();}});initSwipe();render();var triggers=document.querySelectorAll('[data-pm-surya-calc-open], .pm-surya-subsidy__promo');Array.prototype.forEach.call(triggers,function(trigger){trigger.addEventListener('click',function(event){event.preventDefault();open(trigger);});});}
function init(){var roots=document.querySelectorAll('[data-pm-surya-calc]');var i;for(i=0;i<roots.length;i++){initCalculator(roots[i]);}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}}());