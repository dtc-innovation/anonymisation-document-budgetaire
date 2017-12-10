# Proposition d'améliorations au format de fichier &lt;DocumentBudgétaire>

Il s'agit du type de fichier documenté ici : http://odm-budgetaire.org/doc-schema/doc-schema.html

## Pour une anonymisation plus fine à fins d'Open Data

Afin de mettre les fichiers `<DocumentBudgétaire>` en open data, il semble nécessaire d'anonymiser les noms et prénoms de personnes physiques mentionnées dans les documents. Afin de pouvoir anonymiser sans autre perte d'information, des changements dans la structure du fichier seraient à envisager.

Les propositions sont les suivantes : 
- Rendre les éléments `CodNatJurBenefCA` et `CodNatJurBenef` obligatoires partout où ils sont présents.
- Faire que la valeur de l'attribut `V` des enfants `NatJurOrgEng` de chaque `ORGANISME_ENG` soit de [type `ATCodNatJurBenef`](http://odm-budgetaire.org/doc-schema/CommunAnnexe_xsd_Complex_Type_ATCodNatJurBenef.html#ATCodNatJurBenef_V) au lieu d'un champ libre.
- Rajouter un enfant `NatJurOrgEng` avec une valeur de type `ATCodNatJurBenef` aux `PRET`s

## Autres

- Mettre une vraie URL pour `DocumentBudgetaire@xsi:schemaLocation`