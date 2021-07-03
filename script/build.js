const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const copy = require('rollup-plugin-copy');
const replace = require('@rollup/plugin-replace');
const rollup = require('rollup');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');
const { exec } = require('./exec');

const pkg = require('../package.json');
const generateEntry = require('./generate-entry');

function externalsDependencies() {
  const deps = Object.keys(pkg.dependencies);

  const matchDeps = deps.map(key => new RegExp(`^${key}`));
  // 额外的external
  matchDeps.push(/^m78/);
  matchDeps.push('m78');
  matchDeps.push('react');
  matchDeps.push('react-dom');
  return matchDeps;
}

const external = externalsDependencies();

const entry = generateEntry();

const DIST = 'dist';

const parsePath = (...args) => path.resolve(__dirname, ...args);

async function build(type = 'esm') {
  const confs = [];

  const extensions = ['.ts', '.tsx', '.jsx', '.js'];

  const copyList = [
    {
      src: 'src/components/style/**/*',
      dest: parsePath(`../${DIST}/${type}/style`),
    },
    {
      src: 'src/components/assets/**/*',
      dest: parsePath(`../${DIST}/${type}/assets`),
    },
  ];

  Object.entries(entry).forEach(([name, ePath]) => {
    const input = {
      input: ePath,
      external,
      plugins: [
        nodeResolve({
          extensions,
        }),
        babel({
          exclude: '**/node_modules/**',
          extensions,
          babelHelpers: 'runtime',
        }),
        commonjs(),
        copy({
          targets: copyList,
          hook: 'writeBundle',
        }),
      ],
    };

    if (type !== 'esm') {
      input.plugins.unshift(
        replace({
          'm78/': `'m78/${type}/`,
          delimiters: ["'", ''],
        }),
      );
    }

    const output = {
      file: parsePath('../', DIST, `./${type}`, name, 'index.js'),
      format: type,
      exports: 'named',
    };

    copyList.push({
      src: `src/components/${name}/style/**/*`,
      dest: parsePath('../', DIST, `./${type}/${name}/style`),
    });

    confs.push({
      input,
      output,
      name,
    });
  });

  for (const conf of confs) {
    const spinner = ora(
      `${conf.name} start compile... ${confs.indexOf(conf) + 1}/${confs.length}`,
    ).start();

    try {
      const bundle = await rollup.rollup(conf.input);

      await bundle.write(conf.output);

      spinner.succeed(`${conf.name} compile successfully.`);
    } catch (e) {
      spinner.stop();
      console.log(e);
    }
  }

  console.log(chalk.blue(`${type} generate declaration...`));

  await exec(`tsc --emitDeclarationOnly -p ./config/lib.config.json --outDir ./${DIST}/${type}`);

  // tsc foo.ts --outFile foo.js --declaration --module system

  console.log(chalk.blue(`${chalk.cyan(type)} build complete.`));
}

(async function pipe() {
  const spinner = ora('esm building...').start();

  try {
    fs.removeSync(parsePath('../', DIST));

    await build().catch(err => console.log(err));

    // spinner.text = 'cjs building...';
    //
    // await build('cjs').catch(err => console.log(err));

    console.log(chalk.blue('copy file...'));

    fs.copySync(parsePath('../package.json'), parsePath(`../${DIST}/package.json`));

    fs.copySync(parsePath(`../${DIST}/esm`), parsePath(`../${DIST}`));

    fs.removeSync(parsePath(`../${DIST}/esm`));

    console.log(chalk.green('build complete. (please publish the dist directory)'));

    // spinner.text = 'umd building...';
    // await build('umd').catch(err => console.log(err));
  } catch (e) {
    spinner.fail(e);
  } finally {
    spinner.stop();
  }
})();
