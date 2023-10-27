// ==UserScript==
// @name          QuickOpen.uc.js
// @description   QuickOpen 快速打开指定选项
// @author         Runningcheese
// @namespace   https://www.runningcheese.com
// @include        main
// @license         MIT License
// @compatibility  Firefox 73+
// @charset        UTF-8
// @version        v2020.02.03 for 73+ 
// @version        v2019.12.22 for 72+ 
// @version        v2019.12.20 for 71+ 
// @version        v2019.09.23 for 70+ 
// @version        v2019.05.25 for 67+ 
// @version        v2018.12.19 for 64+ 
// @version        v2018.11.12 
// @version        v2018.04.27 
// @version        v2018.04.11 
// @update        v2018-03-18 for 57+
// @version        v2017.04.02 
// @version        v2017.02.05 
// @version        v2016.01.05 
// @homepage    https://www.runningcheese.com/firefox
// ==/UserScript==

//载入脚本
function jsonToDOM(json, doc, nodes) {

    var namespaces = {
        html: 'http://www.w3.org/1999/xhtml',
        xul: 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    };
    var defaultNamespace = namespaces.html;

    function namespace(name) {
        var m = /^(?:(.*):)?(.*)$/.exec(name);        
        return [namespaces[m[1]], m[2]];
    }

    function tag(name, attr) {
        if (Array.isArray(name)) {
            var frag = doc.createDocumentFragment();
            Array.prototype.forEach.call(arguments, function (arg) {
                if (!Array.isArray(arg[0]))
                    frag.appendChild(tag.apply(null, arg));
                else
                    arg.forEach(function (arg) {
                        frag.appendChild(tag.apply(null, arg));
                    });
            });
            return frag;
        }

        var args = Array.prototype.slice.call(arguments, 2);
        var vals = namespace(name);
        var elem = doc.createElementNS(vals[0] || defaultNamespace, vals[1]);

        for (var key in attr) {
            var val = attr[key];
            if (nodes && key == 'id')
                nodes[val] = elem;

            vals = namespace(key);
            if (typeof val == 'function')
                elem.addEventListener(key.replace(/^on/, ''), val, false);
            else
                elem.setAttributeNS(vals[0] || '', vals[1], val);
        }
        args.forEach(function(e) {
            try {
                elem.appendChild(
                                    Object.prototype.toString.call(e) == '[object Array]'
                                    ?
                                        tag.apply(null, e)
                                    :
                                        e instanceof doc.defaultView.Node
                                        ?
                                            e
                                        :
                                            doc.createTextNode(e)
                                );
            } catch (ex) {
                elem.appendChild(doc.createTextNode(ex));
            }
        });
        return elem;
    }
    return tag.apply(null, json);
}


