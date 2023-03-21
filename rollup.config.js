import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

function resolveFile(filePath) {
  return path.join(__dirname, filePath);
}

const outputName = 'baseTemplatRollup';

function getOptions(mode) {
  const result = {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile(`dist/${outputName}.mode.js`),
      format: mode,
      sourcemap: true,
      name: outputName,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      json({ compact: true }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      terser({
        Compress: {
          drop_console: true,
        },
      }),
    ],
  };
}

if (process.env.NODE_ENV === 'development') {
  const watcher = rollup.watch(getOptions('esm'));
  console.log('rollup is watching for file change...');

  watcher.on('event', (event) => {
    switch (event.code) {
      case 'START':
        console.log('rollup is rebuilding...');
        break;
      case 'ERROR':
      case 'FATAL':
        console.log('error in rebuilding.');
        break;
      case 'END':
        console.log('rebuild done.');
    }
  });
}

const modes = ['esm', 'cjs', 'iife'];
export default modes.map((mode) => getOptions(mode));
