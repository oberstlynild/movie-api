const searchInput = document.getElementById('input-movie-search');
const searchButton = document.getElementById('submit-movie-search');
const moviesSearchable = document.getElementById('movies-searchable');
const moviesContainer = document.getElementById('movies-container');
const container = document.getElementById('container');
const bootstrapCards = document.getElementById('bootstrap-cards');
const myModals = document.getElementById('my-modals');

searchButton.addEventListener("click", addQuery);

function addQuery() {
	const apiQuery = searchInput.value;
	fetchMovies(apiQuery);
}

function fetchMovies(apiQuery) {
	if (!searchInput.value) {
		alert("Enter a keyword to search for");
	}
	else {
		for (i=1; i<=66; i++) {
			let url = 'https://api.themoviedb.org/3/discover/movie?api_key=f363bf74ae13d74367feb1b6dc5e325f&with_keywords=207317&page=' + i;
			fetch(url)
			.then(function(resp) {
				return resp.json();
			})
			.then(function(data) {
				drawMovies(data, apiQuery);
			})
			.catch(function() {
				alert('Cannot fetch the API');
			})
		}
		searchInput.value = "";
		bootstrapCards.innerHTML="";
		myModals.innerHTML="";
	}
}

let counter = 0;
function drawMovies(data, apiQuery) {
	for (i = 0; i<data.results.length; i++) {
		if (data.results[i].poster_path) {
			if (data.results[i].title.toLowerCase().includes(apiQuery.toLowerCase())) {
				counter++;
				let newCard = document.createElement('div');
				newCard.setAttribute('class', 'card');

				let newCardImg = document.createElement('img');
				newCardImg.setAttribute('class', 'card-img-top');
				newCardImg.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + data.results[i].poster_path);
				newCardImg.setAttribute('data-toggle', 'modal');
				newCardImg.setAttribute('data-target', '#modal' + counter + 'fix');
				newCard.appendChild(newCardImg);
				bootstrapCards.appendChild(newCard);

				let newModal = document.createElement('div');
				newModal.setAttribute('class', 'modal fade');
				newModal.setAttribute('id', 'modal' + counter + 'fix');
				newModal.setAttribute('tabindex', '-1');
				newModal.setAttribute('role', 'dialog');
				newModal.setAttribute('aria-labelledby', 'modal' + counter + 'label');
				newModal.setAttribute('aria-hidden', 'true');

				let newModalDialog = document.createElement('div');
				newModalDialog.setAttribute('class', 'modal-dialog');
				newModalDialog.setAttribute('role', 'document');
				newModal.appendChild(newModalDialog);

				let newModalContent = document.createElement('div');
				newModalContent.setAttribute('class', 'modal-content');
				newModalDialog.appendChild(newModalContent);

				let newModalHeader = document.createElement('div');
				newModalHeader.setAttribute('class', 'modal-header');
				newModalContent.appendChild(newModalHeader);

				let newModalHeaderTitle = document.createElement('h5');
				newModalHeaderTitle.setAttribute('class', 'modal-title');
				newModalHeaderTitle.setAttribute('id', 'modal' + i + 'label');
				newModalHeaderTitle.innerHTML = data.results[i].title;
				newModalHeader.appendChild(newModalHeaderTitle);

				let newModalHeaderButton = document.createElement('button');
				newModalHeaderButton.setAttribute('type', 'button');
				newModalHeaderButton.setAttribute('class', 'close');
				newModalHeaderButton.setAttribute('data-dismiss', 'modal');
				newModalHeaderButton.setAttribute('aria-label', 'Close');
				newModalHeader.appendChild(newModalHeaderButton);

				let newModalHeaderButtonSpan = document.createElement('span');
				newModalHeaderButtonSpan.setAttribute('aria-hidden', 'true');
				newModalHeaderButtonSpan.innerHTML = "&times;";
				newModalHeaderButton.appendChild(newModalHeaderButtonSpan);

				let newModalBody = document.createElement('div');
				newModalBody.setAttribute('class', 'modal-body');
				newModalContent.appendChild(newModalBody);

				let newModalBodyText = document.createElement('p');
				newModalBodyText.innerHTML = '<strong>Beskrivelse:</strong><br>' + data.results[i].overview + '<br><br><strong>Vurdering:</strong><br> ' + data.results[i].vote_average + '/10 <br><br><strong>Udgivet:</strong><br>' + data.results[i].release_date.slice(0, 4);
				newModalBody.appendChild(newModalBodyText);

				let newModalFooter = document.createElement('div');
				newModalFooter.setAttribute('class', 'modal-footer');
				newModalContent.appendChild(newModalFooter);

				let newModalFooterTrailer = document.createElement('button');
				newModalFooterTrailer.setAttribute('class', 'btn btn-primary');
				newModalFooterTrailer.setAttribute('onclick', 'window.location.href="https://www.youtube.com/results?search_query=' + data.results[i].title + ' trailer"');
				newModalFooterTrailer.innerHTML = "Søg efter trailer på youtube";
				newModalFooter.appendChild(newModalFooterTrailer);

				myModals.appendChild(newModal);




				let currentMovieId=data.results[i].id;
				let runtimeUrl = 'https://api.themoviedb.org/3/movie/' + currentMovieId + '?api_key=f363bf74ae13d74367feb1b6dc5e325f';

				fetch(runtimeUrl)
				.then(function(resp) {
					return resp.json();
				})
				.then(function(data) {
					if (data.runtime) {
						let updatedModalText = document.createElement('p');
						updatedModalText.innerHTML='<br><strong>Spilletid:</strong><br>' + data.runtime + ' min';
						newModalBody.appendChild(updatedModalText);
					}
				})
				.catch(function() {
					alert('Cannot fetch runtime API');
				})




				let creditUrl = 'https://api.themoviedb.org/3/movie/' + currentMovieId + '/credits?api_key=f363bf74ae13d74367feb1b6dc5e325f';

				fetch(creditUrl)
				.then(function(resp) {
					return resp.json();
				})
				.then(function(data) {
					
					if (data.crew) {
						let directors = [];
						for (i = 0; i<data.crew.length; i++) {
							if (data.crew[i].job == "Director") {
								directors.push(data.crew[i].name);
							}
						}


						if (directors.length === 1) {
							let directorPara = document.createElement('p');
							directorPara.innerHTML ='<br><strong>Instruktør:</strong>';
							newModalBody.appendChild(directorPara);

							for (i = 0; i<directors.length; i++) {
								let updatedModalText = document.createElement('span');
								updatedModalText.innerHTML='<br>' + directors[i];
								directorPara.appendChild(updatedModalText);
							}
						}

						if (directors.length > 1) {
							let directorPara = document.createElement('p');
							directorPara.innerHTML ='<br><strong>Instruktører:</strong>';
							newModalBody.appendChild(directorPara);

							for (i = 0; i<directors.length; i++) {
								let updatedModalText = document.createElement('span');
								updatedModalText.innerHTML='<br>' + directors[i];
								directorPara.appendChild(updatedModalText);
							}
						}
					}

					if (data.cast) {
						if (data.cast[4]) {
							let castPara = document.createElement('p');
							castPara.innerHTML ='<br><strong>Skuespillere:</strong>';
							newModalBody.appendChild(castPara);

							for (i = 0; i<5; i++) {
								let updatedModalText = document.createElement('span');
								updatedModalText.innerHTML='<br>' + data.cast[i].name;
								castPara.appendChild(updatedModalText);
							}
						}
					}
				})
				.catch(function() {
					alert('Cannot fetch credit API');
				})
			}
		}
	}
}