from django import template

register = template.Library()


# Custom filter to split a string into a list used in the chef profile page to show the cuisine types
@register.filter
def split_string(value, separator):
    return value.split(separator)
