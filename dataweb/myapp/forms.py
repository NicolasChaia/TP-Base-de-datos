from django import forms
from .models import Movie

class MovieForm(forms.ModelForm):
    class Meta:
        model = Movie
        fields = ['title', 'genre', 'director']

SEARCH_CHOICES = [
    ('title', 'Título'),
    ('genre', 'Género'),
    ('director', 'Director')
]

class MovieSearchForm(forms.Form):
    search_by = forms.ChoiceField(choices=SEARCH_CHOICES, label='Buscar por')
    query = forms.CharField(max_length=100, label='Elemento a buscar')


