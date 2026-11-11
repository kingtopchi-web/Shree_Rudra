(function(){'use strict';var SHEET='(max-width: 767.98px)';function isSheet(){return!!(window.matchMedia&&window.matchMedia(SHEET).matches);}
(function chooseForm(){var ours=document.querySelector('[data-pm-surya-lead]');var theirs=document.getElementById('leadFormModal');var loser=isSheet()?ours:theirs;if(loser&&loser.parentNode){loser.parentNode.removeChild(loser);}}());var FOCUSABLE=['a[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'].join(',');var EXIT_DURATION=240;var TRIGGERS=['[data-pm-surya-lead-open]','.pm-surya-hero__cta','.pm-surya-stats__cta-button','.pm-surya-eligibility__cta-button','.pm-surya-cta__button'].join(',');var OTHER_DIALOGS='[data-pm-surya-calc]:not([hidden]), [data-pm-surya-tips]:not([hidden])';var LEAD_SOURCE='Website - PMSGY';var SUBMIT_LABEL='Book a FREE Consultation';function hostWindow(){try{if(window.parent&&window.parent!==window){return window.parent;}}catch(e){}
return window;}
function moengage(){var host=hostWindow();return(host&&host.Moengage)?host.Moengage:null;}
function ajaxConfig(){return(typeof ajaxObject!=='undefined')?ajaxObject:{};}
function parseCookieString(cookieString){var parsed={};if(!cookieString){return parsed;}
cookieString.split(';').forEach(function(pair){var separatorIndex=pair.indexOf('=');if(separatorIndex===-1){return;}
var key=decodeURIComponent(pair.slice(0,separatorIndex).trim());parsed[key]=decodeURIComponent(pair.slice(separatorIndex+1).trim());});return parsed;}
function pickUtmParams(source){var safe=source||{};return{utm_source:safe.utm_source||'',utm_medium:safe.utm_medium||'',utm_campaign:safe.utm_campaign||'',utm_content:safe.utm_content||'',utm_term:safe.utm_term||'',fbclid:safe.fbclid||'',gclid:safe.gclid||''};}
function resolvedUtm(){var host=hostWindow();var fromWindow={};var fromHostCookies={};var fromOwnCookies={};try{fromWindow=pickUtmParams(host.utmParams||{});}catch(e){}
try{fromHostCookies=pickUtmParams(parseCookieString(host.document.cookie));}catch(e){}
try{fromOwnCookies=pickUtmParams(parseCookieString(document.cookie));}catch(e){}
var out={};Object.keys(pickUtmParams({})).forEach(function(key){out[key]=fromWindow[key]||fromHostCookies[key]||fromOwnCookies[key]||'';});return out;}
function hostPageUrl(){var host=hostWindow();try{return host.location.href||window.location.href;}catch(e){return document.referrer||window.location.href;}}
function routeFromUrl(url){try{if(!url){return'';}
var route=new URL(url).pathname;if(route.length>1&&route.charAt(route.length-1)==='/'){route=route.slice(0,-1);}
return route;}catch(e){return null;}}
function deviceType(){return/Mobi|Android/i.test(navigator.userAgent)?'mobile':'desktop';}
function deviceName(){var ua=navigator.userAgent;if(/iPhone/.test(ua)){return'iPhone';}
if(/iPad/.test(ua)){return'iPad';}
if(/Android/.test(ua)){return'Android Device';}
if(/Windows Phone/.test(ua)){return'Windows Phone';}
if(/Macintosh/.test(ua)){return'Mac';}
if(/Windows/.test(ua)){return'Windows PC';}
if(/Linux/.test(ua)){return'Linux PC';}
return'Unknown Device';}
function serviceabilityType(pincodeStatus){if(['Inactive City','Inactive State'].indexOf(pincodeStatus)!==-1){return'Inactive_PIN_Inactive_City';}
if(pincodeStatus==='Inactive Pincode'){return'Inactive_PIN_Active_City';}
if(pincodeStatus===null){return'Inactive_PIN_Unidentified';}
return undefined;}
function stripEmpty(payload){Object.keys(payload).forEach(function(key){if(payload[key]===null||payload[key]===undefined||payload[key]===''){delete payload[key];}});return payload;}
function pushToDataLayer(event){var host=hostWindow();host.dataLayer=host.dataLayer||[];host.dataLayer.push(event);}
function triggerLabel(trigger){if(!trigger){return'';}
var text='';Array.prototype.forEach.call(trigger.childNodes,function(node){if(node.nodeType===3){text+=node.nodeValue;return;}
if(node.nodeType!==1){return;}
if(node.getAttribute('aria-hidden')==='true'||node.classList.contains('material-symbols-outlined')){return;}
text+=node.textContent;});return text.replace(/\s+/g,' ').trim();}
function prefersReducedMotion(){return!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}
function initForm(root){var form=root.querySelector('#pmSuryaConsultationForm');if(!form){return;}
var fullNameInput=form.querySelector('#pmSuryaFullName');var pinCodeInput=form.querySelector('#pmSuryaPinCode');var whatsappInput=form.querySelector('#pmSuryaWhatsapp');var billSelect=form.querySelector('#pmSuryaBill');var referrerInput=form.querySelector('#pmSuryaReferrer');var submitBtn=form.querySelector('#pmSuryaSubmit');var resolvedCity='';if(!fullNameInput||!pinCodeInput||!whatsappInput||!billSelect||!submitBtn){return;}
var isAppended=false;function fieldError(field){return document.getElementById(field.id+'Error');}
function showError(field,message){field.classList.add('is-error');var el=fieldError(field);if(el){el.textContent=message;}}
function clearFieldError(field){field.classList.remove('is-error');var el=fieldError(field);if(el){el.textContent='';}}
function clearErrors(){[fullNameInput,pinCodeInput,whatsappInput,billSelect].forEach(function(field){if(field){field.classList.remove('is-error');}});Array.prototype.forEach.call(form.querySelectorAll('.pm-surya-lead__error'),function(el){el.textContent='';});}
function cleanPin(){var value=pinCodeInput.value.trim();return value.indexOf(' (')!==-1?value.split(' (')[0]:value;}
function validateFullName(value){var trimmed=value.trim();if(!trimmed){showError(fullNameInput,'Full Name is required.');return false;}
if(!/^[a-zA-Z\s]+$/.test(trimmed)){showError(fullNameInput,'Full Name should contain only letters and spaces.');return false;}
clearFieldError(fullNameInput);return true;}
function validateWhatsApp(value){var trimmed=value.trim();if(!trimmed){showError(whatsappInput,'WhatsApp Number is required.');return false;}
if(!/^[1-9]\d{9}$/.test(trimmed)){showError(whatsappInput,'WhatsApp Number must be valid 10 digits.');return false;}
clearFieldError(whatsappInput);return true;}
function resetPinState(){resolvedCity='';pinCodeInput.dataset.isValid='false';isAppended=false;}
function checkPinCode(pin){if(pin.length!==6||!/^\d{6}$/.test(pin)){return;}
var cfg=ajaxConfig();var body=new URLSearchParams();body.append('action','sse_get_pincode_status');body.append('pincode',pin);fetch(cfg.ajax_url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body}).then(function(response){if(!response.ok){throw new Error('Pincode lookup failed (HTTP '+response.status+')');}
return response.json();}).then(function(res){return{data:res&&res.success?res.data:null};}).then(function(result){clearFieldError(pinCodeInput);var data=result&&result.data;if(data&&Object.keys(data).length>0){var originalCity=data.city||data.cluster;var displayCity=originalCity==='Aurangabad'?'Chhatrapati Sambhajinagar':originalCity;resolvedCity=displayCity;pinCodeInput.value=data.pin_code+' ('+displayCity+')';pinCodeInput.dataset.isValid='true';isAppended=true;return;}
resetPinState();if(data===null){var moe=moengage();if(moe){moe.track_event('invalid_pin_entered',{entered_pin:pin,page_url:hostPageUrl()});}}}).catch(function(error){console.error('PIN Code API error:',error);resetPinState();});}
function submitFormDetails(payload){var cfg=ajaxConfig();var body=new URLSearchParams();body.append('action','send_to_lsq_handler');body.append('leadData',JSON.stringify(payload));return fetch(cfg.ajax_url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','cache-control':'no-cache',accept:'*/*'},body:body,redirect:'follow'}).then(function(response){return response.json();}).catch(function(error){console.log('Lead submission failed:',error);return null;});}
function trackSuccess(data,city,formFieldName){var moe=moengage();if(!moe||!data){return;}
var utm=resolvedUtm();var pin=cleanPin();moe.add_unique_user_id(data.prospectId);var legacyPayload=stripEmpty({page_source:routeFromUrl(hostPageUrl()),device_type:deviceType(),device_name:deviceName(),utm_source:utm.utm_source,utm_medium:utm.utm_medium,utm_campaign:utm.utm_campaign,utm_content:utm.utm_content,utm_fbclid:utm.fbclid,gclid:utm.gclid,customer_name:fullNameInput.value.trim(),customer_mobile:whatsappInput.value.trim(),monthly_bill:billSelect.value,pin_code:pin,city:city==='Chhatrapati Sambhajinagar'?'Aurangabad':(city||''),prospect_id:data.prospectId||'',opportunity_id:data.opportunityId||'',form_field_name:formFieldName,lead_serviceable_check:data.invalid_pincode===false});var successPayload={customer_name:fullNameInput.value.trim(),customer_mobile:whatsappInput.value.trim(),monthly_bill:billSelect.value,pin_code:pin,city:city||'',is_servicable:!data.invalid_pincode,url:hostPageUrl(),device_type:'',device_name:'',is_pin_valid:data.pin_in_db||false};var pageReferrer=resolveReferrer()||'';successPayload.page_referrer=pageReferrer;var serviceability=serviceabilityType(data.pincode_status);if(typeof serviceability!=='undefined'){successPayload.serviceability=serviceability;}
moe.track_event('lead_form_submit_success',stripEmpty(successPayload));moe.track_event('form_field_clicked',legacyPayload);var nameParts=fullNameInput.value.split(' ');if(nameParts[0]){moe.add_first_name(nameParts[0]);}
if(nameParts[1]){moe.add_last_name(nameParts[1]);}
moe.add_mobile(whatsappInput.value.trim());moe.add_user_name(fullNameInput.value.trim());moe.add_user_attribute('prospect_id',String(data.prospectId||''));moe.add_user_attribute('opportunity_id',String(data.opportunityId||''));moe.add_user_attribute('monthly_bill',billSelect.value||'');moe.add_user_attribute('pin_code',pin||'');moe.add_user_attribute('page_referrer',pageReferrer);if(city){moe.add_user_attribute('city',city);}
if(data.state){moe.add_user_attribute('state',String(data.state));}
if(data.cluster){moe.add_user_attribute('cluster',String(data.cluster));}
moe.add_user_attribute('product_type','residential');}
function clusterEvent(result,city){var typed=city.trim();var resolved=result.city||city;var match=false;try{match=new RegExp(resolved,'i').test(typed)||new RegExp(typed,'i').test(resolved);}catch(e){match=resolved.toLowerCase()===typed.toLowerCase();}
var bengaluru=(resolved==='Bengaluru'&&typed==='Bangalore')||(resolved==='Bangalore'&&typed==='Bengaluru');if(match||bengaluru){return result.invalid_pincode?'lead_inactive_pin_accurate_cluster':'lead_active_pin_accurate_cluster';}
return result.invalid_pincode?'lead_inactive_pin_inaccurate_cluster':'lead_active_pin_inaccurate_cluster';}
function syncHiddenUtmInputs(){var utm=resolvedUtm();var values={utm_source:utm.utm_source,utm_medium:utm.utm_medium,utm_campaign:utm.utm_campaign,utm_content:utm.utm_content,utm_term:utm.utm_term,utm_url:hostPageUrl(),gclid:utm.gclid};Object.keys(values).forEach(function(name){var field=form.querySelector('input[name="'+name+'"]');if(field){field.value=values[name]||'';}});}
function resolveReferrer(){var host=hostWindow();var utils=host.SSEReferrer||null;var resolved='';if(utils&&typeof utils.resolveFinalReferrer==='function'){resolved=utils.resolveFinalReferrer()||'';}else{try{resolved=(host.sessionStorage&&host.sessionStorage.getItem('original_referrer'))||'';}catch(e){resolved='';}}
if(referrerInput){referrerInput.value=resolved;}
return resolved;}
resolveReferrer();syncHiddenUtmInputs();form.addEventListener('submit',function(event){event.preventDefault();clearErrors();var isValid=validateFullName(fullNameInput.value);var pin=cleanPin();if(!pin){showError(pinCodeInput,'PIN Code is required.');isValid=false;}else if(!/^\d{6}$/.test(pin)){showError(pinCodeInput,'PIN Code must be exactly 6 digits.');isValid=false;}
if(!validateWhatsApp(whatsappInput.value)){isValid=false;}
if(!billSelect.value){showError(billSelect,'Please select your Monthly Electricity Bill.');isValid=false;}
if(!isValid){var firstError=form.querySelector('.is-error');if(firstError){firstError.scrollIntoView({behavior:'smooth',block:'center'});}
return;}
submitBtn.disabled=true;submitBtn.textContent='Submitting...';var city=resolvedCity||'';var formFieldName='form_submit_details';var utm=resolvedUtm();submitFormDetails({name:fullNameInput.value.trim(),whatsapp:whatsappInput.value.trim(),pincode:pin,city:city==='Chhatrapati Sambhajinagar'?'Aurangabad':city,monthly_bill:billSelect.value,source:LEAD_SOURCE,form_field_name:formFieldName,referrer:resolveReferrer(),utm_source:utm.utm_source,utm_medium:utm.utm_medium,utm_campaign:utm.utm_campaign,utm_content:utm.utm_content,utm_terms:utm.utm_term,utm_url:hostPageUrl(),gclid:utm.gclid,utm_fbclid:utm.fbclid}).then(function(response){var result=(response&&response.data)||{};pushToDataLayer({event:result.invalid_pincode?'invalid_pincode':'lead_form_submit',phone_number:whatsappInput.value.trim(),bill_value:billSelect.value,currency:'INR'});pushToDataLayer({event:clusterEvent(result,city),phone_number:whatsappInput.value.trim(),bill_value:billSelect.value,currency:'INR'});trackSuccess(result,city,formFieldName);if(!response){submitBtn.disabled=false;submitBtn.textContent=SUBMIT_LABEL;return;}
fullNameInput.value='';pinCodeInput.value='';whatsappInput.value='';billSelect.value='';Array.prototype.forEach.call(billPills,function(p){p.classList.remove('is-active');});resetPinState();submitBtn.disabled=false;submitBtn.textContent=SUBMIT_LABEL;hostWindow().location.href=result.redirect_url||'/';});});whatsappInput.addEventListener('input',function(){if(this.value.length>10){this.value=this.value.slice(0,10);}
validateWhatsApp(this.value);});fullNameInput.addEventListener('input',function(){if(this.value.length>50){this.value=this.value.slice(0,50);}
validateFullName(this.value);});fullNameInput.addEventListener('blur',function(){validateFullName(this.value);trackField('form_full_name',this.value.trim());});pinCodeInput.addEventListener('keydown',function(event){if(!isAppended){return;}
if(event.key!=='Backspace'&&event.key!=='Delete'){return;}
event.preventDefault();pinCodeInput.value='';clearFieldError(pinCodeInput);resetPinState();});pinCodeInput.addEventListener('keyup',function(){if(isAppended){return;}
var value=this.value.trim();clearFieldError(this);resetPinState();if(value.length>6){showError(this,'PIN Code must be exactly 6 digits.');return;}
if(value.length!==6){return;}
if(/^\d{6}$/.test(value)){checkPinCode(value);}else{showError(this,'PIN Code must contain only digits.');}});pinCodeInput.addEventListener('blur',function(){trackField('form_pincode',cleanPin());});whatsappInput.addEventListener('blur',function(){validateWhatsApp(this.value);trackField('form_whatsapp_number',this.value.trim());});var billPills=form.querySelectorAll('.pm-surya-lead__pill');Array.prototype.forEach.call(billPills,function(pill){pill.addEventListener('click',function(){Array.prototype.forEach.call(billPills,function(p){p.classList.remove('is-active');});pill.classList.add('is-active');billSelect.value=pill.getAttribute('data-value');clearFieldError(billSelect);trackField('form_monthly_bill',billSelect.value);});});function trackField(fieldName,fieldValue){var moe=moengage();if(!moe){return;}
var utm=resolvedUtm();moe.track_event('form_field_clicked',stripEmpty({utm_source:utm.utm_source,utm_medium:utm.utm_medium,utm_campaign:utm.utm_campaign,utm_content:utm.utm_content,utm_fbclid:utm.fbclid,gclid:utm.gclid,form_field_name:fieldName,form_field_value:fieldValue||''}));}}
function initLead(root){var panel=root.querySelector('.pm-surya-lead__panel');var scroller=root.querySelector('[data-lead-scroller]');if(!panel){return;}
var titleEl=root.querySelector('.pm-surya-lead__title');var descEl=root.querySelector('[data-lead-desc-target]');var subEl=root.querySelector('[data-lead-subheading-target]');var defaults={heading:root.getAttribute('data-lead-default-heading')||'',desc:root.getAttribute('data-lead-default-desc')||'',subheading:root.getAttribute('data-lead-default-subheading')||''};var lastTrigger=null;var exitTimer=null;var scrollY=0;initForm(root);function apply(el,trigger,attr,fallback){if(!el){return;}
var value=trigger?trigger.getAttribute(attr):null;el.innerHTML=(value===null||value==='')?fallback:value;}
function applyCopy(trigger){var heading=triggerLabel(trigger);if(titleEl){if(heading){titleEl.textContent=heading;}else{titleEl.innerHTML=defaults.heading;}}
apply(descEl,trigger,'data-lead-desc',defaults.desc);apply(subEl,trigger,'data-lead-subheading',defaults.subheading);}
function focusable(){return Array.prototype.filter.call(panel.querySelectorAll(FOCUSABLE),function(el){if(el.tabIndex<0){return false;}
return el.offsetWidth>0||el.offsetHeight>0||el===document.activeElement;});}
function onKeydown(event){if(event.key==='Escape'||event.key==='Esc'){event.preventDefault();close();return;}
if(event.key!=='Tab'){return;}
var items=focusable();if(!items.length){event.preventDefault();panel.focus();return;}
var first=items[0];var last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}else if(items.indexOf(document.activeElement)===-1){event.preventDefault();first.focus();}}
function lockScroll(){scrollY=window.pageYOffset||document.documentElement.scrollTop||0;var gap=window.innerWidth-document.documentElement.clientWidth;document.body.style.overflow='hidden';if(gap>0){document.body.style.paddingRight=gap+'px';}}
function unlockScroll(){document.body.style.overflow='';document.body.style.paddingRight='';window.scrollTo(0,scrollY);}
function open(trigger){if(!root.hasAttribute('hidden')){return;}
if(document.querySelector(OTHER_DIALOGS)){return;}
if(exitTimer){clearTimeout(exitTimer);exitTimer=null;}
lastTrigger=trigger||null;applyCopy(trigger);root.removeAttribute('hidden');lockScroll();if(scroller){scroller.scrollTop=0;}
void panel.offsetWidth;root.classList.add('is-open');document.addEventListener('keydown',onKeydown,true);var closeBtn=root.querySelector('[data-lead-close]');if(closeBtn){closeBtn.focus();}}
function finishClose(){exitTimer=null;root.setAttribute('hidden','');unlockScroll();if(lastTrigger&&document.contains(lastTrigger)){lastTrigger.focus();}
lastTrigger=null;}
function close(){if(root.hasAttribute('hidden')){return;}
root.classList.remove('is-open');document.removeEventListener('keydown',onKeydown,true);if(prefersReducedMotion()||document.hidden){finishClose();return;}
if(exitTimer){clearTimeout(exitTimer);}
exitTimer=setTimeout(finishClose,EXIT_DURATION);}
Array.prototype.forEach.call(root.querySelectorAll('[data-lead-close]'),function(button){button.addEventListener('click',close);});var backdrop=root.querySelector('[data-lead-close-backdrop]');if(backdrop){backdrop.addEventListener('click',close);}
Array.prototype.forEach.call(document.querySelectorAll(TRIGGERS),function(trigger){trigger.addEventListener('click',function(event){event.preventDefault();open(trigger);});});}
function initSharedModal(modal){var titleEl=modal.querySelector('#leadFormLabel');var descEl=modal.querySelector('.modal-header p');var phoneInput=modal.querySelector('[name="whatsapp_number"]');var pincodeInput=modal.querySelector('[name="pincode"]');if(phoneInput){phoneInput.setAttribute('maxlength','10');phoneInput.addEventListener('input',function(){if(this.value.length>10){this.value=this.value.slice(0,10);}});}
if(pincodeInput){pincodeInput.setAttribute('maxlength','6');pincodeInput.addEventListener('input',function(){if(this.value.length>6){this.value=this.value.slice(0,6);}});}
var defaults={heading:titleEl?titleEl.textContent:'',desc:descEl?descEl.textContent:''};function copy(el,trigger,attr,fallback){if(!el){return;}
var value=trigger.getAttribute(attr);el.textContent=(value===null||value==='')?fallback:value;}
Array.prototype.forEach.call(document.querySelectorAll(TRIGGERS),function(trigger){trigger.addEventListener('click',function(event){event.preventDefault();if(document.querySelector(OTHER_DIALOGS)){return;}
var heading=triggerLabel(trigger);if(titleEl){titleEl.textContent=heading||defaults.heading;}
copy(descEl,trigger,'data-lead-desc',defaults.desc);if(window.bootstrap&&window.bootstrap.Modal){window.bootstrap.Modal.getOrCreateInstance(modal).show();}});});}
function init(){var ours=document.querySelectorAll('[data-pm-surya-lead]');if(ours.length){Array.prototype.forEach.call(ours,initLead);return;}
var shared=document.getElementById('leadFormModal');if(shared){initSharedModal(shared);}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}}());