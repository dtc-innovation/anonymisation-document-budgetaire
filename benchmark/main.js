import {promisify} from 'util'
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';
import { promises } from 'fs';
import {exec as execCb} from 'child_process'

import { dir } from 'tmp-promise'

const exec = promisify(execCb);

const {link, readdir, copyFile} = promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Fill sourceDir with the number of <DocumentBudgetaire> files
 * For now, it copies the same 5 CD33 files over and over
 * 
 * @param {*} sourceDirPath 
 * @param {*} number 
 */
function fillSourceDir(sourceDirPath, number = 10){
    const exampleFileDirPath = join(__dirname, `./data`)

    // copy the 5 reference files in a tmp directory
    // (otherwise, if the reference files and /tmp aren't in the same mount device, calls to link may fail)
    return dir({unsafeCleanup: true}).then(tmpCopyDir => {
        return readdir(exampleFileDirPath).then(DocumentBudgetaireExampleFileNames => {            
            // Create copies of the example files in a temporary directory (to be link-ed later)
            return Promise.all(DocumentBudgetaireExampleFileNames.map(name =>  {
                const sourcePath = join(exampleFileDirPath, name)
                const destPath = join(tmpCopyDir.path, name) // same file name

                return copyFile(sourcePath, destPath)
                    .then(() => destPath)
            }))
            .then(linkableExampleFilePaths => {
                const sourceFilePaths = Array(number).fill().map((_, i) => join(sourceDirPath, `DocBudg-${i+1}.xml`))

                return Promise.all(sourceFilePaths.map((pathToCreate, i) => {
                    const fileToLink = linkableExampleFilePaths[i % linkableExampleFilePaths.length];
                    return link(fileToLink, pathToCreate)
                }))
            })  
        })
        .then(() => tmpCopyDir.cleanup())
    })
}

const sourceDirP = dir({unsafeCleanup: true})
const destinationDirP = dir({unsafeCleanup: true})

const NUMBER_FILES = 80;

Promise.all([sourceDirP, destinationDirP])
.then(([sourceDir, destinationDir]) => {
    console.info(`Dossier source: `, sourceDir.path, `\nDossier destination: `, destinationDir.path);

    return fillSourceDir(sourceDir.path, NUMBER_FILES).then(() => {
        const binPath = join(__dirname, `../bin/anon-doc-budg.js`)

        const command = `${binPath} --in ${sourceDir.path} --out ${destinationDir.path}`
        const timerString = `benchmark anonymisation ${NUMBER_FILES}`
        console.time(timerString)
        return new Promise((res, rej) => {
            const {child} = exec(command);

            child.on('error', rej)
            child.on('exit', res)
        })
        .then(() => console.timeEnd(timerString))
    })
    //.then( () => Promise.all([sourceDir.cleanup(), destinationDir.cleanup()]) )
})
.catch(err => console.error('end', err))