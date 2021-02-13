from django import forms

from .models import Client, Invoice


class EditClientForm(forms.ModelForm):
    nif = forms.CharField(
        max_length=9,
        label='Nif',
        widget=forms.TextInput(
            attrs={
                'placeholder': '734231503',
                'class': 'form__input form__input--small',
            }))

    address = forms.CharField(
        max_length=500,
        label='Morada',
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Rua da carreira, edifício bela vista',
                'class': 'form__input',
            }))

    contact_email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(
            attrs={
                'placeholder': 'ruiptbarros@gmail.com',
                'class': 'form__input',
            }))

    contact_phone = forms.CharField(
        max_length=9,
        label='Contacto',
        widget=forms.TextInput(
            attrs={
                'input': 'tel',
                'pattern': '[0-9]{9}',
                'placeholder': '921846856',
                'class': 'form__input form__input--small',
            }))

    zip_code = forms.CharField(
        max_length=16,
        label='Código Postal',
        widget=forms.TextInput(
            attrs={
                'pattern': '[0-9]{4}-[0-9]{3}',
                'placeholder': '9125-119',
                'class': 'form__input form__input--small',
            }))

    class Meta:
        model = Client
        fields = [
            'nif',
            'address',
            'contact_email',
            'contact_phone',
            'zip_code',
        ]


class ClientForm(forms.ModelForm):
    name = forms.CharField(
        max_length=120,
        label='Nome',
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Rui Barros (Max. 120 carácteres)',
                'class': 'form__input',
            }))

    nif = forms.CharField(
        max_length=9,
        label='Nif',
        widget=forms.TextInput(
            attrs={
                'placeholder': '734231503',
                'class': 'form__input form__input--small',
            }))

    address = forms.CharField(
        max_length=500,
        label='Morada',
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Rua da carreira, edifício bela vista',
                'class': 'form__input',
            }))

    contact_email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(
            attrs={
                'placeholder': 'ruiptbarros@gmail.com',
                'class': 'form__input',
            }))

    contact_phone = forms.CharField(
        max_length=9,
        label='Contacto',
        widget=forms.TextInput(
            attrs={
                'input': 'tel',
                'pattern': '[0-9]{9}',
                'placeholder': '921846856',
                'class': 'form__input form__input--small',
            }))

    zip_code = forms.CharField(
        max_length=16,
        label='Código Postal',
        widget=forms.TextInput(
            attrs={
                'pattern': '[0-9]{4}-[0-9]{3}',
                'placeholder': '9125-119',
                'class': 'form__input form__input--small',
            }))

    class Meta:
        model = Client
        fields = [
            'name',
            'nif',
            'address',
            'contact_email',
            'contact_phone',
            'zip_code',
        ]


class InvoiceForm(forms.ModelForm):
    emission_date = forms.DateField(
        label='Data de emissão',
        widget=forms.DateInput(
            attrs={
                'class': 'form__input form__input--small',
                'type': 'date',
            }))

    provider_name = forms.CharField(
        max_length=120,
        label='Nome do Provedor',
        widget=forms.TextInput(
            attrs={
                'value': 'Valter Pereira',
                'class': 'form__input form__input--small',
            }))

    provider_nif = forms.CharField(
        max_length=9,
        label='Nif do Provedor',
        widget=forms.TextInput(
            attrs={
                'placeholder': '223345678',
                'class': 'form__input form__input--small',
            }))
    service_value = forms.DecimalField(
        label='Valor do Serviço',
        min_value=0,
        decimal_places=2,
        widget=forms.NumberInput(
            attrs={
                'placeholder': '34.5',
                'class': 'form__input form__input--small',
            }))

    iva = forms.DecimalField(
        required=False,
        decimal_places=2,
        max_digits=10,
        min_value=0,
        label='Taxa de Iva',
        widget=forms.NumberInput(
            attrs={
                'placeholder': '0.60',
                'class': 'form__input form__input--small',
            }))

    tax_explanation = forms.CharField(
        label='Razão de isenção da taxa de Iva',
        widget=forms.Textarea(
            attrs={
                'class': 'form__input form__input--textarea', }))

    service_date = forms.DateField(
        required=False,
        label='Data de Serviço',
        widget=forms.DateInput(
            attrs={
                'type': 'date',
                'class': 'form__input form__input--small', }))

    class Meta:
        model = Invoice
        fields = [
            'client',
            'emission_date',
            'provider_name',
            'provider_nif',
            'service_value',
            'iva',
            'tax_explanation',
            'service_date'
        ]
        labels = {
            'name': 'Nome:',
        }
