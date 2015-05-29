var fs = require('fs');
var path = require('path');
/**
 * �������л�ȡ������Ϣ
 * @example �� test
 * @param propertyStr ���Ե��ַ���
 */
var getDataFrom = function (propertyStr) {
    // ( һ�������ǿո�>���ַ� �ո� = �ո� "' ��̰��ƥ��ǵȺŵ��ַ� "' ?= ���ƥ��һ���ո����>  )
    var datas = {};
    var dataReg = /([^\s<>'"]+[\s]*=[\s]*(['"]?)[^=>]+?\2(?=[\s]+))|([^\s<>'"]+)/gi;
    (propertyStr + ' ').match(dataReg).forEach(function (dataAttr) {
        var dataKey = dataAttr.match(/^([^\s].*)=/);
        var dataValue = dataAttr.match(/=[\s]*(['"]?)(.*)[\s]*\1/);
        if (dataValue === null) {
            datas[dataAttr] = "true";
        }
        if (dataKey !== null && dataValue !== null) {
            datas[dataKey[1].trim()] = dataValue[2]; //string ȥ������� ' �� "
        }
    });
    //ת����json�������ʽ
    return datas;
};

/**
 * ���ַ����л�ȡ��ģ��
 * @param htmlCode html����
 * @returns {Array} ��priority�Ӹߵ������е���ģ��
 */
var getSubModules = function (htmlCode) {
    var result = [];
    var puzzles = htmlCode.match(/<puzzle[\s]+?([^>]*)>([\s\S]*?)<\/puzzle>/g);
    if (puzzles === null) {
        return result;
    }
    puzzles.forEach(function (val) {
        var subInnerHTML = val.match(/<puzzle[\s]+?[^>]*>([\s\S]*?)<\/puzzle>/);
        var subModule = getDataFrom(val.replace(/<puzzle|>[\s\S]*?<\/puzzle>/g, ''));
        subModule.puz = val;
        subModule.innerHTML = subInnerHTML[1];
        result.push(subModule);
    });
    result.sort(function (puz1, puz2) {
        var pri1 = puz1.priority || 0;
        var pri2 = puz2.priority || 0;
        if (pri1 < pri2) {
            return 1;
        } else if (pri1 > pri2) {
            return -1;
        } else {
            return 0;
        }
    });
    return result;
};

var getFullPage = function (pageUrl) {
    var code = fs.readFileSync(pageUrl, 'utf-8');
    var allSubs = getSubModules(code);

    allSubs.forEach(function (sub) {
        var subUrl = path.resolve(path.dirname(pageUrl), sub.module);
        var subCode = getFullPage(subUrl);
        subCode = subCode.replace(/\{\{([^\}]+)\}\}/g, function ($0, $1) {
            var props = $1.split('.');
            if (props.length === 1) { //��ͨȡ�ַ�����ֵ
                return sub[$1];
            } else { //���ȴ���һ��ȡ�����е�����
                try {
                    var propValue = JSON.parse(sub[props[0]]);
                    for (var i = 1, len = props.length; i < len; i++) {
                        propValue = propValue[props[i]];
                        if (propValue === undefined) { // ��������Ѿ�Ϊ undefine�����ټ�������ȡ������ undefined
                            break;
                        }
                    }
                    return propValue;
                } catch (e) {
                    return '\n{ JSON parse Error::' + e + ' in file:' + subUrl + ', property: ' + $1 + ' }';
                }
            }
        });
        code = code.replace(sub.puz, subCode);
    });
    return code;
};

exports.puz = getFullPage;


