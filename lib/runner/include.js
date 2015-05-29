var fs = require('fs');
var path = require('path');

/**
 * <!--#include virtual="/index/index_news/news_list.htm"-->
 * ���ַ����л�ȡ��ģ��
 * @param htmlCode html����
 */
var getSubModules = function (htmlCode) {
    var result = [];
    var puzzles = htmlCode.match(/<\!--#include\s+virtual\=(['"]?)(.*)\1\s*-->/g);
    if (puzzles === null) {
        return result;
    }
    puzzles.forEach(function (val) {
        var subInnerHTML = val.match(/<\!--#include\s+virtual\=(['"]?)(.*)\1\s*-->/);
        var subModule = {
            inc: val,
            module: subInnerHTML[2]
        };
        result.push(subModule);
    });
    return result;
};

var getFullPage = function (pageUrl, htmlCode) {
    var code = "";
    try {
        code = htmlCode || fs.readFileSync(pageUrl, 'utf-8');
        var allSubs = getSubModules(code);
        allSubs.forEach(function (sub) {
            var subUrl = path.join(path.dirname(pageUrl), sub.module);
            if (/^\/|\\/.test(sub.module)) {
                if (/\/pages\/|\\pages\\/.test(pageUrl)) { //����pages�ļ����е�ҳ�棬��������pages�£���������Ŀ�ĸ��ļ��У�����ִ�е�λ�ã�
                    subUrl = path.join(process.cwd(), "pages" + sub.module);//�Զ���pages�ļ�����Ѱ��
                } else {
                    subUrl = path.join(process.cwd(), sub.module);//�Զ���pages�ļ�����Ѱ��
                }
            }
            var subCode = getFullPage(subUrl);
            code = code.replace(sub.inc, subCode);
        });
    } catch (e) {
        console.warn(e);
        code = e;
    }

    return code;
};

exports.include = getFullPage;


