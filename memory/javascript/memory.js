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
		//alert("Constructor... "+this.cards.length+" elements");

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
		//alert(this.indexes);

		// Les indices sont distribués de manière "aléatoire"
		// BUG: souvent la première et la dernière image sont identiques

		this.cpt=0;
		while(this.cpt<this.cards.length)
		{
			this.oldalt=this.cards[this.cpt].alt;
			this.cards[this.cpt].alt=this.cards[this.indexes[this.cpt]].alt;
			this.cards[this.indexes[this.cpt]].alt=this.oldalt;
			this.cpt++;
		}
	}

	// Pouvoir recommencer une partie
	Victory()
	{
		this.cardsContainer = document.getElementById("plateau").getElementsByTagName("img");
		this.cards = [...this.cardsContainer];
		this.flippedCards = [];
		this.delay = 1000;
		this.indexes = [...this.cardsContainer];
		this.cpt=0;
		while(this.cpt<this.indexes.length)
		{
			this.cards[this.cpt].src="../html/images/card-cover.png";
			this.indexes[this.cpt]=this.cpt;
			this.cpt++;
		}

		// nous avons un tableau avec les indices

		this.indexes.sort(function(a,b){return 0.75 - Math.random()});
		//alert(this.indexes);

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
		// card.addEventListener('click', game.flip.bind(game, card));
		card.classList.remove('no-event');			// enlever les "flags" no-event
		card.classList.remove('has-match');			// enlever les "flags" has-match
		});
	}

	validateCards()
	{
		//const [firstCard, secondCard] = this.flippedCards;

		//alert("First "+firstCard.alt);
		//alert("Second "+secondCard.alt);

		const firstCard=this.flippedCards.pop();
		const secondCard=this.flippedCards.pop();

		firstCard.classList.toggle('no-event');
		secondCard.classList.toggle('no-event');

		if (firstCard.alt === secondCard.alt)
		{
			firstCard.classList.replace('flipped', 'has-match');
			secondCard.classList.replace('flipped', 'has-match');

			
			//this.flippedCards = [];

      setTimeout(() =>
      {
				const allHaveMatches = this.cards.every(card =>
				(
					card.classList.contains('has-match')
        ));

        //firstCard.style.pointerEvents = "none";
				//secondCard.style.pointerEvents = "none";

        if (allHaveMatches)
				{
					this.Victory();
        }
			}, this.delay);
		}
		else
		{
			//alert("Perdu !!");
			setTimeout(() => {
			firstCard.classList.remove('flipped');
			secondCard.classList.remove('flipped');

			firstCard.src="../html/images/card-cover.png";
			secondCard.src="../html/images/card-cover.png";

			//this.flippedCards = [];
			firstCard.classList.remove('no-event');
			secondCard.classList.remove('no-event');

			}, this.delay);
		}
	}

	flip(selectedCard)
	{
		//alert("Click "+selectedCard.alt);
		//alert(selectedCard.classList.toggle('no-event'));

		if(selectedCard.classList.toggle('no-event')==true)
		{
			// selectedCard.classList.add('flipped'); // à quoi ça sert ??? boh ???
			selectedCard.src="../html/images/"+selectedCard.alt+".png";

			this.flippedCards.push(selectedCard);

			if (this.flippedCards.length === 2)
			{
				this.validateCards();
			}
		}
	}
}

const game = new MemoryGame;
// enregistrer l'écouteur pour toutes les cartes
game.cards.forEach(card => {
	card.addEventListener('click', game.flip.bind(game, card));
});
