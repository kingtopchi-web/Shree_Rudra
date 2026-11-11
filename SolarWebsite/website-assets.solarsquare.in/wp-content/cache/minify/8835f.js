(function(){'use strict';var FOCUSABLE=['a[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'].join(',');var EXIT_DURATION=240;var DISMISS_RATIO=0.3;var FLICK_VELOCITY=0.5;function prefersReducedMotion(){return!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
function isSheet(){return!!(window.matchMedia&&window.matchMedia('(max-width: 767px)').matches);}
function initTips(root){var panel=root.querySelector('.pm-surya-tips__panel');var scroller=root.querySelector('[data-tips-scroller]');var head=root.querySelector('.pm-surya-tips__head');if(!panel){return;}
var lastTrigger=null;var exitTimer=null;var scrollY=0;function focusable(){return Array.prototype.filter.call(panel.querySelectorAll(FOCUSABLE),function(el){if(el.tabIndex<0){return false;}
return el.offsetWidth>0||el.offsetHeight>0||el===document.activeElement;});}
function onKeydown(event){if(event.key==='Escape'||event.key==='Esc'){event.preventDefault();close();return;}
if(event.key!=='Tab'){return;}
var items=focusable();if(!items.length){event.preventDefault();panel.focus();return;}
var first=items[0];var last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}else if(items.indexOf(document.activeElement)===-1){event.preventDefault();first.focus();}}
function lockScroll(){scrollY=window.pageYOffset||document.documentElement.scrollTop||0;var gap=window.innerWidth-document.documentElement.clientWidth;document.body.style.overflow='hidden';if(gap>0){document.body.style.paddingRight=gap+'px';}}
function unlockScroll(){document.body.style.overflow='';document.body.style.paddingRight='';window.scrollTo(0,scrollY);}
function open(trigger){if(!root.hasAttribute('hidden')){return;}
if(exitTimer){clearTimeout(exitTimer);exitTimer=null;}
lastTrigger=trigger||null;root.removeAttribute('hidden');lockScroll();if(scroller){scroller.scrollTop=0;}
void panel.offsetWidth;root.classList.add('is-open');document.addEventListener('keydown',onKeydown,true);var closeBtn=root.querySelector('[data-tips-close]');if(closeBtn){closeBtn.focus();}else if(scroller){scroller.focus();}}
function finishClose(){exitTimer=null;root.setAttribute('hidden','');panel.classList.remove('is-dragging');panel.style.transform='';unlockScroll();if(lastTrigger&&document.contains(lastTrigger)){lastTrigger.focus();}
lastTrigger=null;}
function close(){if(root.hasAttribute('hidden')){return;}
root.classList.remove('is-open');document.removeEventListener('keydown',onKeydown,true);if(prefersReducedMotion()||document.hidden){finishClose();return;}
if(exitTimer){clearTimeout(exitTimer);}
exitTimer=setTimeout(finishClose,EXIT_DURATION);}
function initSwipe(){if(!head||typeof window.PointerEvent==='undefined'){return;}
var startY=0;var startTime=0;var offset=0;var dragging=false;function onMove(event){if(!dragging){return;}
offset=Math.max(0,event.clientY-startY);panel.style.transform='translateY('+offset+'px)';}
function onUp(event){if(!dragging){return;}
dragging=false;panel.classList.remove('is-dragging');if(head.hasPointerCapture&&head.hasPointerCapture(event.pointerId)){head.releasePointerCapture(event.pointerId);}
document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);document.removeEventListener('pointercancel',onUp);var elapsed=Math.max(1,Date.now()-startTime);var velocity=offset/elapsed;var threshold=panel.offsetHeight*DISMISS_RATIO;if(offset>threshold||velocity>FLICK_VELOCITY){panel.style.transform='';close();return;}
panel.style.transform='';}
head.addEventListener('pointerdown',function(event){if(!isSheet()||event.button!==0){return;}
if(event.target.closest('[data-tips-close]')){return;}
if(scroller&&scroller.scrollTop>0){return;}
dragging=true;startY=event.clientY;startTime=Date.now();offset=0;panel.classList.add('is-dragging');if(head.setPointerCapture){head.setPointerCapture(event.pointerId);}
document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',onUp);});function syncTouchAction(){head.style.touchAction=(scroller&&scroller.scrollTop>0)?'':'none';}
if(scroller){scroller.addEventListener('scroll',syncTouchAction,{passive:true});}
syncTouchAction();}
Array.prototype.forEach.call(root.querySelectorAll('[data-tips-close]'),function(button){button.addEventListener('click',close);});var backdrop=root.querySelector('[data-tips-close-backdrop]');if(backdrop){backdrop.addEventListener('click',close);}
initSwipe();window.addEventListener('resize',function(){if(!isSheet()){panel.style.transform='';panel.classList.remove('is-dragging');}});var triggers=document.querySelectorAll('[data-pm-surya-tips-open], .pm-surya-keep__button');Array.prototype.forEach.call(triggers,function(trigger){trigger.addEventListener('click',function(event){event.preventDefault();open(trigger);});});}
function init(){var roots=document.querySelectorAll('[data-pm-surya-tips]');Array.prototype.forEach.call(roots,initTips);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}}());