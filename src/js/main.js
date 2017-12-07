import anonymize from '../../index.js';

const BEFORE_ENCODING = `encoding="`;

function makeAnonimizedFile(file){
    
    // get file to detect encoding
    return new Promise( (resolve, reject) => {
        const reader = new FileReader();  
        reader.addEventListener("loadend", e => {
            resolve(reader.result);
        });
        reader.readAsText(file);
    })
    // get content with proper encoding
    .then( badEncodingStr => {
        const encodingStartIndex = badEncodingStr.indexOf(BEFORE_ENCODING) + BEFORE_ENCODING.length;
        const encodingEndIndex = badEncodingStr.indexOf('"', encodingStartIndex);
        const encoding = badEncodingStr.slice(encodingStartIndex, encodingEndIndex);

        return new Promise( (resolve, reject) => {
            const reader = new FileReader();  
            reader.addEventListener("loadend", e => {
                resolve(reader.result);
            });
            reader.readAsText(file, encoding);
        })
    })
    // parse as XML
    .then( xmlText => {
        return (new DOMParser()).parseFromString(xmlText, 'text/xml') 
    })
    // anonymize 
    .then( doc => {
        anonymize(doc);
        return doc;
    }) 
    // serialize
    .then( doc => {
        return (new XMLSerializer()).serializeToString(doc) 
    });
    
}

document.addEventListener('DOMContentLoaded', e => {
    const input = document.body.querySelector('.input input[type="file"]');
    const output = document.body.querySelector('.output');

    input.addEventListener('input', e => {
        // replace <input> with list of files
        const files = Array.from(e.target.files);

        const ulInput = document.createElement('ul');
        files.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f.name;
            ulInput.append(li);
        })

        input.replaceWith(ulInput);

        // create output
        const ulOutput = document.createElement('ul');

        files.forEach(f => {
            const {name} = f;

            const li = document.createElement('li');
            li.textContent = name;
            ulOutput.append(li);

            makeAnonimizedFile(f)
            .then(str => {
                const blob = new Blob([str], {type: 'text/xml'});
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                
                a.setAttribute('href', blobUrl);
                a.setAttribute('download', name);
                a.textContent = name;

                li.innerHTML = '';

                li.append(a);
            });
        });

        output.append(ulOutput);
    })


}, {once: true})