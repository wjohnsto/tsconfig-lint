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

0. You provide a path to a directory containing a tsconfig.json
  - You can also provide the full path to a `.json` file that contains a `files` or `filesGlob` property along with your tslint rules.
0. You specify a `files` pattern in your tsconfig.json
0. You specify a `lintOptions` property in your tsconfig.json that contains your tslint rules.
  - If you do not specify `lintOptions`, the default tslint rules will be used.

### Using the CLI
```shell
tsconfig-lint .
```

#### Options

	```shell
	-u, --use-glob A flag indicating that tsconfig-glob should be executed on the .json file before running lint on the files.
	-i, --indent <number> The number of spaces to indent the tsconfig.json file (defaults to 4). Only necessary if using --use-glob
	```

### Using with Node

```ts
import * as lint from 'tsconfig-lint';
lint();
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
	 * Whether or not tsconfig-glob should be executed on the .json file before running lint on the files.
	 */
	useGlob?: boolean;

	tsconfigOptions: {
		/**
		 * The number of spaces to indent the tsconfig.json
		 */
		indent?: number;
	};	

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
});
```
