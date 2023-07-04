from django import template

register = template.Library()


# Custom filter to split a string into a list used in the chef profile page to show the cuisine types
@register.filter
def split_string(value, separator):
    return value.split(separator)


# Custom filter to get the class name of an object used in the chef profile page to show the  textareas elements
# solution found here: https://stackoverflow.com/questions/4938303/how-to-properly-make-custom-filter-in-django-framework
@register.filter(name="class_name")
def class_name(value):
    return value.__class__.__name__
