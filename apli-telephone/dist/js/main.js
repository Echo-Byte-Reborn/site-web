(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(i,s){"use strict";var e="model",o="name",r="type",n="vendor",a="version",d="mobile",t="tablet",l={extend:function(i,s){var e={};for(var o in i)s[o]&&s[o].length%2==0?e[o]=s[o].concat(i[o]):e[o]=i[o];return e},has:function(i,s){return"string"==typeof i&&-1!==s.toLowerCase().indexOf(i.toLowerCase())},lowerize:function(i){return i.toLowerCase()},major:function(i){return"string"==typeof i?i.replace(/[^\d\.]/g,"").split(".")[0]:void 0},trim:function(i){return i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}},w={rgx:function(i,s){for(var e,o,r,n,a,d,t=0;t<s.length&&!a;){var l=s[t],w=s[t+1];for(e=o=0;e<l.length&&!a;)if(a=l[e++].exec(i))for(r=0;r<w.length;r++)d=a[++o],"object"==typeof(n=w[r])&&n.length>0?2==n.length?"function"==typeof n[1]?this[n[0]]=n[1].call(this,d):this[n[0]]=n[1]:3==n.length?"function"!=typeof n[1]||n[1].exec&&n[1].test?this[n[0]]=d?d.replace(n[1],n[2]):void 0:this[n[0]]=d?n[1].call(this,d,n[2]):void 0:4==n.length&&(this[n[0]]=d?n[3].call(this,d.replace(n[1],n[2])):void 0):this[n]=d||void 0;t+=2}},str:function(i,s){for(var e in s)if("object"==typeof s[e]&&s[e].length>0){for(var o=0;o<s[e].length;o++)if(l.has(s[e][o],i))return"?"===e?void 0:e}else if(l.has(s[e],i))return"?"===e?void 0:e;return i}},u={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}},c={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[o,a],[/(opios)[\/\s]+([\w\.]+)/i],[[o,"Opera Mini"],a],[/\s(opr)\/([\w\.]+)/i],[[o,"Opera"],a],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i],[o,a],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[o,"IE"],a],[/(edge|edgios|edga)\/((\d+)?[\w\.]+)/i],[[o,"Edge"],a],[/(yabrowser)\/([\w\.]+)/i],[[o,"Yandex"],a],[/(puffin)\/([\w\.]+)/i],[[o,"Puffin"],a],[/(focus)\/([\w\.]+)/i],[[o,"Firefox Focus"],a],[/(opt)\/([\w\.]+)/i],[[o,"Opera Touch"],a],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[o,"UCBrowser"],a],[/(comodo_dragon)\/([\w\.]+)/i],[[o,/_/g," "],a],[/(micromessenger)\/([\w\.]+)/i],[[o,"WeChat"],a],[/(brave)\/([\w\.]+)/i],[[o,"Brave"],a],[/(qqbrowserlite)\/([\w\.]+)/i],[o,a],[/(QQ)\/([\d\.]+)/i],[o,a],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[o,a],[/(BIDUBrowser)[\/\s]?([\w\.]+)/i],[o,a],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[o,a],[/(MetaSr)[\/\s]?([\w\.]+)/i],[o],[/(LBBROWSER)/i],[o],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[a,[o,"MIUI Browser"]],[/;fbav\/([\w\.]+);/i],[a,[o,"Facebook"]],[/safari\s(line)\/([\w\.]+)/i,/android.+(line)\/([\w\.]+)\/iab/i],[o,a],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[a,[o,"Chrome Headless"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[o,/(.+)/,"$1 WebView"],a],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[o,/(.+(?:g|us))(.+)/,"$1 $2"],a],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[a,[o,"Android Browser"]],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[o,a],[/(dolfin)\/([\w\.]+)/i],[[o,"Dolphin"],a],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[o,"Chrome"],a],[/(coast)\/([\w\.]+)/i],[[o,"Opera Coast"],a],[/fxios\/([\w\.-]+)/i],[a,[o,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[a,[o,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[a,o],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[o,"GSA"],a],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[o,[a,w.str,u.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[o,a],[/(navigator|netscape)\/([\w\.-]+)/i],[[o,"Netscape"],a],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[o,a]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[["architecture","amd64"]],[/(ia32(?=;))/i],[["architecture",l.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[["architecture","ia32"]],[/windows\s(ce|mobile);\sppc;/i],[["architecture","arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[["architecture",/ower/,"",l.lowerize]],[/(sun4\w)[;\)]/i],[["architecture","sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[["architecture",l.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],[e,n,[r,t]],[/applecoremedia\/[\w\.]+ \((ipad)/],[e,[n,"Apple"],[r,t]],[/(apple\s{0,1}tv)/i],[[e,"Apple TV"],[n,"Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[n,e,[r,t]],[/(kf[A-z]+)\sbuild\/.+silk\//i],[e,[n,"Amazon"],[r,t]],[/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],[[e,w.str,u.device.amazon.model],[n,"Amazon"],[r,d]],[/android.+aft([bms])\sbuild/i],[e,[n,"Amazon"],[r,"smarttv"]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[e,n,[r,d]],[/\((ip[honed|\s\w*]+);/i],[e,[n,"Apple"],[r,d]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[n,e,[r,d]],[/\(bb10;\s(\w+)/i],[e,[n,"BlackBerry"],[r,d]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],[e,[n,"Asus"],[r,t]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[n,"Sony"],[e,"Xperia Tablet"],[r,t]],[/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i],[e,[n,"Sony"],[r,d]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[n,e,[r,"console"]],[/android.+;\s(shield)\sbuild/i],[e,[n,"Nvidia"],[r,"console"]],[/(playstation\s[34portablevi]+)/i],[e,[n,"Sony"],[r,"console"]],[/(sprint\s(\w+))/i],[[n,w.str,u.device.sprint.vendor],[e,w.str,u.device.sprint.model],[r,d]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],[n,e,[r,t]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[n,[e,/_/g," "],[r,d]],[/(nexus\s9)/i],[e,[n,"HTC"],[r,t]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p)/i],[e,[n,"Huawei"],[r,d]],[/(microsoft);\s(lumia[\s\w]+)/i],[n,e,[r,d]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[e,[n,"Microsoft"],[r,"console"]],[/(kin\.[onetw]{3})/i],[[e,/\./g," "],[n,"Microsoft"],[r,d]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w*)/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[e,[n,"Motorola"],[r,d]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[e,[n,"Motorola"],[r,t]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[n,l.trim],[e,l.trim],[r,"smarttv"]],[/hbbtv.+maple;(\d+)/i],[[e,/^/,"SmartTV"],[n,"Samsung"],[r,"smarttv"]],[/\(dtv[\);].+(aquos)/i],[e,[n,"Sharp"],[r,"smarttv"]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[n,"Samsung"],e,[r,t]],[/smart-tv.+(samsung)/i],[n,[r,"smarttv"],e],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[n,"Samsung"],e,[r,d]],[/sie-(\w*)/i],[e,[n,"Siemens"],[r,d]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[n,"Nokia"],e,[r,d]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],[e,[n,"Acer"],[r,t]],[/android.+([vl]k\-?\d{3})\s+build/i],[e,[n,"LG"],[r,t]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[n,"LG"],e,[r,t]],[/(lg) netcast\.tv/i],[n,e,[r,"smarttv"]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[e,[n,"LG"],[r,d]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[e,[n,"Lenovo"],[r,t]],[/linux;.+((jolla));/i],[n,e,[r,d]],[/((pebble))app\/[\d\.]+\s/i],[n,e,[r,"wearable"]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[n,e,[r,d]],[/crkey/i],[[e,"Chromecast"],[n,"Google"]],[/android.+;\s(glass)\s\d/i],[e,[n,"Google"],[r,"wearable"]],[/android.+;\s(pixel c)[\s)]/i],[e,[n,"Google"],[r,t]],[/android.+;\s(pixel( [23])?( xl)?)\s/i],[e,[n,"Google"],[r,d]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i],[[e,/_/g," "],[n,"Xiaomi"],[r,d]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],[[e,/_/g," "],[n,"Xiaomi"],[r,t]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[e,[n,"Meizu"],[r,t]],[/(mz)-([\w-]{2,})/i],[[n,"Meizu"],e,[r,d]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})\s+build/i],[e,[n,"OnePlus"],[r,d]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[e,[n,"RCA"],[r,t]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[e,[n,"Dell"],[r,t]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[e,[n,"Verizon"],[r,t]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[n,"Barnes & Noble"],e,[r,t]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[e,[n,"NuVision"],[r,t]],[/android.+;\s(k88)\sbuild/i],[e,[n,"ZTE"],[r,t]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[e,[n,"Swiss"],[r,d]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[e,[n,"Swiss"],[r,t]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[e,[n,"Zeki"],[r,t]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[n,"Dragon Touch"],e,[r,t]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[e,[n,"Insignia"],[r,t]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[e,[n,"NextBook"],[r,t]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[n,"Voice"],e,[r,d]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[n,"LvTel"],e,[r,d]],[/android.+;\s(PH-1)\s/i],[e,[n,"Essential"],[r,d]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[e,[n,"Envizen"],[r,t]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[n,e,[r,t]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[e,[n,"MachSpeed"],[r,t]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[n,e,[r,t]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[e,[n,"Rotor"],[r,t]],[/android.+(KS(.+))\s+build/i],[e,[n,"Amazon"],[r,t]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[n,e,[r,t]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[r,l.lowerize],n,e],[/(android[\w\.\s\-]{0,9});.+build/i],[e,[n,"Generic"]]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[a,[o,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[o,a],[/rv\:([\w\.]{1,9}).+(gecko)/i],[a,o]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[o,a],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[o,[a,w.str,u.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[o,"Windows"],[a,w.str,u.os.windows.version]],[/\((bb)(10);/i],[[o,"BlackBerry"],a],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i,/linux;.+(sailfish);/i],[o,a],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[o,"Symbian"],a],[/\((series40);/i],[o],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[o,"Firefox OS"],a],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[o,a],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[o,"Chromium OS"],a],[/(sunos)\s?([\w\.\d]*)/i],[[o,"Solaris"],a],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[o,a],[/(haiku)\s(\w+)/i],[o,a],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[a,/_/g,"."],[o,"iOS"]],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[o,"Mac OS"],[a,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,/(unix)\s?([\w\.]*)/i],[o,a]]},m=function(s,e){if("object"==typeof s&&(e=s,s=void 0),!(this instanceof m))return new m(s,e).getResult();var o=s||(i&&i.navigator&&i.navigator.userAgent?i.navigator.userAgent:""),r=e?l.extend(c,e):c;return this.getBrowser=function(){var i={name:void 0,version:void 0};return w.rgx.call(i,o,r.browser),i.major=l.major(i.version),i},this.getCPU=function(){var i={architecture:void 0};return w.rgx.call(i,o,r.cpu),i},this.getDevice=function(){var i={vendor:void 0,model:void 0,type:void 0};return w.rgx.call(i,o,r.device),i},this.getEngine=function(){var i={name:void 0,version:void 0};return w.rgx.call(i,o,r.engine),i},this.getOS=function(){var i={name:void 0,version:void 0};return w.rgx.call(i,o,r.os),i},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return o},this.setUA=function(i){return o=i,this},this};m.VERSION="0.7.19",m.BROWSER={NAME:o,MAJOR:"major",VERSION:a},m.CPU={ARCHITECTURE:"architecture"},m.DEVICE={MODEL:e,VENDOR:n,TYPE:r,CONSOLE:"console",MOBILE:d,SMARTTV:"smarttv",TABLET:t,WEARABLE:"wearable",EMBEDDED:"embedded"},m.ENGINE={NAME:o,VERSION:a},m.OS={NAME:o,VERSION:a},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports.UAParser=m):"function"==typeof define&&define.amd?define(function(){return m}):i&&(i.UAParser=m);var b=i&&(i.jQuery||i.Zepto);if(void 0!==b&&!b.ua){var p=new m;b.ua=p.getResult(),b.ua.get=function(){return p.getUA()},b.ua.set=function(i){p.setUA(i);var s=p.getResult();for(var e in s)b.ua[e]=s[e]}}}("object"==typeof window?window:this);

},{}],2:[function(require,module,exports){
"use strict";function _classCallCheck(e,l){if(!(e instanceof l))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var Example=function e(){_classCallCheck(this,e),console.log("yolo")};exports.default=Example;

},{}],3:[function(require,module,exports){
"use strict";var _Example=require("./components/Example"),_Example2=_interopRequireDefault(_Example),_environment=require("./utils/environment");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var App={init:function(){document.addEventListener("DOMContentLoaded",this.ready.bind(this),!1)},ready:function(){this.initComponents(),this.bindEvent(),console.log((0,_environment.getBrowser)()),new _Example2.default},bindEvent:function(){},initComponents:function(){}};App.init();

},{"./components/Example":2,"./utils/environment":4}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isRetina=isRetina,exports.isHighDensity=isHighDensity,exports.isUnderBreakpoint=isUnderBreakpoint,exports.getBrowser=getBrowser,exports.getOS=getOS;var _uaParserJs=require("ua-parser-js"),_uaParserJs2=_interopRequireDefault(_uaParserJs);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function isRetina(){return(window.matchMedia&&(window.matchMedia("only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)").matches||window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)").matches)||window.devicePixelRatio&&window.devicePixelRatio>=2)&&/(iPad|iPhone|iPod)/g.test(navigator.userAgent)}function isHighDensity(){return window.matchMedia&&(window.matchMedia("only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)").matches||window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)").matches)||window.devicePixelRatio&&window.devicePixelRatio>1.3}function isUnderBreakpoint(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:960;return window.matchMedia("(max-width: "+e+"px)").matches}function getBrowser(){return(new _uaParserJs2.default).getResult().browser.name}function getOS(){return(new _uaParserJs2.default).getOS().name.replace(/\s/g,"")}

},{"ua-parser-js":1}]},{},[3]);