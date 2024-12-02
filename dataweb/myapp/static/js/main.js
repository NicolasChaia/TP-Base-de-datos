// Configuración de Firebase
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
const db = firebase.firestore();

// Función para añadir reseñas
document.getElementById('add-review-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const filmName = document.getElementById('film-name').value.trim();
    const review = document.getElementById('review').value.trim();

    if (filmName && review) {
        try {
            await db.collection('reviews').add({ filmName, review });
            alert('Review añadida exitosamente');
            document.getElementById('add-review-form').reset();
            loadReviews(); // Recargar la tabla después de añadir una reseña
        } catch (error) {
            console.error('Error al añadir la reseña:', error);
            alert('Hubo un problema al añadir la reseña.');
        }
    } else {
        alert('Por favor completa todos los campos.');
    }
});

// Función para buscar reseñas
document.getElementById('searchReviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchValue = document.getElementById('reviewInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchReviewResults');
    resultsContainer.innerHTML = '';

    if (searchValue) {
        try {
            const snapshot = await db.collection('reviews').get();
            let results = '';

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.filmName.toLowerCase().includes(searchValue)) {
                    results += `<li>${data.filmName}: ${data.review}</li>`;
                }
            });

            resultsContainer.innerHTML = results || '<li>No se encontraron resultados.</li>';
        } catch (error) {
            console.error('Error al buscar reseñas:', error);
            alert('Hubo un problema al buscar las reseñas.');
        }
    } else {
        alert('Por favor ingresa un término de búsqueda.');
    }
});

// Función para cargar todas las reseñas
async function loadReviews() {
    const tableBody = document.getElementById('reviewTableBody');
    tableBody.innerHTML = '';

    try {
        const snapshot = await db.collection('reviews').get();
        snapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.filmName}</td>
                <td>${data.review}</td>
                <td>
                    <button class="delete-btn" data-id="${doc.id}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Añadir eventos a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                try {
                    await db.collection('reviews').doc(id).delete();
                    alert('Reseña eliminada exitosamente');
                    loadReviews(); // Recargar la tabla después de eliminar
                } catch (error) {
                    console.error('Error al eliminar la reseña:', error);
                    alert('Hubo un problema al eliminar la reseña.');
                }
            });
        });
    } catch (error) {
        console.error('Error al cargar las reseñas:', error);
        alert('Hubo un problema al cargar las reseñas.');
    }
}

// Inicializar la tabla de reseñas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
});


