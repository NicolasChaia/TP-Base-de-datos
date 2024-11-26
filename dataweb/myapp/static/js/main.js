var firebaseConfig = {
	apiKey: "AIzaSyCCDmOpf0SJfMDfTQ6l3JVPQsowipHRfFI",
	authDomain: "base-de-datos-6bc22.firebaseapp.com",
	projectId: "base-de-datos-6bc22",
	storageBucket: "base-de-datos-6bc22.firebasestorage.app",
	messagingSenderId: "851585268399",
	appId: "1:851585268399:web:e30a568f25e986fedef25a",
	measurementId: "G-1QBL9TJE8N"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();

function handleReviewFormSubmission() {
	const form = document.getElementById('add-review-form');

	if (!form) {
		console.error("Formulario no encontrado.");
		return;
	}

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		const review = document.getElementById('review').value;
		const filmName = document.getElementById('film-name').value;

		if (!review || !filmName) {
			alert("Por favor, completa todos los campos.");
			return;
		}

		const reviewId = filmName + "-" + new Date().getTime();

		const filmRef = db.collection("reseñas").doc(filmName);
		filmRef.collection("reviews").doc(reviewId).set({
			review: review,
			filmName: filmName
		})
		.then(function() {
			console.log("Reseña añadida con ID: ", reviewId);
		})
		.catch(function(error) {
			console.error("Error al agregar la reseña: ", error);
		});

		form.reset();
		console.log(`Reseña añadida para la película: ${filmName}`);
	});
}

function handleSearchFormSubmission() {
	const searchForm = document.getElementById('searchReviewForm');
	const searchInput = document.getElementById('reviewInput');
	const searchResults = document.getElementById('reviewTableBody');

	searchForm.addEventListener('submit', function(event) {
		console.log("Buscando reseñas");
		event.preventDefault();

		const filmName = searchInput.value.trim();
		console.log("Buscando reseñas para:", filmName);

		if (!filmName) {
			alert("Por favor, introduce el nombre de una película.");
			return;
		}

		searchResults.innerHTML = '';

		const filmRef = db.collection("reseñas").doc(filmName);

		filmRef.collection("reviews").get()
			.then(function(querySnapshot) {
				if (querySnapshot.empty) {
					const row = document.createElement('tr');
					const cell = document.createElement('td');
					cell.setAttribute('colspan', '2');
					cell.textContent = 'No se encontraron reseñas para esta película.';
					row.appendChild(cell);
					searchResults.appendChild(row);
					return;
				}

				querySnapshot.forEach(function(doc) {
					const data = doc.data();
					const row = document.createElement('tr');

					const filmCell = document.createElement('td');
					filmCell.textContent = filmName;

					const reviewCell = document.createElement('td');
					reviewCell.textContent = data.review;

					row.appendChild(filmCell);
					row.appendChild(reviewCell);

					searchResults.appendChild(row);
				});
			})
			.catch(function(error) {
				console.error("Error al buscar reseñas: ", error);
				const row = document.createElement('tr');
				const cell = document.createElement('td');
				cell.setAttribute('colspan', '2');
				cell.textContent = 'Error al buscar reseñas. Por favor, inténtalo más tarde.';
				row.appendChild(cell);
				searchResults.appendChild(row);
			});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	handleReviewFormSubmission();
	handleSearchFormSubmission();
});
