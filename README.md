# ts-glob deprecation notice
This package currently uses tsconfig-glob. However in the next major release it will be removed in favor of using the "include" property for [TypeScript 2.0](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#user-content-glob-support-in-tsconfigjson)

[![npm version](https://badge.fury.io/js/tsconfig-lint.svg)](http://badge.fury.io/js/tsconfig-lint)
[![Downloads](http://img.shields.io/npm/dm/tsconfig-lint.svg)](https://npmjs.org/package/tsconfig-lint)
[![Dependency Status](https://david-dm.org/wjohnsto/tsconfig-lint.svg)](https://david-dm.org/wjohnsto/tsconfig-lint)
[![devDependency Status](https://david-dm.org/wjohnsto/tsconfig-lint/dev-status.svg)](https://david-dm.org/wjohnsto/tsconfig-lint#info=devDependencies)

# tsconfig-lint
A tsconfig tool for running [tslint](https://github.com/palantir/tslint) on files found in the tsconfig. Integrates with [tsconfig-glob](https://github.com/wjohnsto/tsconfig-glob) to allow for `filesGlob` in the tsconfig.json.

## Install

Use `npm` to install this package.

Locally:

```shell
npm install tsconfig-lint --save-dev
```

or, Globally:

```shell
npm install -g tsconfig-lint --save-dev
```

## Usage

You can use this library as either a CLI or in a node script. It follows a similar format to the [atom-typescript](https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md) plugin:

0. You provide a path to a directory containing a tsconfig.json file
  - You can also provide the full path to a `.json` file that contains an `exclude`, `files` or `filesGlob` property along with your tslint rules.
0. You specify an `exclude`, `files`, or `filesGlob` pattern in your tsconfig.json
0. You specify a `lintOptions` property in your tsconfig.json that contains your tslint rules.
  - If you do not specify `lintOptions`, the default tslint rules will be used

You can also put your tslint rules in a separate file. By default, tsconfig-lint will look for `tslint.json` (you can override the name if needed).
If the file is found, then:
 * the rules defined in it will be used
 * lintOptions will be ignored

### Using the CLI
```shell
tsconfig-lint .
```

#### Options

```shell
	-c, --config The name of the tslint configuration file; if not provided, 'tslint.json' will be used
	-u, --use-glob A flag indicating that `filesGlob` should be used in place of `files` for determining the files to lint.
	-i, --indent <number> The number of spaces to indent the tsconfig.json file (defaults to 4). Only necessary if using --use-glob
    -p, --passive A flag indicating whether or not the script should exit with 1 on fail. If `passive` is specified, failures will still be sent with 0.
```

### Using with Node

```ts
import * as lint from 'tsconfig-lint';
lint(undefined, (err) => {
    //...
});
```

#### Options

```ts
{
	/**
	 * A relative path from cwd to the directory containing a tsconfig.json. If not specified, the '.' is used.
	 */
	configPath?: string;

	/**
	 * The current working directory, defaults to `process.cwd()`
	 */
	cwd?: string;

	/**
	 * Whether or not `filesGlob` should be used in place of `files` for determining the files to lint.
	 */
	useGlob?: boolean;

	tsconfigOptions: {
		/**
		 * The number of spaces to indent the tsconfig.json
		 */
		indent?: number;
	};

	/**
	 * A relative path from the configPath to the tslint configuration file.
	 */
	tsLintConfigFilePath?: string;

}
```
#### Realistic Node Usage

```ts
import * as lint from 'tsconfig-lint';
lint({
	configPath: '.',
	cwd: process.cwd(),
	useGlob: true,
	tsconfigOptions: {
		indent: 2
	}
}, (err) => {
    //...
});
```

## Default Rules

The default rules (found in the tsconfig.json) are below:

```ts
"rules": {
    "class-name": true,
    "curly": true,
    "eofline": true,
    "forin": true,
    "indent": [
        true,
        4
    ],
    "interface-name": true,
    "jsdoc-format": true,
    "label-position": true,
    "label-undefined": true,
    "max-line-length": false,
    "member-ordering": [
        true,
        "public-before-private",
        "static-before-instance",
        "variables-before-functions"
    ],
    "no-any": false,
    "no-arg": true,
    "no-bitwise": false,
    "no-console": [
        true,
        "debug",
        "info",
        "time",
        "timeEnd",
        "trace"
    ],
    "no-consecutive-blank-lines": true,
    "no-construct": true,
    "no-constructor-vars": false,
    "no-debugger": true,
    "no-duplicate-key": true,
    "no-duplicate-variable": true,
    "no-empty": false,
    "no-eval": true,
    "no-string-literal": true,
    "no-trailing-comma": true,
    "no-trailing-whitespace": true,
    "no-unreachable": true,
    "no-unused-expression": true,
    "no-unused-variable": false,
    "no-use-before-declare": true,
    "one-line": [
        true,
        "check-open-brace",
        "check-catch",
        "check-else",
        "check-whitespace"
    ],
    "quotemark": [
        true,
        "single"
    ],
    "radix": true,
    "semicolon": true,
    "triple-equals": [
        true,
        "allow-null-check"
    ],
    "typedef": [
        true,
        "property-declaration",
        "member-variable-declaration",
        "call-signature"
    ],
    "typedef-whitespace": [
        true,
        [
            "call-signature",
            "nospace"
        ],
        [
            "catch-clause",
            "nospace"
        ],
        [
            "index-signature",
            "space"
        ],
        [
            "parameter",
            "nospace"
        ],
        [
            "property-declaration",
            "nospace"
        ],
        [
            "variable-declaration",
            "nospace"
        ]
    ],
    "use-strict": [
        true,
        "check-module"
    ],
    "variable-name": false,
    "whitespace": [
        false,
        "check-branch",
        "check-decl",
        "check-operator",
        "check-separator",
        "check-type"
    ]
}
```
