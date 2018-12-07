(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * UAParser.js v0.7.17
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.17',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            // console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                    // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i,    // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i      // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)?(?:[\s_]*[\w\s]+)?)\s+build/i          // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i                                         // OnePlus
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Venue[\d\s]*)\s+build/i                          // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i                        // ZTE K Series Tablet
            ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i          // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?.+)\s+build/i                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?.+)\s+build/i                         // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i             // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q.+)\s+build/i                           // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android.+)[;\/].+build/i                                          // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]


        /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,                  // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                  // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i                 // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    /*
    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;
    */
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        //var browser = new Browser();
        //var cpu = new CPU();
        //var device = new Device();
        //var engine = new Engine();
        //var os = new OS();

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            //browser = new Browser();
            //cpu = new CPU();
            //device = new Device();
            //engine = new Engine();
            //os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        // TODO: test!!!!!!!!
        /*
        if (require && require.main === module && process) {
            // cli
            var jsonize = function (arr) {
                var res = [];
                for (var i in arr) {
                    res.push(new UAParser(arr[i]).getResult());
                }
                process.stdout.write(JSON.stringify(res, null, 2) + '\n');
            };
            if (process.stdin.isTTY) {
                // via args
                jsonize(process.argv.slice(2));
            } else {
                // via pipe
                var str = '';
                process.stdin.on('readable', function() {
                    var read = process.stdin.read();
                    if (read !== null) {
                        str += read;
                    }
                });
                process.stdin.on('end', function () {
                    jsonize(str.replace(/\n$/, '').split('\n'));
                });
            }
        }
        */
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Acceleration = function () {
    function Acceleration() {
        _classCallCheck(this, Acceleration);

        this.bindEvents();
        this.init();
    }

    _createClass(Acceleration, [{
        key: "init",
        value: function init() {}
    }, {
        key: "sleep",
        value: function sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if (new Date().getTime() - start > milliseconds) {
                    break;
                }
            }
        }
    }, {
        key: "bindEvents",
        value: function bindEvents() {
            var boole = true;
            if (boole) {
                window.addEventListener("devicemotion", function () {
                    var x = event.accelerationIncludingGravity.x;
                    var y = event.accelerationIncludingGravity.y;
                    var z = event.accelerationIncludingGravity.z;
                    if (z < 3) {
                        console.log("je tombe");
                        boole = false;
                    } else {
                        document.getElementById("log").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
                    }
                }, false);
            } else {
                // Le navigateur ne supporte pas l'événement devicemotion
            }
        }

        //Chute?

    }, {
        key: "chute_bool",
        value: function chute_bool() {}
    }]);

    return Acceleration;
}();

exports.default = Acceleration;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var News = function () {
    function News() {
        _classCallCheck(this, News);

        this.$button = document.querySelector(".buttonNews");
        this.$textbox = document.querySelector('.textBoxNews');
        this.news = "";
        this.bindEvents();
        this.init();
    }

    _createClass(News, [{
        key: "init",
        value: function init() {}
    }, {
        key: "bindEvents",
        value: function bindEvents() {
            this.$button.addEventListener("click", function () {
                this.news = document.querySelector('.textBoxNews').value;
                xhttp.open("POST", "http://51.68.87.119/message", { "message": this.news });
                xhttp.send();
            });
        }
    }]);

    return News;
}();

