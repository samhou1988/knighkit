﻿/**
 * @describe: 所有相关配置
 * 以下路径配置时需要以 kConfig 的父文件夹（项目根路径）路径为基础，不得使用相对路径
 */
(function (window, undefined) {
    var allConfigs = {
        /**
         * commonJS 和 nodejs 都可以加载此模块
         *  lib/jquery
         * -------- begin -----------*/
        "alias": {
            "subModule": "lib/runtime/subModule/index",
            "jquery": "lib/jquery",
            "q": "lib/runtime/q",
            "setimmediate": "lib/setImmediate",
            "path": "lib/runtime/path"
        },
        "paths": {
//            "render": "src/scripts/render",
//            "router": "src/scripts/router",
//            "frame": "src/scripts/frame",
//            "utils": "src/scripts/utils"
        },
        "debug": true,
        "base": "file:///E:/works/GitHub/knighkit" //请保证修改好此端口后，修改 http.port
        /* --------end-----------*/

        /**
         * nodejs build 文件时需要的配置文件
         * -------- begin -----------*/
//        "template": "src/template", // 项目中待编译模版的路径
//        "buildTemplate": "kConfig/moduleTemplate", //编译模版需要的 js 模块模版
//        "output": "output", //输出路径
//        "cssOutput": "src/styles/dict.css",
        /* --------end-----------*/

        /**
         * 打包模块, 可设置多个
         * path 是要打包文件的入口模块路径
         * name 是输出文件名称
         * -------- begin -----------*/
//        "packModules": [
//            {"path": "src/scripts/package", "name": "business"}
//        ],
        /* --------end-----------*/


        /**
         * server port
         * -------- begin -----------*/
//        "http": {
//            "port": "9527"  //请保证修改好此端口后，修改 base 的端口号
//        },
//        "weinre": {
//            "port": "10089"
//        }
        /* --------end-----------*/
    };

    if (typeof module !== 'undefined' && module.exports !== 'undefined') {
        module.exports = allConfigs;
    } else if (typeof define === 'function') {
        define(function () {
            return  allConfigs;
        });
    }
})(this);
