const scss = require('rollup-plugin-scss');

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

const pkg = require('../package.json');
const generateEntry = require('../build/generate-entry');

function externalsDependencies() {
  const deps = Object.keys(pkg.dependencies);

  const matchDeps = deps.map(key => new RegExp(`^${key}`));
  // 额外的external
  matchDeps.push(/^@lxjx\/fr/);
  matchDeps.push('@lxjx/fr');
  matchDeps.push('react');
  matchDeps.push('react-dom');
  return matchDeps;
}

const external = externalsDependencies();

const entry = generateEntry();

// const entry = {
//   test1: path.resolve(__dirname, '../src/components/test1/index.ts'),
//   test2: path.resolve(__dirname, '../src/components/test2/index.ts'),
// };

async function build(type = 'esm') {
  fs.removeSync(path.resolve(__dirname, '../', type));

  const confs = [];

  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  const copyList = [
    {
      src: 'src/components/style/**/*',
      dest: `${type}/style`,
    },
    {
      src: 'src/components/assets/**/*',
      dest: `${type}/assets`,
    },
  ];

  Object.entries(entry).forEach(([name, ePath]) => {
    const input = {
      input: ePath,
      external,
      plugins: [
        replace({
          '@lxjx/fr/lib/': `'@lxjx/fr/${type}/`,
          delimiters: ["'", ''],
        }),
        nodeResolve({
          extensions,
        }),
        commonjs(),
        babel({
          exclude: 'node_modules',
          extensions,
          babelHelpers: 'runtime',
        }),
        copy({
          targets: copyList,
          hook: 'writeBundle',
        }),
        // scss({ output: `style/css.css` }), // TODO: css打包
      ],
    };

    const output = {
      file: path.resolve(__dirname, `../${type}`, name, 'index.js'),
      format: type,
      // name: type === 'umd' ? `Fr.${name}` : undefined,
      // name,
      exports: 'named',
    };

    copyList.push({
      src: `src/components/${name}/style/**/*`,
      dest: path.resolve(__dirname, `../${type}/${name}/style`),
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

  console.log(chalk.blue(`${chalk.cyan(type)} build complete.`));
}

(async function pipe() {
  const spinner = ora('esm building...').start();

  try {
    await build().catch(err => console.log(err));
    // spinner.text = 'cjs building...';
    // await build('cjs').catch(err => console.log(err));
    // spinner.text = 'umd building...';
    // await build('umd').catch(err => console.log(err));
  } catch (e) {
    spinner.fail(e);
  } finally {
    spinner.stop();
  }
})();