//定义按钮
CustomizableUI.createWidget({
    id: 'QuickOpen',
    defaultArea: CustomizableUI.AREA_NAVBAR,
    label: '快捷工具',
    tooltiptext: '快速打开指定选项',
    onCreated: function(aNode) {
    aNode.setAttribute('type', 'menu');    
        
 //定义菜单      
        var myMenuJson = 
                                ['xul:menupopup', {id: 'QuickOpen_pop', position:'after_end'},
                                //['xul:menuitem', {label: 'Clash.Mini',oncommand: 'RunClashMINI();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcqRVCAAAAGnRSTlMADemyrN/XxCUb8XhcUUc7zqSDcPe7jWc/NHRhkYYAAABzSURBVBjTfc5HDsQgDEBRF3ook2Sq73/Q8QJIsslfWPgJIeC23V5WNE8571/74jNstlA8IHiDZoEJmT5QHQzA9REAXB3Q7FvnYqDDRlVnpNjB63VNX+xQOHHGn4MOGmZO4lf2jgTHryXtpYUIM2lwDefpDwA9BCKhzLlxAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'v2rayN',oncommand: 'Runv2rayN();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcqRVCAAAAGnRSTlMADemyrN/XxCUb8XhcUUc7zqSDcPe7jWc/NHRhkYYAAABzSURBVBjTfc5HDsQgDEBRF3ook2Sq73/Q8QJIsslfWPgJIeC23V5WNE8571/74jNstlA8IHiDZoEJmT5QHQzA9REAXB3Q7FvnYqDDRlVnpNjB63VNX+xQOHHGn4MOGmZO4lf2jgTHryXtpYUIM2lwDefpDwA9BCKhzLlxAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'Motrix',oncommand: 'OpenMotrix();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVR42mNgwAGcnJyOAPF/KD7MQCpA0gzGowYQaQAotNE1YsGHKTXgCCFXNODR3ECsVxqI1gx19mEChjTgSKmHGfCFMtSQBnyxxEBuPGMYAMQ2JGi2RjbgGRFRhws/BxngBWKQofkJSC8A7kTAGZ4aXdgAAAAASUVORK5CYII='}],
					               		//	  ['xul:menuitem', {label: '我的电脑',oncommand: 'QuickOpenMyComputer();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAD1klEQVR42lWUbUxbZRTHn8I2Y2Ji/GrcB90HIrhsQjACk0wzXXAKsoVEE50yPzmXzDkK9La9T29b+k6BsrZpBx10ThBWStv1JbSMAX2DrUMWuw2cSmI0Zpl+MSGU+3J8boWNfTjJc2+e88v//J9zDlKpVEgMjLEE00qk0hksbpfT4DRpntUzNFIoaUSRoGn8DMMwu7buou08MR4faKySaGkKfa51jZ7w3imcsfuXmT6XzWox1lu6mBItg5GSpklgcheXkpySbeBjCFYxJRqFDLWahkab5gGa4gK8P/k3NA8vwdf24D11j9NsMehrCHDXTiCBlOxUUqJVUuiUyTNy/AYHn0zzhY9mYPNoAvi3wgLUjj+EhoEl+NI2eZfpcVmtBl2dRa/Z/VQ5ohKtgkKtxksjTTMALdMC25TghWMxDo5Gef7tGLA1MRAOBAUou/wIqh1LcLJ7fMVxwXH5aQhR8oXBM9J4nUASPNsY5+DYlAANUR7ejXBCbYCFCh/P7/MBuzcIwj73r8B06eAJhBirIZBWw6XvPkxwfPMUR5RwQmOchyMEcjDAQZmPJ8HBqz5WKCffBzy/8IzOyD7xpKhEhj7TeUMNswDNN6DwAQHVBgp8xVUWyicEoWKChf1+AV7zc7D/GkCVhyjRGncqwRK1CqPTMuZ0szW4enh4lSSuQ3kI4PUQ8JVBYCv9m0KlnxWqiIqqCEDN0G+AdQbY8oOAig3ESLQMOVPSPd+0tdeflJt73zMGVqsHVuCgbx3eIIl1MYBDYY47FOW4+uEHAtYbBREiIZ1YbB6FQoEoiiq+v1ajRjqsQAwlRTSjOX7G5PY19oXZmov5zTd9/8JhYv47o7/ztM7EIrlcjmSyTqRUKlGfrX+ve2Cw2myxPEfJZMjY3ftxZC6Vvn3vwcP83Z//zCSTGxbnxfnzvUNjLfap/JH+GcAmCyCb3V47Nj5xNp1ZDKXSN/+ZTy4IqfTiWjQ6ZRvyXunpc7jHnR7vjxORaSG9vAK5+2sQn8sUuk0m5blvz9fpjMZTqKf/wlfeK2OhcOz6xlwmB7k79yGzuAyp1C3ILuTWk8ns7clA2ONwujSEOMhoda5zbe2fyhTKlzSkZEzaHym2yqHk8ucNJsuJQe/I9/GZzF83b+VhNrkAs/NZyGZz8FN+lc9kl9auBiNes9X6Csa0+KLiVJeKxpYSY4sTKfoiAuVyxQtavaHF5Rn+IXAt9sfsXGYjGIo9srs9iS6DWapi1C8XVwfG/0/x9mFrR+xWq9V7CBQpyUt1tEtRR0fnixgzZ9vapGWyzg7yX45EFTv3yX/7b3/eaLgxuQAAAABJRU5ErkJggg=='}], 
                                ['xul:menuseparator', {}],		

                       ['xul:menu', {label:'便携软件' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgoAZwcnI6AsT/0fBhYuUZsEiCMbHyw8QAbIF0hFj5QQDolQ6skfg2JMcCFlfT2QA0L1gPnnQAAH/e4tL0xtUPAAAAAElFTkSuQmCC'},
                                ['xul:menupopup', {},
                                //['xul:menuitem', {label: '收音机',oncommand:'CRadio();',class:'menuitem-iconic', tooltiptext: 'Tabplus.uc.js\n左键：编辑配置',image:'data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAADaUlEQVR42l1Tf2xTVRQ+IUFcMs10NGyyjUWQjAnJamBkxmgyGUYWlZiQQQIhRELVjcnWrm+v78d9r+/19YctwkrX1jKybpBOB8PN0bFpnEOiLrCoMIJE449MG6LRZIMJWLfjvdU1wB8nJ7k557vf+b5zQFEUWAhJVsFvtJZ83LlD+mmg+tzPA5vOjR/fGjrRtu8VSVagnguAQ9JBVUi2B+4GkIkCulPMjQTe2piM7bRN9T97EUfLMD2y9u9UX9XXQ5E6OyHyg62Si9aTTNwDwB4YiEPUwOYwaHbC+8E9u26fefIGflSKeHYFpt4zXwpo1tWc6MowuQ/gfjAVmnkPHDKaymf6yn/HgccRB4rwz0TZlEtpNdlFN2SLWXZIGtgFAxg6C1bgkHVodnih07e3Zv50Mc71UianTDgRea6rgQ9AlnYLbTzosq0ajm7jLnXX9Ex2V58cjbysH3E3mlsokFXwwNWjVWextwDnE4V4q7t4NuyyVIJEaXKCDslwHXcnWXYLh9msRYhDyxCT+Yj9Jvy8fVPkgMMHJ3y7t2JPPs51F+JcfBlOBs1JaOD8MBja3oQjtHFoBeKHpXg9UfHthdjmzk9DtYEvwzXvpuJrLicPvmT3KC2mdLwgPd9pwnSHCWejS29Dm7G/YvaDtdM4VISpRMU3Hd59L9joOAqRHuCZG5Q60yao1Vf4VOvy6VjJb9iRh+nYI3gjlH8Tvuuq+gwHi/H7eOWYKJGcRt4PnwRrtbHgZr8oq0sI1YewMSU36AqfOxN97A+MPYT/RB7GibfNPYD9xfhX78oZr9pS0EhV7QvUvYaJfPQ5bYU83bqsQ9QNv9pUcieSl8ZoDt4MPjr9DnlzDWCfCcfD1R1M5VbaMHV03cVUrOwKJ+oZdxZstlMGcX3XFgwvQQwDnvc83VYvHAa4Fn1q7KR/x25mFQP4JVr+1fXoE9c4uq4LAIQQsEpeuODb0MWafw0sn1RkMZcnBkBE3/tMu27ZIMha5pfT3lcteGwxtmuvm62SL/M7J7shpFrMGAT8wV963iXbC3jZ+G+V2ZVRxReR/4+JzT3qf9748fCqL46ob1QKRFuky7xp3LP+2KDxYpMgO8FB7jompjDb+YUHiThhv3AIwppl/aC79oCmCHk+xVqoESGnQWoDkWhZYVn8C2bQ63gisy46AAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '记事本',oncommand: 'QuickOpenNotedpad();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAACXBIWXMAAB2HAAAdhwGP5fFlAAADuklEQVR42l2UXUybVRjHz8YS77yYJobNZVHvvDDbhXFemHjjTJzGGROXaVzGTFzGEPpBv2j7vqeftLR8lq4MUuSrtCvDqoWWCtiy0bIx02IXVCIzyLBru64FSoChex+fwpidF7+c8379n/95zv+8hFJKdmEpS8xySrQMJQxl99bVMKRRwpAGxIhzrYIlKpbFZ3RvAYrzJx8XLrQMS962UX2pk0ZfuKL59TWHbuS4Xdd4ulX7RblJfUysoc9TfEeNYio5s/3df9UZhuiVLCl1aX4mw2ogXi3s8xngxdF6OBa0wMmJNjgXbF/7zNs8++mA8ZvyS9oylUxJnlRnEZ2CIUfdxqnSH+q5wz4THPKZuIPDpkev+M3cG6PNcDxoBW3cA/HMLLSEeqcqeELyeO2U6LD6RY3y8Mte8/r7QTu8N26DD8et8PGPVvgIOTFmgbcCDXDrzzscrGz80+HrvlrJ3xXA6oWGHWlnrYew0plQD3wS7IJTyOehTvjyWidUTtqBh8wuLcDKgyx4PRYXjy/aEdAoGSLV0Of2eLSrr4/ZuAvXHVB2rQfphbMTO5yb6AZBpB8WUylYzqRh1G3q4gnEZNu+Aat/cFlXUxIwwkm0L4i44OJk/zYVYQTHMhRojI5BPrsGmXQChp1GaxVfQogGG4cizxz53px4KVDPnZ/sA9kNN4imrhThgq/CDpi+Mwf53BrcT90FX7/exhNICTGKFOTCJf3ZN4Mt8C42SnnTDXT6KrA3B3aYHgDpDSc0Rf2QvpeGbHYVxwV0UNtWJZQRoqL02dN+y8KJUCuUT3Zx5uh3UPuTBwxFMNNuCP0eh1wqC9lcHlJ/zYPXUdvME9Zs92B/hbPRfibcAerYINhmfJwlNsQ1x7xQoAEFrTN+WFxKwP10BnLLa5Bc/AUGv1breNVy3AVlIZpKUtNU+05V4HJcOeMGa3wI7LdHuI64H5pi33Jj8zEucy8DD7LoYGUdEn9EYdDOGHjVyp1dKORAhSKY832Srnq5ZKp7vQ4TZ7/t43p/G8etS0IykXq0ms9zuZUNuDsXBlebjOGL2aIoU7qHxYNSyDdr1L6qGGobZmec0HdrZD65lMxubj6Era2/0cEWt4DO+lqFIoGEPn0ad2PNytENbq+6veGUUq86WGcwHghHIpblbCq3sbkFc5EecFj4Ur5YVSTwf6GCK1wWiymVy+WkWiQmeq3qQMBl6ox7Kh/22+TV/KccFP9YHp9OnJcUlla4p1arS6QoyBeKSW+L6HxTHXtUpqDkX2eyneB7ts6iAAAAAElFTkSuQmCC'}],   
                                //['xul:menuitem', {label: 'Dism++',oncommand: 'Dism();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABM0lEQVQ4jbVSsU7DMBSM1LUoflYo6pCBqWsL/wE/gBDt91QI0ZxDFlTWfk4lquBz+QCousCAOtQMDaiFNAoDT7Is2b5757sXBFU18Q2BS1XKnoBepeyJoQkmvlGJC4IgUAnPlbF9AZcCfgjoi32pjO0rw7NKAp1wUIBKl0442AuWxGYCLorHa53YsRheCPgg4Lo4XwjcXSlBZPKOgO9Fp/tdZXZcELxFJu+UK9iSquAud7yBvdq+LzcQtltHgYLt/o8Hm05/SEHDxc1bHgroD7KnSMPFtecgHOXHAq4k4aOAvthX4Sg//prE0LhTAX2Y8OTXJEo2DwWcCviiwKGArwJOJZuHe/+3Y9h3XBxuEuB1ZUQ/K8pm7TIFUTZr1yKo9KBuabi4dfN8JKBvpq6l4eK62E/v8zD10SKdoQAAAABJRU5ErkJggg=='}],
							                	['xul:menuseparator', {}], 
                               ['xul:menuseparator', {}], 
                                ['xul:menuitem', {label: 'Aria2下载',oncommand: 'Openaria2();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVR42mNgwAGcnJyOAPF/KD7MQCpA0gzGowYQaQAotNE1YsGHKTXgCCFXNODR3ECsVxqI1gx19mEChjTgSKmHGfCFMtSQBnyxxEBuPGMYAMQ2JGi2RjbgGRFRhws/BxngBWKQofkJSC8A7kTAGZ4aXdgAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'IDM下载',oncommand: 'OpenIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAADv0lEQVR42lWTa1CUZRTHz+6KSJGlYxLZVN6AQBgwBAMDdkVRhpt0g5BLMOUGlSDXZfd5b/u+LyzLsAUixkCkYjqoYeg4NRClpqON64DiGAwijZMI5kjpJLC7z2nXRoY+nHM+/c45H/4/4DgO5hbLssDxHDAMgV1FRSDLZmht359a99XhHFNdU6CgLwSG6IDleBXHsfB/0Dl5nlMxhAGe45VHOr/Ls163Wq/fGnxwcajvn4bu4Tv8132HBal2Bc/qnQyvnIWdoIJlGCgvJ67tis7uuhMDoyfx2s1OHJo4jX0PbmPjNRsWHEfMMA2N6VnZn+eIwgk/vqqo1DlBWYJDB83q9g7jvm+tJdgzUD9z494lx7jtexzG32jr8DDNOjA1pSZ/YIr2y0vVIlGBIHBKXQWB3c01PiM/MmfHLVm490AWtv2UZz/6qx7777fQv/AgDsz8jMyZWzSh9iFG77zgCEmWUFtQvgvKivWwp7UmYPwCMzGZn4THPsw5zzQkTTWeSqJNPdvokSvpeGzkG9SftWPyF48wqtBKQ99vQ9+oHTRSnToKelKt6h+Rz/1dn4HnCrQtpVz1yuzCaPqZJYzmm9WorU/BRHEQN+pv4PodpzDk3Wbqv7kSXw1KoKFhG/6Eht7PKwbvfzo12fAW7SjRZRYJoiJGo7HHV2ykW1oI1RSX0PB0CYPjZFwTXYmBkTnoH67B1YE++EFuWhNUDIqjXXffsTsG42ifnN5fK5jd1bHZdb5bIzHrSoItcywVt51Pwjf3xWNoWQgNTnnJsSpgCY1YF3xVEmVPEE92XUz8PZZ2PAxw0LE38F5P6kBH/U6S/LZmUm2MpFvOxNDY2+tx7cgq+srNReh91XP6mUMqjKqLuGypt/jDbnPXptSW5kfel5fbcycW24/feQF7rT7YfiLMEca8hiuLX6bLe71wqfVpXLz/Kdv8YsAlOc9NZejTdZIsLgVJKoOSsqPmoMw2XMDG2ZVVL057Vi6c9i5eZvf+5Hm7R64S3d+b53CPcLOBN6BvuF9fRYlubTVvAkIIOBszz2gk8FF+o9Hv9aaZZ/2M6BFUiguDBPRICEX3PIUd1gAqlykwfnv8nqrqqgWCIABhiMqV4sdRZpxRlkQClQYhIC3bJMbEm37YmtjUHaPdfho2A3qFeN39uEibVlNV45SMcUVf+USBWYkYllPyPAtVMguyxIBZFqFUKtywLi30F6dcK2RRdr2smpWP+4+bYyLr8kJlIJy7gbBuegPjxnH8IkutxWUmGIhh/lxrn9S/Cnf97OexlBAAAAAASUVORK5CYII='}],
                               // ['xul:menuitem', {label: 'M3U8下载',oncommand: 'OpenM3U8();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVR42mNgwAGcnJyOAPF/KD7MQCpA0gzGowYQaQAotNE1YsGHKTXgCCFXNODR3ECsVxqI1gx19mEChjTgSKmHGfCFMtSQBnyxxEBuPGMYAMQ2JGi2RjbgGRFRhws/BxngBWKQofkJSC8A7kTAGZ4aXdgAAAAASUVORK5CYII='}],
                               ['xul:menuitem', {label: '绿化IDM',oncommand: 'SetIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                               ['xul:menuitem', {label: '卸载IDM',oncommand: 'UnsetIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '关联记事本',oncommand: 'SetNotePad3();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAACXBIWXMAAB2HAAAdhwGP5fFlAAADuklEQVR42l2UXUybVRjHz8YS77yYJobNZVHvvDDbhXFemHjjTJzGGROXaVzGTFzGEPpBv2j7vqeftLR8lq4MUuSrtCvDqoWWCtiy0bIx02IXVCIzyLBru64FSoChex+fwpidF7+c8379n/95zv+8hFJKdmEpS8xySrQMJQxl99bVMKRRwpAGxIhzrYIlKpbFZ3RvAYrzJx8XLrQMS962UX2pk0ZfuKL59TWHbuS4Xdd4ulX7RblJfUysoc9TfEeNYio5s/3df9UZhuiVLCl1aX4mw2ogXi3s8xngxdF6OBa0wMmJNjgXbF/7zNs8++mA8ZvyS9oylUxJnlRnEZ2CIUfdxqnSH+q5wz4THPKZuIPDpkev+M3cG6PNcDxoBW3cA/HMLLSEeqcqeELyeO2U6LD6RY3y8Mte8/r7QTu8N26DD8et8PGPVvgIOTFmgbcCDXDrzzscrGz80+HrvlrJ3xXA6oWGHWlnrYew0plQD3wS7IJTyOehTvjyWidUTtqBh8wuLcDKgyx4PRYXjy/aEdAoGSLV0Of2eLSrr4/ZuAvXHVB2rQfphbMTO5yb6AZBpB8WUylYzqRh1G3q4gnEZNu+Aat/cFlXUxIwwkm0L4i44OJk/zYVYQTHMhRojI5BPrsGmXQChp1GaxVfQogGG4cizxz53px4KVDPnZ/sA9kNN4imrhThgq/CDpi+Mwf53BrcT90FX7/exhNICTGKFOTCJf3ZN4Mt8C42SnnTDXT6KrA3B3aYHgDpDSc0Rf2QvpeGbHYVxwV0UNtWJZQRoqL02dN+y8KJUCuUT3Zx5uh3UPuTBwxFMNNuCP0eh1wqC9lcHlJ/zYPXUdvME9Zs92B/hbPRfibcAerYINhmfJwlNsQ1x7xQoAEFrTN+WFxKwP10BnLLa5Bc/AUGv1breNVy3AVlIZpKUtNU+05V4HJcOeMGa3wI7LdHuI64H5pi33Jj8zEucy8DD7LoYGUdEn9EYdDOGHjVyp1dKORAhSKY832Srnq5ZKp7vQ4TZ7/t43p/G8etS0IykXq0ms9zuZUNuDsXBlebjOGL2aIoU7qHxYNSyDdr1L6qGGobZmec0HdrZD65lMxubj6Era2/0cEWt4DO+lqFIoGEPn0ad2PNytENbq+6veGUUq86WGcwHghHIpblbCq3sbkFc5EecFj4Ur5YVSTwf6GCK1wWiymVy+WkWiQmeq3qQMBl6ox7Kh/22+TV/KccFP9YHp9OnJcUlla4p1arS6QoyBeKSW+L6HxTHXtUpqDkX2eyneB7ts6iAAAAAElFTkSuQmCC'}],   
                               ]
                               ],


                       ['xul:menu', {label:'代码工具' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAbklEQVQ4je3TXwqAIAzAYe+VsP32pvc/QuQx7KmIAm39eYkGwz3IB24zhCdDRBIwmVn1JDCJSFqhK8gWW6HeZVWN+3Opzayehnr5HqSq8eyAmk/zTvuHPgV59ggYDtDNT1u2UAbKBWgEsrclzZgBLQgC98zNgUMAAAAASUVORK5CYII='},
                                ['xul:menupopup', {},
                                //['xul:menuitem', {label: '图片转Base64',oncommand: 'Runimagebase64();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAnFBMVEUAAAAxMD0wLzwxLz0xMD0zMj8wLz1GRUsuLDs4Nz4zMjwzMj8xMD0wLzsyMUExMDwyMD4zMkEwLzwzMj8xLz4xMD1IRVIuLDopJzU4OEYiIC5KSVYtKzlJSFUzM0QiIS8uLDslJTE1ND4wLz0xMD0mJTM0Mz5SUV0nJjAzMz8wLzw3Nz41Mz44OT4xMD4zM0Cam58wLz0vLjwpKDe/HF1kAAAAMXRSTlMA/vZg0L5YKMplO/zy7ujb1cfEto9GEfnz7ODd09DPz83EwJyUjYqJhXtOQC0rJh0Hv03wpAAAAIlJREFUGNONzscWgjAQheGbEAKEDoK99+7E9383kxwPutN/+S1mLv4o8Im9Iz8wEDJPeiapmoiFBrgAXLcWgn9BjxWoHJQ4XRxMUFrI44JoB0C1mFsQur4f9QbXw/6xtJBmACJdDceDUZzbGzNYeU6BmsTni+pvgSzthsnzitZNsuimE/HETf/dCyS9CMtea5G7AAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '字符串编解码',oncommand: 'Runendecode();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAflBMVEUAAAAxMD0xMD0xMD0zMj0wLzsxMD0xMD0xMEAwLzwxMD0xMD0xMD4yMD0wMD0xMD0yMj0xMDwxMD0xMD0zMj0xMT0xMD0yMD0xMDsyMT0xMD0xMT8xMT40Mz8xMD0yMlgxMD0xMD0xMD0wMTw2Nj43Nj4yMD4xMD0xMT4xMD04F0baAAAAKXRSTlMAY071KO85MuTV0c2pJPvgb19IQD0cGhMP6tnHsJZoX0M2Lsq5uKxZHzMbSowAAACVSURBVBjTjc7HEoMwDARQuWDTTO8JBEjd///BCJjkmuxBhzcjaemPxNiTmDPPmKEu8krO1UKv5yQbBqtpbZ0p6rUjbRl8aJVFgPByihRDiKzPvAt1+EIAEfgn2Y9l6DEMSA8YlI+AwbuNENuKSq4IGdS9wrQdTR8OKYN1ZBtt5la3x9tGioVcaWQpRVEzxJ/a2Kv/zhvUGwyqK6GY3QAAAABJRU5ErkJggg=='}],
                                ['xul:menuitem', {label: '随机密码生成',oncommand: 'Runpassword();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAe1BMVEUAAABWVFwvLjwwMDhOTlg3NUAsKzo5OEQnJjgmJTUyMEgyME09O0ktLDopJzYpKDcyMD0wLzw2NT83NkE1NEExMD44N0AvLjwxLz1XWV1kZWgsKjhOUFUkJDUtLDs+PUgnJjVkZWhXWF0sLDsfHzEwLzwoKDUlJDEqKTgI49aUAAAAJXRSTlMABPG9DND+56ymWlgG7e3z7eXEuKSJhXtuXFlHQy0oJAtISC0tvub8fAAAAJJJREFUGNNtj1cSwyAMBR9gMO691xSw73/CKBP85eyfdkaaFf7CIsG5iBgcXnAmUiZn4LnZt0MMxIP1f0YfCzBNwPvQIEI7Aq0xLTDakIRIGXZljNrBUkGCS4BVxlQMkNwJoOsAJ0TC2Ktvmn5xK6F6IjNEhgcdJbRdtzrP62099BU2f8NmCrvSVVGWhaL0+3N3Pr5OCQQV/39OAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '二维码生成器',oncommand: 'Runqrcode();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAclBMVEUAAAAwLz0xMD0xMD0xMD4zMj0xMD0xMD4xMD4xMD4xMD0vLjwvLjwxMD09PEIwLzw1ND4uLTw8O0EtLDs7OkAwLz02Nj8xMD4xMD4xMD45OD8xMD4zMz43NkA1ND81ND4vLjwxMD0uLTw8O0IxMD0vLjzvAX+ZAAAAJHRSTlMAna3wfv7MxFlUvaOOijX279fKx8W3onlzZF9KO+3Pz62Wii9xSLQeAAAAgklEQVQY043MyRKDIBAEUJpBFlk0cUvMnsD//2IoqPLkwb7Nq+5hR6JS6hZAEJEqkOa1t1K6mFMhsHHQGvmmArF/NZMxfGsI2+J+Ooev96IA+O16QdNyzrEPwuOTJz/3Rp3EHG7M1DypPqUM0HoYWYhbw0lpH+tcQRGRAJYuRcUO5A/zyglWpRBFcQAAAABJRU5ErkJggg=='}],
                                //['xul:menuitem', {label: 'MyHash64',oncommand: 'MyHash64();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEUyMjIAWLH///8pKSmGhobj4+OTk5O9XYJGAAAAL0lEQVQI12MQhAIGAQYwYERisCkzMJgGABksQIaRAnaGEhAgGPgVs0EYmHbBnQEAF6QHVpJlwssAAAAASUVORK5CYII='}],

                                ['xul:menuseparator', {}],		
							                	['xul:menuseparator', {}], 
                                ['xul:menuitem', {label: 'Base64',oncommand: 'Base64();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAADAFBMVEX///8AAAEAAAIAAAAsLC1LS0wODg9GRkcKCgwnJylBQUIoKCkCAgRBQUOJiYpDQ0SCgoJQUFFMTE1iYmJEREWDg4MkJCZkZGViYmNRUVJeXl9YWFlISEkxMTIBAQOWlpe6urq4uLi7u7vKysvGxse5ubq3t7i7u7zExMSTk5Pa2tv///+9vb3Ly8vY2NjU1NTLy8z6+vr7+/uxsbL4+PgRERLw8PD8/PzGxsbOzs/+/v5WVlehoaH9/f3U1NVqamvj4+PJycn09PQkJCVgYGFFRUWmpqdvb3Dq6upsbG3x8fHu7u8ZGRrq6uvr6+swMDIqKiqQkJEuLi+WlpZDQ0XFxcbX19g2Njft7e2zs7OYmJglJSWpqanS0tJXV1dRUVG1tbZdXV6tra3Pz9DKysp0dHWQkJCOjo6Pj4+NjY2NjY6MjIxycnIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5RAC4d5QFh5vKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZAAAAAAAAADYkvgAAwAAAAAAAAADAAeaaAC4BYcFh5vYkugAAAAAAMoAAAAZ9jQ8FgCJd5B3kasAAAAAAAAAAAAAAAAAAAAAAADcAAAZF/NBAyz22HZNABl2QQMAALcAAAAAAADAAABBA2sAYHYAAAAAAAAAAAUAgACAAADAEAAAAAAG9AAAAAAAAAAAAAMAUgC4AFQFh5sAAACbuAAABYcAAAAzMzMzMzMAgzMAAAAAABgAAAB4AAAAGfYAAEAAAADIAAAAGfYAAAAAAAAAAAAAAAAAAAAAAAAxMgAzMwAAAAwAAgCEhvuKAAAAAXRSTlMAQObYZgAAAAFiS0dEKlO+1J4AAAAJcEhZcwAACxMAAAsTAQCanBgAAADVSURBVHjaY2BkZGKGAyZGRgYmJkYWVjZ2Dk4uFlZuRiYmBiYeZl4+fgFBIWERUTFmsAAjl7iEpLCUtIyELKMcEwMzGmCQV1BQVFJWUVVTU9dQUFDQZNDSBgIdXRCpB8T6DAaGRnoiosZGJtqapmbm5hYMluZW1jba2rbadvbCDtpWjgyW2k7OLq5utkbuHp5e2togAW8fXz9/K42AwKBgsApb85DQsHDbiMio6BiwgJV2bFy8DtCChMQkkECyNhTYgskUhtS0tPSMtMy0tLSs7Ky0tBwA0Z0oREwALIsAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'Base64 IMG',oncommand: 'Base64IMG();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAflBMVEUAAAAxMD0xMD0xMD0zMj0wLzsxMD0xMD0xMEAwLzwxMD0xMD0xMD4yMD0wMD0xMD0yMj0xMDwxMD0xMD0zMj0xMT0xMD0yMD0xMDsyMT0xMD0xMT8xMT40Mz8xMD0yMlgxMD0xMD0xMD0wMTw2Nj43Nj4yMD4xMD0xMT4xMD04F0baAAAAKXRSTlMAY071KO85MuTV0c2pJPvgb19IQD0cGhMP6tnHsJZoX0M2Lsq5uKxZHzMbSowAAACVSURBVBjTjc7HEoMwDARQuWDTTO8JBEjd///BCJjkmuxBhzcjaemPxNiTmDPPmKEu8krO1UKv5yQbBqtpbZ0p6rUjbRl8aJVFgPByihRDiKzPvAt1+EIAEfgn2Y9l6DEMSA8YlI+AwbuNENuKSq4IGdS9wrQdTR8OKYN1ZBtt5la3x9tGioVcaWQpRVEzxJ/a2Kv/zhvUGwyqK6GY3QAAAABJRU5ErkJggg=='}],
                               ]
                               ],


/*
                   ['xul:menu', {label:'常用功能' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgoAZwcnI6AsT/0fBhYuUZsEiCMbHyw8QAbIF0hFj5QQDolQ6skfg2JMcCFlfT2QA0L1gPnnQAAH/e4tL0xtUPAAAAAElFTkSuQmCC'},
                               ['xul:menupopup', {},
                               ['xul:menuitem', {label: '管理书签',oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');", class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVQ4jWNgGGzgPxZMkmZSxAnaTAzGsOEomoKjxLj6P5oAKWEwXA04ysDAYMWACFCSDJjFwMDADmWzQ/kkGUAqoI4BMAbZKZEiAAA7FFJDJW1v5AAAAABJRU5ErkJggg=='}],                   
							                 ['xul:menuitem', {label: '清理痕迹',oncommand: 'window.open(\'chrome://browser/content/sanitize.xhtml\', \'Toolkit:SanitizeDialog\', \'chrome,resizable=yes\');',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMAzVQUwp9BDPLTp3dwPDUsGPvn39vHtauPh35sZlxMJB736yg/5R5gAAAAhklEQVQY01WPVxLDMAhEJatb1b07TsL9z5goGmckPoB5DAuL7InKoE1VAkLBlESMsKKD8QzVMDagLpITaB3u/mIPCdJRExg+Eqjgyac1Tli/RRDaap5jcxIv02k9/WoY6J6WNPsmvyGLb92BI4H2HrsbvJWovegyF2a5XrhwpTS2hSW+pNc/dQcGVNn7bGYAAAAASUVORK5CYII='}], 
                               ['xul:menuitem', {label: '打开文件',oncommand: 'BrowserOpenFileWindow();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja3SsQ2AIBCF4b92CHqnYBx2oHECF9LCWXQGem3ORPHAI/qSyxnEjwsRfooHdqW8FdA2n6gZ6AvrpfL5Rg0o5TFd7aRa3QDzhZUmuMYBE5CkOwWpAjMQgU760gok+Rjp6csEE7C1Ak6QBKzyfmwB8owK8gCCAYnyHHJgoP0nGl4OtOUAFiVQKeOOdswAAAAASUVORK5CYII='}],
                               ['xul:menuitem', {label: '隐私浏览',oncommand: 'OpenBrowserWindow({private: true});',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVQ4je3RIUzDQBjF8V9CMotEoTCYufopBBqLx1ZOYiZn0JVIVC0WXTuJm6mqmpmY6Dt2CYIESXjJ9a7/vn7fvTv+hJ6wRocPTNhnfg+fcMCA1/gfsIIjtmgLiC5SfIPrsCZsiz6F58cvNcInbgJKhBHPlXEd3xgPLLGTnPeBh2T7qh7tMz/GI76+VH+p4JBd1NHK+1A16Mzn5iod7n4KXGmVfy4LaALawAVus7s260W+tYn3reHS+Wom8wF1Gbtkn/AW77+iE6SaONczlmqVAAAAAElFTkSuQmCC'}],
                               ['xul:menuitem', {label: '历史记录',oncommand: 'PlacesCommandHook.showPlacesOrganizer("History");',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbXTLVYDMRQF4E9VdANdQA1mXN0sg0VgkcgxyJpqloDCsodYJA5ThRqDQORNG6bJ8HMO95yIebm5k3vfC/+ADe6RMMZKGGJvEdc44oAe61h91I7BaR5+wy6+E65mnC44FyKbUO+K2hNuKj/qgvvFzoD9jHiHh8Zt93JOJyTZZ4kerw2BPs6cMGI1I62ivq0ITHuLAmRrI55x65zRGu8lsWZhwlYO87G49oWFQe7zT3EwC7HWxhaqbeQ8SEsizUEqRf48yhOmx/SCDzntFLVvH9Ov8QntGzLFRkqKRgAAAABJRU5ErkJggg=='}], 
                               ['xul:menuseparator', {}],
                               ['xul:menuitem', {label: '登录信息',oncommand: 'window.openDialog("chrome://passwordmgr/content/passwordManager.xhtml"); ',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4jb3TLW4DMRAF4A9UYTlAQG5QWlZeKYco3b1F2bLCReXZA5TkICHLlhT0Bsta4LFiR1ZUVWqfZI3nz54ZP/NHeMSED6whp7DfxB1GLOixxyZkH/Yx4pp4wwlb7GK/htyF/RRxzbKXCIJ3DKEPkSj0pdXOEV2hr8Vhm9AzemkmFT6lXjPOeCqqmwvfXhpsha+4KeMQhw4hD4XvuqJmBeLWZ6nnEs0KJvUM7ovEGQ+FrzmD61d4wWvsh1jceAUSSTIPztJc8ppdeDC2kqmZ2KmZ2PkBE8t2fvUX/h/fXwk8p3xlsGQAAAAASUVORK5CYII='}], 
                               ['xul:menuitem', {label: '证书管理',oncommand: 'window.openDialog("chrome://pippki/content/certManager.xhtml"); ',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4jb3TLW4DMRAF4A9UYTlAQG5QWlZeKYco3b1F2bLCReXZA5TkICHLlhT0Bsta4LFiR1ZUVWqfZI3nz54ZP/NHeMSED6whp7DfxB1GLOixxyZkH/Yx4pp4wwlb7GK/htyF/RRxzbKXCIJ3DKEPkSj0pdXOEV2hr8Vhm9AzemkmFT6lXjPOeCqqmwvfXhpsha+4KeMQhw4hD4XvuqJmBeLWZ6nnEs0KJvUM7ovEGQ+FrzmD61d4wWvsh1jceAUSSTIPztJc8ppdeDC2kqmZ2KmZ2PkBE8t2fvUX/h/fXwk8p3xlsGQAAAAASUVORK5CYII='}],   
                               ['xul:menuitem', {label: 'Cookies',oncommand: 'window.openDialog("chrome://browser/content/preferences/siteDataSettings.xhtml");',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgoDaQlZU9LCcn9x8XlpWVPYzXAKhCGxxyNnJycv8xJGRkZB7isxUXlpGReYhhOzHexKmOqgbAnIdOE20AjI1OjxpAggEUxwI+QDsDCOVEJHwEpgcAQdpq5UW7wZYAAAAASUVORK5CYII='}],
                               ['xul:menuitem', {label: '故障排除',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:support", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4jbXSIQ4CQQyF4S9ZNwaJ4hZ4FII74LEruQASg0buCbDY1XsFDoBCIUFsSUYAu7DwkknaTPu3My0/1gh7NKhRIn0K2eCMJQ4B6oSkqJZDmrCr8N9qgVsWmHANe4pTF2CJY1StsMuSRrh0AR5VxljHWcXdrE8HooNnb03aj9x3AcYR2GAbCVUAekNgrp3IKgDHbyAPFf+EbIdAJnqM9hWkzmAfq9AuXaldsOG6A+IHLLa/+ULtAAAAAElFTkSuQmCC'}],        
                               ]
                               ],
*/

									  ['xul:menu', {label:'系统工具' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhUlEQVQ4jd2T2w2AIAxFOxKjnDuRjuCGMgIb4A8aYlpTfiVpwuP2poWDmZkBB3CO2CwYrg44JPU5gN1LdnWS2lgUoIz5+TYIdd6BpJYxkFQN2N+lZeNpdZjUheTq3dNdapfUs/t/MbgJW7j9bxKXnjEAJGwhS2J1DPIkBp8p1k0kxoQFugt45yNbKB7xNQAAAABJRU5ErkJggg=='},
                               ['xul:menupopup', {},
                              // ['xul:menuitem', {label: '菜单',oncommand:'addMenu.edit(addMenu.FILE); ',onclick:'if (event.button == 2) { if (event.button == 2) { event.preventDefault(); setTimeout(function(){ addMenu.rebuild(true); }, 10);}}',class:'menuitem-iconic', tooltiptext: 'addmenu.js\n左键：编辑配置\n右键：重载配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAQlBMVEUAAADr6+v8/Pzh4eGSkpJVVVVERERBQUErKyscHBwWFhby8vLT09PPz8+2traxsbGhoaGgoKBtbW1ra2sLCwsKCgqT8ZvFAAAAAXRSTlMAQObYZgAAAD9JREFUGNPFzTcSwCAQxVAtGZzT/a/q8o/H9Kh5pejl/UdLrWWTxNO5K0qeCeyW1BmWKgllW0uQcOS0yzHbfy87/AR9dbQdjwAAAABJRU5ErkJggg=='}],
                              // ['xul:menuitem', {label: '标签页',oncommand:'Tabplusjs();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1g03gsvdkebj20l70dyn11.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', tooltiptext: 'Tabplus.uc.js\n左键：编辑配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVElEQVQ4jc2Ruw0AIAgFr3IFJ3YB13EkhtBGEiuCnxheQgE8DhIgihJQAQG6I2T6kwIq0IDsXJinv2hBNoZXiGjSDaOrFw9gfeDPBbEAlt4CTuNOA8bzPo9tYBnVAAAAAElFTkSuQmCC'}],
                              // ['xul:menuitem', {label: '快捷键',oncommand:'KeyChanger.edit(KeyChanger.file); var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/e6c9d24egy1go3g5p6cjbj21kg0u0k70.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',onclick:'if (event.button == 2) { event.preventDefault(); setTimeout(function(){ KeyChanger.makeKeyset(true); }, 10);}',class:'menuitem-iconic', tooltiptext: 'keychanger.js\n左键：编辑配置\n右键：重载配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAxOqay5EAAAAiSURBVAjXY0ADUqtWrWRQYGBgYlACAgyW1ioIC0xAFKMCABYYBwHv+ZZuAAAAAElFTkSuQmCC'}],
                              // ['xul:menuitem', {label: '鼠标手势',oncommand: 'MouseGesturesjs();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/0081Kckwgy1glqna6ecn6j30zk0k0aeo.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',tooltiptext: 'MouseGestures.uc.js\n左键：编辑配置',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDIYgjAAAAMHRSTlMA6kEK4JpdD/7v2su9q5Z5b05FJyAbFAP208K3r6SAZzsxBtbOxbmxpp6QhWJaWSwB0NSsAAAAm0lEQVQY00WOhw7DIAxEzcreTchuRvf+/7+rQYRY4ux7xtKBrqL3vTZ1wVSdBB9ZL4/gYMAzYgAhgMOl9jNXfz18r1GD/g0GMFKiuk04YUdLBc+w00s+EnLugiZMszuCb4xSzfTHcBnhnA9gq7iiLO0OJqFi+dKC2FEqjpuvfJ2+JFvkwawcrskquhUMIUleZKeYgT1Ob1FC9fgHj9IH8vwTbm8AAAAASUVORK5CYII='}],
                             // ['xul:menuitem', {label: '图标按键',oncommand:'ButtonEventListener();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1g72cvr10wwj20k00f3q5d.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', tooltiptext: 'ButtonEventListener.uc.js\n左键：编辑配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                        //     ['xul:menuseparator', {}],
                              // ['xul:menuitem', {label: '用户偏好',oncommand: 'QuickOpenUserjs();',tooltiptext: 'user.js',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgoCL4TwA3EGMAPrnrhAwhZIA4IUMIGcBAyJD/SDQyxiaG1TJ8LiBKLdUMIBSdtHcBxQbgczp9XECRAaRg6gAArMpGck8h/nAAAAAASUVORK5CYII='}],
                              // ['xul:menuitem', {label: 'about:config',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:config", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:config',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],
                             //  ['xul:menuitem', {label: 'About:About',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:about", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:about',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],  
                              // ['xul:menuitem', {label: '界面设置',oncommand: 'ChromeCSS(); ',tooltiptext: 'chrome.css',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARklEQVQ4jWNgGCxgP5kYDv5D6fkMDAzdUPZhJDlcGMWA1QwMDNcZGBhOMzAwbGdgYHjOwMAwmxQDSAWjBgw/AxrIxIMAAADq9jfGHLxovAAAAABJRU5ErkJggg=='}],  
                              // ['xul:menuitem', {label: '关于FireFox',oncommand: 'openAboutDialog();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFsSURBVDhPjVLNSsNgEEyq4lEURPEphBwMIT8QUpoXCOJT6BvozaN4VEEQb3ryJLUgopfiMxQ8FCkIitimFw91Ju7K15S0FoZvd3b2p5u1rNIvCIKnMAwfQNeMUA1cm7Gyfsz3PG8DwhEBcaxB2spTU1kEoroK8V6qkLbB1ysLoNOeIcxd110hwOUGvzttgjMZ/1veA7z7Je50okCapou+7y9zUdLpUN53vAT3olyb2izL5opCURTtYPSBMeIIglX4TWOhd8IVCxZ8IW/b0g5wPmF/ANcszG2DeyR087CvgC7wohNacDriNNll6nf+nXgdOS3ZS8dC0haInhBdCDarikDrQPcq2h5zdQ+sei+BPt6Jb00OGsZ4ZK04jtfGGjmOs4DAhfydIeyGcYkN8ENJPseU81VT2kg8liI5RyTg6yEdIdGetScbCcVBAW8Cjn3yn+SiOI8ECbfGHdz8Hc6s9hpPkmQJRZ4J2lV5P7lDzT8FaRF5AAAAAElFTkSuQmCC'}],
                              //  ['xul:menuseparator', {}],
                              //  ['xul:menuseparator', {}],
                               // ['xul:menuitem', {label: '音量控制',oncommand: 'QuickOpenVolume();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/0lEQVQ4jc2SsW3DQAxFPcIVUchSI2gED5AiI2gEjaAR0h2pRmrSa4N4A6tJH2QBG+A3VF6Ks4yTpSB20oTAAQcc/uP/5G02/7ZcG1zWoPiVOGtQkGLParu7xY96eia1AwmGFECC4UdHrFaT2pE9SlarUwB7lPFtzBciFryR2DsLPqcuKYAEL64NjhUdK7prwG46D/70NAMnAFZ0cTZ2XAPUrFazt+0agL1tL3dFuBtAiorEevZjvgCQWM+KwIpAHq+uDW4lwnBebUVi/eoGsgYFCQZS7OPArrcw5qR2SF0uapp0/AfWzwCKD/YovxXPYimqGGvu4CZxGunmjn+pLx3DytJm9xPuAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '计算器',oncommand: 'QuickOpenCALC();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABVUlEQVQ4ja2TwUoCURSG7yP0CD1BDCO1KhgoKEJEaCBNoXP+kQoXcSML06whdFnUYmaWuctVCUHkylm2yxcI3bXMlVNtbDNThBpTtvg2l8vHOd/lCiGEYOYqgP5vYOamEEIIItL8ww4zu2EA0AHQJyLtU7CeP9zRa/fNMKQLZmZAkCyVpV5r9MOQLJXlgCBdMDP6VcMNw9AJmLkN4DgM/t3vgr8wTCDvzAUJoAWgaxhG3DCMOIAugFYtv5jZ30wdDBUw88ubHYl7tuo6uViCmeuvtio9SzUBmACkZ0eq75ai+E85OAERaZ6jaMxcZ+Y2EU0S0YS/883z2XT2tji/+tMK4zWobOsn5pYeDRocZddSF7srG0ED/64c2cBzFK1nRR6JSAsa9Cz1/KuB6nqWSiMbOLlYwo9UZ+b2dXFh9qEyNxU0eDqdiV7uLS3/b4MxvrMrhBAfP031D+YuWNIAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '命令行',oncommand: 'QuickOpenCMD();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAWlBMVEUAAAAqaK0qaa4qaa4oZqopZqgrZ6pEREBEREBEREAqaa4qaKwraKwraKoqaa0rZ6gsZ6dLTExLTEuOj49fX16XmJjZ2dlgYGCcnZ3a2tqTlJTl5eXk5OTt7e3IVKOjAAAACnRSTlMAkPyP+/uNAQQFJel8hAAAAGdJREFUGBkFwQEOggAQA7DuIEL8/1NNRARnCwAgyQ5JiyOZHRZucOSJNWkvkNVGqAV8B6FAdJApEDqYeYDA4Jp5IJQBEIrBlt8pFFbMfXqm84IVb/JWYA4IBc4s3S3cwDdhS9oPbEn/sUolL0EdiUMAAAAASUVORK5CYII='}],
                              //  ['xul:menuitem', {label: '放大镜',oncommand: 'QuickOpenMagnify();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdklEQVQ4jc2SsQ3AIAwEbwGK1NmFDdIwE3OxCCOkZYAU+RSRMEFyIuUkN7Z5vwH4IxtQgKYoyk2RgQokICiScnlmcgWWTm1RbeikaJpFUo9J47RsEdTznYB7BfclwvgZGxCfBC4nvY8UgX1WxOJVkdUj4jp84wDU6yD4kZGU+wAAAABJRU5ErkJggg=='}],
                               // ['xul:menuitem', {label: '屏幕键盘',oncommand: 'QuickOpenOSK();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABj0lEQVQ4jbWTUWvaUBiGz3/ZfsBg/2+wmyRYO9YaYzNyQqPRta6gDibC2qKi6VTc5qaVCbb0J0xNjIHy7CJdN4qyTdgHD++5eL/n4nCOEP9jkqbDVos7B867pOnwfDfV2lJwiBDiqRDi8V8vJTJ2WU1LlJT1T6hpSSJjl4WqS8Y31wyvpgyvpoz+wM/e+OYaVZcIJWUxmExwy1UKlRr5So3C2w1ZqeGWq+RKVQaTCUrKigX90SXRMiBpOtxGIbuvsmszaTqsAp/xtym94ehOoFv0vnzlheWyZxfYP3y9kZd2nh0zy2L2nQ+fB78EXv8Tq8AnCpcY2WNuoxAj9yCzx0TLgGAxx5/PaPU+ougWQtUlrW6fjFvkIH+CmT+Jz+6btZnJFTFyRVqdfnyJqi5peB2iMEAelVgFPsFivpYw8JFHJaIwoOF1YoFm2DTbXc6bF5w3LzhreJzW27x/wGm9zVnDu+812100w0Zohpxpho2aljG6RNmAqsv7nmbYPEvs14UQ4snd892GR1v9md/nB80bBOQ8zIfYAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'IE浏览器',oncommand: 'QuickOpenIE();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAARltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltsRltuGA5VuAAAAJnRSTlMA0ZQJ/LeE6LJ2Oi30xG9C9u7ayquMf2dkXlpPKSAQBN2fe1BNFnhg+YwAAACTSURBVBjTdYxFEsMwFEMVx3YMYWiggeK//xH7PYFd30YjGOE/cdGJaTvMrE1UUuf6z94JSYFkxD34zVR0MBZgbiKi8jlkHMiwiPuW5BwKTnQILFELZk2JGlbHjxdyBUz4j04W+FAI4ELUKS8WAF4pZYHMap48cpcnrB6ofNzQiQUv3ojNbtMcjBN6mIqXqpX+Bv8DYOgPfPnW8/wAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'Internet选项',oncommand: 'QuickOpenInetcpl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+0lEQVQ4jbWSUXnDMAyEfwiFEAiFUCYrhEIohDFYGSQMLKcAEgKSwqBhsD24Sewm6V42fZ9eJN9JujP8S7R+RrRGLKTUmugfvwODHxHriXpFdCTad5FiTvDjPjiaEPwAQNTrC0FDqxfEhm2S1KgAuPsJsUc2+TGDUm9Y3xztRvAK0a/V6vlmANFutHqhKIh1iwbF3f1aJ62J1uQEsoD0k+AVdz8RrXmSdIiFedhU2yQoGpDVB4IfZm2KzSbWKVs/z4LlxKUz2QlJxFK05EzPWtBySGHj8iA5sgde2bioO2aiddtgHd//xnKT9eRdcB5Jk+bpjqRv/HrzH8UPMURixhqrlg4AAAAASUVORK5CYII='}],
                               // ['xul:menuitem', {label: '内存控制',oncommand: 'FirefoxMemoryControl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVQ4jWNgGNbgPxQPDgPIMoxmBuA1jBhNowZQIX0MMgAAHXQ5x38zRc4AAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'Hosts编辑',oncommand: 'HostsEdit();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jbWTMWrDQBBFdQQdQUfYUngnZFZdjIstdq3gUilc6QxRoUO4WtK4cpeAEWoUcOEiETb4AGp9i5/GMSFIKzceeLAwy+f/YSYILhWzjqSyR1L204dU9ihYh8H/IjZMiSli1hEl5rWPS68gNjwmUPQxKiCV7UiZxodUtvM6EKzDB2Uf+xCsw/tGIGWaoQFeUabxzMC8ERv28ftnMMKErRjagQlbcd8INF0cVJ5/+6Dp4jAowNnyY7ZdwQe/LN9HBfLdBrPtCmntkNbu+r5JIN9tAABlW2F/7rA/dyjbCgCQ1u42B2VbIa0dsmaNrFkjrR3KtvI7iFlHMpmf6On5y4dM5qe/5/wDY4MxXr1IEisAAAAASUVORK5CYII='}],
                               // ['xul:menuitem', {label: 'Hosts位置',oncommand: 'HostsFolder();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACZJREFUCNdjAAL2BwwsChAEYjM2MPB/YOAQAKG6OgYnJwgCsoFqAaKRB28Dt45/AAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'DnsJumper',oncommand: 'SetDNS();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAUVBMVEUAAAAnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjYnJjaABOg9AAAAGnRSTlMAFvgH4fHde+e3HnXTJRCkmYFdT8GtZDWebMClLZ8AAACfSURBVBjTRY9ZbgMxDEOfbHkZz5aZbC3vf9DGboI8CJLAD4KkY2XKeSrGm5Kk7FI6GFyUwgQ/StojMKteNcOpR1UBS76e4QktlDWnxmYG2P+YbUzuC4STEFGtE8vW31CtC621j3DcX7u6J/bVuhAXRVpbb/y6XyDzzBF3P7p1jBYh9msjWB7BrnosKrzYlcJtNNCdwRwkr1IovLH5W/8P3PAHPWO4fUEAAAAASUVORK5CYII='}],
                               ]
                               ],
                        ['xul:menuseparator', {}],
                              // ['xul:menuitem', {label: '配置文件夹',tooltiptext: 'Profiles', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).launch();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],
                               ['xul:menuitem', {label: '脚本文件夹',tooltiptext: 'Chrome', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).reveal();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],   
                              // ['xul:menuitem', {label: '火狐根目录', tooltiptext: 'Firefox', oncommand: 'QuickOpenApplication();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}], 
                              // ['xul:menuseparator', {}],
                              // ['xul:menuitem', {label: '关于浏览器',oncommand: 'openAboutDialog();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFsSURBVDhPjVLNSsNgEEyq4lEURPEphBwMIT8QUpoXCOJT6BvozaN4VEEQb3ryJLUgopfiMxQ8FCkIitimFw91Ju7K15S0FoZvd3b2p5u1rNIvCIKnMAwfQNeMUA1cm7Gyfsz3PG8DwhEBcaxB2spTU1kEoroK8V6qkLbB1ysLoNOeIcxd110hwOUGvzttgjMZ/1veA7z7Je50okCapou+7y9zUdLpUN53vAT3olyb2izL5opCURTtYPSBMeIIglX4TWOhd8IVCxZ8IW/b0g5wPmF/ANcszG2DeyR087CvgC7wohNacDriNNll6nf+nXgdOS3ZS8dC0haInhBdCDarikDrQPcq2h5zdQ+sei+BPt6Jb00OGsZ4ZK04jtfGGjmOs4DAhfydIeyGcYkN8ENJPseU81VT2kg8liI5RyTg6yEdIdGetScbCcVBAW8Cjn3yn+SiOI8ECbfGHdz8Hc6s9hpPkmQJRZ4J2lV5P7lDzT8FaRF5AAAAAElFTkSuQmCC'}],
							                 ['xul:menuitem', {label: '重启浏览器',oncommand: 'Services.startup.quit(Services.startup.eAttemptQuit | Services.startup.eRestart);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC5SURBVDhPpVNJDsMgDMwHcmryGcRy4DV9Z3sjt+Y/iQfZFSUJdQQSEhqPBzM2w9BYzrkXdovTjHnvN2yVAN+WrLWzJNQCiBG2nFaFABIo+IkxPiACImFvnIHReWXR5VAVq2dCCOFZE4Bx8lpW+cPDLSAaY8ZaABhiUp3KFxWJ35nd1rTswC8BMezfbEh3NHzVK76kLhO72yiDhGGhdk0ySGIssOYgaUeZeEnTrezLrc90Znf5F67asQMTxXivwhMfxAAAAABJRU5ErkJggg=='}],    
                        ]; 

        aNode.appendChild(jsonToDOM(myMenuJson, aNode.ownerDocument, {}));
        aNode.setAttribute('menupopup', 'QuickOpen_pop');
    }
});


//定义图标
var cssStr = '@-moz-document url("chrome://browser/content/browser.xul"), url(chrome://browser/content/browser.xhtml){'
		 + '#QuickOpen .toolbarbutton-icon {'
		 + 'list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbWRIRKDMBREn8NhOoPrDLoqtifgAnG9AUfgAJU9SS2uAoOt6gWqIiqjqlrBMhNChoLozjA/2ewu/yfwRxRAC3jVYmtAD5yBXLXfYj4BndZ71U78KtwAK9NLf7fiV8HLMLY9Bvg1ZgM8gSoKqMSbJXMFOOACZDKOI2TinXQzWB0eI76M9kfpbBzgf7UXwJC4j0+w3iXCjPiUfkI0DHM7htlbhud04pulgLsMJXBQmw/VUl8r3SzgDdTBPpdxDMqDs1r6CeLbh+HZvOoa/QwZcFVN4gv6nzt18jn5zAAAAABJRU5ErkJggg==)'
		 + '}}';
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	sss.loadAndRegisterSheet(ios.newURI("data:text/css;base64," + btoa(cssStr), null, null), sss.USER_SHEET);




//定义函数


function	QuickOpenUserjs() { FileUtils.getFile('ProfD',['user.js']).launch();};
function	Tabplusjs() { FileUtils.getFile('UChrm',['SubScript', 'Tabplus.uc.js']).launch();};
function	ButtonEventListener() { FileUtils.getFile('UChrm',['SubScript', 'ButtonEventListener.uc.js']).launch();};
function	ChromeCSS() { FileUtils.getFile('UChrm',['css', 'chrome.css']).launch();};

function	SetNotePad3() { FileUtils.getFile('UChrm',['Local', 'NotePad3','NotePad3.bat']).launch();};
function	OpenM3U8() { FileUtils.getFile('UChrm',['Local', 'M3U8','M3U8.exe']).launch();};
function	Openaria2() { FileUtils.getFile('UChrm',['Local', 'aria2','aria2.exe']).launch();};
function	OpenMotrix() { FileUtils.getFile('UChrm',['Local','Motrix.exe']).launch();};
function	OpenIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','IDMan.exe']).launch();};
function	SetIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','!绿化.bat']).launch();};
function	UnsetIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','!卸载.bat']).launch();};

function	HostsEdit() { FileUtils.getFile('UChrm',['Local', 'HostsEdit.bat']).launch();};
function	SetDNS() { FileUtils.getFile('UChrm',['Local', 'DnsJumper','DnsJumper.exe']).launch();};
function	CRadio() { FileUtils.getFile('UChrm',['Local', 'CRadio','CRadio.exe']).launch();};
function	Base64() { FileUtils.getFile('UChrm',['Local', 'Sunbox_tool','Base64.exe']).launch();};
function	Base64IMG() { FileUtils.getFile('UChrm',['Local', 'Sunbox_tool','Base64IMG.exe']).launch();};
function	Dism() { FileUtils.getFile('UChrm',['Local', 'Sunbox_tool','Dism++.exe']).launch();};
function	MyHash64() { FileUtils.getFile('UChrm',['Local', 'Sunbox_tool','MyHash.exe']).launch();};


function	RunClashforWindows() { FileUtils.getFile('UChrm',['Local', 'Clash.for.Windows','Clash for Windows.exe']).launch();};
function	RunClashMINI() { FileUtils.getFile('UChrm',['Local', 'Clash.Mini','Clash.Mini.exe']).launch();};
function	Runv2rayN() { FileUtils.getFile('UChrm',['Local', 'v2rayN','v2rayN.exe']).launch();};




function Runimagebase64() {FileUtils.getFile('UChrm',['Local','Sunbox_tool','image-base64', 'index.html']).launch();}
function Runendecode() {FileUtils.getFile('UChrm',['Local','Sunbox_tool','en-decode', 'index.html']).launch();}
function Runpassword() {FileUtils.getFile('UChrm',['Local','Sunbox_tool','password', 'index.html']).launch();}
function Runqrcode() {FileUtils.getFile('UChrm',['Local','Sunbox_tool','qr-code', 'index.html']).launch();}

function	KillFirefoxProcessbat() { FileUtils.getFile('UChrm',['Local', 'Updates', 'KillFirefoxProcess.bat']).launch();};
function	KillUtilityProcessbat() { FileUtils.getFile('UChrm',['Local', 'Updates', 'KillUtilityProcess.bat']).launch();};
function	FirefoxMemoryControl(){ FileUtils.getFile('UChrm',['Local', 'Firemin', 'Firemin.exe']).launch();};



function	QuickOpenApplication() { 
var path ="..\\..\\..\\..\\";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).path));file.launch();
};


function	HostsFolder() {
var path ="..\\..\\System32\\drivers\\etc";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
 };


 function QuickOpenMyComputer() {
				var path ="..\\..\\explorer.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenVolume() {
				var path ="..\\sndvol.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};

 function QuickOpenTaskMGR() {
				var path ="..\\taskmgr.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenIE() {
				var path ="..\\..\\..\\Program Files\\Internet Explorer\\iexplore.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenNotedpad() {
				var path ="..\\notepad.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenInetcpl() {
				var path ="..\\inetcpl.cpl";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenCALC() {
				var path ="..\\calc.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenCMD() {
				var path ="..\\cmd.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenOSK() {
				var path ="..\\osk.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function QuickOpenMagnify() {
				var path ="..\\magnify.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));file.launch();
};


 function OpenProfilesManage() {
				var path ="..\\..\\..\\Firefox Profiles.lnk";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).path));file.launch();
};










