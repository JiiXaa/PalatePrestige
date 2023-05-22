from django import forms
from allauth.account.forms import SignupForm


class CustomSignupForm(SignupForm):
    USER_GROUP_CHOICES = (
        ("chef", "Chef"),
        ("customer", "Customer"),
    )

    user_type = forms.ChoiceField(choices=USER_GROUP_CHOICES)
