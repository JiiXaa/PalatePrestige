### User Stories:

**Registration and User Accounts**

| As a/an   | I want to be able to...                         | So that I can...                                                              |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Site User | Easily register for an account                  | Have a personal account and be able to view my profile                        |
| Site User | Easily login or logout                          | Access my personal account information and access content for logged in users |
| Site User | Easily recover my password in case I forget it  | Recover access to my account                                                  |
| Site User | Receive an email confirmation after registering | Verify that my account registration was successful                            |
| Site User | Have a personalized user profile                | View my personal chef booking history                                         |

**Displaying and Navigation**

| As a/an | I want to be able to...                      | So that I can...                                         |
| ------- | -------------------------------------------- | -------------------------------------------------------- |
| Client  | View a list of chefs                         | Select a chef to book                                    |
| Client  | View individual chef details                 | Identify the price, menu, availability, rating           |
| Client  | Easily view the total amount of the bookings | Keep an eye on the total sum before completing a booking |

## Development

### Third party packages:

- [Bootstrap](https://getbootstrap.com/) the world’s most popular framework for building responsive, mobile-first sites
- [django-allauth](https://django-allauth.readthedocs.io/en/latest/) provides a set of reusable Django applications addressing authentication, registration, account management, and third-party (social) account authentication.

## Database Model

**User and Chef:** The relationship (one-to-one) between the Chef and Customer models with the built-in Django's User model is established primarily for authentication and authorization purposes. If a User is deleted, the associated Chef will be deleted too due to the 'on_delete=models.CASCADE' option.

**User and Customer:** models have a one-to-one relationship. The implication is the same as the relationship between User and Chef.

**Chef and Menu:** this is a one-to-many relationship where one Chef can have multiple Menu instances but each Menu is associated with one Chef. If a Chef is deleted, all associated Menu instances will be deleted too.

**Menu and MenuCategory:** A ForeignKey relationship exists between the Menu and MenuCategory models. This means each Menu can have one MenuCategory, but a MenuCategory can be associated with many Menu objects. If a MenuCategory is deleted, the Menu objects associated with it will not be deleted; instead, their menu_category fields (which is the ForeignKey to MenuCategory) will be set to NULL due to the on_delete=models.SET_NULL setting.

**Menu and Dish:** This is a one-to-many relationship. One Menu can have many Dish instances but each Dish is associated with one Menu. If a Menu is deleted, all related Dish instances are also deleted.

**Customer and Booking:** This is a one-to-many relationship. One Customer can have multiple Booking instances but each Booking is associated with one Customer. If a Customer is deleted, all of their Booking instances are also deleted.

**Menu and Booking:** This is another one-to-many relationship. One Menu can have multiple Booking instances but each Booking is associated with one Menu. If a Menu is deleted, all related Booking instances are also deleted.

**Chef and Deal:** This is a one-to-many relationship. One Chef can create multiple Deal instances, but each Deal is associated with one Chef. If a Chef is deleted, all related Deal instances are also deleted.

**Customer and Review:** This is a one-to-many relationship. One Customer can write multiple Review instances, but each Review is associated with one and only one Customer. If a Customer is deleted, all of their Review instances are also deleted due to the on_delete=models.CASCADE argument.

**Chef and Review:** This is another one-to-many relationship. One Chef can have multiple Review instances, but each Review is associated with one and only one Chef. If a Chef is deleted, all related Review instances are also deleted due to the on_delete=models.CASCADE argument.

## Admin specific actions

**Add menu category:**
Admin-only add menu categories simplify search and sorting while preventing an excessive number of categories for users.

Nice to have:

- [ ] Chef can request specific category addition.
