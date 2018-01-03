# anonymisation-document-budgetaire [![Build Status](https://travis-ci.org/dtc-innovation/anonymisation-document-budgetaire.svg?branch=master)](https://travis-ci.org/dtc-innovation/anonymisation-document-budgetaire)

Outil d'anonymisation de fichiers DocumentBudgetaire

Ce dépôt de code contient un module d'anonymisation de fichiers XML de type `<DocumentBudgetaire>` comme définis par son [XML Schema](http://odm-budgetaire.org/doc-schema/doc-schema.html) ainsi que son encapsulation dans [une page web](https://dtc-innovation.github.io/anonymisation-document-budgetaire/) et dans un outil en ligne de commande.

## Outil en ligne de commande

Installer [Node.js](https://nodejs.org/fr/)

Installer l'outil : 
```bash
npm install anon-doc-budg -g
```

Utiliser : 
```sh
anon-doc-budg dossierEntree dossierSortie
```

## Propositions d'amélioration

Des [propositions d'amélioration](propositions%20d'améliorations.md) sont disponibles
