# Rapport de benchmark du 21 novembre 2020

*par David Bruant*

Je suis parti d'une croyance que l'outil en ligne de commande permettait d'anonymiser à l'échelle les fichiers xml `<DocumentBudgetaire>`s. Mais nous n'avons jamais vérifié l'ampleur de l'échelle.

Avec le Conseil Départemental de la Gironde, nous avons eu une expérience que l'outil avait fonctionné sur 10-20 fichiers

Mais est-ce que ça peut aller plus loin ? Et ça prend combien de temps ?
Spécifiquement, nous avons des informations que certaines administrations reçoivent parfois de l'ordre de 2000 fichiers pour un exercice budgétaire
Aussi, l'historique que détient la DGCL contient sûrement de l'ordre de centaines de milliers de fichiers

Objectifs : 
- l'outil d'anonymisation fonctionne sur 100000 fichiers (même s'il doit tourner longtemps) sur un ordinateur commun
- le process d'anonymisation en masse prenne moins de 1h de temps humain pour 100000 fichiers



## Première analyse du code

La [structure du code commence par](https://github.com/dtc-innovation/anonymisation-document-budgetaire/blob/3123c300eec0498c556da200f6a96af1fd644e24/bin/anon-doc-budg.js#L29-L34) :

```js
readdir(inDir)
.then(files => {
    console.log(chalk.underline('Files found'), files);

    return Promise.all(files.map(f => {
        return readFile(join(inDir, f))
        // ...
```

D'abord, on liste tous les fichiers du dossier d'entrée,\
puis, on les lis tous en mémoire\
(puis, chaque est parsé avec le bon encoding, puis parsé en xml, puis anonymisé, puis resérialisé, puis posé sur disque)

Chaque fichier fait 10-20Mo
Avec cette première opération, ma première crainte était que la mémoire explose instantanément avec toutes ces lectures. 50 fichiers font déjà ~1Go... sans compter la duplication associée au parsing en string, puis en xml

## Conditions

J'ai essayé `npm run benchmark` sur entre 10 et 80 fichiers de 10-20Mo chacun. Il s'agit de fichiers du Conseil Départemental de la Gironde. Il s'agit d'un cas un peu pessimiste

Mon ordinateur est un laptop à 4 cœurs, 4Go de mémoire (dont ~3Go de dispo pour le benchmark) et 4Go de swap, disque dur qui tourne (pas SSD)


## Observations

Ce que j'ai observé, c'est que la mémoire fait des vagues (monte puis redescend). J'imagine que tous les fichiers ne sont pas directement mis en mémoire (sûrement parce que ça prend du temps de charger des fichiers de plusieurs mégas) et donc du parsing/anonymisation/écriture doit avoir lieu et le GC doit nettoyer correctement la mémoire après l'écriture. Toutefois, il y a quand même une tendance générale à la montée de l'utilisation de la mémoire (jusqu'au swap)

Beaucoup de CPUs sont actifs (pas à 100%). J'imagine qu'un sert au parsing/anonymisation et les autres sont utilisés par l'OS pour discuter avec le disque (lecture et écriture des fichiers)

À une échelle macroscopique, le temps d'anonymisation est à peu près linéaire de 10 à ~40 fichiers : **1 minute pour 10 fichiers**\
Après ~40 fichiers, le temps est un peu pire que linéaire. C'est sûrement dû au fait que le process d'anonymisation utilise du swap. Peut⁻être plus de temps passé à GC aussi ?

À 80 fichiers, le process node.js a crashé après avoir échoué à allouer de la mémoire


## Idée pour la suite

### Gestion de la mémoire

Ne pas tout charger d'un coup

Créer une "fenêtre" de 5-10 fichiers qui sont traités simultanément pour que la mémoire ne croisse pas indéfiniment

### Projection d'échelle

1 minute pour 10 fichiers, ça donne :
- ~4h de calcul machine (quelques minutes de temps humain pour lancer le script et constater que ça s'est bien passé) pour 2000 fichiers, ce qui semble très acceptable pour une opération qui a besoin d'avoir lieu une fois par an
- ~7 jours (10000 minutes) de temps de calcul pour 100000 fichiers... ce qui fait un peu beaucoup, mais ptèt que c'est ok ne de pas faire les 100000 d'un coup. Une discussion pour une autre fois 


# Rapport de benchmark du 28 février 2021

J'ai fait 2 changements :
- les fichiers sont chargés par fenêtre glissante de 10 parallèlement
- pris des fichiers plus petits pour le benchmark


## Crash résolu

Après le changement sur le chargement des fichiers, le crash à 80 fichiers n'existe plus

J'ai testé de faire tourner l'outil sur 600 fichiers et ça a tourné sans aucun problème

Je n'ai pas testé sur plus que ça, mais il n'y a plus aucun signe de limite de fichiers (il n'y a plus de ralentissements, etc.)

Temps d'anonymisation en fonction du nombre de fichiers
10 fichiers: 1:03 
20 fichiers: 2:06
40 fichiers: 4:15
60 fichiers: 7:03
80 fichiers: 9:15
100 fichiers: 11:13
200 fichiers: 23:25
600 fichiers: 1:02:58


## Changements des fichiers de benchmark

J'ai eu une intuition que le nombre de méga-octets est une meilleure base de mesure pour la performance quele nombre de fichiers

J'ai changé les fichiers du benchmark (passant d'un total 74.1Mo sur les 5 fichiers à 5 autres fichiers totalisant 49Mo) et j'ai pu confirmé cette intuition

Nouveaux temps sur mon ordi : 
10 fichiers : 40s
50 fichiers : 3:14 (194s)
100 fichiers : 6:40 (400s)

**Sur ma machine, l'anonymisation se fait à la vitesse de 0.4s/Mo**


## Extrapolation

Imaginons un ensemble de fichiers à anonymiser de 2To

Il faudrait 800000 secondes (= ~9 jours et 6 heures)


