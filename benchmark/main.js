import {join, dirname} from 'path';
import { dir } from 'tmp-promise'
import { fileURLToPath } from 'url';
import { promises } from 'fs';

const {link, readdir, copyFile} = promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*

- [ ] Créer un dossier de source dans /tmp
    - [ ] y mettre le nombre de fichiers `<DocumentBudgetaire>` à tester
- [ ] Créer un dossier de destination dans /tmp
- [ ] lancer l'outil d'anonymisation
- [ ] Enregistrer le temps d'execution
- [ ] Supprimer tous les dossiers et fichiers

*/


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
                    console.log('pathToCreate', pathToCreate, i)


                    return link(fileToLink, pathToCreate)
                }))
            })  
        })
        .then(() => tmpCopyDir.cleanup())
    })
}

const sourceDirP = dir({unsafeCleanup: true})
const destinationDirP = dir({unsafeCleanup: true})

Promise.all([sourceDirP, destinationDirP])
.then(([sourceDir, destinationDir]) => {
    console.info(`Dossiers source et destination`, sourceDir, destinationDir);

    return fillSourceDir(sourceDir.path).then(() => {
        return Promise.all([sourceDir.cleanup(), destinationDir.cleanup()])
    })    
})
.catch(err => console.error('end', err))