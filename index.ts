import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as util from 'util';
import {EOL} from 'os';
import {extend} from './utils';

var defaultRules = require('./tsconfig.json').lintOptions;
var Linter = require('tslint');
var tsconfig = require('tsconfig-glob');

function log(color?: Array<number>, lighten: number = 0): (message: string) => void {
    var strColor: Array<string>;

    if (Array.isArray(color)) {
        strColor = ['\033[' + (color[0] + lighten) + 'm', '\033[' + color[1] + 'm'];
    } else {
        strColor = ['', ''];
    }

    return function(message: string): void {
        console.log(strColor[0] + message + strColor[1]);
    };
}

var colors = (<any>util.inspect).colors,
    red = log(colors.red, 60),
    green = log(colors.green),
    cyan = log(colors.cyan),
    normal = log();

function unique(arr: Array<string>): Array<string> {
    var keys: { [key: string]: boolean; } = {},
        out: Array<string> = [];

    for (var i = 0, l = arr.length; i < l; ++i) {
        if (keys.hasOwnProperty(arr[i])) {
            continue;
        }

        out.push(arr[i]);
        keys[arr[i]] = true;
    }

    return out;
}

function findRules(config: { rules?: any; lintOptions?: any; }): { rules?: any; } {
    if (config.hasOwnProperty('rules')) {
        return config;
    }

    return config.lintOptions;
}

var es6 = false;

function lintFile(file: string, config: { configuration?: { rules?: any; } }): Array<any> {
    try {
        return [(new Linter(file, fs.readFileSync(file, 'utf8'), config)).lint(), file];
    } catch (e) {
        if (!es6 && e.message.indexOf('Cannot read property \'text\' of undefined') > -1) {
            es6 = true;
            delete config.configuration.rules.whitespace;
            delete config.configuration.rules['no-use-before-declare'];
            delete config.configuration.rules['no-unused-variable'];
            cyan(`You are using the ES6 destructuring syntax (i.e. "import {isString} from \'lodash\';")
We will remove the following rules allow linting files temporarily to lint these files:
    noUnusedVariableRule
    noUseBeforeDeclareRule
    whitespaceRule`);
            return lintFile(file, config);
        }
        return [{
            failureCount: 0
        }, file];
    }
}

function lintFiles(files: Array<string>, config: { formatter?: string; configuration?: { rules?: any; } }): number {
    var failed = 0;

    cyan('Linting ' + files.length + ' file' + (files.length === 1 ? '' : 's'));

    files.map((file) => {
        return lintFile(file, config);
    })
        .sort((resultA, resultB) => {
            var a: { failureCount: number; } = resultA[0],
                b: { failureCount: number; } = resultB[0];

            if (a.failureCount > b.failureCount) {
                return 1;
            }

            if (b.failureCount > a.failureCount) {
                return -1;
            }

            return 0;
        })
        .map((results) => {
            var result = results[0];

            if (result.failureCount <= 0) {
                return '';
            }

            failed += result.failureCount;

            return result.output
                .split(/\r\n|\n/)
                .map((line: string) => {
                    if (line === '') {
                        return;
                    }

                    return line;
                }).join(EOL);
        }).forEach((value) => {
            if (!value) {
                return;
            }

            normal(value);
        });

    return failed;
}

export = function(options: IOptions, done: (err?: any, success?: number) => void): void {
    var root = options.cwd || process.cwd(),
        configDir = path.resolve(root, options.configPath || '.'),
        filePath: string;

    if (configDir.indexOf('.json') === -1) {
        filePath = path.resolve(configDir, 'tsconfig.json');
    } else {
        filePath = configDir;
    }

    var configFile: { filesGlob: Array<string>; files: Array<string>; } = require(filePath),
        useGlob = options.useGlob;

    if (useGlob) {
        configFile = tsconfig({
            cwd: root,
            configPath: options.configPath,
            indent: options.tsconfigOptions && options.tsconfigOptions.indent
        }, (err: any) => {
            if (!!err) {
                done(err);
                return;
            }

            lint();
        });
    } else {
        lint();
    }

    function lint(): void {
        var files = unique(configFile.files || []),
            configuration = extend(true, undefined, defaultRules, findRules(configFile));

        var failed = lintFiles(files, {
            formatter: 'prose',
            configuration: configuration
        });

        var message = 'Done with ' + failed + ' failures.';

        if (failed > 0) {
            red(message);
        } else {
            green(message);
        }

        done(undefined, failed);
    }
};

interface IOptions {
    args?: Array<string>;
    configPath?: string;
    cwd?: string;
    useGlob?: boolean;
    tsconfigOptions: {
        indent?: number;
    };
}
