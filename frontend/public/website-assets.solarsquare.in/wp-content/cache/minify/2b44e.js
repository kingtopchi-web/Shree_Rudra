(function(){'use strict';var RING_CIRCUMFERENCE=2*Math.PI*35;var MS_PER_MINUTE=60*1000;var MS_PER_HOUR=60*MS_PER_MINUTE;var MS_PER_DAY=24*MS_PER_HOUR;function parseDeadline(value){if(!value){return null;}
var parsed=new Date(value+'T23:59:59');if(isNaN(parsed.getTime())){parsed=new Date(value);}
return isNaN(parsed.getTime())?null:parsed;}
function setRing(el,fraction){if(!el){return;}
var clamped=Math.max(0,Math.min(1,fraction));el.style.strokeDasharray=RING_CIRCUMFERENCE;el.style.strokeDashoffset=RING_CIRCUMFERENCE*(1-clamped);}
function initRingsFullCircle(rings){Object.keys(rings).forEach(function(key){var el=rings[key];if(!el){return;}
el.style.strokeDasharray=RING_CIRCUMFERENCE;el.style.strokeDashoffset='0';el.style.transition='none';});}
function animateRingsToTarget(rings){Object.keys(rings).forEach(function(key){var el=rings[key];if(!el){return;}
el.style.transition='stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';});}
function initCountdown(root){var deadline=parseDeadline(root.getAttribute('data-deadline'));if(!deadline){root.classList.add('pm-surya-countdown--inactive');return;}
var totalDays=parseInt(root.getAttribute('data-total-days'),10);if(!totalDays||totalDays<1){totalDays=365;}
var values={days:root.querySelector('[data-countdown="days"]'),hours:root.querySelector('[data-countdown="hours"]'),mins:root.querySelector('[data-countdown="mins"]')};var rings={days:root.querySelector('[data-ring="days"]'),hours:root.querySelector('[data-ring="hours"]'),mins:root.querySelector('[data-ring="mins"]')};var timer=null;var firstRender=true;function render(){var remaining=deadline.getTime()-Date.now();if(remaining<=0){remaining=0;if(timer){clearInterval(timer);timer=null;}
root.classList.add('pm-surya-countdown--expired');}
var days=Math.floor(remaining/MS_PER_DAY);var hours=Math.floor(remaining/MS_PER_HOUR)%24;var mins=Math.floor(remaining/MS_PER_MINUTE)%60;if(values.days){values.days.textContent=days;}
if(values.hours){values.hours.textContent=hours;}
if(values.mins){values.mins.textContent=mins;}
if(firstRender){initRingsFullCircle(rings);void(rings.days&&rings.days.offsetWidth);requestAnimationFrame(function(){animateRingsToTarget(rings);setRing(rings.days,days/totalDays);setRing(rings.hours,hours/24);setRing(rings.mins,mins/60);});firstRender=false;}else{setRing(rings.days,days/totalDays);setRing(rings.hours,hours/24);setRing(rings.mins,mins/60);}}
render();timer=setInterval(render,1000);}
function initCountUp(){var elements=document.querySelectorAll('[data-count-to]');if(!elements.length){return;}
var DURATION=2000;function parseValue(raw){var match=raw.match(/^([^\d]*)([\d.,]+)(.*)$/);if(!match){return null;}
return{prefix:match[1],number:parseFloat(match[2].replace(/,/g,'')),decimals:(match[2].split('.')[1]||'').length,hasCommas:match[2].indexOf(',')!==-1,suffix:match[3]};}
function formatNumber(num,decimals,hasCommas){var fixed=num.toFixed(decimals);if(!hasCommas){return fixed;}
var parts=fixed.split('.');var intPart=parts[0];var decPart=parts[1]?'.'+parts[1]:'';var lastThree=intPart.slice(-3);var rest=intPart.slice(0,-3);if(rest){lastThree=','+lastThree;rest=rest.replace(/\B(?=(\d{2})+(?!\d))/g,',');}
return rest+lastThree+decPart;}
function animateElement(el){var target=el.getAttribute('data-count-to');var parsed=parseValue(target);if(!parsed){return;}
el.textContent=parsed.prefix+formatNumber(0,parsed.decimals,parsed.hasCommas)+parsed.suffix;var start=null;function step(timestamp){if(!start){start=timestamp;}
var progress=Math.min((timestamp-start)/DURATION,1);var eased=1-Math.pow(1-progress,5);var current=eased*parsed.number;el.textContent=parsed.prefix+formatNumber(current,parsed.decimals,parsed.hasCommas)+parsed.suffix;if(progress<1){requestAnimationFrame(step);}else{el.textContent=target;}}
requestAnimationFrame(step);}
if('IntersectionObserver'in window){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){animateElement(entry.target);observer.unobserve(entry.target);}});},{threshold:0.3});elements.forEach(function(el){observer.observe(el);});}else{elements.forEach(function(el){el.textContent=el.getAttribute('data-count-to');});}}
function initTrustCarousel(root){var AUTOPLAY_INTERVAL=4000;var RESUME_DELAY=6000;var track=root.querySelector('.pm-surya-trust-carousel__track');if(!track){return;}
var originals=Array.prototype.slice.call(track.children);var count=originals.length;if(!count){return;}
var autoplay=null;var resumeTimer=null;var settleTimer=null;var raf=null;var looping=count>1;if(looping){var lead=document.createDocumentFragment();var trail=document.createDocumentFragment();originals.forEach(function(el){[lead,trail].forEach(function(frag){var clone=el.cloneNode(true);clone.classList.add('is-clone');clone.setAttribute('aria-hidden','true');frag.appendChild(clone);});});track.insertBefore(lead,track.firstChild);track.appendChild(trail);}
var items=Array.prototype.slice.call(track.children);var first=looping?count:0;var current=first;function offsetWithin(item){return(item.getBoundingClientRect().left-root.getBoundingClientRect().left)+root.scrollLeft;}
function scrollTargetFor(i){return offsetWithin(items[i])-((root.clientWidth-items[i].offsetWidth)/2);}
function setWidth(){return offsetWithin(items[count])-offsetWithin(items[0]);}
function nearestIndex(){var rootRect=root.getBoundingClientRect();var mid=rootRect.left+(rootRect.width/2);var closest=0;var best=Infinity;var i;var rect;var distance;for(i=0;i<items.length;i++){rect=items[i].getBoundingClientRect();distance=Math.abs((rect.left+(rect.width/2))-mid);if(distance<best){best=distance;closest=i;}}
return closest;}
function markActive(index){var i;for(i=0;i<items.length;i++){items[i].classList.toggle('is-active',i===index);}}
function normalise(){if(looping){var index=nearestIndex();var shift=0;if(index<count){shift=setWidth();}else if(index>=count*2){shift=-setWidth();}
if(shift){root.scrollLeft=root.scrollLeft+shift;}}
current=nearestIndex();return current;}
function advance(){if(looping&&current>=count*2){root.scrollLeft=root.scrollLeft-setWidth();current=current-count;}
current=current+1;if(current>=items.length){current=first;}
root.scrollTo({left:scrollTargetFor(current),behavior:'smooth'});markActive(current);}
function onScroll(){if(raf){return;}
raf=requestAnimationFrame(function(){raf=null;markActive(nearestIndex());});if(settleTimer){clearTimeout(settleTimer);}
settleTimer=setTimeout(function(){settleTimer=null;normalise();markActive(current);},150);}
function stopAutoplay(){if(autoplay){clearInterval(autoplay);autoplay=null;}}
function startAutoplay(){if(autoplay||!looping){return;}
if(root.scrollWidth<=root.clientWidth){return;}
autoplay=setInterval(advance,AUTOPLAY_INTERVAL);}
function pauseAutoplay(){stopAutoplay();if(resumeTimer){clearTimeout(resumeTimer);}
resumeTimer=setTimeout(function(){resumeTimer=null;startAutoplay();},RESUME_DELAY);}
root.addEventListener('scroll',onScroll,{passive:true});['pointerdown','touchstart','wheel','keydown'].forEach(function(evt){root.addEventListener(evt,pauseAutoplay,{passive:true});});if(typeof IntersectionObserver!=='undefined'){new IntersectionObserver(function(entries){if(entries[0].isIntersecting){startAutoplay();}else{stopAutoplay();}},{threshold:0}).observe(root);}
root.scrollLeft=scrollTargetFor(first);markActive(first);startAutoplay();}
function initApplySteps(section){var viewport=section.querySelector('.pm-surya-apply__viewport');var list=section.querySelector('.pm-surya-apply__list');var prev=section.querySelector('[data-apply-nav="prev"]');var next=section.querySelector('[data-apply-nav="next"]');if(!viewport||!list||!prev||!next){return;}
var SCROLL_DURATION=450;var raf=null;var anim=null;function step(){var card=list.querySelector('.pm-surya-apply__step');if(!card){return list.clientWidth;}
var styles=window.getComputedStyle(list);var gap=parseFloat(styles.columnGap||styles.gap)||0;return card.getBoundingClientRect().width+gap;}
function sync(){var maxScroll=list.scrollWidth-list.clientWidth;var atStart=list.scrollLeft<=1;var atEnd=list.scrollLeft>=maxScroll-1;var scrollable=maxScroll>1;prev.disabled=atStart;next.disabled=atEnd;viewport.classList.toggle('has-prev',scrollable&&!atStart);viewport.classList.toggle('has-next',scrollable&&!atEnd);section.classList.toggle('is-static',!scrollable);}
function animateTo(target,duration){var start=list.scrollLeft;var max=list.scrollWidth-list.clientWidth;var end=Math.max(0,Math.min(max,target));var delta=end-start;if(anim){cancelAnimationFrame(anim);anim=null;}
if(Math.abs(delta)<1){sync();return;}
if(document.hidden){list.scrollLeft=end;sync();return;}
list.style.scrollSnapType='none';var startedAt=performance.now();function frame(now){var p=Math.min(1,(now-startedAt)/duration);var eased=p<0.5?2*p*p:1-(Math.pow(-2*p+2,2)/2);list.scrollLeft=start+(delta*eased);sync();if(p<1){anim=requestAnimationFrame(frame);return;}
anim=null;list.style.scrollSnapType='';sync();}
anim=requestAnimationFrame(frame);}
function scrollBy(direction){animateTo(list.scrollLeft+(step()*direction),SCROLL_DURATION);}
prev.addEventListener('click',function(){scrollBy(-1);});next.addEventListener('click',function(){scrollBy(1);});list.addEventListener('scroll',function(){if(raf){return;}
raf=requestAnimationFrame(function(){raf=null;sync();});},{passive:true});window.addEventListener('resize',sync);sync();}
function init(){var countdowns=document.querySelectorAll('.pm-surya-countdown');var carousels=document.querySelectorAll('.pm-surya-trust-carousel');var i;for(i=0;i<countdowns.length;i++){initCountdown(countdowns[i]);}
for(i=0;i<carousels.length;i++){initTrustCarousel(carousels[i]);}
var applySections=document.querySelectorAll('.pm-surya-apply');for(i=0;i<applySections.length;i++){initApplySteps(applySections[i]);}
initCountUp();}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}}());