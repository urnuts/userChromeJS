// ==UserScript==
// @name           NewTabOverride.uc.uc.js
// @description    替换新标签页
// @version        2018.1.25.1
// @startup        window.AboutNewTabServiceFix.init();
// ==/UserScript==
(function () {
    if (location != 'chrome://browser/content/browser.xul')
        return;

    //设定第三方网址时注意斜杠，完全匹配时地址栏才不会显示地址
    //const newurl = "http://localhost/";
    //const newurl ="www.baidu.com";
    const newurl ="https://www.baidu.com"
    window.AboutNewTabServiceFix = {
        init: function () {

            //设定主页
            Services.prefs.setStringPref("https://www.google.com",newurl);

            aboutNewTabService.newTabURL = newurl;

        }
    }

    AboutNewTabServiceFix.init();

})();
