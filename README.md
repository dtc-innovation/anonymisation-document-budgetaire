# anonymisation-document-budgetaire [![Build Status](https://travis-ci.org/dtc-innovation/anonymisation-document-budgetaire.svg?branch=master)](https://travis-ci.org/dtc-innovation/anonymisation-document-budgetaire)

Outil d'anonymisation de fichiers DocumentBudgetaire

Ce dépôt de code contient un module d'anonymisation de fichiers XML de type `<DocumentBudgetaire>` comme définis par son [XML Schema](http://odm-budgetaire.org/doc-schema/doc-schema.html) ainsi que son encapsulation dans [une page web](https://dtc-innovation.github.io/anonymisation-document-budgetaire/) et dans un outil en ligne de commande.

## Version web

La version web est accessible à cette adresse : https://dtc-innovation.github.io/anonymisation-document-budgetaire/

## Outil en ligne de commande

Pour utiliser la version en ligne de commande : 

Installer [Node.js](https://nodejs.org/fr/)

Installer l'outil :
```bash
npm install anon-doc-budg -g
```

Utiliser :
```sh
anon-doc-budg --in dossierEntree --out dossierSortie
```

```sh
$ anon-doc-budg --help

  Usage: anon-doc-budg --in <dossier> --out <dossier>


  Options:

    -V, --version    output the version number
    -i, --in <dir>   Input directory
    -o, --out <dir>  Output directory
    -h, --help       output usage information
```

# Propositions d'amélioration du format de fichier `<DocumentBudgetaire>`

Des [propositions d'amélioration](propositions%20d'améliorations.md) sont disponibles

# Licence

[MIT](LICENCE)