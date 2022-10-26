import fs from 'fs';
import path from 'path';
import {Plugin} from 'vite';

export enum Languages {
    cs = 'cs',
    de = 'de',
    es = 'es',
    fr = 'fr',
    it = 'it',
    ja = 'ja',
    ko = 'ko',
    pl = 'pl',
    pt_br = 'pt-br',
    ru = 'ru',
    tr = 'tr',
    zh_hans = 'zh-hans',
    zh_hant = 'zh-hant',
}

export interface Options {
    locale: Languages;
}

/**
 * 动态替换语言包
 */
export function buildMonacoEditorNls(options: Options = {locale: Languages.zh_hans}): Plugin {
    const CURRENT_LOCALE_DATA = getLocalizeMapping(options.locale);
    // 转义下，防止特殊符号导致js打包出现问题
    const CURRENT_DATA = encodeURIComponent(CURRENT_LOCALE_DATA)
    return {
        name: 'vite-plugin-monaco-editor-nls',
        enforce: 'pre',
        transform: (code: string, id: string) => {
            if (code.indexOf("monaco-editor/esm/vs/nls.js") > -1) {
                const key = "_____CODE_CODE_REPLACE_____"
                code = code.replace(
                    "function localize(data, message, ...args) {\n" +
                    "  return _format(message, args);\n" +
                    "}", key)
                code = code.replace(key,
                    `\nconst CURRENT_DATA = JSON.parse(decodeURIComponent("${CURRENT_DATA}")); \n\n` +
                    "function localize(data, defaualtMessage, ...args) {\n" +
                    "    var key = typeof data === \"object\" ? data.key : data;\n" +
                    "    var data = CURRENT_DATA || {};\n" +
                    "    var message = data[key];\n" +
                    "    if (!message) {\n" +
                    "        message = defaualtMessage;\n" +
                    "    }\n" +
                    "  return _format(message, args);\n" +
                    "}\n"
                )
            }
            return {
                code: code, id: id
            }
        }
    };
}

/**
 * 获取语言包
 * @param locale 语言
 * @returns
 */
function getLocalizeMapping(locale: Languages) {
    const locale_data_path = path.join(`node_modules/monaco-editor-nls/locale/${locale}.json`);
    const buffer = fs.readFileSync(locale_data_path);
    // 语言JSON对象
    let jsonObject: any = new Object()
    const DATA = JSON.parse(String(buffer))
    for (let key of Object.keys(DATA)) {
        for (let key1 of Object.keys(DATA[key])) {
            jsonObject[key1] = DATA[key][key1]
        }
    }
    return JSON.stringify(jsonObject);
}
