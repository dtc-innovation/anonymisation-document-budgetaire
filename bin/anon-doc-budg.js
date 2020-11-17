#!/usr/bin/env node

import {join, dirname} from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import {DOMParser, XMLSerializer} from 'xmldom';
import xmlBufferToString from 'xml-buffer-tostring';
import chalk from 'chalk';
import program from 'commander';

import anonymize from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {readdir, readFile, writeFile} = fs;

const {version} = JSON.parse(await readFile(join(__dirname, '../package.json'), 'utf-8'));

program
  .version(version)
  .usage('--in <dossier> --out <dossier>')
  .option('-i, --in <dir>', 'Input directory')
  .option('-o, --out <dir>', 'Output directory')
  .parse(process.argv);

const {in:inDir, out:outDir} = program;

if (!inDir || !outDir) {
   console.error('Error: Input and Output directories are mandatory.');
   program.help();
}

readdir(inDir)
.then(files => {
    console.log(chalk.underline('Files found'), files);

    return Promise.all(files.map(f => {
        return readFile(join(inDir, f))
        .then( xmlBufferToString )
        .then( str => {
            return (new DOMParser()).parseFromString(str, "text/xml");
        })
        .then(doc => {
            anonymize(doc);

            // convert to utf-8
            Array.from(doc.childNodes).forEach(n => {
                if(n.nodeType === 7 && n.target === 'xml'){ // PROCESSING_INSTRUCTION_NODE
                    n.data = n.data.replace(/encoding="(.*)"/, 'encoding="UTF-8"');
                }
            });

            return doc;
        })
        .then( doc => {
            return (new XMLSerializer()).serializeToString(doc);
        })
        .then(str => writeFile(join(outDir, f), str, 'utf-8'))
        .catch(err => {
            console.error(chalk.red(`Problem detected with file: ${f}`))
            console.error(chalk.grey(err));
            throw err;
        });
    }))
})
.then(successes => {
    console.log(chalk.green(`Anonymized ${successes.length} file${successes.length >= 2 ? 's' : ''} successfully!`))
})
.catch(err => {
    console.error(chalk.red('Error during processing. Stopping right now.'));
    console.error(chalk.grey(err));
    process.exit(1);
});
