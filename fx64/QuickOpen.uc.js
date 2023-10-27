// ==UserScript==
// @name          QuickOpen.uc.js
// @description   QuickOpen 快速打开指定选项
// @author         Runningcheese
// @namespace   https://www.runningcheese.com
// @include        main
// @license         MIT License
// @compatibility  Firefox 64+
// @charset        UTF-8
// @version        v2018.12.19 for 64+ 
// @version        v2018.11.12 
// @version        v2018.04.27 
// @version        v2018.04.11 
// @update        v2018-03-18 for 57+
// @version        v2017.04.02 
// @version        v2017.02.05 
// @version        v2016.01.05 
// @homepage    https://www.runningcheese.com/firefox-v10
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
            Array.forEach(arguments, function (arg) {
                if (!Array.isArray(arg[0]))
                    frag.appendChild(tag.apply(null, arg));
                else
                    arg.forEach(function (arg) {
                        frag.appendChild(tag.apply(null, arg));
                    });
            });
            return frag;
        }

        var args = Array.slice(arguments, 2);
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
                                ['xul:menuitem', {label: 'v2rayN',oncommand: 'Runv2rayN();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcqRVCAAAAGnRSTlMADemyrN/XxCUb8XhcUUc7zqSDcPe7jWc/NHRhkYYAAABzSURBVBjTfc5HDsQgDEBRF3ook2Sq73/Q8QJIsslfWPgJIeC23V5WNE8571/74jNstlA8IHiDZoEJmT5QHQzA9REAXB3Q7FvnYqDDRlVnpNjB63VNX+xQOHHGn4MOGmZO4lf2jgTHryXtpYUIM2lwDefpDwA9BCKhzLlxAAAAAElFTkSuQmCC'}],
                              //['xul:menuitem', {label: '我的电脑',oncommand: 'QuickOpenMyComputer();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAApElEQVQ4jcWTIQ7CYAyF/0vgOQH6T/p9DskNCJ5wAySWC3CDSSQnwHCB+XkQc7ghRlAbWcIymlS99jXt60tpilBnagCbiDgAhXoDHp+inPMcWEbEVj0C55RSAmq16csEXNRnJ9hO721Wm6SWveAkBED1X4IxNL7/ukKvzkNV6PyBSQm+XngIwQJYATtbDxTAFahGkTHnPFcjItYRsVdPb/+UQP0CUEY7Z3H6hLEAAAAASUVORK5CYII='}], 
                                ['xul:menuseparator', {}],
                                ['xul:menuitem', {label: 'Clash.MINI',oncommand: 'RunClashMINI();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAUVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcqRVCAAAAGnRSTlMADemyrN/XxCUb8XhcUUc7zqSDcPe7jWc/NHRhkYYAAABzSURBVBjTfc5HDsQgDEBRF3ook2Sq73/Q8QJIsslfWPgJIeC23V5WNE8571/74jNstlA8IHiDZoEJmT5QHQzA9REAXB3Q7FvnYqDDRlVnpNjB63VNX+xQOHHGn4MOGmZO4lf2jgTHryXtpYUIM2lwDefpDwA9BCKhzLlxAAAAAElFTkSuQmCC'}],
                       ['xul:menu', {label:'自用软件' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAkElEQVQ4jbWTXQ2AMAyEvzc0TAIWEIIWTMwBBhCBNni5Cw2MwPhp0mT9u7a3DX6UAVikw92iHphCcSs1yKSc02InjkAXYp18Bi6CuPOVeJJiYNS5ATIbB1k+wiSH4iWMndUlSWf5vM6BWBMW7RTsJJ+l3dnvAUorzDUrGOQxifDBNb5+SAZ5/JRLo1Z/pmpZAR6aP0H2Y7uIAAAAAElFTkSuQmCC'},
                                ['xul:menupopup', {},
                                ['xul:menuitem', {label: '收音机',oncommand:'CRadio();',class:'menuitem-iconic', tooltiptext: 'Tabplus.uc.js\n左键：编辑配置',image:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNi4wNDggMTIuODQ2IEMgNi41NjcgMTIuODQ2IDYuOTg5IDEyLjU2NSA3LjIxNSAxMi4xNzIgQyA3LjQ0MiAxMS43NzkgNy40NzUgMTEuMjczIDcuMjE1IDEwLjgyNCBDIDcuMDk0IDEwLjYxNSA2LjkyMyAxMC40NDcgNi43MjEgMTAuMzMxIEMgNi41MiAxMC4yMTQgNi4yODggMTAuMTUgNi4wNDggMTAuMTUgQyA1LjUyOSAxMC4xNSA1LjEwNyAxMC40MzEgNC44OCAxMC44MjQgQyA0LjY1MyAxMS4yMTggNC42MiAxMS43MjMgNC44OCAxMi4xNzIgQyA1IDEyLjM4MSA1LjE3MiAxMi41NDkgNS4zNzQgMTIuNjY1IEMgNS41NzUgMTIuNzgyIDUuODA3IDEyLjg0NiA2LjA0OCAxMi44NDYgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gMTEuNDQgMTEuNDk4IEMgMTEuNDQgMTIuMDE3IDExLjE1OSAxMi40MzkgMTAuNzY2IDEyLjY2NiBDIDEwLjM3MyAxMi44OTMgOS44NjggMTIuOTI2IDkuNDE4IDEyLjY2NiBDIDkuMjA5IDEyLjU0NiA5LjA0MSAxMi4zNzQgOC45MjUgMTIuMTcyIEMgOC44MDggMTEuOTcxIDguNzQ0IDExLjczOSA4Ljc0NCAxMS40OTggQyA4Ljc0NCAxMC45OCA5LjAyNSAxMC41NTggOS40MTggMTAuMzMxIEMgOS44MTEgMTAuMTA0IDEwLjMxNyAxMC4wNzIgMTAuNzY2IDEwLjMzMSBDIDEwLjk3NSAxMC40NTIgMTEuMTQzIDEwLjYyMyAxMS4yNTkgMTAuODI1IEMgMTEuMzc2IDExLjAyNiAxMS40NCAxMS4yNTggMTEuNDQgMTEuNDk4IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDE0LjEzNiAxMi44NDYgQyAxNC42NTUgMTIuODQ2IDE1LjA3NyAxMi41NjUgMTUuMzA0IDEyLjE3MiBDIDE1LjUzMSAxMS43NzkgMTUuNTY0IDExLjI3MyAxNS4zMDQgMTAuODI0IEMgMTUuMTg0IDEwLjYxNSAxNS4wMTIgMTAuNDQ3IDE0LjgxIDEwLjMzMSBDIDE0LjYwOSAxMC4yMTQgMTQuMzc3IDEwLjE1IDE0LjEzNiAxMC4xNSBDIDEzLjYxNyAxMC4xNSAxMy4xOTYgMTAuNDMxIDEyLjk2OSAxMC44MjQgQyAxMi43NDIgMTEuMjE4IDEyLjcxIDExLjcyMyAxMi45NjkgMTIuMTcyIEMgMTMuMDkgMTIuMzgxIDEzLjI2MSAxMi41NDkgMTMuNDYzIDEyLjY2NSBDIDEzLjY2NCAxMi43ODIgMTMuODk2IDEyLjg0NiAxNC4xMzYgMTIuODQ2IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDAuNjU1IDQuMDg0IEMgMC42NTUgMy4xNTQgMS4wMzIgMi4zMTEgMS42NDIgMS43MDEgQyAyLjI1MiAxLjA5MSAzLjA5NSAwLjcxNCA0LjAyNiAwLjcxNCBMIDEwLjA5MiAwLjcxNCBMIDE2LjE1OCAwLjcxNCBDIDE3LjA4OSAwLjcxNCAxNy45MzEgMS4wOTEgMTguNTQxIDEuNzAxIEMgMTkuMTUxIDIuMzExIDE5LjUyOCAzLjE1NCAxOS41MjggNC4wODQgTCAxOS41MjggMTAuMTUxIEwgMTkuNTI4IDE2LjIxNyBDIDE5LjUyOCAxNy4xNDggMTkuMTUxIDE3Ljk5IDE4LjU0MSAxOC42IEMgMTcuOTMyIDE5LjIxIDE3LjA4OSAxOS41ODcgMTYuMTU4IDE5LjU4NyBMIDEwLjA5MiAxOS41ODcgTCA0LjAyNiAxOS41ODcgQyAzLjA5NSAxOS41ODcgMi4yNTIgMTkuMjEgMS42NDIgMTguNiBDIDEuMDMyIDE3Ljk5IDAuNjU1IDE3LjE0OCAwLjY1NSAxNi4yMTcgTCAwLjY1NSAxMC4xNTEgWiBNIDQuMDI2IDIuMDYyIEMgMy40NjggMi4wNjIgMi45NjIgMi4yODggMi41OTYgMi42NTQgQyAyLjIzIDMuMDIgMi4wMDQgMy41MjYgMi4wMDQgNC4wODQgTCAyLjAwNCAxMC4xNTEgTCAyLjAwNCAxNi4yMTcgQyAyLjAwNCAxNi43NzUgMi4yMyAxNy4yODEgMi41OTYgMTcuNjQ3IEMgMi45NjIgMTguMDEzIDMuNDY4IDE4LjIzOSA0LjAyNiAxOC4yMzkgTCAxMC4wOTIgMTguMjM5IEwgMTYuMTU4IDE4LjIzOSBDIDE2LjcxNyAxOC4yMzkgMTcuMjIyIDE4LjAxMyAxNy41ODggMTcuNjQ3IEMgMTcuOTU0IDE3LjI4MSAxOC4xOCAxNi43NzUgMTguMTggMTYuMjE3IEwgMTguMTggMTEuMTYxIEwgMTguMTggNi4xMDYgTCAxMy43OTkgNi4xMDYgTCA5LjQxOCA2LjEwNiBDIDguODU5IDYuMTA2IDguMzU0IDUuODggNy45ODggNS41MTQgQyA3LjYyMiA1LjE0OCA3LjM5NiA0LjY0MiA3LjM5NiA0LjA4NCBMIDcuMzk2IDMuMDczIEwgNy4zOTYgMi4wNjIgTCA1LjcxMSAyLjA2MiBaIE0gMTguMTggNC4wODQgQyAxOC4xOCAzLjUyNiAxNy45NTQgMy4wMiAxNy41ODggMi42NTQgQyAxNy4yMjIgMi4yODggMTYuNzE3IDIuMDYyIDE2LjE1OCAyLjA2MiBMIDEyLjQ1MSAyLjA2MiBMIDguNzQ0IDIuMDYyIEwgOC43NDQgMy4wNzMgTCA4Ljc0NCA0LjA4NCBDIDguNzQ0IDQuMjcgOC44MiA0LjQzOSA4Ljk0MiA0LjU2MSBDIDkuMDY0IDQuNjgzIDkuMjMyIDQuNzU4IDkuNDE4IDQuNzU4IEwgMTMuNzk5IDQuNzU4IEwgMTguMTggNC43NTggTCAxOC4xOCA0LjQyMSBaIiBzdHlsZT0iIi8+Cjwvc3ZnPg=='}],
                                ['xul:menuitem', {label: '记事本',oncommand: 'QuickOpenNotedpad();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII='}],   
                                ['xul:menuitem', {label: 'Notepad++',oncommand: 'Opennotepad();',class:'menuitem-iconic', image:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9Ii1tcy10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpOyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGZpbGw9Im5vbmUiIHRyYW5zZm9ybT0ibWF0cml4KDAuODI0OTY0LCAwLCAwLCAwLjgyNDk2NCwgLTEuMTc0ODUsIC0xLjM2NjI1KSIgc3R5bGU9IiI+CiAgICA8cGF0aCBkPSJNOCAxMC4yNWEuNzUuNzUgMCAwIDEgLjc1LS43NWgxMGEuNzUuNzUgMCAwIDEgMCAxLjVoLTEwYS43NS43NSAwIDAgMS0uNzUtLjc1eiIgZmlsbD0iIzAwMDAwMCIvPgogICAgPHBhdGggZD0iTTggMTQuNzVhLjc1Ljc1IDAgMCAxIC43NS0uNzVoMTBhLjc1Ljc1IDAgMCAxIDAgMS41aC0xMGEuNzUuNzUgMCAwIDEtLjc1LS43NXoiIGZpbGw9IiMwMDAwMDAiLz4KICAgIDxwYXRoIGQ9Ik04Ljc1IDE4LjVhLjc1Ljc1IDAgMCAwIDAgMS41aDQuNWEuNzUuNzUgMCAwIDAgMC0xLjVoLTQuNXoiIGZpbGw9IiMwMDAwMDAiLz4KICAgIDxwYXRoIGQ9Ik0xNCAyYS43NS43NSAwIDAgMSAuNzUuNzVWNGgzLjc1VjIuNzVhLjc1Ljc1IDAgMCAxIDEuNSAwVjRoLjc1QTIuMjUgMi4yNSAwIDAgMSAyMyA2LjI1djEyLjk5NmEuNzUuNzUgMCAwIDEtLjIyLjUzbC01LjUwNCA1LjUwNGEuNzUuNzUgMCAwIDEtLjUzLjIySDYuNzVhMi4yNSAyLjI1IDAgMCAxLTIuMjUtMi4yNXYtMTdBMi4yNSAyLjI1IDAgMCAxIDYuNzUgNEg4VjIuNzVhLjc1Ljc1IDAgMCAxIDEuNSAwVjRoMy43NVYyLjc1QS43NS43NSAwIDAgMSAxNCAyek02IDYuMjV2MTdjMCAuNDE0LjMzNi43NS43NS43NWg5LjI0NnYtMy4yNTRhMi4yNSAyLjI1IDAgMCAxIDIuMjUtMi4yNUgyMS41VjYuMjVhLjc1Ljc1IDAgMCAwLS43NS0uNzVoLTE0YS43NS43NSAwIDAgMC0uNzUuNzV6bTEyLjI0NiAxMy43NDZhLjc1Ljc1IDAgMCAwLS43NS43NXYyLjE5M2wyLjk0My0yLjk0M2gtMi4xOTN6IiBmaWxsPSIjMDAwMDAwIi8+CiAgPC9nPgo8L3N2Zz4='}],   
                                ['xul:menuseparator', {}],		
                                ['xul:menuitem', {label: 'Aria2下载',oncommand: 'Openaria2();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'IDM下载',oncommand: 'OpenIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'M3U8下载',oncommand: 'OpenM3U8();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
							                	['xul:menuseparator', {}], 
                                ['xul:menuitem', {label: '绿化IDM',oncommand: 'SetIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '卸载IDM',oncommand: 'UnsetIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '备份IDM',oncommand: 'BackupIDM();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '关联记事本',oncommand: 'SetNotepad2();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII='}],   
                               ]
                               ],

                              //  ['xul:menu', {label:'常用功能' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzUlEQVQ4jaXSIU7EQBSA4S8j+sIFVpD0HIi9wC6CM+0FMFUILA7DDRAIVB0KheoFMKuK2OlmSLZTGl4ymWTe+/95M3lUIqV0SCkdajVVuGmaD/SrJQW8yWtRsouIISLGiBgLeIoN+ikfEQN252w+2K5ocpuZs2CcKbxChx53ZeIXUxF0OOIFDW7XCnq84QnPeF8jaDFkyWvupPuroMUnvgrJvdOfLAomeMh7e+ltNcEjvmvwkuAGD7iegy8J/jdI2JejvLScPne/4sL5+AHddkk+mzKKaQAAAABJRU5ErkJggg=='},
                              //  ['xul:menupopup', {},
                              //  ['xul:menuitem', {label: '管理书签',oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');", class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVQ4jWNgGGzgPxZMkmZSxAnaTAzGsOEomoKjxLj6P5oAKWEwXA04ysDAYMWACFCSDJjFwMDADmWzQ/kkGUAqoI4BMAbZKZEiAAA7FFJDJW1v5AAAAABJRU5ErkJggg=='}],                   
				             			   //  ['xul:menuitem', {label: '清理痕迹',oncommand: 'window.open(\'chrome://browser/content/sanitize.xul\', \'Toolkit:SanitizeDialog\', \'chrome,resizable=yes\');',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMAzVQUwp9BDPLTp3dwPDUsGPvn39vHtauPh35sZlxMJB736yg/5R5gAAAAhklEQVQY01WPVxLDMAhEJatb1b07TsL9z5goGmckPoB5DAuL7InKoE1VAkLBlESMsKKD8QzVMDagLpITaB3u/mIPCdJRExg+Eqjgyac1Tli/RRDaap5jcxIv02k9/WoY6J6WNPsmvyGLb92BI4H2HrsbvJWovegyF2a5XrhwpTS2hSW+pNc/dQcGVNn7bGYAAAAASUVORK5CYII='}], 
                              //  ['xul:menuitem', {label: '打开文件',oncommand: 'BrowserOpenFileWindow();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja3SsQ2AIBCF4b92CHqnYBx2oHECF9LCWXQGem3ORPHAI/qSyxnEjwsRfooHdqW8FdA2n6gZ6AvrpfL5Rg0o5TFd7aRa3QDzhZUmuMYBE5CkOwWpAjMQgU760gok+Rjp6csEE7C1Ak6QBKzyfmwB8owK8gCCAYnyHHJgoP0nGl4OtOUAFiVQKeOOdswAAAAASUVORK5CYII='}],
                              //  ['xul:menuitem', {label: '隐私浏览',oncommand: 'OpenBrowserWindow({private: true});',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVQ4je3RIUzDQBjF8V9CMotEoTCYufopBBqLx1ZOYiZn0JVIVC0WXTuJm6mqmpmY6Dt2CYIESXjJ9a7/vn7fvTv+hJ6wRocPTNhnfg+fcMCA1/gfsIIjtmgLiC5SfIPrsCZsiz6F58cvNcInbgJKhBHPlXEd3xgPLLGTnPeBh2T7qh7tMz/GI76+VH+p4JBd1NHK+1A16Mzn5iod7n4KXGmVfy4LaALawAVus7s260W+tYn3reHS+Wom8wF1Gbtkn/AW77+iE6SaONczlmqVAAAAAElFTkSuQmCC'}],
                              //  ['xul:menuitem', {label: '历史记录',oncommand: 'PlacesCommandHook.showPlacesOrganizer("History");',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbXTLVYDMRQF4E9VdANdQA1mXN0sg0VgkcgxyJpqloDCsodYJA5ThRqDQORNG6bJ8HMO95yIebm5k3vfC/+ADe6RMMZKGGJvEdc44oAe61h91I7BaR5+wy6+E65mnC44FyKbUO+K2hNuKj/qgvvFzoD9jHiHh8Zt93JOJyTZZ4kerw2BPs6cMGI1I62ivq0ITHuLAmRrI55x65zRGu8lsWZhwlYO87G49oWFQe7zT3EwC7HWxhaqbeQ8SEsizUEqRf48yhOmx/SCDzntFLVvH9Ov8QntGzLFRkqKRgAAAABJRU5ErkJggg=='}], 
                              //['xul:menuseparator', {}],
                               //['xul:menuitem', {label: '登录信息',oncommand: 'window.openDialog("chrome://passwordmgr/content/passwordManager.xul"); ',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4jb3TLW4DMRAF4A9UYTlAQG5QWlZeKYco3b1F2bLCReXZA5TkICHLlhT0Bsta4LFiR1ZUVWqfZI3nz54ZP/NHeMSED6whp7DfxB1GLOixxyZkH/Yx4pp4wwlb7GK/htyF/RRxzbKXCIJ3DKEPkSj0pdXOEV2hr8Vhm9AzemkmFT6lXjPOeCqqmwvfXhpsha+4KeMQhw4hD4XvuqJmBeLWZ6nnEs0KJvUM7ovEGQ+FrzmD61d4wWvsh1jceAUSSTIPztJc8ppdeDC2kqmZ2KmZ2PkBE8t2fvUX/h/fXwk8p3xlsGQAAAAASUVORK5CYII='}], 
                               //['xul:menuitem', {label: '证书管理',oncommand: 'window.openDialog("chrome://pippki/content/certManager.xul"); ',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4jb3TLW4DMRAF4A9UYTlAQG5QWlZeKYco3b1F2bLCReXZA5TkICHLlhT0Bsta4LFiR1ZUVWqfZI3nz54ZP/NHeMSED6whp7DfxB1GLOixxyZkH/Yx4pp4wwlb7GK/htyF/RRxzbKXCIJ3DKEPkSj0pdXOEV2hr8Vhm9AzemkmFT6lXjPOeCqqmwvfXhpsha+4KeMQhw4hD4XvuqJmBeLWZ6nnEs0KJvUM7ovEGQ+FrzmD61d4wWvsh1jceAUSSTIPztJc8ppdeDC2kqmZ2KmZ2PkBE8t2fvUX/h/fXwk8p3xlsGQAAAAASUVORK5CYII='}],   
                               //['xul:menuitem', {label: 'Cookies',oncommand: 'window.openDialog("chrome://browser/content/preferences/cookies.xul");',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgoDaQlZU9LCcn9x8XlpWVPYzXAKhCGxxyNnJycv8xJGRkZB7isxUXlpGReYhhOzHexKmOqgbAnIdOE20AjI1OjxpAggEUxwI+QDsDCOVEJHwEpgcAQdpq5UW7wZYAAAAASUVORK5CYII='}],
                               // ['xul:menuitem', {label: '故障排除',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:support", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4jbXSIQ4CQQyF4S9ZNwaJ4hZ4FII74LEruQASg0buCbDY1XsFDoBCIUFsSUYAu7DwkknaTPu3My0/1gh7NKhRIn0K2eCMJQ4B6oSkqJZDmrCr8N9qgVsWmHANe4pTF2CJY1StsMuSRrh0AR5VxljHWcXdrE8HooNnb03aj9x3AcYR2GAbCVUAekNgrp3IKgDHbyAPFf+EbIdAJnqM9hWkzmAfq9AuXaldsOG6A+IHLLa/+ULtAAAAAElFTkSuQmCC'}],           
                             //  ]
                             //  ],


                                //['xul:menu', {label:'系统工具' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABM0lEQVQ4jaWSMUvDUBDH/17lndKIvCpNwFTB0qTUtghNFpMOgsTuDgEnB+nYyQ/QDyEurg79EqKLo906+QE6uLvGoWnM0/pK6R9uuHf3/73jOEAjIhoS0VDXozcLngAYrwzJmctpLIX0hBBTZk6YOcmZ5yoDGM/rQogpgF5WTR+CFYYMUs9MzJwoZWk9kOAJtow3hFcXiwiKR0nqZxGAJItKowvb6WOndAfHj7F3cKMH2E4fhhyBt19Qsp7RjooKcHf/VQ8wq01Yxz7MahPtqIjT80ABzPJ/AK7nAvjKml3PRSuUcD0XlUYXh/WOfgeGHP38tvGJVihJ8ATSfIIh73F0cqsH2LUB7NoAVHiE48dw/FgZP12gfgd5dS6vQZvvoMJHOh0t9Kx9SPh1ysvizymvo2/tuWGnVFMwTgAAAABJRU5ErkJggg=='},
                                //['xul:menupopup', {},
                                //['xul:menuitem', {label: '音量控制',oncommand: 'QuickOpenVolume();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVQ4jWNgoCFQZmBg+E+pZlwG4DUcJolNEbLByoQ0MyAZgFfjfzSsjCbHgEUcwwBy5EgyAN2VKAGMbAC6M4l2AUVhgAzIigV8hpCcDrApxCdPlEsGOQAAKY8zgtP7s6EAAAAASUVORK5CYII='}],
                                //['xul:menuitem', {label: '记事本',oncommand: 'QuickOpenNotedpad();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4jWNgoCL4TwA3EGMAPrnrhAwhZIA4IUMIGcBAyBBCBqBjkgwgSu2oAcPGAFIwdQAA7bk0hAgVKwIAAAAASUVORK5CYII='}],
                                //['xul:menuitem', {label: '计算器',oncommand: 'QuickOpenCALC();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATklEQVQ4jWNgoCJYw8DA8J8IvAaXAf8ZGBhYCVjCClWH0wAYjQsjq8NrADny1HMBIUCUAbjYJBmA7iWSDMAHhrsXmAloZsZnAMWZiSwAAJGrSHtJfnvHAAAAAElFTkSuQmCC'}],
                                //['xul:menuitem', {label: '命令行',oncommand: 'QuickOpenCMD();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATklEQVQ4jWNgoBL4TwGGG0CuxbQxQI4SAxQZGBheMzAw2FHiAjuoIWHkGsDAwMCQBxXH5xLauECBATMMMOKdkAsoigVSwCAzgKLMRDYAAKIZQECvdVKSAAAAAElFTkSuQmCC'}],
                                //['xul:menuitem', {label: '放大镜',oncommand: 'QuickOpenMagnify();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdklEQVQ4jc2SsQ3AIAwEbwGK1NmFDdIwE3OxCCOkZYAU+RSRMEFyIuUkN7Z5vwH4IxtQgKYoyk2RgQokICiScnlmcgWWTm1RbeikaJpFUo9J47RsEdTznYB7BfclwvgZGxCfBC4nvY8UgX1WxOJVkdUj4jp84wDU6yD4kZGU+wAAAABJRU5ErkJggg=='}],
                                //['xul:menuitem', {label: '屏幕键盘',oncommand: 'QuickOpenOSK();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAxOqay5EAAAAiSURBVAjXY0ADUqtWrWRQYGBgYlACAgyW1ioIC0xAFKMCABYYBwHv+ZZuAAAAAElFTkSuQmCC'}],
                                //['xul:menuitem', {label: 'IE浏览器',oncommand: 'QuickOpenIE();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEElEQVQ4jZXSnVuDYRQG8B8EQTAIgkEQBMEgDIIwGA4Hg0EYBMH+gyAIh0EwHIRBEARBEAzDwWAweIP3bD17rmd9nOu64X3ec9/3+eJ/cYpL9DHAwabEHZyjG7jAbQik0SsRHzBHlWGBYebaSclNvEfyFK8FkQoznCSGqxhGwmP0t9ggsBTZS8n7QbjHVSQ9oRUu3UJbN6lAB2O0E+d+CC/xnAnMU4F2uM1+KLuEtRmMs5+fmPyCZlpBrn5mPY7Ud5BiFXl/FUZoJOS8vdGS3PC9+1xkirfC+yJmhnoDFQ7Vq/vL8Ppp+YMYCPVUr+O7RPyQna9Qm2RvLfWh9MKgi2Ns5WTYxot6bXfhsFtKLMUX/+qC1cGn0mkAAAAASUVORK5CYII='}],
                                //['xul:menuitem', {label: 'IE属性设置',oncommand: 'QuickOpenInetcpl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVQ4ja2SL28CQRDFf7ebzKWChKQJokmTGgwCgUHQoFtT06TmHKKSBEWCQuEwKASCD4BBkCD6AapQoFCnTqAqcRU8YPlX1ZdcsjN7783M24FL3AM9M1uZ2dbMtsA30AFyV/4/wUccxxnQB6rAHZD33jeApcRqt8hvQCqBuUgF59xYuTaQOOfGEj5BAcjMbAU8SWxuZtsoimZh6865LrDQqCfJoS5egXIcx5lzrivRIWBAW/FAvuT3GgvN9gIsgTWQ6C6n9lu6e1B+ou5A5uznWuvzwYhN5R4V1+VLLRTIAXUgBebARG1/npFrQAb0QhOXQBmYyn0DOjqnMhagqsodFTlgwO7ts2CUROSi4oqMHau7VihQBDYHU44LVVJcVtwDRsCG8BmFkWZ9PiOXFL+r+objC12gr3EGZ+TEe9/QuXmLDICqjLRcqcb6AaZA5U+y8BVF0UwCdXaLc7H7/4Zf1MVXuPDScn0AAAAASUVORK5CYII='}],
                                //['xul:menuseparator', {}],
                                //['xul:menuitem', {label: '内存控制',oncommand: 'FirefoxMemoryControl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVQ4jWNgGNbgPxQPDgPIMoxmBuA1jBhNowZQIX0MMgAAHXQ5x38zRc4AAAAASUVORK5CYII='}],
                                //['xul:menuseparator', {}],
                                //['xul:menuitem', {label: 'Hosts编辑',oncommand: 'HostsEdit();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACZJREFUCNdjAAL2BwwsChAEYjM2MPB/YOAQAKG6OgYnJwgCsoFqAaKRB28Dt45/AAAAAElFTkSuQmCC'}],
                               // ['xul:menuitem', {label: 'Hosts位置',oncommand: 'HostsFolder();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACZJREFUCNdjAAL2BwwsChAEYjM2MPB/YOAQAKG6OgYnJwgCsoFqAaKRB28Dt45/AAAAAElFTkSuQmCC'}],
                               // ['xul:menuitem', {label: 'DNS设置',oncommand: 'SetDNS();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA50lEQVQ4jb3SPUpDURAF4A8bbdxC9mEX8WcBIkYQbN2D2UQsxdYNiCiCgRQK9pogYgpdwPMHC41NUry5ECSP3Nd4YODO3Htmzsxc/hFX+ML1dHChBvkWy+iF1cL7H39UR8E+FtEO/xB3uZUvMQ4FN/hGd9bDo3hUoIMDfAT5fF6VDi7QCDsLYoG9HJlFEBMaITULVUNcwinWpmLbuFduYIDddDGrhULZxhhDnOAFm8HZwCt2UpI0xLc4wwqO8RmJEjmhiX5Om/BTER/lfuWnCgXPuQq2lDNYDX89/FZuAsotPOAXj2ILE+UhOi1pfPDEAAAAAElFTkSuQmCC'}],
                               //]
                              // ],


							  ['xul:menu', {label:'自定义设置' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4ja3SPUpDQRAH8B9KJJAUKYR0KYw2Sho7sVDBE4iWaS2CnkAvkICdrU3AE9ioB/ADtLEQQaN9UFOoYBUtnKfmQUgEB5Z57/8xO7O7/FMsYGVI7Wroe+ISXZxjqY9xMfguLtLkGeaiiwec4AatyKeBr2A+/nuihdKQI5RwnwaeUBmywGzovzfcx1Z8F6JQBRMYj5xghdBthw+8oIg9dHAVq4XHyAnWCV0xfOANdRwgN6D9XOjqeEUe3mOmMkZxjEbK2MBR8GU8hw8/dzuCqWitnSrQDnwydMmbARv4wAzGcI1mqkAz8DFMh34zITO+Hs5hMtOAMzgMfeY3kcUObrGLGqpYi1wL/C502X475LEcpvVfqxr4oA7/Hp/fA0aywESMdQAAAABJRU5ErkJggg=='},
                                ['xul:menupopup', {},
                               // ['xul:menuitem', {label: '标签页',oncommand:'Tabplusjs();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://ws1.sinaimg.cn/large/7a6a15d5gy1g03gsvdkebj20l70dyn11.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', tooltiptext: 'Tabplus.uc.js\n左键：编辑配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVElEQVQ4jc2Ruw0AIAgFr3IFJ3YB13EkhtBGEiuCnxheQgE8DhIgihJQAQG6I2T6kwIq0IDsXJinv2hBNoZXiGjSDaOrFw9gfeDPBbEAlt4CTuNOA8bzPo9tYBnVAAAAAElFTkSuQmCC'}],
                               // ['xul:menuitem', {label: '快捷键',oncommand:'KeyChanger.edit(KeyChanger.file); var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://ws1.sinaimg.cn/large/7a6a15d5gy1fx5iyfagicj215o0ixdli.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',onclick:'if (event.button == 2) { event.preventDefault(); setTimeout(function(){ KeyChanger.makeKeyset(true); }, 10);}',class:'menuitem-iconic', tooltiptext: 'keychanger.js\n左键：编辑配置\n右键：重载配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAxOqay5EAAAAiSURBVAjXY0ADUqtWrWRQYGBgYlACAgyW1ioIC0xAFKMCABYYBwHv+ZZuAAAAAElFTkSuQmCC'}],
                                //  ['xul:menuseparator', {}],
                                ['xul:menuitem', {label: '偏好设置',oncommand: 'QuickOpenUserjs();',tooltiptext: 'user.js',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgoCL4TwA3EGMAPrnrhAwhZIA4IUMIGcBAyJD/SDQyxiaG1TJ8LiBKLdUMIBSdtHcBxQbgczp9XECRAaRg6gAArMpGck8h/nAAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'Config',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:config", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:config',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '所有设置',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:about", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:about',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],  
                                //['xul:menuitem', {label: '界面设置',oncommand: 'ChromeCSS(); ',tooltiptext: 'chrome.css',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARklEQVQ4jWNgGCxgP5kYDv5D6fkMDAzdUPZhJDlcGMWA1QwMDNcZGBhOMzAwbGdgYHjOwMAwmxQDSAWjBgw/AxrIxIMAAADq9jfGHLxovAAAAABJRU5ErkJggg=='}],  
                                ['xul:menuseparator', {}],
                                ['xul:menuseparator', {}],
                                //['xul:menuitem', {label: '音量控制',oncommand: 'QuickOpenVolume();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVQ4jWNgoCFQZmBg+E+pZlwG4DUcJolNEbLByoQ0MyAZgFfjfzSsjCbHgEUcwwBy5EgyAN2VKAGMbAC6M4l2AUVhgAzIigV8hpCcDrApxCdPlEsGOQAAKY8zgtP7s6EAAAAASUVORK5CYII='}],
                                //['xul:menuitem', {label: '记事本',oncommand: 'QuickOpenNotedpad();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4jWNgoCL4TwA3EGMAPrnrhAwhZIA4IUMIGcBAyBBCBqBjkgwgSu2oAcPGAFIwdQAA7bk0hAgVKwIAAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '计算器',oncommand: 'QuickOpenCALC();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATklEQVQ4jWNgoCJYw8DA8J8IvAaXAf8ZGBhYCVjCClWH0wAYjQsjq8NrADny1HMBIUCUAbjYJBmA7iWSDMAHhrsXmAloZsZnAMWZiSwAAJGrSHtJfnvHAAAAAElFTkSuQmCC'}],
                                //['xul:menuitem', {label: '命令行',oncommand: 'QuickOpenCMD();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATklEQVQ4jWNgoBL4TwGGG0CuxbQxQI4SAxQZGBheMzAw2FHiAjuoIWHkGsDAwMCQBxXH5xLauECBATMMMOKdkAsoigVSwCAzgKLMRDYAAKIZQECvdVKSAAAAAElFTkSuQmCC'}],
                                //['xul:menuitem', {label: '放大镜',oncommand: 'QuickOpenMagnify();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdklEQVQ4jc2SsQ3AIAwEbwGK1NmFDdIwE3OxCCOkZYAU+RSRMEFyIuUkN7Z5vwH4IxtQgKYoyk2RgQokICiScnlmcgWWTm1RbeikaJpFUo9J47RsEdTznYB7BfclwvgZGxCfBC4nvY8UgX1WxOJVkdUj4jp84wDU6yD4kZGU+wAAAABJRU5ErkJggg=='}],
                               // ['xul:menuitem', {label: '屏幕键盘',oncommand: 'QuickOpenOSK();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAxOqay5EAAAAiSURBVAjXY0ADUqtWrWRQYGBgYlACAgyW1ioIC0xAFKMCABYYBwHv+ZZuAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'IE浏览器',oncommand: 'QuickOpenIE();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEElEQVQ4jZXSnVuDYRQG8B8EQTAIgkEQBMEgDIIwGA4Hg0EYBMH+gyAIh0EwHIRBEARBEAzDwWAweIP3bD17rmd9nOu64X3ec9/3+eJ/cYpL9DHAwabEHZyjG7jAbQik0SsRHzBHlWGBYebaSclNvEfyFK8FkQoznCSGqxhGwmP0t9ggsBTZS8n7QbjHVSQ9oRUu3UJbN6lAB2O0E+d+CC/xnAnMU4F2uM1+KLuEtRmMs5+fmPyCZlpBrn5mPY7Ud5BiFXl/FUZoJOS8vdGS3PC9+1xkirfC+yJmhnoDFQ7Vq/vL8Ppp+YMYCPVUr+O7RPyQna9Qm2RvLfWh9MKgi2Ns5WTYxot6bXfhsFtKLMUX/+qC1cGn0mkAAAAASUVORK5CYII='}],
                                // ['xul:menuitem', {label: 'IE属性设置',oncommand: 'QuickOpenInetcpl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVQ4ja2SL28CQRDFf7ebzKWChKQJokmTGgwCgUHQoFtT06TmHKKSBEWCQuEwKASCD4BBkCD6AapQoFCnTqAqcRU8YPlX1ZdcsjN7783M24FL3AM9M1uZ2dbMtsA30AFyV/4/wUccxxnQB6rAHZD33jeApcRqt8hvQCqBuUgF59xYuTaQOOfGEj5BAcjMbAU8SWxuZtsoimZh6865LrDQqCfJoS5egXIcx5lzrivRIWBAW/FAvuT3GgvN9gIsgTWQ6C6n9lu6e1B+ou5A5uznWuvzwYhN5R4V1+VLLRTIAXUgBebARG1/npFrQAb0QhOXQBmYyn0DOjqnMhagqsodFTlgwO7ts2CUROSi4oqMHau7VihQBDYHU44LVVJcVtwDRsCG8BmFkWZ9PiOXFL+r+objC12gr3EGZ+TEe9/QuXmLDICqjLRcqcb6AaZA5U+y8BVF0UwCdXaLc7H7/4Zf1MVXuPDScn0AAAAASUVORK5CYII='}],
                               // ['xul:menuitem', {label: '内存控制',oncommand: 'FirefoxMemoryControl();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVQ4jWNgGNbgPxQPDgPIMoxmBuA1jBhNowZQIX0MMgAAHXQ5x38zRc4AAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: 'Hosts编辑',oncommand: 'HostsEdit();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACZJREFUCNdjAAL2BwwsChAEYjM2MPB/YOAQAKG6OgYnJwgCsoFqAaKRB28Dt45/AAAAAElFTkSuQmCC'}],
                               // ['xul:menuitem', {label: 'Hosts位置',oncommand: 'HostsFolder();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACZJREFUCNdjAAL2BwwsChAEYjM2MPB/YOAQAKG6OgYnJwgCsoFqAaKRB28Dt45/AAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: 'DNS设置',oncommand: 'SetDNS();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA50lEQVQ4jb3SPUpDURAF4A8bbdxC9mEX8WcBIkYQbN2D2UQsxdYNiCiCgRQK9pogYgpdwPMHC41NUry5ECSP3Nd4YODO3Htmzsxc/hFX+ML1dHChBvkWy+iF1cL7H39UR8E+FtEO/xB3uZUvMQ4FN/hGd9bDo3hUoIMDfAT5fF6VDi7QCDsLYoG9HJlFEBMaITULVUNcwinWpmLbuFduYIDddDGrhULZxhhDnOAFm8HZwCt2UpI0xLc4wwqO8RmJEjmhiX5Om/BTER/lfuWnCgXPuQq2lDNYDX89/FZuAsotPOAXj2ILE+UhOi1pfPDEAAAAAElFTkSuQmCC'}],
                               ]
                               ],


                                ['xul:menuseparator', {}],
                               // ['xul:menuitem', {label: '配置文件夹',tooltiptext: 'Profiles', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).launch();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],
                                    ['xul:menuitem', {label: '脚本文件夹',tooltiptext: 'Chrome', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).reveal();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],   
                               // ['xul:menuitem', {label: '火狐根目录', tooltiptext: 'Firefox', oncommand: 'QuickOpenApplication();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}], 
                                //['xul:menuseparator', {}],
                               // ['xul:menuitem', {label: '已登录信息',oncommand: 'window.openDialog("chrome://passwordmgr/content/passwordManager.xul"); ',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4jb3TLW4DMRAF4A9UYTlAQG5QWlZeKYco3b1F2bLCReXZA5TkICHLlhT0Bsta4LFiR1ZUVWqfZI3nz54ZP/NHeMSED6whp7DfxB1GLOixxyZkH/Yx4pp4wwlb7GK/htyF/RRxzbKXCIJ3DKEPkSj0pdXOEV2hr8Vhm9AzemkmFT6lXjPOeCqqmwvfXhpsha+4KeMQhw4hD4XvuqJmBeLWZ6nnEs0KJvUM7ovEGQ+FrzmD61d4wWvsh1jceAUSSTIPztJc8ppdeDC2kqmZ2KmZ2PkBE8t2fvUX/h/fXwk8p3xlsGQAAAAASUVORK5CYII='}], 
						                     	['xul:menuitem', {label: '重启浏览器',oncommand: 'Services.startup.quit(Services.startup.eAttemptQuit | Services.startup.eRestart);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAq0lEQVQ4ja2SvQ3DIBCFv44qXXrXbrMDK2QFhqD2FhmAFbyD9/AILknBU2TH/FnJkxDScd9xBw/aGoFXR15RBlgA3wsMwCRo1T4BEbAt2AMb4FTIaPcq4FrwfIfbV3wU/KzBD2DLwAiswgCh1V5LkTTrTwXMhfzTSFc6GEhfe9BM/xs4ki8OspR/4SOdrxS6DeR9sIdnKpY2KpJzolP81HpOVjfF3Qoks/1fb/8xJcvKSjYUAAAAAElFTkSuQmCC'}],    
                        ]; 
						
        aNode.appendChild(jsonToDOM(myMenuJson, aNode.ownerDocument, {}));
        aNode.setAttribute('menupopup', 'QuickOpen_pop');
    }
});


//定义图标
var cssStr = '@-moz-document url("chrome://browser/content/browser.xul"){'
		 + '#QuickOpen .toolbarbutton-icon {'
		 + 'list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbWRIRKDMBREn8NhOoPrDLoqtifgAnG9AUfgAJU9SS2uAoOt6gWqIiqjqlrBMhNChoLozjA/2ewu/yfwRxRAC3jVYmtAD5yBXLXfYj4BndZ71U78KtwAK9NLf7fiV8HLMLY9Bvg1ZgM8gSoKqMSbJXMFOOACZDKOI2TinXQzWB0eI76M9kfpbBzgf7UXwJC4j0+w3iXCjPiUfkI0DHM7htlbhud04pulgLsMJXBQmw/VUl8r3SzgDdTBPpdxDMqDs1r6CeLbh+HZvOoa/QwZcFVN4gv6nzt18jn5zAAAAABJRU5ErkJggg==)'
		 + '}}';
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	sss.loadAndRegisterSheet(ios.newURI("data:text/css;base64," + btoa(cssStr), null, null), sss.USER_SHEET);




//定义函数


function	QuickOpenUserjs() { FileUtils.getFile('ProfD',['user.js']).launch();};
function	MouseGesturesjs() { FileUtils.getFile('UChrm',['SubScript', 'MouseGestures.uc.js']).launch();};
function	Tabplusjs() { FileUtils.getFile('UChrm',['SubScript', 'Tabplus.uc.js']).launch();};
function	ChromeCSS() { FileUtils.getFile('UChrm',['css', 'chrome.css']).launch();};

function	SetNotepad2() { FileUtils.getFile('UChrm',['Local', 'NotePad2','NotePad2.bat']).launch();};
function	Opennotepad() { FileUtils.getFile('UChrm',['Local', 'notepad++','notepad++.exe']).launch();};
function	OpenM3U8() { FileUtils.getFile('UChrm',['Local', 'M3U8','M3U8.exe']).launch();};
function	OpenIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','IDMan.exe']).launch();};
function	SetIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','!绿化.bat']).launch();};
function	UnsetIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','!卸载.bat']).launch();};
function	BackupIDM() { FileUtils.getFile('UChrm',['Local', 'IDM','IDMBackup1.2.exe']).launch();};
function	HostsEdit() { FileUtils.getFile('UChrm',['Local', 'HostsEdit.bat']).launch();};
function	SetDNS() { FileUtils.getFile('UChrm',['Local', 'DnsJumper','DnsJumper.exe']).launch();};
function	CRadio() { FileUtils.getFile('UChrm',['Local', 'CRadio','CRadio.exe']).launch();};
function	Openaria2() { FileUtils.getFile('UChrm',['Local', 'aria2','aria2.exe']).launch();};

function	RunClashforWindows() { FileUtils.getFile('UChrm',['Local', 'Clash.for.Windows','Clash for Windows.exe']).launch();};
function	Runv2rayN() { FileUtils.getFile('UChrm',['Local', 'v2rayN','v2rayN.exe']).launch();};
function	RunClashMINI() { FileUtils.getFile('UChrm',['Local', 'Clash.Mini','Clash.Mini.exe']).launch();};


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
