# views.py
from django.shortcuts import render, redirect
from .forms import MovieForm, MovieSearchForm
from .models import Movie

def home(request):
    movie_form = MovieForm()        # Formulario para añadir película
    search_form = MovieSearchForm() # Formulario para buscar películas
    movies = None                   # Para almacenar resultados de búsqueda
    movie_list = Movie.objects.all()  # Lista de películas

    if request.method == 'POST':
        # Añadir película
        if 'add_movie' in request.POST:
            movie_form = MovieForm(request.POST)
            if movie_form.is_valid():
                movie_form.save()
                return redirect('home')  # Refresca la página tras añadir la película

        # Buscar películas
        elif 'search_movie' in request.POST:
            search_form = MovieSearchForm(request.POST)
            if search_form.is_valid():
                search_by = search_form.cleaned_data['search_by']
                query = search_form.cleaned_data['query']
                if search_by == 'director':
                    movies = Movie.objects.filter(director__icontains=query)
                elif search_by == 'genre':
                    movies = Movie.objects.filter(genre__icontains=query)
                else:
                    movies = Movie.objects.filter(title__icontains=query)

        # Eliminar películas
        elif 'delete_movies_by' in request.POST:
            delete_by = request.POST.get('delete_by')
            condition = request.POST.get('delete_condition')
            if delete_by == 'title':
                Movie.objects.filter(title__icontains=condition).delete()
            elif delete_by == 'director':
                Movie.objects.filter(director__icontains=condition).delete()
            elif delete_by == 'genre':
                Movie.objects.filter(genre__icontains=condition).delete()
            return redirect('home')
        # Actualizar película por condición
        elif 'update_movie_by' in request.POST:
            update_by = request.POST.get('update_by')
            condition = request.POST.get('update_condition')
            new_value = request.POST.get('new_value')
            if update_by == 'director':
                Movie.objects.filter(director__icontains=condition).update(director=new_value)
            elif update_by == 'genre':
                Movie.objects.filter(genre__icontains=condition).update(genre=new_value)
            return redirect('home')

    return render(request, 'home.html', {
        'movie_form': movie_form,
        'search_form': search_form,
        'movie_list': movie_list,
    })