exports.default = News;

},{}],4:[function(require,module,exports){
'use strict';

var _News = require('./components/News');

var _News2 = _interopRequireDefault(_News);

var _environment = require('./utils/environment');

var _Acceleration = require('./components/Acceleration');

var _Acceleration2 = _interopRequireDefault(_Acceleration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = {
    init: function init() {
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },
    ready: function ready() {
        this.initComponents();
        this.bindEvent();
        console.log((0, _environment.getBrowser)());
        new _Acceleration2.default();
        new _News2.default();
    },
    bindEvent: function bindEvent() {},
    initComponents: function initComponents() {}
};

App.init();

},{"./components/Acceleration":2,"./components/News":3,"./utils/environment":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRetina = isRetina;
exports.isHighDensity = isHighDensity;
exports.isUnderBreakpoint = isUnderBreakpoint;
exports.getBrowser = getBrowser;
exports.getOS = getOS;

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isRetina() {
  return (window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches) || window.devicePixelRatio && window.devicePixelRatio >= 2) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

function isHighDensity() {
  return window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches) || window.devicePixelRatio && window.devicePixelRatio > 1.3;
}

function isUnderBreakpoint() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 960;

  return window.matchMedia("(max-width: " + width + "px)").matches;
}

function getBrowser() {
  var parser = new _uaParserJs2.default();
  var result = parser.getResult();
  return result.browser.name;
}

function getOS() {
  var parser = new _uaParserJs2.default();
  var result = parser.getOS();
  return result.name.replace(/\s/g, '');
}

},{"ua-parser-js":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvdWEtcGFyc2VyLWpzL3NyYy91YS1wYXJzZXIuanMiLCJjb21wb25lbnRzL0FjY2VsZXJhdGlvbi5qcyIsImNvbXBvbmVudHMvTmV3cy5qcyIsIm1haW4uanMiLCJ1dGlscy9lbnZpcm9ubWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztJQ2hqQ00sWTtBQUNGLDRCQUFhO0FBQUE7O0FBR1QsYUFBSyxVQUFMO0FBQ0EsYUFBSyxJQUFMO0FBQ0g7Ozs7K0JBRUssQ0FDTDs7OzhCQUVLLFksRUFBYztBQUNoQixnQkFBSSxRQUFRLElBQUksSUFBSixHQUFXLE9BQVgsRUFBWjtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksR0FBcEIsRUFBeUIsR0FBekIsRUFBOEI7QUFDNUIsb0JBQUssSUFBSSxJQUFKLEdBQVcsT0FBWCxLQUF1QixLQUF4QixHQUFpQyxZQUFyQyxFQUFrRDtBQUNoRDtBQUNEO0FBQ0Y7QUFDRjs7O3FDQUVTO0FBQ1IsZ0JBQUksUUFBTSxJQUFWO0FBQ0EsZ0JBQUcsS0FBSCxFQUFVO0FBQ04sdUJBQU8sZ0JBQVAsQ0FBd0IsY0FBeEIsRUFBd0MsWUFBVztBQUMvQyx3QkFBSSxJQUFJLE1BQU0sNEJBQU4sQ0FBbUMsQ0FBM0M7QUFDQSx3QkFBSSxJQUFJLE1BQU0sNEJBQU4sQ0FBbUMsQ0FBM0M7QUFDQSx3QkFBSSxJQUFJLE1BQU0sNEJBQU4sQ0FBbUMsQ0FBM0M7QUFDQSx3QkFBSSxJQUFFLENBQU4sRUFBUTtBQUNKLGdDQUFRLEdBQVIsQ0FBWSxVQUFaO0FBQ0EsZ0NBQU0sS0FBTjtBQUNILHFCQUhELE1BR0s7QUFDRCxpQ0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCLFNBQS9CLEdBQTJDLGlCQUFpQixDQUFqQixHQUFxQixlQUFyQixHQUF1QyxDQUF2QyxHQUEyQyxlQUEzQyxHQUE2RCxDQUE3RCxHQUFpRSxZQUE1RztBQUNIO0FBRUosaUJBWEQsRUFXRyxLQVhIO0FBWUQsYUFiSCxNQWFTO0FBQ0w7QUFDRDtBQUNOOztBQUVEOzs7O3FDQUNZLENBQ1g7Ozs7OztrQkFLVSxZOzs7Ozs7Ozs7Ozs7O0lDOUNULEk7QUFDRixvQkFBYTtBQUFBOztBQUNULGFBQUssT0FBTCxHQUFlLFNBQVMsYUFBVCxDQUF1QixhQUF2QixDQUFmO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLFNBQVMsYUFBVCxDQUF1QixjQUF2QixDQUFoQjtBQUNBLGFBQUssSUFBTCxHQUFXLEVBQVg7QUFDQSxhQUFLLFVBQUw7QUFDQSxhQUFLLElBQUw7QUFDSDs7OzsrQkFFSyxDQUVMOzs7cUNBRVc7QUFDUixpQkFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBc0MsWUFBVTtBQUM1QyxxQkFBSyxJQUFMLEdBQVUsU0FBUyxhQUFULENBQXVCLGNBQXZCLEVBQXVDLEtBQWpEO0FBQ0Esc0JBQU0sSUFBTixDQUFXLE1BQVgsRUFBbUIsNkJBQW5CLEVBQWtELEVBQUMsV0FBVSxLQUFLLElBQWhCLEVBQWxEO0FBQ0Esc0JBQU0sSUFBTjtBQUNILGFBSkQ7QUFLSDs7Ozs7O2tCQUlVLEk7Ozs7O0FDdkJmOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUdBLElBQU0sTUFBTTtBQUdSLFFBSFEsa0JBR0Y7QUFDRixpQkFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUE5QyxFQUFxRSxLQUFyRTtBQUNILEtBTE87QUFPUixTQVBRLG1CQU9EO0FBQ0gsYUFBSyxjQUFMO0FBQ0EsYUFBSyxTQUFMO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLDhCQUFaO0FBQ0E7QUFDQTtBQUNILEtBYk87QUFlUixhQWZRLHVCQWVHLENBRVYsQ0FqQk87QUFvQlIsa0JBcEJRLDRCQW9CUSxDQUdmO0FBdkJPLENBQVo7O0FBNEJBLElBQUksSUFBSjs7Ozs7Ozs7UUMvQmdCLFEsR0FBQSxRO1FBSUEsYSxHQUFBLGE7UUFLQSxpQixHQUFBLGlCO1FBTUEsVSxHQUFBLFU7UUFNQSxLLEdBQUEsSzs7QUF4QmhCOzs7Ozs7QUFHTyxTQUFTLFFBQVQsR0FBbUI7QUFDeEIsU0FBTyxDQUFFLE9BQU8sVUFBUCxLQUFzQixPQUFPLFVBQVAsQ0FBa0IsK0hBQWxCLEVBQW1KLE9BQW5KLElBQThKLE9BQU8sVUFBUCxDQUFrQixzTUFBbEIsRUFBME4sT0FBOVksQ0FBRCxJQUE2WixPQUFPLGdCQUFQLElBQTJCLE9BQU8sZ0JBQVAsSUFBMkIsQ0FBcGQsS0FBMmQsc0JBQXNCLElBQXRCLENBQTJCLFVBQVUsU0FBckMsQ0FBbGU7QUFDRDs7QUFFTSxTQUFTLGFBQVQsR0FBd0I7QUFDN0IsU0FBUyxPQUFPLFVBQVAsS0FBc0IsT0FBTyxVQUFQLENBQWtCLGlJQUFsQixFQUFxSixPQUFySixJQUFnSyxPQUFPLFVBQVAsQ0FBa0IsOE1BQWxCLEVBQWtPLE9BQXhaLENBQUQsSUFBdWEsT0FBTyxnQkFBUCxJQUEyQixPQUFPLGdCQUFQLEdBQTBCLEdBQXBlO0FBQ0Q7O0FBR00sU0FBUyxpQkFBVCxHQUF3QztBQUFBLE1BQWIsS0FBYSx1RUFBTCxHQUFLOztBQUM3QyxTQUFPLE9BQU8sVUFBUCxDQUFrQixpQkFBZSxLQUFmLEdBQXFCLEtBQXZDLEVBQThDLE9BQXJEO0FBQ0Q7O0FBSU0sU0FBUyxVQUFULEdBQXNCO0FBQzNCLE1BQUksU0FBUywwQkFBYjtBQUNBLE1BQUksU0FBUyxPQUFPLFNBQVAsRUFBYjtBQUNBLFNBQU8sT0FBTyxPQUFQLENBQWUsSUFBdEI7QUFDRDs7QUFFTSxTQUFTLEtBQVQsR0FBaUI7QUFDdEIsTUFBSSxTQUFTLDBCQUFiO0FBQ0EsTUFBSSxTQUFTLE9BQU8sS0FBUCxFQUFiO0FBQ0EsU0FBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLENBQW9CLEtBQXBCLEVBQTJCLEVBQTNCLENBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogVUFQYXJzZXIuanMgdjAuNy4xN1xuICogTGlnaHR3ZWlnaHQgSmF2YVNjcmlwdC1iYXNlZCBVc2VyLUFnZW50IHN0cmluZyBwYXJzZXJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWlzYWxtYW4vdWEtcGFyc2VyLWpzXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTItMjAxNiBGYWlzYWwgU2FsbWFuIDxmeXpsbWFuQGdtYWlsLmNvbT5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgR1BMdjIgJiBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgdW5kZWZpbmVkKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIENvbnN0YW50c1xuICAgIC8vLy8vLy8vLy8vLy9cblxuXG4gICAgdmFyIExJQlZFUlNJT04gID0gJzAuNy4xNycsXG4gICAgICAgIEVNUFRZICAgICAgID0gJycsXG4gICAgICAgIFVOS05PV04gICAgID0gJz8nLFxuICAgICAgICBGVU5DX1RZUEUgICA9ICdmdW5jdGlvbicsXG4gICAgICAgIFVOREVGX1RZUEUgID0gJ3VuZGVmaW5lZCcsXG4gICAgICAgIE9CSl9UWVBFICAgID0gJ29iamVjdCcsXG4gICAgICAgIFNUUl9UWVBFICAgID0gJ3N0cmluZycsXG4gICAgICAgIE1BSk9SICAgICAgID0gJ21ham9yJywgLy8gZGVwcmVjYXRlZFxuICAgICAgICBNT0RFTCAgICAgICA9ICdtb2RlbCcsXG4gICAgICAgIE5BTUUgICAgICAgID0gJ25hbWUnLFxuICAgICAgICBUWVBFICAgICAgICA9ICd0eXBlJyxcbiAgICAgICAgVkVORE9SICAgICAgPSAndmVuZG9yJyxcbiAgICAgICAgVkVSU0lPTiAgICAgPSAndmVyc2lvbicsXG4gICAgICAgIEFSQ0hJVEVDVFVSRT0gJ2FyY2hpdGVjdHVyZScsXG4gICAgICAgIENPTlNPTEUgICAgID0gJ2NvbnNvbGUnLFxuICAgICAgICBNT0JJTEUgICAgICA9ICdtb2JpbGUnLFxuICAgICAgICBUQUJMRVQgICAgICA9ICd0YWJsZXQnLFxuICAgICAgICBTTUFSVFRWICAgICA9ICdzbWFydHR2JyxcbiAgICAgICAgV0VBUkFCTEUgICAgPSAnd2VhcmFibGUnLFxuICAgICAgICBFTUJFRERFRCAgICA9ICdlbWJlZGRlZCc7XG5cblxuICAgIC8vLy8vLy8vLy8vXG4gICAgLy8gSGVscGVyXG4gICAgLy8vLy8vLy8vL1xuXG5cbiAgICB2YXIgdXRpbCA9IHtcbiAgICAgICAgZXh0ZW5kIDogZnVuY3Rpb24gKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgIHZhciBtYXJnZWRSZWdleGVzID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHJlZ2V4ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9uc1tpXSAmJiBleHRlbnNpb25zW2ldLmxlbmd0aCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2VkUmVnZXhlc1tpXSA9IGV4dGVuc2lvbnNbaV0uY29uY2F0KHJlZ2V4ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdlZFJlZ2V4ZXNbaV0gPSByZWdleGVzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXJnZWRSZWdleGVzO1xuICAgICAgICB9LFxuICAgICAgICBoYXMgOiBmdW5jdGlvbiAoc3RyMSwgc3RyMikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3RyMSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIHN0cjIudG9Mb3dlckNhc2UoKS5pbmRleE9mKHN0cjEudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsb3dlcml6ZSA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFqb3IgOiBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZih2ZXJzaW9uKSA9PT0gU1RSX1RZUEUgPyB2ZXJzaW9uLnJlcGxhY2UoL1teXFxkXFwuXS9nLCcnKS5zcGxpdChcIi5cIilbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0gOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gTWFwIGhlbHBlclxuICAgIC8vLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciBtYXBwZXIgPSB7XG5cbiAgICAgICAgcmd4IDogZnVuY3Rpb24gKHVhLCBhcnJheXMpIHtcblxuICAgICAgICAgICAgLy92YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICB2YXIgaSA9IDAsIGosIGssIHAsIHEsIG1hdGNoZXMsIG1hdGNoOy8vLCBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgICAgICAvKi8vIGNvbnN0cnVjdCBvYmplY3QgYmFyZWJvbmVzXG4gICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgYXJnc1sxXS5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgIHEgPSBhcmdzWzFdW3BdO1xuICAgICAgICAgICAgICAgIHJlc3VsdFt0eXBlb2YgcSA9PT0gT0JKX1RZUEUgPyBxWzBdIDogcV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCByZWdleGVzIG1hcHNcbiAgICAgICAgICAgIHdoaWxlIChpIDwgYXJyYXlzLmxlbmd0aCAmJiAhbWF0Y2hlcykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gYXJyYXlzW2ldLCAgICAgICAvLyBldmVuIHNlcXVlbmNlICgwLDIsNCwuLilcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMgPSBhcnJheXNbaSArIDFdOyAgIC8vIG9kZCBzZXF1ZW5jZSAoMSwzLDUsLi4pXG4gICAgICAgICAgICAgICAgaiA9IGsgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gdHJ5IG1hdGNoaW5nIHVhc3RyaW5nIHdpdGggcmVnZXhlc1xuICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgcmVnZXgubGVuZ3RoICYmICFtYXRjaGVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4W2orK10uZXhlYyh1YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBtYXRjaGVzWysra107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcSA9IHByb3BzW3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdpdmVuIHByb3BlcnR5IGlzIGFjdHVhbGx5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBxID09PSBPQkpfVFlQRSAmJiBxLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcVsxXSA9PSBGVU5DX1RZUEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhc3NpZ24gbW9kaWZpZWQgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXS5jYWxsKHRoaXMsIG1hdGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWduIGdpdmVuIHZhbHVlLCBpZ25vcmUgcmVnZXggbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3FbMF1dID0gcVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGZ1bmN0aW9uIG9yIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHFbMV0gPT09IEZVTkNfVFlQRSAmJiAhKHFbMV0uZXhlYyAmJiBxWzFdLnRlc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBmdW5jdGlvbiAodXN1YWxseSBzdHJpbmcgbWFwcGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcVswXV0gPSBtYXRjaCA/IHFbMV0uY2FsbCh0aGlzLCBtYXRjaCwgcVsyXSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhbml0aXplIG1hdGNoIHVzaW5nIGdpdmVuIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gbWF0Y2gucmVwbGFjZShxWzFdLCBxWzJdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txWzBdXSA9IG1hdGNoID8gcVszXS5jYWxsKHRoaXMsIG1hdGNoLnJlcGxhY2UocVsxXSwgcVsyXSkpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1txXSA9IG1hdGNoID8gbWF0Y2ggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy9yZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdHIgOiBmdW5jdGlvbiAoc3RyLCBtYXApIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBhcnJheVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwW2ldID09PSBPQkpfVFlQRSAmJiBtYXBbaV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWwuaGFzKG1hcFtpXVtqXSwgc3RyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoaSA9PT0gVU5LTk9XTikgPyB1bmRlZmluZWQgOiBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlsLmhhcyhtYXBbaV0sIHN0cikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChpID09PSBVTktOT1dOKSA/IHVuZGVmaW5lZCA6IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFN0cmluZyBtYXBcbiAgICAvLy8vLy8vLy8vLy8vL1xuXG5cbiAgICB2YXIgbWFwcyA9IHtcblxuICAgICAgICBicm93c2VyIDoge1xuICAgICAgICAgICAgb2xkc2FmYXJpIDoge1xuICAgICAgICAgICAgICAgIHZlcnNpb24gOiB7XG4gICAgICAgICAgICAgICAgICAgICcxLjAnICAgOiAnLzgnLFxuICAgICAgICAgICAgICAgICAgICAnMS4yJyAgIDogJy8xJyxcbiAgICAgICAgICAgICAgICAgICAgJzEuMycgICA6ICcvMycsXG4gICAgICAgICAgICAgICAgICAgICcyLjAnICAgOiAnLzQxMicsXG4gICAgICAgICAgICAgICAgICAgICcyLjAuMicgOiAnLzQxNicsXG4gICAgICAgICAgICAgICAgICAgICcyLjAuMycgOiAnLzQxNycsXG4gICAgICAgICAgICAgICAgICAgICcyLjAuNCcgOiAnLzQxOScsXG4gICAgICAgICAgICAgICAgICAgICc/JyAgICAgOiAnLydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGV2aWNlIDoge1xuICAgICAgICAgICAgYW1hem9uIDoge1xuICAgICAgICAgICAgICAgIG1vZGVsIDoge1xuICAgICAgICAgICAgICAgICAgICAnRmlyZSBQaG9uZScgOiBbJ1NEJywgJ0tGJ11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3ByaW50IDoge1xuICAgICAgICAgICAgICAgIG1vZGVsIDoge1xuICAgICAgICAgICAgICAgICAgICAnRXZvIFNoaWZ0IDRHJyA6ICc3MzczS1QnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2ZW5kb3IgOiB7XG4gICAgICAgICAgICAgICAgICAgICdIVEMnICAgICAgIDogJ0FQQScsXG4gICAgICAgICAgICAgICAgICAgICdTcHJpbnQnICAgIDogJ1NwcmludCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3MgOiB7XG4gICAgICAgICAgICB3aW5kb3dzIDoge1xuICAgICAgICAgICAgICAgIHZlcnNpb24gOiB7XG4gICAgICAgICAgICAgICAgICAgICdNRScgICAgICAgIDogJzQuOTAnLFxuICAgICAgICAgICAgICAgICAgICAnTlQgMy4xMScgICA6ICdOVDMuNTEnLFxuICAgICAgICAgICAgICAgICAgICAnTlQgNC4wJyAgICA6ICdOVDQuMCcsXG4gICAgICAgICAgICAgICAgICAgICcyMDAwJyAgICAgIDogJ05UIDUuMCcsXG4gICAgICAgICAgICAgICAgICAgICdYUCcgICAgICAgIDogWydOVCA1LjEnLCAnTlQgNS4yJ10sXG4gICAgICAgICAgICAgICAgICAgICdWaXN0YScgICAgIDogJ05UIDYuMCcsXG4gICAgICAgICAgICAgICAgICAgICc3JyAgICAgICAgIDogJ05UIDYuMScsXG4gICAgICAgICAgICAgICAgICAgICc4JyAgICAgICAgIDogJ05UIDYuMicsXG4gICAgICAgICAgICAgICAgICAgICc4LjEnICAgICAgIDogJ05UIDYuMycsXG4gICAgICAgICAgICAgICAgICAgICcxMCcgICAgICAgIDogWydOVCA2LjQnLCAnTlQgMTAuMCddLFxuICAgICAgICAgICAgICAgICAgICAnUlQnICAgICAgICA6ICdBUk0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBSZWdleCBtYXBcbiAgICAvLy8vLy8vLy8vLy8vXG5cblxuICAgIHZhciByZWdleGVzID0ge1xuXG4gICAgICAgIGJyb3dzZXIgOiBbW1xuXG4gICAgICAgICAgICAvLyBQcmVzdG8gYmFzZWRcbiAgICAgICAgICAgIC8ob3BlcmFcXHNtaW5pKVxcLyhbXFx3XFwuLV0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1pbmlcbiAgICAgICAgICAgIC8ob3BlcmFcXHNbbW9iaWxldGFiXSspLit2ZXJzaW9uXFwvKFtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIE1vYmkvVGFibGV0XG4gICAgICAgICAgICAvKG9wZXJhKS4rdmVyc2lvblxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhID4gOS44MFxuICAgICAgICAgICAgLyhvcGVyYSlbXFwvXFxzXSsoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgPCA5LjgwXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhvcGlvcylbXFwvXFxzXSsoW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgbWluaSBvbiBpcGhvbmUgPj0gOC4wXG4gICAgICAgICAgICBdLCBbW05BTUUsICdPcGVyYSBNaW5pJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9cXHMob3ByKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIFdlYmtpdFxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnT3BlcmEnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gTWl4ZWRcbiAgICAgICAgICAgIC8oa2luZGxlKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2luZGxlXG4gICAgICAgICAgICAvKGx1bmFzY2FwZXxtYXh0aG9ufG5ldGZyb250fGphc21pbmV8YmxhemVyKVtcXC9cXHNdPyhbXFx3XFwuXSspKi9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMdW5hc2NhcGUvTWF4dGhvbi9OZXRmcm9udC9KYXNtaW5lL0JsYXplclxuXG4gICAgICAgICAgICAvLyBUcmlkZW50IGJhc2VkXG4gICAgICAgICAgICAvKGF2YW50XFxzfGllbW9iaWxlfHNsaW18YmFpZHUpKD86YnJvd3Nlcik/W1xcL1xcc10/KFtcXHdcXC5dKikvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZhbnQvSUVNb2JpbGUvU2xpbUJyb3dzZXIvQmFpZHVcbiAgICAgICAgICAgIC8oPzptc3xcXCgpKGllKVxccyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyXG5cbiAgICAgICAgICAgIC8vIFdlYmtpdC9LSFRNTCBiYXNlZFxuICAgICAgICAgICAgLyhyZWtvbnEpXFwvKFtcXHdcXC5dKykqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWtvbnFcbiAgICAgICAgICAgIC8oY2hyb21pdW18ZmxvY2t8cm9ja21lbHR8bWlkb3JpfGVwaXBoYW55fHNpbGt8c2t5ZmlyZXxvdmlicm93c2VyfGJvbHR8aXJvbnx2aXZhbGRpfGlyaWRpdW18cGhhbnRvbWpzfGJvd3NlcilcXC8oW1xcd1xcLi1dKykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWl1bS9GbG9jay9Sb2NrTWVsdC9NaWRvcmkvRXBpcGhhbnkvU2lsay9Ta3lmaXJlL0JvbHQvSXJvbi9JcmlkaXVtL1BoYW50b21KUy9Cb3dzZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHRyaWRlbnQpLitydls6XFxzXShbXFx3XFwuXSspLitsaWtlXFxzZ2Vja28vaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJRTExXG4gICAgICAgICAgICBdLCBbW05BTUUsICdJRSddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGVkZ2UpXFwvKChcXGQrKT9bXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgRWRnZVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oeWFicm93c2VyKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWFuZGV4XG4gICAgICAgICAgICBdLCBbW05BTUUsICdZYW5kZXgnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhwdWZmaW4pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQdWZmaW5cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1B1ZmZpbiddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKCg/OltcXHNcXC9dKXVjP1xccz9icm93c2VyfCg/Omp1Yy4rKXVjd2ViKVtcXC9cXHNdPyhbXFx3XFwuXSspL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVUNCcm93c2VyXG4gICAgICAgICAgICBdLCBbW05BTUUsICdVQ0Jyb3dzZXInXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhjb21vZG9fZHJhZ29uKVxcLyhbXFx3XFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21vZG8gRHJhZ29uXG4gICAgICAgICAgICBdLCBbW05BTUUsIC9fL2csICcgJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8obWljcm9tZXNzZW5nZXIpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2VDaGF0XG4gICAgICAgICAgICBdLCBbW05BTUUsICdXZUNoYXQnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhRUSlcXC8oW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBRUSwgYWthIFNob3VRXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL20/KHFxYnJvd3NlcilbXFwvXFxzXT8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUVFCcm93c2VyXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3hpYW9taVxcL21pdWlicm93c2VyXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTUlVSSBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdNSVVJIEJyb3dzZXInXV0sIFtcblxuICAgICAgICAgICAgLztmYmF2XFwvKFtcXHdcXC5dKyk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYWNlYm9vayBBcHAgZm9yIGlPUyAmIEFuZHJvaWRcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ0ZhY2Vib29rJ11dLCBbXG5cbiAgICAgICAgICAgIC9oZWFkbGVzc2Nocm9tZSg/OlxcLyhbXFx3XFwuXSspfFxccykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZSBIZWFkbGVzc1xuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnQ2hyb21lIEhlYWRsZXNzJ11dLCBbXG5cbiAgICAgICAgICAgIC9cXHN3dlxcKS4rKGNocm9tZSlcXC8oW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaHJvbWUgV2ViVmlld1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAvKC4rKS8sICckMSBXZWJWaWV3J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oKD86b2N1bHVzfHNhbXN1bmcpYnJvd3NlcilcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8oLisoPzpnfHVzKSkoLispLywgJyQxICQyJ10sIFZFUlNJT05dLCBbICAgICAgICAgICAgICAgIC8vIE9jdWx1cyAvIFNhbXN1bmcgQnJvd3NlclxuXG4gICAgICAgICAgICAvYW5kcm9pZC4rdmVyc2lvblxcLyhbXFx3XFwuXSspXFxzKyg/Om1vYmlsZVxccz9zYWZhcml8c2FmYXJpKSovaSAgICAgICAgLy8gQW5kcm9pZCBCcm93c2VyXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdBbmRyb2lkIEJyb3dzZXInXV0sIFtcblxuICAgICAgICAgICAgLyhjaHJvbWV8b21uaXdlYnxhcm9yYXxbdGl6ZW5va2FdezV9XFxzP2Jyb3dzZXIpXFwvdj8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENocm9tZS9PbW5pV2ViL0Fyb3JhL1RpemVuL05va2lhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhkb2xmaW4pXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2xwaGluXG4gICAgICAgICAgICBdLCBbW05BTUUsICdEb2xwaGluJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YW5kcm9pZC4rKWNybW98Y3Jpb3MpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIGZvciBBbmRyb2lkL2lPU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnQ2hyb21lJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oY29hc3QpXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgQ29hc3RcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ09wZXJhIENvYXN0J10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9meGlvc1xcLyhbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCBmb3IgaU9TXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdGaXJlZm94J11dLCBbXG5cbiAgICAgICAgICAgIC92ZXJzaW9uXFwvKFtcXHdcXC5dKykuKz9tb2JpbGVcXC9cXHcrXFxzKHNhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAgLy8gTW9iaWxlIFNhZmFyaVxuICAgICAgICAgICAgXSwgW1ZFUlNJT04sIFtOQU1FLCAnTW9iaWxlIFNhZmFyaSddXSwgW1xuXG4gICAgICAgICAgICAvdmVyc2lvblxcLyhbXFx3XFwuXSspLis/KG1vYmlsZVxccz9zYWZhcml8c2FmYXJpKS9pICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgJiBTYWZhcmkgTW9iaWxlXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgTkFNRV0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdC4rPyhnc2EpXFwvKFtcXHdcXC5dKykuKz8obW9iaWxlXFxzP3NhZmFyaXxzYWZhcmkpKFxcL1tcXHdcXC5dKykvaSAgLy8gR29vZ2xlIFNlYXJjaCBBcHBsaWFuY2Ugb24gaU9TXG4gICAgICAgICAgICBdLCBbW05BTUUsICdHU0EnXSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL3dlYmtpdC4rPyhtb2JpbGVcXHM/c2FmYXJpfHNhZmFyaSkoXFwvW1xcd1xcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIDwgMy4wXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIG1hcHBlci5zdHIsIG1hcHMuYnJvd3Nlci5vbGRzYWZhcmkudmVyc2lvbl1dLCBbXG5cbiAgICAgICAgICAgIC8oa29ucXVlcm9yKVxcLyhbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS29ucXVlcm9yXG4gICAgICAgICAgICAvKHdlYmtpdHxraHRtbClcXC8oW1xcd1xcLl0rKS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLy8gR2Vja28gYmFzZWRcbiAgICAgICAgICAgIC8obmF2aWdhdG9yfG5ldHNjYXBlKVxcLyhbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV0c2NhcGVcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ05ldHNjYXBlJ10sIFZFUlNJT05dLCBbXG4gICAgICAgICAgICAvKHN3aWZ0Zm94KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN3aWZ0Zm94XG4gICAgICAgICAgICAvKGljZWRyYWdvbnxpY2V3ZWFzZWx8Y2FtaW5vfGNoaW1lcmF8ZmVubmVjfG1hZW1vXFxzYnJvd3NlcnxtaW5pbW98Y29ua2Vyb3IpW1xcL1xcc10/KFtcXHdcXC5cXCtdKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWNlRHJhZ29uL0ljZXdlYXNlbC9DYW1pbm8vQ2hpbWVyYS9GZW5uZWMvTWFlbW8vTWluaW1vL0Nvbmtlcm9yXG4gICAgICAgICAgICAvKGZpcmVmb3h8c2VhbW9ua2V5fGstbWVsZW9ufGljZWNhdHxpY2VhcGV8ZmlyZWJpcmR8cGhvZW5peClcXC8oW1xcd1xcLi1dKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveC9TZWFNb25rZXkvSy1NZWxlb24vSWNlQ2F0L0ljZUFwZS9GaXJlYmlyZC9QaG9lbml4XG4gICAgICAgICAgICAvKG1vemlsbGEpXFwvKFtcXHdcXC5dKykuK3J2XFw6LitnZWNrb1xcL1xcZCsvaSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vemlsbGFcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC8ocG9sYXJpc3xseW54fGRpbGxvfGljYWJ8ZG9yaXN8YW1heWF8dzNtfG5ldHN1cmZ8c2xlaXBuaXIpW1xcL1xcc10/KFtcXHdcXC5dKykvaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9sYXJpcy9MeW54L0RpbGxvL2lDYWIvRG9yaXMvQW1heWEvdzNtL05ldFN1cmYvU2xlaXBuaXJcbiAgICAgICAgICAgIC8obGlua3MpXFxzXFwoKFtcXHdcXC5dKykvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbmtzXG4gICAgICAgICAgICAvKGdvYnJvd3NlcilcXC8/KFtcXHdcXC5dKykqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvQnJvd3NlclxuICAgICAgICAgICAgLyhpY2VcXHM/YnJvd3NlcilcXC92PyhbXFx3XFwuX10rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUNFIEJyb3dzZXJcbiAgICAgICAgICAgIC8obW9zYWljKVtcXC9cXHNdKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vc2FpY1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dXG5cbiAgICAgICAgICAgIC8qIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gTWVkaWEgcGxheWVycyBCRUdJTlxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgICwgW1xuXG4gICAgICAgICAgICAvKGFwcGxlKD86Y29yZW1lZGlhfCkpXFwvKChcXGQrKVtcXHdcXC5fXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmljIEFwcGxlIENvcmVNZWRpYVxuICAgICAgICAgICAgLyhjb3JlbWVkaWEpIHYoKFxcZCspW1xcd1xcLl9dKykvaVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oYXF1YWx1bmd8bHlzc25hfGJzcGxheWVyKVxcLygoXFxkKyk/W1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgIC8vIEFxdWFsdW5nL0x5c3NuYS9CU1BsYXllclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oYXJlc3xvc3Nwcm94eSlcXHMoKFxcZCspW1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFyZXMvT1NTUHJveHlcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGF1ZGFjaW91c3xhdWRpbXVzaWNzdHJlYW18YW1hcm9rfGJhc3N8Y29yZXxkYWx2aWt8Z25vbWVtcGxheWVyfG11c2ljIG9uIGNvbnNvbGV8bnNwbGF5ZXJ8cHNwLWludGVybmV0cmFkaW9wbGF5ZXJ8dmlkZW9zKVxcLygoXFxkKylbXFx3XFwuLV0rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdWRhY2lvdXMvQXVkaU11c2ljU3RyZWFtL0FtYXJvay9CQVNTL09wZW5DT1JFL0RhbHZpay9Hbm9tZU1wbGF5ZXIvTW9DXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5TUGxheWVyL1BTUC1JbnRlcm5ldFJhZGlvUGxheWVyL1ZpZGVvc1xuICAgICAgICAgICAgLyhjbGVtZW50aW5lfG11c2ljIHBsYXllciBkYWVtb24pXFxzKChcXGQrKVtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgLy8gQ2xlbWVudGluZS9NUERcbiAgICAgICAgICAgIC8obGcgcGxheWVyfG5leHBsYXllcilcXHMoKFxcZCspW1xcZFxcLl0rKS9pLFxuICAgICAgICAgICAgL3BsYXllclxcLyhuZXhwbGF5ZXJ8bGcgcGxheWVyKVxccygoXFxkKylbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgIC8vIE5leFBsYXllci9MRyBQbGF5ZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhuZXhwbGF5ZXIpXFxzKChcXGQrKVtcXHdcXC4tXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV4cGxheWVyXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhmbHJwKVxcLygoXFxkKylbXFx3XFwuLV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmxpcCBQbGF5ZXJcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0ZsaXAgUGxheWVyJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oZnN0cmVhbXxuYXRpdmVob3N0fHF1ZXJ5c2Vla3NwaWRlcnxpYS1hcmNoaXZlcnxmYWNlYm9va2V4dGVybmFsaGl0KS9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZTdHJlYW0vTmF0aXZlSG9zdC9RdWVyeVNlZWtTcGlkZXIvSUEgQXJjaGl2ZXIvZmFjZWJvb2tleHRlcm5hbGhpdFxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG5cbiAgICAgICAgICAgIC8oZ3N0cmVhbWVyKSBzb3VwaHR0cHNyYyAoPzpcXChbXlxcKV0rXFwpKXswLDF9IGxpYnNvdXBcXC8oKFxcZCspW1xcd1xcLi1dKykvaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHc3RyZWFtZXJcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKGh0YyBzdHJlYW1pbmcgcGxheWVyKVxcc1tcXHdfXStcXHNcXC9cXHMoKFxcZCspW1xcZFxcLl0rKS9pLCAgICAgICAgICAgICAgLy8gSFRDIFN0cmVhbWluZyBQbGF5ZXJcbiAgICAgICAgICAgIC8oamF2YXxweXRob24tdXJsbGlifHB5dGhvbi1yZXF1ZXN0c3x3Z2V0fGxpYmN1cmwpXFwvKChcXGQrKVtcXHdcXC4tX10rKS9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKYXZhL3VybGxpYi9yZXF1ZXN0cy93Z2V0L2NVUkxcbiAgICAgICAgICAgIC8obGF2ZikoKFxcZCspW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGF2ZiAoRkZNUEVHKVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oaHRjX29uZV9zKVxcLygoXFxkKylbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUQyBPbmUgU1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAvXy9nLCAnICddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKG1wbGF5ZXIpKD86XFxzfFxcLykoPzooPzpzaGVycHlhLSl7MCwxfXN2bikoPzotfFxccykoclxcZCsoPzotXFxkK1tcXHdcXC4tXSspezAsMX0pL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTVBsYXllciBTVk5cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKG1wbGF5ZXIpKD86XFxzfFxcL3xbdW5rb3ctXSspKChcXGQrKVtcXHdcXC4tXSspL2kgICAgICAgICAgICAgICAgICAgICAgLy8gTVBsYXllclxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8obXBsYXllcikvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTVBsYXllciAobm8gb3RoZXIgaW5mbylcbiAgICAgICAgICAgIC8oeW91cm11emUpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWW91ck11emVcbiAgICAgICAgICAgIC8obWVkaWEgcGxheWVyIGNsYXNzaWN8bmVybyBzaG93dGltZSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWVkaWEgUGxheWVyIENsYXNzaWMvTmVybyBTaG93VGltZVxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG5cbiAgICAgICAgICAgIC8obmVybyAoPzpob21lfHNjb3V0KSlcXC8oKFxcZCspW1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5lcm8gSG9tZS9OZXJvIFNjb3V0XG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgLyhub2tpYVxcZCspXFwvKChcXGQrKVtcXHdcXC4tXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5va2lhXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl0sIFtcblxuICAgICAgICAgICAgL1xccyhzb25nYmlyZClcXC8oKFxcZCspW1xcd1xcLi1dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbmdiaXJkL1BoaWxpcHMtU29uZ2JpcmRcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHdpbmFtcCkzIHZlcnNpb24gKChcXGQrKVtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmFtcFxuICAgICAgICAgICAgLyh3aW5hbXApXFxzKChcXGQrKVtcXHdcXC4tXSspL2ksXG4gICAgICAgICAgICAvKHdpbmFtcCltcGVnXFwvKChcXGQrKVtcXHdcXC4tXSspL2lcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKG9jbXMtYm90fHRhcGlucmFkaW98dHVuZWluIHJhZGlvfHVua25vd258d2luYW1wfGlubGlnaHQgcmFkaW8pL2kgIC8vIE9DTVMtYm90L3RhcCBpbiByYWRpby90dW5laW4vdW5rbm93bi93aW5hbXAgKG5vIG90aGVyIGluZm8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlubGlnaHQgcmFkaW9cbiAgICAgICAgICAgIF0sIFtOQU1FXSwgW1xuXG4gICAgICAgICAgICAvKHF1aWNrdGltZXxybWF8cmFkaW9hcHB8cmFkaW9jbGllbnRhcHBsaWNhdGlvbnxzb3VuZHRhcHx0b3RlbXxzdGFnZWZyaWdodHxzdHJlYW1pdW0pXFwvKChcXGQrKVtcXHdcXC4tXSspL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUXVpY2tUaW1lL1JlYWxNZWRpYS9SYWRpb0FwcC9SYWRpb0NsaWVudEFwcGxpY2F0aW9uL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb3VuZFRhcC9Ub3RlbS9TdGFnZWZyaWdodC9TdHJlYW1pdW1cbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvKHNtcCkoKFxcZCspW1xcZFxcLl0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNNUFxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8odmxjKSBtZWRpYSBwbGF5ZXIgLSB2ZXJzaW9uICgoXFxkKylbXFx3XFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgLy8gVkxDIFZpZGVvbGFuXG4gICAgICAgICAgICAvKHZsYylcXC8oKFxcZCspW1xcd1xcLi1dKykvaSxcbiAgICAgICAgICAgIC8oeGJtY3xndmZzfHhpbmV8eG1tc3xpcmFwcClcXC8oKFxcZCspW1xcd1xcLi1dKykvaSwgICAgICAgICAgICAgICAgICAgIC8vIFhCTUMvZ3Zmcy9YaW5lL1hNTVMvaXJhcHBcbiAgICAgICAgICAgIC8oZm9vYmFyMjAwMClcXC8oKFxcZCspW1xcZFxcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvb2JhcjIwMDBcbiAgICAgICAgICAgIC8oaXR1bmVzKVxcLygoXFxkKylbXFxkXFwuXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlUdW5lc1xuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8od21wbGF5ZXIpXFwvKChcXGQrKVtcXHdcXC4tXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgTWVkaWEgUGxheWVyXG4gICAgICAgICAgICAvKHdpbmRvd3MtbWVkaWEtcGxheWVyKVxcLygoXFxkKylbXFx3XFwuLV0rKS9pXG4gICAgICAgICAgICBdLCBbW05BTUUsIC8tL2csICcgJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC93aW5kb3dzXFwvKChcXGQrKVtcXHdcXC4tXSspIHVwbnBcXC9bXFxkXFwuXSsgZGxuYWRvY1xcL1tcXGRcXC5dKyAoaG9tZSBtZWRpYSBzZXJ2ZXIpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93cyBNZWRpYSBTZXJ2ZXJcbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBbTkFNRSwgJ1dpbmRvd3MnXV0sIFtcblxuICAgICAgICAgICAgLyhjb21cXC5yaXNldXByYWRpb2FsYXJtKVxcLygoXFxkKylbXFxkXFwuXSopL2kgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJpc2VVUCBSYWRpbyBBbGFybVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8ocmFkLmlvKVxccygoXFxkKylbXFxkXFwuXSspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJhZC5pb1xuICAgICAgICAgICAgLyhyYWRpby4oPzpkZXxhdHxmcikpXFxzKChcXGQrKVtcXGRcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAncmFkLmlvJ10sIFZFUlNJT05dXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIE1lZGlhIHBsYXllcnMgRU5EXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5cbiAgICAgICAgXSxcblxuICAgICAgICBjcHUgOiBbW1xuXG4gICAgICAgICAgICAvKD86KGFtZHx4KD86KD86ODZ8NjQpW18tXSk/fHdvd3x3aW4pNjQpWztcXCldL2kgICAgICAgICAgICAgICAgICAgICAvLyBBTUQ2NFxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhbWQ2NCddXSwgW1xuXG4gICAgICAgICAgICAvKGlhMzIoPz07KSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElBMzIgKHF1aWNrdGltZSlcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCB1dGlsLmxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLygoPzppWzM0Nl18eCk4NilbO1xcKV0vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUEzMlxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdpYTMyJ11dLCBbXG5cbiAgICAgICAgICAgIC8vIFBvY2tldFBDIG1pc3Rha2VubHkgaWRlbnRpZmllZCBhcyBQb3dlclBDXG4gICAgICAgICAgICAvd2luZG93c1xccyhjZXxtb2JpbGUpO1xcc3BwYzsvaVxuICAgICAgICAgICAgXSwgW1tBUkNISVRFQ1RVUkUsICdhcm0nXV0sIFtcblxuICAgICAgICAgICAgLygoPzpwcGN8cG93ZXJwYykoPzo2NCk/KSg/Olxcc21hY3w7fFxcKSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBvd2VyUENcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCAvb3dlci8sICcnLCB1dGlsLmxvd2VyaXplXV0sIFtcblxuICAgICAgICAgICAgLyhzdW40XFx3KVs7XFwpXS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNQQVJDXG4gICAgICAgICAgICBdLCBbW0FSQ0hJVEVDVFVSRSwgJ3NwYXJjJ11dLCBbXG5cbiAgICAgICAgICAgIC8oKD86YXZyMzJ8aWE2NCg/PTspKXw2OGsoPz1cXCkpfGFybSg/OjY0fCg/PXZcXGQrOykpfCg/PWF0bWVsXFxzKWF2cnwoPzppcml4fG1pcHN8c3BhcmMpKD86NjQpPyg/PTspfHBhLXJpc2MpL2lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSUE2NCwgNjhLLCBBUk0vNjQsIEFWUi8zMiwgSVJJWC82NCwgTUlQUy82NCwgU1BBUkMvNjQsIFBBLVJJU0NcbiAgICAgICAgICAgIF0sIFtbQVJDSElURUNUVVJFLCB1dGlsLmxvd2VyaXplXV1cbiAgICAgICAgXSxcblxuICAgICAgICBkZXZpY2UgOiBbW1xuXG4gICAgICAgICAgICAvXFwoKGlwYWR8cGxheWJvb2spO1tcXHdcXHNcXCk7LV0rKHJpbXxhcHBsZSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpUGFkL1BsYXlCb29rXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFZFTkRPUiwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hcHBsZWNvcmVtZWRpYVxcL1tcXHdcXC5dKyBcXCgoaXBhZCkvICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlQYWRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FwcGxlJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKGFwcGxlXFxzezAsMX10dikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBsZSBUVlxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0FwcGxlIFRWJ10sIFtWRU5ET1IsICdBcHBsZSddXSwgW1xuXG4gICAgICAgICAgICAvKGFyY2hvcylcXHMoZ2FtZXBhZDI/KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcmNob3NcbiAgICAgICAgICAgIC8oaHApLisodG91Y2hwYWQpL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgVG91Y2hQYWRcbiAgICAgICAgICAgIC8oaHApLisodGFibGV0KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgVGFibGV0XG4gICAgICAgICAgICAvKGtpbmRsZSlcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtpbmRsZVxuICAgICAgICAgICAgL1xccyhub29rKVtcXHdcXHNdK2J1aWxkXFwvKFxcdyspL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vb2tcbiAgICAgICAgICAgIC8oZGVsbClcXHMoc3RyZWFba3ByXFxzXFxkXSpbXFxka29dKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGwgU3RyZWFrXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oa2ZbQS16XSspXFxzYnVpbGRcXC9bXFx3XFwuXSsuKnNpbGtcXC8vaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBLaW5kbGUgRmlyZSBIRFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQW1hem9uJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhzZHxrZilbMDM0OWhpam9yc3R1d10rXFxzYnVpbGRcXC9bXFx3XFwuXSsuKnNpbGtcXC8vaSAgICAgICAgICAgICAgICAgIC8vIEZpcmUgUGhvbmVcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIG1hcHBlci5zdHIsIG1hcHMuZGV2aWNlLmFtYXpvbi5tb2RlbF0sIFtWRU5ET1IsICdBbWF6b24nXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9cXCgoaXBbaG9uZWR8XFxzXFx3Kl0rKTsuKyhhcHBsZSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgVkVORE9SLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC9cXCgoaXBbaG9uZWR8XFxzXFx3Kl0rKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaVBvZC9pUGhvbmVcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FwcGxlJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGJsYWNrYmVycnkpW1xccy1dPyhcXHcrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmxhY2tCZXJyeVxuICAgICAgICAgICAgLyhibGFja2JlcnJ5fGJlbnF8cGFsbSg/PVxcLSl8c29ueWVyaWNzc29ufGFjZXJ8YXN1c3xkZWxsfG1laXp1fG1vdG9yb2xhfHBvbHl0cm9uKVtcXHNfLV0/KFtcXHctXSspKi9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCZW5RL1BhbG0vU29ueS1Fcmljc3Nvbi9BY2VyL0FzdXMvRGVsbC9NZWl6dS9Nb3Rvcm9sYS9Qb2x5dHJvblxuICAgICAgICAgICAgLyhocClcXHMoW1xcd1xcc10rXFx3KS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSFAgaVBBUVxuICAgICAgICAgICAgLyhhc3VzKS0/KFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXN1c1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgL1xcKGJiMTA7XFxzKFxcdyspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCbGFja0JlcnJ5IDEwXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdCbGFja0JlcnJ5J10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBc3VzIFRhYmxldHNcbiAgICAgICAgICAgIC9hbmRyb2lkLisodHJhbnNmb1twcmltZVxcc117NCwxMH1cXHNcXHcrfGVlZXBjfHNsaWRlclxcc1xcdyt8bmV4dXMgN3xwYWRmb25lKS9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdBc3VzJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvKHNvbnkpXFxzKHRhYmxldFxcc1twc10pXFxzYnVpbGRcXC8vaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ueVxuICAgICAgICAgICAgLyhzb255KT8oPzpzZ3AuKylcXHNidWlsZFxcLy9pXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1NvbnknXSwgW01PREVMLCAnWHBlcmlhIFRhYmxldCddLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC9hbmRyb2lkLitcXHMoW2MtZ11cXGR7NH18c29bLWxdXFx3KylcXHNidWlsZFxcLy9pXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTb255J10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvXFxzKG91eWEpXFxzL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3V5YVxuICAgICAgICAgICAgLyhuaW50ZW5kbylcXHMoW3dpZHMzdV0rKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmludGVuZG9cbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgQ09OU09MRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLis7XFxzKHNoaWVsZClcXHNidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOdmlkaWFcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ052aWRpYSddLCBbVFlQRSwgQ09OU09MRV1dLCBbXG5cbiAgICAgICAgICAgIC8ocGxheXN0YXRpb25cXHNbMzRwb3J0YWJsZXZpXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYXlzdGF0aW9uXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTb255J10sIFtUWVBFLCBDT05TT0xFXV0sIFtcblxuICAgICAgICAgICAgLyhzcHJpbnRcXHMoXFx3KykpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwcmludCBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCBtYXBwZXIuc3RyLCBtYXBzLmRldmljZS5zcHJpbnQudmVuZG9yXSwgW01PREVMLCBtYXBwZXIuc3RyLCBtYXBzLmRldmljZS5zcHJpbnQubW9kZWxdLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhsZW5vdm8pXFxzPyhTKD86NTAwMHw2MDAwKSsoPzpbLV1bXFx3K10pKS9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExlbm92byB0YWJsZXRzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC8oaHRjKVs7X1xccy1dKyhbXFx3XFxzXSsoPz1cXCkpfFxcdyspKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVENcbiAgICAgICAgICAgIC8oenRlKS0oXFx3KykqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURVxuICAgICAgICAgICAgLyhhbGNhdGVsfGdlZWtzcGhvbmV8bGVub3ZvfG5leGlhbnxwYW5hc29uaWN8KD89O1xccylzb255KVtfXFxzLV0/KFtcXHctXSspKi9pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsY2F0ZWwvR2Vla3NQaG9uZS9MZW5vdm8vTmV4aWFuL1BhbmFzb25pYy9Tb255XG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbTU9ERUwsIC9fL2csICcgJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKG5leHVzXFxzOSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVEMgTmV4dXMgOVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnSFRDJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvZFxcL2h1YXdlaShbXFx3XFxzLV0rKVs7XFwpXS9pLFxuICAgICAgICAgICAgLyhuZXh1c1xcczZwKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHVhd2VpXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdIdWF3ZWknXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC8obWljcm9zb2Z0KTtcXHMobHVtaWFbXFxzXFx3XSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWljcm9zb2Z0IEx1bWlhXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9bXFxzXFwoO10oeGJveCg/Olxcc29uZSk/KVtcXHNcXCk7XS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNaWNyb3NvZnQgWGJveFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWljcm9zb2Z0J10sIFtUWVBFLCBDT05TT0xFXV0sIFtcbiAgICAgICAgICAgIC8oa2luXFwuW29uZXR3XXszfSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1pY3Jvc29mdCBLaW5cbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9cXC4vZywgJyAnXSwgW1ZFTkRPUiwgJ01pY3Jvc29mdCddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNb3Rvcm9sYVxuICAgICAgICAgICAgL1xccyhtaWxlc3RvbmV8ZHJvaWQoPzpbMi00eF18XFxzKD86YmlvbmljfHgyfHByb3xyYXpyKSk/KDo/XFxzNGcpPylbXFx3XFxzXStidWlsZFxcLy9pLFxuICAgICAgICAgICAgL21vdFtcXHMtXT8oXFx3KykqL2ksXG4gICAgICAgICAgICAvKFhUXFxkezMsNH0pIGJ1aWxkXFwvL2ksXG4gICAgICAgICAgICAvKG5leHVzXFxzNikvaVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTW90b3JvbGEnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rXFxzKG16NjBcXGR8eG9vbVtcXHMyXXswLDJ9KVxcc2J1aWxkXFwvL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ01vdG9yb2xhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvaGJidHZcXC9cXGQrXFwuXFxkK1xcLlxcZCtcXHMrXFwoW1xcd1xcc10qO1xccyooXFx3W147XSopOyhbXjtdKikvaSAgICAgICAgICAgIC8vIEhiYlRWIGRldmljZXNcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCB1dGlsLnRyaW1dLCBbTU9ERUwsIHV0aWwudHJpbV0sIFtUWVBFLCBTTUFSVFRWXV0sIFtcblxuICAgICAgICAgICAgL2hiYnR2LittYXBsZTsoXFxkKykvaVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgL14vLCAnU21hcnRUViddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgU01BUlRUVl1dLCBbXG5cbiAgICAgICAgICAgIC9cXChkdHZbXFwpO10uKyhhcXVvcykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaGFycFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU2hhcnAnXSwgW1RZUEUsIFNNQVJUVFZdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rKChzY2gtaVs4OV0wXFxkfHNody1tMzgwc3xndC1wXFxkezR9fGd0LW5cXGQrfHNnaC10OFs1Nl05fG5leHVzIDEwKSkvaSxcbiAgICAgICAgICAgIC8oKFNNLVRcXHcrKSkvaVxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdTYW1zdW5nJ10sIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFsgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nXG4gICAgICAgICAgICAvc21hcnQtdHYuKyhzYW1zdW5nKS9pXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBbVFlQRSwgU01BUlRUVl0sIE1PREVMXSwgW1xuICAgICAgICAgICAgLygoc1tjZ3BdaC1cXHcrfGd0LVxcdyt8Z2FsYXh5XFxzbmV4dXN8c20tXFx3W1xcd1xcZF0rKSkvaSxcbiAgICAgICAgICAgIC8oc2FtW3N1bmddKilbXFxzLV0qKFxcdystP1tcXHctXSopKi9pLFxuICAgICAgICAgICAgL3NlYy0oKHNnaFxcdyspKS9pXG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ1NhbXN1bmcnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvc2llLShcXHcrKSovaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaWVtZW5zXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTaWVtZW5zJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKG1hZW1vfG5va2lhKS4qKG45MDB8bHVtaWFcXHNcXGQrKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9raWFcbiAgICAgICAgICAgIC8obm9raWEpW1xcc18tXT8oW1xcdy1dKykqL2lcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnTm9raWEnXSwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZFxcczNcXC5bXFxzXFx3Oy1dezEwfShhXFxkezN9KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWNlclxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnQWNlciddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuKyhbdmxda1xcLT9cXGR7M30pXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMRyBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0xHJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgL2FuZHJvaWRcXHMzXFwuW1xcc1xcdzstXXsxMH0obGc/KS0oWzA2Y3Y5XXszLDR9KS9pICAgICAgICAgICAgICAgICAgICAgLy8gTEcgVGFibGV0XG4gICAgICAgICAgICBdLCBbW1ZFTkRPUiwgJ0xHJ10sIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcbiAgICAgICAgICAgIC8obGcpIG5ldGNhc3RcXC50di9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExHIFNtYXJ0VFZcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgU01BUlRUVl1dLCBbXG4gICAgICAgICAgICAvKG5leHVzXFxzWzQ1XSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMR1xuICAgICAgICAgICAgL2xnW2U7XFxzXFwvLV0rKFxcdyspKi9pLFxuICAgICAgICAgICAgL2FuZHJvaWQuK2xnKFxcLT9bXFxkXFx3XSspXFxzK2J1aWxkL2lcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0xHJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rKGlkZWF0YWJbYS16MC05XFwtXFxzXSspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVub3ZvXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdMZW5vdm8nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9saW51eDsuKygoam9sbGEpKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9sbGFcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLygocGViYmxlKSlhcHBcXC9bXFxkXFwuXStcXHMvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGViYmxlXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFdFQVJBQkxFXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuKztcXHMob3BwbylcXHM/KFtcXHdcXHNdKylcXHNidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9QUE9cbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2Nya2V5L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgQ2hyb21lY2FzdFxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0Nocm9tZWNhc3QnXSwgW1ZFTkRPUiwgJ0dvb2dsZSddXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhnbGFzcylcXHNcXGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdvb2dsZSBHbGFzc1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR29vZ2xlJ10sIFtUWVBFLCBXRUFSQUJMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLis7XFxzKHBpeGVsIGMpXFxzL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHb29nbGUgUGl4ZWwgQ1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnR29vZ2xlJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhwaXhlbCB4bHxwaXhlbClcXHMvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR29vZ2xlIFBpeGVsXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdHb29nbGUnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLisoXFx3KylcXHMrYnVpbGRcXC9obVxcMS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhpYW9taSBIb25nbWkgJ251bWVyaWMnIG1vZGVsc1xuICAgICAgICAgICAgL2FuZHJvaWQuKyhobVtcXHNcXC1fXSpub3RlP1tcXHNfXSooPzpcXGRcXHcpPylcXHMrYnVpbGQvaSwgICAgICAgICAgICAgICAvLyBYaWFvbWkgSG9uZ21pXG4gICAgICAgICAgICAvYW5kcm9pZC4rKG1pW1xcc1xcLV9dKig/Om9uZXxvbmVbXFxzX11wbHVzfG5vdGUgbHRlKT9bXFxzX10qKD86XFxkXFx3KT8pXFxzK2J1aWxkL2ksICAgIC8vIFhpYW9taSBNaVxuICAgICAgICAgICAgL2FuZHJvaWQuKyhyZWRtaVtcXHNcXC1fXSooPzpub3RlKT8oPzpbXFxzX10qW1xcd1xcc10rKT8pXFxzK2J1aWxkL2kgICAgICAvLyBSZWRtaSBQaG9uZXNcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsICdYaWFvbWknXSwgW1RZUEUsIE1PQklMRV1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rKG1pW1xcc1xcLV9dKig/OnBhZCk/KD86W1xcc19dKltcXHdcXHNdKyk/KVxccytidWlsZC9pICAgICAgICAgIC8vIE1pIFBhZCB0YWJsZXRzXG4gICAgICAgICAgICBdLFtbTU9ERUwsIC9fL2csICcgJ10sIFtWRU5ET1IsICdYaWFvbWknXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvYW5kcm9pZC4rO1xccyhtWzEtNV1cXHNub3RlKVxcc2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1laXp1IFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWVpenUnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLithMDAwKDEpXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9uZVBsdXNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ09uZVBsdXMnXSwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKFJDVFtcXGRcXHddKylcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSQ0EgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnUkNBJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihWZW51ZVtcXGRcXHNdKilcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVsbCBWZW51ZSBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdEZWxsJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihRW1R8TV1bXFxkXFx3XSspXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVmVyaXpvbiBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1Zlcml6b24nXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMrKEJhcm5lc1smXFxzXStOb2JsZVxccyt8Qk5bUlRdKShWPy4qKVxccytidWlsZC9pICAgICAvLyBCYXJuZXMgJiBOb2JsZSBUYWJsZXRcbiAgICAgICAgICAgIF0sIFtbVkVORE9SLCAnQmFybmVzICYgTm9ibGUnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKyhUTVxcZHszfS4qXFxiKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFybmVzICYgTm9ibGUgVGFibGV0XG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdOdVZpc2lvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooenRlKT8uKyhrXFxkezJ9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgLy8gWlRFIEsgU2VyaWVzIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdaVEUnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihnZW5cXGR7M30pXFxzK2J1aWxkLio0OWgvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2lzcyBHRU4gTW9iaWxlXG4gICAgICAgICAgICBdLCBbTU9ERUwsIFtWRU5ET1IsICdTd2lzcyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooenVyXFxkezN9KVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpc3MgWlVSIFRhYmxldFxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnU3dpc3MnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKChaZWtpKT9UQi4qXFxiKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpla2kgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWmVraSddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhhbmRyb2lkKS4rWztcXC9dXFxzKyhbWVJdXFxkezJ9eD8uKilcXHMrYnVpbGQvaSxcbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMrKERyYWdvbltcXC1cXHNdK1RvdWNoXFxzK3xEVCkoLispXFxzK2J1aWxkL2kgICAgICAgICAgLy8gRHJhZ29uIFRvdWNoIFRhYmxldFxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdEcmFnb24gVG91Y2gnXSwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihOUy0/LispXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluc2lnbmlhIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0luc2lnbmlhJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKigoTlh8TmV4dCktPy4rKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5leHRCb29rIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ05leHRCb29rJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihYdHJlbWVcXF8/KT8oVigxWzA0NV18MlswMTVdfDMwfDQwfDYwfDdbMDVdfDkwKSlcXHMrYnVpbGQvaVxuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdWb2ljZSddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbICAgICAgICAgICAgICAgICAgICAvLyBWb2ljZSBYdHJlbWUgUGhvbmVzXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKExWVEVMXFwtPyk/KFYxWzEyXSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgIC8vIEx2VGVsIFBob25lc1xuICAgICAgICAgICAgXSwgW1tWRU5ET1IsICdMdlRlbCddLCBNT0RFTCwgW1RZUEUsIE1PQklMRV1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKFYoMTAwTUR8NzAwTkF8NzAxMXw5MTdHKS4qXFxiKVxccytidWlsZC9pICAgICAgICAgIC8vIEVudml6ZW4gVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnRW52aXplbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuK1s7XFwvXVxccyooTGVbXFxzXFwtXStQYW4pW1xcc1xcLV0rKC4qXFxiKVxccytidWlsZC9pICAgICAgICAgICAgIC8vIExlIFBhbiBUYWJsZXRzXG4gICAgICAgICAgICBdLCBbVkVORE9SLCBNT0RFTCwgW1RZUEUsIFRBQkxFVF1dLCBbXG5cbiAgICAgICAgICAgIC9hbmRyb2lkLitbO1xcL11cXHMqKFRyaW9bXFxzXFwtXSouKilcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWNoU3BlZWQgVGFibGV0c1xuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnTWFjaFNwZWVkJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKihUcmluaXR5KVtcXC1cXHNdKihUXFxkezN9KVxccytidWlsZC9pICAgICAgICAgICAgICAgIC8vIFRyaW5pdHkgVGFibGV0c1xuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rWztcXC9dXFxzKlRVXygxNDkxKVxccytidWlsZC9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJvdG9yIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ1JvdG9yJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuXG4gICAgICAgICAgICAvYW5kcm9pZC4rKEtTKC4rKSlcXHMrYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbWF6b24gS2luZGxlIFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FtYXpvbiddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL2FuZHJvaWQuKyhHaWdhc2V0KVtcXHNcXC1dKyhRLispXFxzK2J1aWxkL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaWdhc2V0IFRhYmxldHNcbiAgICAgICAgICAgIF0sIFtWRU5ET1IsIE1PREVMLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgL1xccyh0YWJsZXR8dGFiKVs7XFwvXS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVuaWRlbnRpZmlhYmxlIFRhYmxldFxuICAgICAgICAgICAgL1xccyhtb2JpbGUpKD86WztcXC9dfFxcc3NhZmFyaSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVbmlkZW50aWZpYWJsZSBNb2JpbGVcbiAgICAgICAgICAgIF0sIFtbVFlQRSwgdXRpbC5sb3dlcml6ZV0sIFZFTkRPUiwgTU9ERUxdLCBbXG5cbiAgICAgICAgICAgIC8oYW5kcm9pZC4rKVs7XFwvXS4rYnVpbGQvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdlbmVyaWMgQW5kcm9pZCBEZXZpY2VcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0dlbmVyaWMnXV1cblxuXG4gICAgICAgIC8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFRPRE86IG1vdmUgdG8gc3RyaW5nIG1hcFxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvKEM2NjAzKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbnkgWHBlcmlhIFogQzY2MDNcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdYcGVyaWEgWiBDNjYwMyddLCBbVkVORE9SLCAnU29ueSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oQzY5MDMpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ueSBYcGVyaWEgWiAxXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnWHBlcmlhIFogMSddLCBbVkVORE9SLCAnU29ueSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhTTS1HOTAwW0Z8SF0pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nIEdhbGF4eSBTNVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0dhbGF4eSBTNSddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oU00tRzcxMDIpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBHYWxheHkgR3JhbmQgMlxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0dhbGF4eSBHcmFuZCAyJ10sIFtWRU5ET1IsICdTYW1zdW5nJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhTTS1HNTMwSCkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nIEdhbGF4eSBHcmFuZCBQcmltZVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0dhbGF4eSBHcmFuZCBQcmltZSddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oU00tRzMxM0haKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBHYWxheHkgVlxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ0dhbGF4eSBWJ10sIFtWRU5ET1IsICdTYW1zdW5nJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhTTS1UODA1KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYW1zdW5nIEdhbGF4eSBUYWIgUyAxMC41XG4gICAgICAgICAgICBdLCBbW01PREVMLCAnR2FsYXh5IFRhYiBTIDEwLjUnXSwgW1ZFTkRPUiwgJ1NhbXN1bmcnXSwgW1RZUEUsIFRBQkxFVF1dLCBbXG4gICAgICAgICAgICAvKFNNLUc4MDBGKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhbXN1bmcgR2FsYXh5IFM1IE1pbmlcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdHYWxheHkgUzUgTWluaSddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgTU9CSUxFXV0sIFtcbiAgICAgICAgICAgIC8oU00tVDMxMSkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2Ftc3VuZyBHYWxheHkgVGFiIDMgOC4wXG4gICAgICAgICAgICBdLCBbW01PREVMLCAnR2FsYXh5IFRhYiAzIDguMCddLCBbVkVORE9SLCAnU2Ftc3VuZyddLCBbVFlQRSwgVEFCTEVUXV0sIFtcblxuICAgICAgICAgICAgLyhUM0MpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZHZhbiBWYW5kcm9pZCBUM0NcbiAgICAgICAgICAgIF0sIFtNT0RFTCwgW1ZFTkRPUiwgJ0FkdmFuJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhBRFZBTiBUMUpcXCspL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWR2YW4gVmFuZHJvaWQgVDFKK1xuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ1ZhbmRyb2lkIFQxSisnXSwgW1ZFTkRPUiwgJ0FkdmFuJ10sIFtUWVBFLCBUQUJMRVRdXSwgW1xuICAgICAgICAgICAgLyhBRFZBTiBTNEEpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZHZhbiBWYW5kcm9pZCBTNEFcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdWYW5kcm9pZCBTNEEnXSwgW1ZFTkRPUiwgJ0FkdmFuJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKFY5NzJNKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFpURSBWOTcyTVxuICAgICAgICAgICAgXSwgW01PREVMLCBbVkVORE9SLCAnWlRFJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuXG4gICAgICAgICAgICAvKGktbW9iaWxlKVxccyhJUVxcc1tcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLW1vYmlsZSBJUVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhJUTYuMykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLW1vYmlsZSBJUSBJUSA2LjNcbiAgICAgICAgICAgIF0sIFtbTU9ERUwsICdJUSA2LjMnXSwgW1ZFTkRPUiwgJ2ktbW9iaWxlJ10sIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhpLW1vYmlsZSlcXHMoaS1zdHlsZVxcc1tcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS1tb2JpbGUgaS1TVFlMRVxuICAgICAgICAgICAgXSwgW1ZFTkRPUiwgTU9ERUwsIFtUWVBFLCBNT0JJTEVdXSwgW1xuICAgICAgICAgICAgLyhpLVNUWUxFMi4xKS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpLW1vYmlsZSBpLVNUWUxFIDIuMVxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ2ktU1RZTEUgMi4xJ10sIFtWRU5ET1IsICdpLW1vYmlsZSddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLyhtb2JpaXN0YXIgdG91Y2ggTEFJIDUxMikvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2JpaXN0YXIgdG91Y2ggTEFJIDUxMlxuICAgICAgICAgICAgXSwgW1tNT0RFTCwgJ1RvdWNoIExBSSA1MTInXSwgW1ZFTkRPUiwgJ21vYmlpc3RhciddLCBbVFlQRSwgTU9CSUxFXV0sIFtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gRU5EIFRPRE9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vKi9cblxuICAgICAgICBdLFxuXG4gICAgICAgIGVuZ2luZSA6IFtbXG5cbiAgICAgICAgICAgIC93aW5kb3dzLitcXHNlZGdlXFwvKFtcXHdcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVkZ2VIVE1MXG4gICAgICAgICAgICBdLCBbVkVSU0lPTiwgW05BTUUsICdFZGdlSFRNTCddXSwgW1xuXG4gICAgICAgICAgICAvKHByZXN0bylcXC8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXN0b1xuICAgICAgICAgICAgLyh3ZWJraXR8dHJpZGVudHxuZXRmcm9udHxuZXRzdXJmfGFtYXlhfGx5bnh8dzNtKVxcLyhbXFx3XFwuXSspL2ksICAgICAvLyBXZWJLaXQvVHJpZGVudC9OZXRGcm9udC9OZXRTdXJmL0FtYXlhL0x5bngvdzNtXG4gICAgICAgICAgICAvKGtodG1sfHRhc21hbnxsaW5rcylbXFwvXFxzXVxcKD8oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS0hUTUwvVGFzbWFuL0xpbmtzXG4gICAgICAgICAgICAvKGljYWIpW1xcL1xcc10oWzIzXVxcLltcXGRcXC5dKykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaUNhYlxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC9ydlxcOihbXFx3XFwuXSspLiooZ2Vja28pL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2Vja29cbiAgICAgICAgICAgIF0sIFtWRVJTSU9OLCBOQU1FXVxuICAgICAgICBdLFxuXG4gICAgICAgIG9zIDogW1tcblxuICAgICAgICAgICAgLy8gV2luZG93cyBiYXNlZFxuICAgICAgICAgICAgL21pY3Jvc29mdFxccyh3aW5kb3dzKVxccyh2aXN0YXx4cCkvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgKGlUdW5lcylcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyh3aW5kb3dzKVxcc250XFxzNlxcLjI7XFxzKGFybSkvaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93cyBSVFxuICAgICAgICAgICAgLyh3aW5kb3dzXFxzcGhvbmUoPzpcXHNvcykqKVtcXHNcXC9dPyhbXFxkXFwuXFxzXStcXHcpKi9pLCAgICAgICAgICAgICAgICAgIC8vIFdpbmRvd3MgUGhvbmVcbiAgICAgICAgICAgIC8od2luZG93c1xcc21vYmlsZXx3aW5kb3dzKVtcXHNcXC9dPyhbbnRjZVxcZFxcLlxcc10rXFx3KS9pXG4gICAgICAgICAgICBdLCBbTkFNRSwgW1ZFUlNJT04sIG1hcHBlci5zdHIsIG1hcHMub3Mud2luZG93cy52ZXJzaW9uXV0sIFtcbiAgICAgICAgICAgIC8od2luKD89M3w5fG4pfHdpblxcczl4XFxzKShbbnRcXGRcXC5dKykvaVxuICAgICAgICAgICAgXSwgW1tOQU1FLCAnV2luZG93cyddLCBbVkVSU0lPTiwgbWFwcGVyLnN0ciwgbWFwcy5vcy53aW5kb3dzLnZlcnNpb25dXSwgW1xuXG4gICAgICAgICAgICAvLyBNb2JpbGUvRW1iZWRkZWQgT1NcbiAgICAgICAgICAgIC9cXCgoYmIpKDEwKTsvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrQmVycnkgMTBcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0JsYWNrQmVycnknXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC8oYmxhY2tiZXJyeSlcXHcqXFwvPyhbXFx3XFwuXSspKi9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJsYWNrYmVycnlcbiAgICAgICAgICAgIC8odGl6ZW4pW1xcL1xcc10oW1xcd1xcLl0rKS9pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpemVuXG4gICAgICAgICAgICAvKGFuZHJvaWR8d2Vib3N8cGFsbVxcc29zfHFueHxiYWRhfHJpbVxcc3RhYmxldFxcc29zfG1lZWdvfGNvbnRpa2kpW1xcL1xccy1dPyhbXFx3XFwuXSspKi9pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkL1dlYk9TL1BhbG0vUU5YL0JhZGEvUklNL01lZUdvL0NvbnRpa2lcbiAgICAgICAgICAgIC9saW51eDsuKyhzYWlsZmlzaCk7L2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2FpbGZpc2ggT1NcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSwgW1xuICAgICAgICAgICAgLyhzeW1iaWFuXFxzP29zfHN5bWJvc3xzNjAoPz07KSlbXFwvXFxzLV0/KFtcXHdcXC5dKykqL2kgICAgICAgICAgICAgICAgIC8vIFN5bWJpYW5cbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ1N5bWJpYW4nXSwgVkVSU0lPTl0sIFtcbiAgICAgICAgICAgIC9cXCgoc2VyaWVzNDApOy9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlcmllcyA0MFxuICAgICAgICAgICAgXSwgW05BTUVdLCBbXG4gICAgICAgICAgICAvbW96aWxsYS4rXFwobW9iaWxlOy4rZ2Vja28uK2ZpcmVmb3gvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IE9TXG4gICAgICAgICAgICBdLCBbW05BTUUsICdGaXJlZm94IE9TJ10sIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8vIENvbnNvbGVcbiAgICAgICAgICAgIC8obmludGVuZG98cGxheXN0YXRpb24pXFxzKFt3aWRzMzRwb3J0YWJsZXZ1XSspL2ksICAgICAgICAgICAgICAgICAgIC8vIE5pbnRlbmRvL1BsYXlzdGF0aW9uXG5cbiAgICAgICAgICAgIC8vIEdOVS9MaW51eCBiYXNlZFxuICAgICAgICAgICAgLyhtaW50KVtcXC9cXHNcXChdPyhcXHcrKSovaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWludFxuICAgICAgICAgICAgLyhtYWdlaWF8dmVjdG9ybGludXgpWztcXHNdL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFnZWlhL1ZlY3RvckxpbnV4XG4gICAgICAgICAgICAvKGpvbGl8W2t4bG5dP3VidW50dXxkZWJpYW58W29wZW5dKnN1c2V8Z2VudG9vfCg/PVxccylhcmNofHNsYWNrd2FyZXxmZWRvcmF8bWFuZHJpdmF8Y2VudG9zfHBjbGludXhvc3xyZWRoYXR8emVud2Fsa3xsaW5wdXMpW1xcL1xccy1dPyg/IWNocm9tKShbXFx3XFwuLV0rKSovaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSm9saS9VYnVudHUvRGViaWFuL1NVU0UvR2VudG9vL0FyY2gvU2xhY2t3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZlZG9yYS9NYW5kcml2YS9DZW50T1MvUENMaW51eE9TL1JlZEhhdC9aZW53YWxrL0xpbnB1c1xuICAgICAgICAgICAgLyhodXJkfGxpbnV4KVxccz8oW1xcd1xcLl0rKSovaSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIdXJkL0xpbnV4XG4gICAgICAgICAgICAvKGdudSlcXHM/KFtcXHdcXC5dKykqL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdOVVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLCBbXG5cbiAgICAgICAgICAgIC8oY3JvcylcXHNbXFx3XStcXHMoW1xcd1xcLl0rXFx3KS9pICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21pdW0gT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ0Nocm9taXVtIE9TJ10sIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgLyhzdW5vcylcXHM/KFtcXHdcXC5dK1xcZCkqL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29sYXJpc1xuICAgICAgICAgICAgXSwgW1tOQU1FLCAnU29sYXJpcyddLCBWRVJTSU9OXSwgW1xuXG4gICAgICAgICAgICAvLyBCU0QgYmFzZWRcbiAgICAgICAgICAgIC9cXHMoW2ZyZW50b3BjLV17MCw0fWJzZHxkcmFnb25mbHkpXFxzPyhbXFx3XFwuXSspKi9pICAgICAgICAgICAgICAgICAgIC8vIEZyZWVCU0QvTmV0QlNEL09wZW5CU0QvUEMtQlNEL0RyYWdvbkZseVxuICAgICAgICAgICAgXSwgW05BTUUsIFZFUlNJT05dLFtcblxuICAgICAgICAgICAgLyhoYWlrdSlcXHMoXFx3KykvaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFpa3VcbiAgICAgICAgICAgIF0sIFtOQU1FLCBWRVJTSU9OXSxbXG5cbiAgICAgICAgICAgIC9jZm5ldHdvcmtcXC8uK2Rhcndpbi9pLFxuICAgICAgICAgICAgL2lwW2hvbmVhZF0rKD86Lipvc1xccyhbXFx3XSspXFxzbGlrZVxcc21hY3w7XFxzb3BlcmEpL2kgICAgICAgICAgICAgICAgIC8vIGlPU1xuICAgICAgICAgICAgXSwgW1tWRVJTSU9OLCAvXy9nLCAnLiddLCBbTkFNRSwgJ2lPUyddXSwgW1xuXG4gICAgICAgICAgICAvKG1hY1xcc29zXFxzeClcXHM/KFtcXHdcXHNcXC5dK1xcdykqL2ksXG4gICAgICAgICAgICAvKG1hY2ludG9zaHxtYWMoPz1fcG93ZXJwYylcXHMpL2kgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWMgT1NcbiAgICAgICAgICAgIF0sIFtbTkFNRSwgJ01hYyBPUyddLCBbVkVSU0lPTiwgL18vZywgJy4nXV0sIFtcblxuICAgICAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgICAgIC8oKD86b3Blbik/c29sYXJpcylbXFwvXFxzLV0/KFtcXHdcXC5dKykqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbGFyaXNcbiAgICAgICAgICAgIC8oYWl4KVxccygoXFxkKSg/PVxcLnxcXCl8XFxzKVtcXHdcXC5dKikqL2ksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFJWFxuICAgICAgICAgICAgLyhwbGFuXFxzOXxtaW5peHxiZW9zfG9zXFwvMnxhbWlnYW9zfG1vcnBob3N8cmlzY1xcc29zfG9wZW52bXMpL2ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBsYW45L01pbml4L0JlT1MvT1MyL0FtaWdhT1MvTW9ycGhPUy9SSVNDT1MvT3BlblZNU1xuICAgICAgICAgICAgLyh1bml4KVxccz8oW1xcd1xcLl0rKSovaSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVTklYXG4gICAgICAgICAgICBdLCBbTkFNRSwgVkVSU0lPTl1cbiAgICAgICAgXVxuICAgIH07XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQ29uc3RydWN0b3JcbiAgICAvLy8vLy8vLy8vLy8vLy8vXG4gICAgLypcbiAgICB2YXIgQnJvd3NlciA9IGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uKSB7XG4gICAgICAgIHRoaXNbTkFNRV0gPSBuYW1lO1xuICAgICAgICB0aGlzW1ZFUlNJT05dID0gdmVyc2lvbjtcbiAgICB9O1xuICAgIHZhciBDUFUgPSBmdW5jdGlvbiAoYXJjaCkge1xuICAgICAgICB0aGlzW0FSQ0hJVEVDVFVSRV0gPSBhcmNoO1xuICAgIH07XG4gICAgdmFyIERldmljZSA9IGZ1bmN0aW9uICh2ZW5kb3IsIG1vZGVsLCB0eXBlKSB7XG4gICAgICAgIHRoaXNbVkVORE9SXSA9IHZlbmRvcjtcbiAgICAgICAgdGhpc1tNT0RFTF0gPSBtb2RlbDtcbiAgICAgICAgdGhpc1tUWVBFXSA9IHR5cGU7XG4gICAgfTtcbiAgICB2YXIgRW5naW5lID0gQnJvd3NlcjtcbiAgICB2YXIgT1MgPSBCcm93c2VyO1xuICAgICovXG4gICAgdmFyIFVBUGFyc2VyID0gZnVuY3Rpb24gKHVhc3RyaW5nLCBleHRlbnNpb25zKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB1YXN0cmluZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGV4dGVuc2lvbnMgPSB1YXN0cmluZztcbiAgICAgICAgICAgIHVhc3RyaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVBUGFyc2VyKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVQVBhcnNlcih1YXN0cmluZywgZXh0ZW5zaW9ucykuZ2V0UmVzdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdWEgPSB1YXN0cmluZyB8fCAoKHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSA/IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50IDogRU1QVFkpO1xuICAgICAgICB2YXIgcmd4bWFwID0gZXh0ZW5zaW9ucyA/IHV0aWwuZXh0ZW5kKHJlZ2V4ZXMsIGV4dGVuc2lvbnMpIDogcmVnZXhlcztcbiAgICAgICAgLy92YXIgYnJvd3NlciA9IG5ldyBCcm93c2VyKCk7XG4gICAgICAgIC8vdmFyIGNwdSA9IG5ldyBDUFUoKTtcbiAgICAgICAgLy92YXIgZGV2aWNlID0gbmV3IERldmljZSgpO1xuICAgICAgICAvL3ZhciBlbmdpbmUgPSBuZXcgRW5naW5lKCk7XG4gICAgICAgIC8vdmFyIG9zID0gbmV3IE9TKCk7XG5cbiAgICAgICAgdGhpcy5nZXRCcm93c2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJyb3dzZXIgPSB7IG5hbWU6IHVuZGVmaW5lZCwgdmVyc2lvbjogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwoYnJvd3NlciwgdWEsIHJneG1hcC5icm93c2VyKTtcbiAgICAgICAgICAgIGJyb3dzZXIubWFqb3IgPSB1dGlsLm1ham9yKGJyb3dzZXIudmVyc2lvbik7IC8vIGRlcHJlY2F0ZWRcbiAgICAgICAgICAgIHJldHVybiBicm93c2VyO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENQVSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjcHUgPSB7IGFyY2hpdGVjdHVyZTogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwoY3B1LCB1YSwgcmd4bWFwLmNwdSk7XG4gICAgICAgICAgICByZXR1cm4gY3B1O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZXZpY2UgPSB7IHZlbmRvcjogdW5kZWZpbmVkLCBtb2RlbDogdW5kZWZpbmVkLCB0eXBlOiB1bmRlZmluZWQgfTtcbiAgICAgICAgICAgIG1hcHBlci5yZ3guY2FsbChkZXZpY2UsIHVhLCByZ3htYXAuZGV2aWNlKTtcbiAgICAgICAgICAgIHJldHVybiBkZXZpY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0RW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVuZ2luZSA9IHsgbmFtZTogdW5kZWZpbmVkLCB2ZXJzaW9uOiB1bmRlZmluZWQgfTtcbiAgICAgICAgICAgIG1hcHBlci5yZ3guY2FsbChlbmdpbmUsIHVhLCByZ3htYXAuZW5naW5lKTtcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0T1MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3MgPSB7IG5hbWU6IHVuZGVmaW5lZCwgdmVyc2lvbjogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICBtYXBwZXIucmd4LmNhbGwob3MsIHVhLCByZ3htYXAub3MpO1xuICAgICAgICAgICAgcmV0dXJuIG9zO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdWEgICAgICA6IHRoaXMuZ2V0VUEoKSxcbiAgICAgICAgICAgICAgICBicm93c2VyIDogdGhpcy5nZXRCcm93c2VyKCksXG4gICAgICAgICAgICAgICAgZW5naW5lICA6IHRoaXMuZ2V0RW5naW5lKCksXG4gICAgICAgICAgICAgICAgb3MgICAgICA6IHRoaXMuZ2V0T1MoKSxcbiAgICAgICAgICAgICAgICBkZXZpY2UgIDogdGhpcy5nZXREZXZpY2UoKSxcbiAgICAgICAgICAgICAgICBjcHUgICAgIDogdGhpcy5nZXRDUFUoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRVQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1YTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRVQSA9IGZ1bmN0aW9uICh1YXN0cmluZykge1xuICAgICAgICAgICAgdWEgPSB1YXN0cmluZztcbiAgICAgICAgICAgIC8vYnJvd3NlciA9IG5ldyBCcm93c2VyKCk7XG4gICAgICAgICAgICAvL2NwdSA9IG5ldyBDUFUoKTtcbiAgICAgICAgICAgIC8vZGV2aWNlID0gbmV3IERldmljZSgpO1xuICAgICAgICAgICAgLy9lbmdpbmUgPSBuZXcgRW5naW5lKCk7XG4gICAgICAgICAgICAvL29zID0gbmV3IE9TKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFVBUGFyc2VyLlZFUlNJT04gPSBMSUJWRVJTSU9OO1xuICAgIFVBUGFyc2VyLkJST1dTRVIgPSB7XG4gICAgICAgIE5BTUUgICAgOiBOQU1FLFxuICAgICAgICBNQUpPUiAgIDogTUFKT1IsIC8vIGRlcHJlY2F0ZWRcbiAgICAgICAgVkVSU0lPTiA6IFZFUlNJT05cbiAgICB9O1xuICAgIFVBUGFyc2VyLkNQVSA9IHtcbiAgICAgICAgQVJDSElURUNUVVJFIDogQVJDSElURUNUVVJFXG4gICAgfTtcbiAgICBVQVBhcnNlci5ERVZJQ0UgPSB7XG4gICAgICAgIE1PREVMICAgOiBNT0RFTCxcbiAgICAgICAgVkVORE9SICA6IFZFTkRPUixcbiAgICAgICAgVFlQRSAgICA6IFRZUEUsXG4gICAgICAgIENPTlNPTEUgOiBDT05TT0xFLFxuICAgICAgICBNT0JJTEUgIDogTU9CSUxFLFxuICAgICAgICBTTUFSVFRWIDogU01BUlRUVixcbiAgICAgICAgVEFCTEVUICA6IFRBQkxFVCxcbiAgICAgICAgV0VBUkFCTEU6IFdFQVJBQkxFLFxuICAgICAgICBFTUJFRERFRDogRU1CRURERURcbiAgICB9O1xuICAgIFVBUGFyc2VyLkVOR0lORSA9IHtcbiAgICAgICAgTkFNRSAgICA6IE5BTUUsXG4gICAgICAgIFZFUlNJT04gOiBWRVJTSU9OXG4gICAgfTtcbiAgICBVQVBhcnNlci5PUyA9IHtcbiAgICAgICAgTkFNRSAgICA6IE5BTUUsXG4gICAgICAgIFZFUlNJT04gOiBWRVJTSU9OXG4gICAgfTtcbiAgICAvL1VBUGFyc2VyLlV0aWxzID0gdXRpbDtcblxuICAgIC8vLy8vLy8vLy8vXG4gICAgLy8gRXhwb3J0XG4gICAgLy8vLy8vLy8vL1xuXG5cbiAgICAvLyBjaGVjayBqcyBlbnZpcm9ubWVudFxuICAgIGlmICh0eXBlb2YoZXhwb3J0cykgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgLy8gbm9kZWpzIGVudlxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gVU5ERUZfVFlQRSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogdGVzdCEhISEhISEhXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChyZXF1aXJlICYmIHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlICYmIHByb2Nlc3MpIHtcbiAgICAgICAgICAgIC8vIGNsaVxuICAgICAgICAgICAgdmFyIGpzb25pemUgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKG5ldyBVQVBhcnNlcihhcnJbaV0pLmdldFJlc3VsdCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSArICdcXG4nKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5zdGRpbi5pc1RUWSkge1xuICAgICAgICAgICAgICAgIC8vIHZpYSBhcmdzXG4gICAgICAgICAgICAgICAganNvbml6ZShwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB2aWEgcGlwZVxuICAgICAgICAgICAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZGluLm9uKCdyZWFkYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVhZCA9IHByb2Nlc3Muc3RkaW4ucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVhZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IHJlYWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZGluLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGpzb25pemUoc3RyLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICBleHBvcnRzLlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVxdWlyZWpzIGVudiAob3B0aW9uYWwpXG4gICAgICAgIGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gRlVOQ19UWVBFICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVBUGFyc2VyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgICAgICAgICAvLyBicm93c2VyIGVudlxuICAgICAgICAgICAgd2luZG93LlVBUGFyc2VyID0gVUFQYXJzZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBqUXVlcnkvWmVwdG8gc3BlY2lmaWMgKG9wdGlvbmFsKVxuICAgIC8vIE5vdGU6XG4gICAgLy8gICBJbiBBTUQgZW52IHRoZSBnbG9iYWwgc2NvcGUgc2hvdWxkIGJlIGtlcHQgY2xlYW4sIGJ1dCBqUXVlcnkgaXMgYW4gZXhjZXB0aW9uLlxuICAgIC8vICAgalF1ZXJ5IGFsd2F5cyBleHBvcnRzIHRvIGdsb2JhbCBzY29wZSwgdW5sZXNzIGpRdWVyeS5ub0NvbmZsaWN0KHRydWUpIGlzIHVzZWQsXG4gICAgLy8gICBhbmQgd2Ugc2hvdWxkIGNhdGNoIHRoYXQuXG4gICAgdmFyICQgPSB3aW5kb3cgJiYgKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvKTtcbiAgICBpZiAodHlwZW9mICQgIT09IFVOREVGX1RZUEUpIHtcbiAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBVQVBhcnNlcigpO1xuICAgICAgICAkLnVhID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAkLnVhLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXIuZ2V0VUEoKTtcbiAgICAgICAgfTtcbiAgICAgICAgJC51YS5zZXQgPSBmdW5jdGlvbiAodWFzdHJpbmcpIHtcbiAgICAgICAgICAgIHBhcnNlci5zZXRVQSh1YXN0cmluZyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VyLmdldFJlc3VsdCgpO1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAkLnVhW3Byb3BdID0gcmVzdWx0W3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzKTtcbiIsImNsYXNzIEFjY2VsZXJhdGlvbntcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgIH1cclxuXHJcbiAgICBzbGVlcChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDFlNzsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQpID4gbWlsbGlzZWNvbmRzKXtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgYmluZEV2ZW50cygpe1xyXG4gICAgICAgIHZhciBib29sZT10cnVlXHJcbiAgICAgICAgaWYoYm9vbGUpIHtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2Vtb3Rpb25cIiwgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcclxuICAgICAgICAgICAgICAgIHZhciB5ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xyXG4gICAgICAgICAgICAgICAgdmFyIHogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7XHJcbiAgICAgICAgICAgICAgICBpZiAoejwzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImplIHRvbWJlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgYm9vbGU9ZmFsc2VcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nXCIpLmlubmVySFRNTCA9IFwiPHVsPjxsaT5YIDogXCIgKyB4ICsgXCI8L2xpPjxsaT5ZIDogXCIgKyB5ICsgXCI8L2xpPjxsaT5aIDogXCIgKyB6ICsgXCI8L2xpPjwvdWw+XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMZSBuYXZpZ2F0ZXVyIG5lIHN1cHBvcnRlIHBhcyBsJ8OpdsOpbmVtZW50IGRldmljZW1vdGlvblxyXG4gICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vQ2h1dGU/XHJcbiAgICBjaHV0ZV9ib29sKCl7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjZWxlcmF0aW9uOyIsIlxyXG5jbGFzcyBOZXdze1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLiRidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbk5ld3NcIik7XHJcbiAgICAgICAgdGhpcy4kdGV4dGJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0Qm94TmV3cycpO1xyXG4gICAgICAgIHRoaXMubmV3cyA9XCJcIjtcclxuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgYmluZEV2ZW50cygpe1xyXG4gICAgICAgIHRoaXMuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB0aGlzLm5ld3M9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRleHRCb3hOZXdzJykudmFsdWU7XHJcbiAgICAgICAgICAgIHhodHRwLm9wZW4oXCJQT1NUXCIsIFwiaHR0cDovLzUxLjY4Ljg3LjExOS9tZXNzYWdlXCIsIHtcIm1lc3NhZ2VcIjp0aGlzLm5ld3N9KTtcclxuICAgICAgICAgICAgeGh0dHAuc2VuZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmV3czsiLCJcclxuaW1wb3J0IE5ld3MgZnJvbSAnLi9jb21wb25lbnRzL05ld3MnXHJcbmltcG9ydCB7Z2V0QnJvd3Nlcn0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCdcclxuaW1wb3J0IEFjY2VsZXJhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvQWNjZWxlcmF0aW9uJ1xyXG5cclxuXHJcbmNvbnN0IEFwcCA9IHtcclxuICAgIFxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgdGhpcy5yZWFkeS5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlYWR5KCl7XHJcbiAgICAgICAgdGhpcy5pbml0Q29tcG9uZW50cygpO1xyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZ2V0QnJvd3NlcigpKTtcclxuICAgICAgICBuZXcgQWNjZWxlcmF0aW9uICgpO1xyXG4gICAgICAgIG5ldyBOZXdzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGJpbmRFdmVudCgpe1xyXG5cclxuICAgIH0sXHJcbiAgICBcclxuXHJcbiAgICBpbml0Q29tcG9uZW50cygpe1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbn07XHJcblxyXG5BcHAuaW5pdCgpOyIsImltcG9ydCBVQVBhcnNlciBmcm9tICd1YS1wYXJzZXItanMnXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUmV0aW5hKCl7XHJcbiAgcmV0dXJuICgod2luZG93Lm1hdGNoTWVkaWEgJiYgKHdpbmRvdy5tYXRjaE1lZGlhKCdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxOTJkcGkpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAyZHBweCksIG9ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDc1LjZkcGNtKScpLm1hdGNoZXMgfHwgd2luZG93Lm1hdGNoTWVkaWEoJ29ubHkgc2NyZWVuIGFuZCAoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwgb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMiksIG9ubHkgc2NyZWVuIGFuZCAobWluLWRldmljZS1waXhlbC1yYXRpbzogMiknKS5tYXRjaGVzKSkgfHwgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID49IDIpKSAmJiAvKGlQYWR8aVBob25lfGlQb2QpL2cudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSGlnaERlbnNpdHkoKXtcclxuICByZXR1cm4gKCh3aW5kb3cubWF0Y2hNZWRpYSAmJiAod2luZG93Lm1hdGNoTWVkaWEoJ29ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDEyNGRwaSksIG9ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDEuM2RwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiA0OC44ZHBjbSknKS5tYXRjaGVzIHx8IHdpbmRvdy5tYXRjaE1lZGlhKCdvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS4zKSwgb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLjYvMiksIG9ubHkgc2NyZWVuIGFuZCAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjMpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuMyknKS5tYXRjaGVzKSkgfHwgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMS4zKSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlckJyZWFrcG9pbnQod2lkdGggPSA5NjApIHtcclxuICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiBcIit3aWR0aCtcInB4KVwiKS5tYXRjaGVzXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyb3dzZXIoKSB7XHJcbiAgbGV0IHBhcnNlciA9IG5ldyBVQVBhcnNlcigpO1xyXG4gIGxldCByZXN1bHQgPSBwYXJzZXIuZ2V0UmVzdWx0KCk7XHJcbiAgcmV0dXJuIHJlc3VsdC5icm93c2VyLm5hbWVcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE9TKCkge1xyXG4gIGxldCBwYXJzZXIgPSBuZXcgVUFQYXJzZXIoKTtcclxuICBsZXQgcmVzdWx0ID0gcGFyc2VyLmdldE9TKCk7XHJcbiAgcmV0dXJuIHJlc3VsdC5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJylcclxufVxyXG4iXX0=
