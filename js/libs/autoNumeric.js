/**
 * autoNumeric.js
 * @author: Bob Knothe
 * @author: Sokolov Yura aka funny_falcon
 * @version: 1.7.1
 *
 * Copyright (c) 2011 Robert J. Knothe  http://www.decorplanit.com/plugin/
 * Copyright (c) 2011 Sokolov Yura aka funny_falcon http://github.com/funny_falcon/auto_numeric_js
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
(function(c){function l(r){var q={};if(r.selectionStart===undefined){r.focus();var p=document.selection.createRange();
q.length=p.text.length;p.moveStart("character",-r.value.length);q.end=p.text.length;
q.start=q.end-q.length}else{q.start=r.selectionStart;q.end=r.selectionEnd;q.length=q.end-q.start
}return q}function d(s,t,p){if(s.selectionStart===undefined){s.focus();var q=s.createTextRange();
q.collapse(true);q.moveEnd("character",p);q.moveStart("character",t);q.select()}else{s.selectionStart=t;
s.selectionEnd=p}}function b(p,q){c.each(q,function(s,u){if(typeof(u)==="function"){q[s]=u(p,q,s)
}else{if(typeof(u)==="string"){var t=u.substr(0,4);if(t==="fun:"){var r=c.autoNumeric[u.substr(4)];
if(typeof(r)==="function"){q[s]=c.autoNumeric[u.substr(4)](p,q,s)}else{q[s]=null}}else{if(t==="css:"){q[s]=c(u.substr(4)).val()
}}}}})}function o(q,p){if(typeof(q[p])==="string"){q[p]*=1}}function e(s,r){var v=c.extend({},c.fn.autoNumeric.defaults,r);
if(c.metadata){v=c.extend(v,s.metadata())}b(s,v);var u=v.vMax.toString().split(".");
var q=(!v.vMin&&v.vMin!==0)?[]:v.vMin.toString().split(".");o(v,"vMax");o(v,"vMin");
o(v,"mDec");v.aNeg=v.vMin<0?"-":"";if(typeof(v.mDec)!=="number"){v.mDec=Math.max((u[1]?u[1]:"").length,(q[1]?q[1]:"").length)
}if(v.altDec===null&&v.mDec>0){if(v.aDec==="."&&v.aSep!==","){v.altDec=","}else{if(v.aDec===","&&v.aSep!=="."){v.altDec="."
}}}var p=v.aNeg?"([-\\"+v.aNeg+"]?)":"(-?)";v._aNegReg=p;v._skipFirst=new RegExp(p+"[^-"+(v.aNeg?"\\"+v.aNeg:"")+"\\"+v.aDec+"\\d].*?(\\d|\\"+v.aDec+"\\d)");
v._skipLast=new RegExp("(\\d\\"+v.aDec+"?)[^\\"+v.aDec+"\\d]\\D*$");var t=(v.aNeg?v.aNeg:"-")+v.aNum+"\\"+v.aDec;
if(v.altDec&&v.altDec!==v.aSep){t+=v.altDec}v._allowed=new RegExp("[^"+t+"]","gi");
v._numReg=new RegExp(p+"(?:\\"+v.aDec+"?(\\d+\\"+v.aDec+"\\d+)|(\\d*(?:\\"+v.aDec+"\\d*)?))");
return v}function k(r,u,t){if(u.aSign){while(r.indexOf(u.aSign)>-1){r=r.replace(u.aSign,"")
}}r=r.replace(u._skipFirst,"$1$2");r=r.replace(u._skipLast,"$1");r=r.replace(u._allowed,"");
if(u.altDec){r=r.replace(u.altDec,u.aDec)}var p=r.match(u._numReg);r=p?[p[1],p[2],p[3]].join(""):"";
if(t){var q="^"+u._aNegReg+"0*(\\d"+(t==="leading"?")":"|$)");q=new RegExp(q);r=r.replace(q,"$1$2")
}return r}function m(q,p,t){if(p&&t){var r=q.split(p);if(r[1]&&r[1].length>t){if(t>0){r[1]=r[1].substring(0,t);
q=r.join(p)}else{q=r[0]}}}return q}function n(r,q,p){if(q&&q!=="."){r=r.replace(q,".")
}if(p&&p!=="-"){r=r.replace(p,"-")}if(!r.match(/\d/)){r+="0"}return r}function h(r,q,p){if(p&&p!=="-"){r=r.replace("-",p)
}if(q&&q!=="."){r=r.replace(".",q)}return r}function j(p,r){p=k(p,r);p=m(p,r.aDec,r.mDec);
p=n(p,r.aDec,r.aNeg);var q=p*1;return q>=r.vMin&&q<=r.vMax}function f(r,v){r=k(r,v);
if(r===""||r===v.aNeg){if(v.wEmpty==="zero"){return r+"0"}else{if(v.wEmpty==="sign"){return r+v.aSign
}else{return r}}}var p="";if(v.dGroup===2){p=/(\d)((\d)(\d{2}?)+)$/}else{if(v.dGroup===4){p=/(\d)((\d{4}?)+)$/
}else{p=/(\d)((\d{3}?)+)$/}}var u=r.split(v.aDec);if(v.altDec&&u.length===1){u=r.split(v.altDec)
}var t=u[0];if(v.aSep){while(p.test(t)){t=t.replace(p,"$1"+v.aSep+"$2")}}if(v.mDec!==0&&u.length>1){if(u[1].length>v.mDec){u[1]=u[1].substring(0,v.mDec)
}r=t+v.aDec+u[1]}else{r=t}if(v.aSign){var q=r.indexOf(v.aNeg)!==-1;r=r.replace(v.aNeg,"");
r=v.pSign==="p"?v.aSign+r:r+v.aSign;if(q){r=v.aNeg+r}}return r}function g(t,y,q,A){t=(t==="")?"0":t+="";
var p="";var v=0;var B="";if(t.charAt(0)==="-"){B=(t*1===0)?"":"-";t=t.replace("-","")
}if((t*1)>0){while(t.substr(0,1)==="0"&&t.length>1){t=t.substr(1)}}var x=t.lastIndexOf(".");
if(x===0){t="0"+t;x=1}if(x===-1||x===t.length-1){if(A&&y>0){p=(x===-1)?t+".":t;for(v=0;
v<y;v++){p+="0"}return B+p}else{return B+t}}var w=(t.length-1)-x;if(w===y){return B+t
}if(w<y&&A){p=t;for(v=w;v<y;v++){p+="0"}return B+p}var r=x+y;var s=t.charAt(r+1)*1;
var u=[];for(v=0;v<=r;v++){u[v]=t.charAt(v)}var z=(t.charAt(r)===".")?(t.charAt(r-1)%2):(t.charAt(r)%2);
if((s>4&&q==="S")||(s>4&&q==="A"&&B==="")||(s>5&&q==="A"&&B==="-")||(s>5&&q==="s")||(s>5&&q==="a"&&B==="")||(s>4&&q==="a"&&B==="-")||(s>5&&q==="B")||(s===5&&q==="B"&&z===1)||(s>0&&q==="C"&&B==="")||(s>0&&q==="F"&&B==="-")||(s>0&&q==="U")){for(v=(u.length-1);
v>=0;v--){if(u[v]==="."){continue}u[v]++;if(u[v]<10){break}}}for(v=0;v<=r;v++){if(u[v]==="."||u[v]<10||v===0){p+=u[v]
}else{p+="0"}}if(y===0){p=p.replace(".","")}return B+p}function a(q,p){this.options=p;
this.that=q;this.$that=c(q);this.formatted=false;this.io=e(this.$that,this.options);
this.value=q.value}a.prototype={init:function(p){this.value=this.that.value;this.io=e(this.$that,this.options);
this.cmdKey=p.metaKey;this.shiftKey=p.shiftKey;this.selection=l(this.that);if(p.type==="keydown"||p.type==="keyup"){this.kdCode=p.keyCode
}this.which=p.which;this.processed=false;this.formatted=false},setSelection:function(r,p,q){r=Math.max(r,0);
p=Math.min(p,this.that.value.length);this.selection={start:r,end:p,length:p-r};if(q===undefined||q){d(this.that,r,p)
}},setPosition:function(q,p){this.setSelection(q,q,p)},getBeforeAfter:function(){var q=this.value;
var r=q.substring(0,this.selection.start);var p=q.substring(this.selection.end,q.length);
return[r,p]},getBeforeAfterStriped:function(){var p=this.getBeforeAfter();p[0]=k(p[0],this.io);
p[1]=k(p[1],this.io);return p},normalizeParts:function(t,r){var u=this.io;r=k(r,u);
var s=r.match(/^\d/)?true:"leading";t=k(t,u,s);if((t===""||t===u.aNeg)){if(r>""){r=r.replace(/^0*(\d)/,"$1")
}}var q=t+r;if(u.aDec){var p=q.match(new RegExp("^"+u._aNegReg+"\\"+u.aDec));if(p){t=t.replace(p[1],p[1]+"0");
q=t+r}}if(u.wEmpty==="zero"&&(q===u.aNeg||q==="")){t+="0"}return[t,r]},setValueParts:function(t,r){var u=this.io;
var s=this.normalizeParts(t,r);var q=s.join("");var p=s[0].length;if(j(q,u)){q=m(q,u.aDec,u.mDec);
if(p>q.length){p=q.length}this.value=q;this.setPosition(p,false);return true}return false
},signPosition:function(){var u=this.io,s=u.aSign,r=this.that;if(s){var q=s.length;
if(u.pSign==="p"){var t=u.aNeg&&r.value&&r.value.charAt(0)===u.aNeg;return t?[1,q+1]:[0,q]
}else{var p=r.value.length;return[p-q,p]}}else{return[1000,-1]}},expandSelectionOnSign:function(q){var p=this.signPosition();
var r=this.selection;if(r.start<p[1]&&r.end>p[0]){if((r.start<p[0]||r.end>p[1])&&this.value.substring(Math.max(r.start,p[0]),Math.min(r.end,p[1])).match(/^\s*$/)){if(r.start<p[0]){this.setSelection(r.start,p[0],q)
}else{this.setSelection(p[1],r.end,q)}}else{this.setSelection(Math.min(r.start,p[0]),Math.max(r.end,p[1]),q)
}}},checkPaste:function(){if(this.valuePartsBeforePaste!==undefined){var q=this.getBeforeAfter();
var p=this.valuePartsBeforePaste;delete this.valuePartsBeforePaste;q[0]=q[0].substr(0,p[0].length)+k(q[0].substr(p[0].length),this.io);
if(!this.setValueParts(q[0],q[1])){this.value=p.join("");this.setPosition(p[0].length,false)
}}},skipAllways:function(t){var p=this.kdCode,u=this.which,q=this.cmdKey;if(p===17&&t.type==="keyup"&&this.valuePartsBeforePaste!==undefined){this.checkPaste();
return false}if((p>=112&&p<=123)||(p>=91&&p<=93)||(p>=9&&p<=31)||(p<8&&(u===0||u===p))||p===144||p===145||p===45){return true
}if(q&&p===65){return true}if(q&&(p===67||p===86||p===88)){if(t.type==="keydown"){this.expandSelectionOnSign()
}if(p===86){if(t.type==="keydown"||t.type==="keypress"){if(this.valuePartsBeforePaste===undefined){this.valuePartsBeforePaste=this.getBeforeAfter()
}}else{this.checkPaste()}}return t.type==="keydown"||t.type==="keypress"||p===67}if(q){return true
}if(p===37||p===39){var r=this.io.aSep,v=this.selection.start,s=this.that.value;if(t.type==="keydown"&&r&&!this.shiftKey){if(p===37&&s.charAt(v-2)===r){this.setPosition(v-1)
}else{if(p===39&&s.charAt(v)===r){this.setPosition(v+1)}}}return true}if(p>=34&&p<=40){return true
}return false},processAllways:function(){var p;if(this.kdCode===8||this.kdCode===46){if(!this.selection.length){p=this.getBeforeAfterStriped();
if(this.kdCode===8){p[0]=p[0].substring(0,p[0].length-1)}else{p[1]=p[1].substring(1,p[1].length)
}this.setValueParts(p[0],p[1])}else{this.expandSelectionOnSign(false);p=this.getBeforeAfterStriped();
this.setValueParts(p[0],p[1])}return true}return false},processKeypress:function(){var t=this.io;
var p=String.fromCharCode(this.which);var s=this.getBeforeAfterStriped();var r=s[0],q=s[1];
if(p===t.aDec||(t.altDec&&p===t.altDec)||((p==="."||p===",")&&this.kdCode===110)){if(!t.mDec||!t.aDec){return true
}if(t.aNeg&&q.indexOf(t.aNeg)>-1){return true}if(r.indexOf(t.aDec)>-1){return true
}if(q.indexOf(t.aDec)>0){return true}if(q.indexOf(t.aDec)===0){q=q.substr(1)}this.setValueParts(r+t.aDec,q);
return true}if(p==="-"||p==="+"){if(!t.aNeg){return true}if(r===""&&q.indexOf(t.aNeg)>-1){r=t.aNeg;
q=q.substring(1,q.length)}if(r.charAt(0)===t.aNeg){r=r.substring(1,r.length)}else{r=(p==="-")?t.aNeg+r:r
}this.setValueParts(r,q);return true}if(p>="0"&&p<="9"){if(t.aNeg&&r===""&&q.indexOf(t.aNeg)>-1){r=t.aNeg;
q=q.substring(1,q.length)}this.setValueParts(r+p,q);return true}return true},formatQuick:function(){var w=this.io;
var u=this.getBeforeAfterStriped();var t=f(this.value,this.io);var p=t.length;if(t){var r=u[0].split("");
var q;for(q in r){if(!r[q].match("\\d")){r[q]="\\"+r[q]}}var v=new RegExp("^.*?"+r.join(".*?"));
var s=t.match(v);if(s){p=s[0].length;if(((p===0&&t.charAt(0)!==w.aNeg)||(p===1&&t.charAt(0)===w.aNeg))&&w.aSign&&w.pSign==="p"){p=this.io.aSign.length+(t.charAt(0)==="-"?1:0)
}}else{if(w.aSign&&w.pSign==="s"){p-=w.aSign.length}}}this.that.value=t;this.setPosition(p);
this.formatted=true}};c.fn.autoNumeric=function(p){return this.each(function(){var q=c(this);
var r=new a(this,p);if(r.io.aForm&&(this.value||r.io.wEmpty!=="empty")){q.autoNumericSet(q.autoNumericGet(p),p)
}q.keydown(function(s){r.init(s);if(r.skipAllways(s)){r.processed=true;return true
}if(r.processAllways()){r.processed=true;r.formatQuick();s.preventDefault();return false
}else{r.formatted=false}return true}).keypress(function(s){var t=r.processed;r.init(s);
if(r.skipAllways(s)){return true}if(t){s.preventDefault();return false}if(r.processAllways()||r.processKeypress()){r.formatQuick();
s.preventDefault();return false}else{r.formatted=false}}).keyup(function(t){r.init(t);
var s=r.skipAllways(t);r.kdCode=0;delete r.valuePartsBeforePaste;if(s){return true
}if(this.value===""){return true}if(!r.formatted){r.formatQuick()}}).focusout(function(v){var w=r.io,u=q.val(),s=u;
if(u!==""){u=k(u,w);if(j(u,w)){u=n(u,w.aDec,w.aNeg);u=g(u,w.mDec,w.mRound,w.aPad);
u=h(u,w.aDec,w.aNeg)}else{u=""}}var t=f(u,w);if(t!==s){q.val(t)}if(t!==r.inVal){q.change();
delete r.inVal}}).focusin(function(s){r.inVal=q.val()})})};function i(p){if(typeof(p)==="string"){p=p.replace(/\[/g,"\\[").replace(/\]/g,"\\]");
p="#"+p.replace(/(:|\.)/g,"\\$1")}return c(p)}c.autoNumeric={};c.autoNumeric.Strip=function(r,q){var s=e(i(r),q);
var p=i(r).val();p=k(p,s);p=n(p,s.aDec,s.aNeg);if(p*1===0){p="0"}return p};c.autoNumeric.Format=function(r,q,p){q+="";
var s=e(i(r),p);q=g(q,s.mDec,s.mRound,s.aPad);q=h(q,s.aDec,s.aNeg);if(!j(q,s)){q=g("",s.mDec,s.mRound,s.aPad)
}return f(q,s)};c.fn.autoNumericGet=function(p){return c.fn.autoNumeric.Strip(this,p)
};c.fn.autoNumericSet=function(q,p){return this.val(c.fn.autoNumeric.Format(this,q,p))
};c.autoNumeric.defaults={aNum:"0123456789",aSep:",",dGroup:"3",aDec:".",altDec:null,aSign:"",pSign:"p",vMax:"999999999.99",vMin:"0.00",mDec:null,mRound:"S",aPad:true,wEmpty:"empty",aForm:false};
c.fn.autoNumeric.defaults=c.autoNumeric.defaults;c.fn.autoNumeric.Strip=c.autoNumeric.Strip;
c.fn.autoNumeric.Format=c.autoNumeric.Format})(jQuery);