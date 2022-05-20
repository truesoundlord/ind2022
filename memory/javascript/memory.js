class MemoryGame
{
	// construire l'objet MemoryGame
	constructor()
	{
		// récupérer tous les éléments dans la page HTML qui correspondent à une image
		this.cardsContainer = document.getElementById("plateau").getElementsByTagName("img");
		this.cards = [...this.cardsContainer];
		this.flippedCards = [];
		this.delay = 1000;
		
		// Tentative de mélange

		this.indexes = [...this.cardsContainer];
		this.cpt=0;
		while(this.cpt<this.indexes.length)
		{
			this.indexes[this.cpt]=this.cpt;
			this.cpt++;
		}

		// nous avons un tableau avec les indices

		this.indexes.sort(function(a,b){return 0.75 - Math.random()});

		// Les indices sont distribués de manière "aléatoire"
		// BUG: souvent la première et la dernière image sont identiques (plus le cas avec .75 au lieu de .50)

		this.cpt=0;
		while(this.cpt<this.cards.length)
		{
			this.oldalt=this.cards[this.cpt].alt;
			this.cards[this.cpt].alt=this.cards[this.indexes[this.cpt]].alt;
			this.cards[this.indexes[this.cpt]].alt=this.oldalt;
			this.cpt++;
		}
	}

	// Pouvoir recommencer une partie...
	Victory()
	{
		this.cardsContainer = document.getElementById("plateau").getElementsByTagName("img");
		this.cards = [...this.cardsContainer];
		this.flippedCards = [];
		this.delay = 1000;
		this.indexes = [...this.cardsContainer];
		this.cpt=0;
		
		// nous faisons en sorte de ne disposer que les cartes retournées...
		
		while(this.cpt<this.indexes.length)
		{
			this.cards[this.cpt].src="../html/images/card-cover.png";
			this.indexes[this.cpt]=this.cpt;
			this.cpt++;
		}

		// nous avons un tableau avec les indices

		this.indexes.sort(function(a,b){return 0.75 - Math.random()});
		
		// Les indices sont distribués de manière aléatoire

		this.cpt=0;
		while(this.cpt<this.cards.length)
		{
			this.oldsrc=this.cards[this.cpt].alt;
			this.cards[this.cpt].alt=this.cards[this.indexes[this.cpt]].alt;
			this.cards[this.indexes[this.cpt]].alt=this.oldsrc;
			this.cpt++;
		}

		this.cards.forEach(card => {
		
		card.classList.remove('no-event');			// enlever les "flags" no-event
		card.classList.remove('has-match');			// enlever les "flags" has-match
		});
	}

	validateCards()
	{
		const firstCard=this.flippedCards.pop();					// on place la carte sur la pile (comme les assiettes)
		const secondCard=this.flippedCards.pop();					// on place l'autre carte sélectionnée sur la pile

		// si les deux cartes sont identiques en comparant les attributs "alt"
		if (firstCard.alt === secondCard.alt)							
		{
			
			// Dans ma première version j'ai fait un oubli...
			
			firstCard.classList.add('has-match');						// indiquer que les cartes correspondent...
			secondCard.classList.add('has-match');					// ...en ajoutant le "flag" has-match aux deux cartes

			// Vérifier si toutes les cartes ont été retournées...
			
      setTimeout(() =>
      {
				const allHaveMatches = this.cards.every(card =>
				(
					card.classList.contains('has-match')	// si la carte contient la classe/le flag "has-match" on ajoute 1 à un compteur interne
        ));

        // Si toutes les cartes (ici 20) ont le flag 'has match' alors... 
				
        if (allHaveMatches) // Si le compteur interne correspond au nombre d'éléments de la liste/du tableau "card" allHaveMatches devrait être à "true"...
				{
					this.Victory();	// ...nous avons gagné !!
        }
			}, this.delay);
		}
		else // sinon...
		{
			setTimeout(() => {
			
			firstCard.src="../html/images/card-cover.png";			// ...il faut restaurer l'image de la carte comme étant "retournée"
			secondCard.src="../html/images/card-cover.png";			// ...pareille pour la seconde
	
			firstCard.classList.remove('no-event');							// nous pouvons de nouveau "cliquer" sur la carte
			secondCard.classList.remove('no-event');						// ...et la suivante aussi

			}, this.delay);
		}
	}

	flip(selectedCard)
	{
		// lorsque l'on "clique" sur une image il faut "verouiller" celle-ci
		// de manière à ce qu'on ne puisse pas cliquer une seconde fois dessus
		
		// Grâce à la fonction toggle() de la classe classList nous ajoutons
		// "un flag" (un drapeau) qui indique l'état de la carte
		// Ici nous vérifions si le "flag" no-event est présent ou non
		// Si il est présent nous ne faisons rien (false)
		// Sinon nous vérifions si deux cartes ont été sélectionnées
		// au moyen de la méthode/attribut length du tableau flippedCards...

		if(selectedCard.classList.toggle('no-event')==true)
		{
			selectedCard.src="../html/images/"+selectedCard.alt+".png";

			this.flippedCards.push(selectedCard);

			if (this.flippedCards.length === 2)
			{
				this.validateCards(); // si deux cartes ont été sélectionnées alors on valide les cartes...
			}
		}
	}
}

const game = new MemoryGame;
// enregistrer l'écouteur pour toutes les cartes
game.cards.forEach(card => {
	card.addEventListener('click', game.flip.bind(game, card));
});
