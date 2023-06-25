from django import forms
from allauth.account.forms import SignupForm
from .models import Chef
from users.models import User


class CustomSignupForm(SignupForm):
    email = forms.EmailField(
        label="Email",
        widget=forms.TextInput(attrs={"placeholder": "Email address"}),
    )
    first_name = forms.CharField(
        max_length=30,
        label="First Name",
        widget=forms.TextInput(attrs={"placeholder": "First name"}),
    )
    last_name = forms.CharField(
        max_length=30,
        label="Last Name",
        widget=forms.TextInput(attrs={"placeholder": "Last name"}),
    )

    profile_image = forms.ImageField(
        label="Profile Image",
        required=False,
    )

    # Override __init__ to make email field autofocus
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].widget.attrs["autofocus"] = True

    # Override signup to save first and last name
    def signup(self, request, user):
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.save()
        return user

    USER_GROUP_CHOICES = (
        ("chef", "Chef"),
        ("customer", "Customer"),
    )

    user_type = forms.ChoiceField(choices=USER_GROUP_CHOICES)


class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "profile_image"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs["autofocus"] = True


class ChefForm(forms.ModelForm):
    class Meta:
        model = Chef
        fields = ["bio", "cuisine_types", "location"]
        widgets = {
            "bio": forms.Textarea(
                attrs={
                    "placeholder": "Enter bio",
                }
            ),
            "cuisine_types": forms.TextInput(
                attrs={
                    "placeholder": "Enter cuisine types",
                }
            ),
            "location": forms.TextInput(
                attrs={
                    "placeholder": "Enter location",
                }
            ),
        }
