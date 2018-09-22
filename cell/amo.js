/*!
 * amo.js
 * easy to use css animation
 * http://nikogu.github.com/amo
 *
 * @author niko
 * @date 2014-12-31
 */
!function(t){function n(t,n){return t.indexOf(n)}function e(t){return"[object Array]"===Object.prototype.toString.call(t)||void 0!==t.length}function a(t){return"[object Number]"===Object.prototype.toString.call(t)&&!isNaN(t)}function r(t,n){e(t)?Array.prototype.forEach.call(t,function(t){n(t)}):n(t)}function i(t,e){var a=t.className.split(" ");-1==n(a,e)&&(a.push(e),t.className=a.join(" "))}function o(t,e){var a=t.className.split(" "),r=n(a,e);r>=0&&(a.splice(r,1),t.className=a.join(" "))}function s(){return"Amo-frame-"+Math.floor(1e7*Math.random())}function c(){return"Amo-transition-"+Math.floor(1e7*Math.random())}function u(t,n){return a(1*n)?n+"px":n}function f(t,n){var e="",a=n.toLowerCase();return"-webkit-transform"==a||"transform"==a?(e+="-webkit-transform:",e+=t[n]+";",e+="transform:",e+=t[n]+";"):(e+=n+":",e+=u(n,t[n])+";"),e}function m(t,n,e){var r=N.map(function(t){return t+"keyframes"}),i="",o="{";if(e){o+="0% {";for(var s in n)o+=f(n,s);o+="}",o+="100% {";for(var s in e)o+=f(e,s);o+="}"}else for(var s in n)if(a(1*s)&&n.hasOwnProperty(s)){o+=s+"% {";for(var c in n[s])o+=f(n[s],c);o+="}"}o+="}";for(var u=0;u<r.length;u++)i+="@"+r[u]+" "+t,i+=o;return i}function l(t,n,e,a,r,i,o){var s=N.map(function(t){return t+"animation"}),u="",f=c();u+="."+f+"{";for(var m=s.length;m--;)u+=s[m]+"-name:"+t+";",u+=s[m]+"-duration:"+n/1e3+"s;",u+=s[m]+"-timing-function:"+e+";",u+=s[m]+"-iteration-count:"+a+";",u+=s[m]+"-fill-mode:"+o+";",u+=s[m]+"-delay:"+r+";",u+=s[m]+"-direction:"+i+";";return u+="}",b(u),f}function d(t,n){var e=s();return w[e]={frameName:e,style:m(e,t,n),animate:p},b(w[e].style),w[e]}function p(t){var t=t||{},n=t.time||1;0>n&&(n="infinite");var e=t.duration||1e3,a=t.easing||"ease",r=t.delay||0,i=t.direction||"normal",o=t.mode||"forwards",s=l(this.frameName,e,a,n,r,i,o);return{className:s,time:n,duration:e,run:v}}function v(t,n){var e=this.className,a=this.duration,s=this.time;r(t,function(t){o(t,e)}),setTimeout(function(){r(t,function(t){i(t,e)})},16.66);var c={className:e,node:t,time:s,duration:a,callback:n,stop:h,start:y,reset:g};return c.start(),c}function h(){var t=this;a(t.time)&&t.callback&&(t.state="stop",t.stopTime=(new Date).getTime()),r(t.node,function(t){i(t,"amo-animation-pause")})}function y(){var t=this;a(t.time)&&t.callback?("stop"==t.state&&r(t.node,function(t){o(t,"amo-animation-pause")}),"running"==t.state||t.isOver||(t.state="running",t.startTime=(new Date).getTime(),r(t.node,function(n){n.addEventListener("webkitAnimationEnd",function(){t.isOver||t.callback(),t.isOver=!0}),n.addEventListener("animationEnd",function(){t.isOver||t.callback(),t.isOver=!0})}))):r(t.node,function(t){o(t,"amo-animation-pause")})}function g(){var t=this;t.isOver=!1,t.state="",r(t.node,function(n){o(n,t.className)}),setTimeout(function(){r(t.node,function(n){i(n,t.className)})},16.66),t.start()}var w={},N=["","-webkit-"];!function(){Array.prototype.map||(Array.prototype.map=function(t,n){var e,a,r;if(null==this)throw new TypeError(" this is null or not defined");var i=Object(this),o=i.length>>>0;if("[object Function]"!={}.toString.call(t))throw new TypeError(t+" is not a function");for(n&&(e=n),a=new Array(o),r=0;o>r;){var s,c;r in i&&(s=i[r],c=t.call(e,s,r,i),a[r]=c),r++}return a})}();var b=function(){var t,n=/\W/g,e=document,a=document.getElementsByTagName("head")[0]||document.documentElement,r=function(r,i){if(!i||(i=i.replace(n,"-"),!e.getElementById(i))){var o;if(!t||i?(o=e.createElement("style"),i&&(o.id=i),a.appendChild(o)):o=t,void 0!==o.styleSheet){if(e.getElementsByTagName("style").length>31)throw new Error("Exceed the maximal count of style tags in IE");o.styleSheet.cssText+=r}else o.appendChild(e.createTextNode(r));i||(t=o)}};return r}();!function(){for(var t=".amo-animation-pause { ",n=N.length;n--;)t+=N[n]+"animation-play-state: paused !important;";t+="}",b(t)}();var E={keyframes:d};t.Amo=E}(window);