<h1 align="center"> DROP DA BOMB </h1>

## Les regles du jeu

1. [Principe Général](#principe-général)
2. [Barre de vie](#barre-de-vie)
3. [Les mains et decks](#les-mains-et-decks)
4. [La poudre](#la-poudre)
5. [Les tours](#les-tours)
6. [Les types de cartes](#les-types-de-cartes)
7. [La zone de jeu](#la-zone-de-jeu)
8. [Les modes de jeu](#les-modes-de-jeu)


### Principe général
DropDaBomb est un TBS (jeu de stratégie au tour par tour) de cartes en ligne. Les affrontements se font en un contre un, les joueurs pouvant utiliser des cartes en échange de ressources, de la poudre principalement, pour essayer de prendre le dessus sur son adversaire, jusqu'à qu'un joueur amène la barre de vie à 150 et fasse ainsi exploser la bombe principale dans le camp de son opposant.



### Barre de vie
Dans DropDaBomb, les joueurs se partagent une unique barre de vie. Quand un joueur inflige des dégâts, on dira qu'il pousse la barre de vie vers l'adversaire : ses points de vie augmente, et ceux de l'adversaire diminue.
Dès qu'un joueur atteint 150 points de vie, ce qui équivaut à faire attendre -150 points de vie à l'adversaire, alors il gagne la partie.

### Les mains et decks
Avant de rechercher un adversaire, chaque joueur constitue un Deck de 8 cartes qu'il utilisera lors de ses combats. Le joueur peut changer la composition de son Deck entre chaque match comme bon lui semble, en respectant les règles suivantes :
  * Le joueur doit posséder toutes les cartes dans son Deck;
  * Chaque carte ne peut être présente qu'une seule fois par Deck
Lors de l'ouverture des hostilités, chaque joueur pioche aléatoirement 4 cartes dans son Deck pour composer sa main initiale.
Les mains sont constituées des cartes que le joueur peut utiliser lors de son tour. Une main remplie est composée au plus de 4 cartes.
Chaque carte utilisée revient dans le Deck du joueur, en dernière position.

### La poudre
Les cartes de la main sont principalement activables en échange d'une certaine quantité d'une ressource : la poudre. Chaque joueur démarre avec une certaine quantité de poudre, et en utilise pour activer ses cartes.
La poudre est une ressource rare : l'utiliser à bon escient est bien souvent un facteur de victoire.

### Les tours
Les combats se déroulent au tour par tour. Le joueur qui commence à jouer en premier est désigné aléatoirement. Le joueur qui commence en deuxième gagne 5 unités de poudre en guise de compensation.
Chaque tour dure au plus 15 secondes, après lesquelles le joueur finit obligatoirement son tour. Durant ce laps de temps, le joueur peut activer autant de cartes qu'il n'en possède dans sa main, s'il possède assez de ressources pour cela.
A la fin de chacun de ses tours, le joueur qui vient de finir gagne 5 unités de poudre et pioche assez de cartes pour remplir sa main et donc commencer son prochain tour avec 4 cartes. Cette pioche suit le principe d'une file :
Les cartes qui ont passées le plus de temps dans le deck sont piochées en priorité. Ainsi, le tirage des cartes est toujours cyclique.

### Les types de cartes
Il existe, à ce jour, deux types de cartes, divisés ensuite en sous-groupes :
  * Les cartes instantanées :

      Ce sont les cartes qui ont un effet instantanément à la pose. Elles sont utilisables à volonté dès lors que le joueur les détient dans sa main et possède assez de poudres pour les activer.
      Parmi celles-ci, on retrouve par exemple :

    + Les bombes directes : 

        Dès la pose, ces cartes infligent un certain montant de dégâts, et poussant la barre de vie vers l'adversaire. Elles peuvent aussi attaquer un batiment en vue de réduire sa vie, voire de le détruire. 
         
    + Les boucliers : 

        Dès la pose, ces cartes remplissent une jauge de protection propre au joueur : tant que celle-ci n'est pas consumée, en absorbant une quantité de dégâts par exemple, la barre de vie ne peut pas être poussée vers le joueur.

    + Les sorts instantanés :
    
        Dès la pose, ces cartes ont un effet divers sur le cours de la partie, de la génération d'une nouvelle main à la copie d'une carte de l'adversaire en passant par la désintégration d'une carte persistante adverse.

 * Les cartes persistantes :

      Ce sont les cartes qui restent actives tant qu'on ne les a pas détruites. Ces cartes sont alors placées sur la zone de jeu, et ne peuvent être retirées que naturellement ou par l'utilisation d'un sort. Chaque joueur ne peut avoir que 5 cartes persistantes actives à la fois.
      Parmi celles-ci, on retrouve par exemple :

    + Les bombes à chargement : 
        
        Ce sont des bombes qui mettent deux tours à se charger. Au terme de ces deux tours de chargement, elles explosent et infligent un certain montant de dégâts. Si elles sont supprimées avant la fin de leurs chargements, ces bombes n'explosent pas et n'infligent donc aucun dommage.

    + Les bâtiments : 

        Ce sont des cartes persistantes qui ont un effet tous les tours tant qu'elles sont présentes sur la zone de jeu. Elles partagent les caractéristiques des cartes persistantes,
        Notamment la possibilité d'être désintégrés, mais possèdent des points de vie, sont améliorables jusqu'à deux fois, et peuvent être aussi attaqués avec des bombes directes :

        * Si ses points de vie tombent à 0, le bâtiment perd un niveau d'amélioration, sauf s'il était au niveau 1 d'amélioration, auquel cas il est totalement détruit et supprimé de la zone de jeu.

        * Lors de l'amélioration d'un bâtiment, celui-ci devient plus efficace et plus robuste : ses effets périodiques sont plus puissants, il recharge ses points de vie, et obtient un bonus de points de vie. Un bâtiment ne peut pas dépasser le niveau 3 d'amélioration.

    + Les sorts persistants : ce sont des sorts qui restent actifs tant qu'ils ne sont pas détruits, et se déclenchent dès qu'ils le peuvent.


### La zone de jeu

Voir la section [Interface du jeu](Interface.md) pour une description détaillée.

### Les modes de jeu


Un seul mode de jeu pour la v1.

En l’état, aucune limite de temps n’est fixée, et tous les joueurs quelques soit leurs niveaux peuvent se rencontrer. Dans les futures évolutions du jeu, des niveaux de joueurs seront créés, et des « arènes » différentes permettront aux joueurs de jouer uniquement contre des joueurs d’un même niveau.

De plus, différents types de rencontres sont imaginables (matchs amicaux, matchs classiques, matchs de tournoi, etc…) avec pour chaque mode des règles spécifiques.

Ces fonctionnalités concernent les prochaines versions du jeu, nous parlerons donc pour l’instant du seul mode de jeu disponible.