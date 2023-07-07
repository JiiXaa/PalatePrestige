# PalatePrestige - A Luxury Private Chef Rental Service

<img width="960" alt="page screenshot" src="https://raw.githubusercontent.com/JiiXaa/PalatePrestige/main/.github/screenshots/palate-prestige.jpg">

## About

The **PalatePrestige** is a sophisticated app that offers a luxury chef rental service, facilitating seamless connections between talented chefs and discerning customers. With PalatePrestige, customers can effortlessly browse through a curated selection of experienced chefs and explore their menus. Whether it's a memorable celebration or an intimate gathering, customers have the freedom to book their chosen chef for a truly special culinary experience.

Customers also benefit from an intuitive booking history feature, allowing them to effortlessly track and manage their past reservations. This provides a convenient overview of their culinary adventures and ensures a seamless and personalized experience throughout.

For chefs, PalatePrestige offers a comprehensive set of tools to manage their culinary offerings. Chefs have complete control over their menus, enabling them to add, edit, and delete dishes specific to each menu. Additionally, chefs can effortlessly manage their availability by adding or removing dates from their calendar. This flexibility ensures that chefs can cater to special occasions and provide unique dining experiences tailored to each customer's needs.

Whether it's a romantic dinner, a festive celebration, or any occasion that calls for an exceptional culinary experience, The PalatePrestige has you covered. Elevate your dining experience with our talented chefs and indulge in unforgettable flavors, all conveniently arranged through our user-friendly app.

**Link to** [live site](https://palate-prestige.onrender.com)

## Contents

- [**User Stories**](#user-stories)
- [**Technologies Used**](#technologies)
- [**Database Model**](#database-model)
- [**Admin Specific Actions**](#admin-specific-actions)
- [**Testing**](#testing)
- [**Deployment**](#deployment)
- [**Recreate Project Locally**](#recreate-project-locally)
- [**Acknowledgements**](#acknowledgements)

## User Stories:

**Registration and User Accounts**

| As a/an   | I want to be able to...                         | So that I can...                                                              |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Site User | Easily register for an account                  | Have a personal account and be able to view my profile                        |
| Site User | Easily login or logout                          | Access my personal account information and access content for logged in users |
| Site User | Easily recover my password in case I forget it  | Recover access to my account                                                  |
| Site User | Receive an email confirmation after registering | Verify that my account registration was successful                            |
| Site User | Have a personalized user profile                | View my personal chef booking history                                         |

**Displaying and Navigation**

- [x] The display of content is determined by the group assigned to each individual user. Depending on their assigned group, clients are able to view pages and templates that showcase chefs' profiles and menus associated with them. On the other hand, chefs have the ability to add or edit menus that they offer to customers.</br>
      More information about the Django groups can be found: </br>
  - https://testdriven.io/blog/django-permissions/ </br>
  - https://stackoverflow.com/questions/34571880/how-to-check-in-template-if-user-belongs-to-a-group </br>

| As a/an | I want to be able to...                         | So that I can...                                         |
| ------- | ----------------------------------------------- | -------------------------------------------------------- |
| Client  | View a list of chefs                            | Select a chef to book                                    |
| Client  | View individual chef details                    | Identify the price, menu, availability, rating           |
| Client  | View individual menu details                    | Identify the dishes, and description of a menu           |
| Client  | Easily view the total price of the booking      | Keep an eye on the total sum before completing a booking |
|         |                                                 |                                                          |
| Chef    | Easily add/edit/remove menu's available to book | Keep an eye on the total sum before completing a booking |

**Chef's Service Booking**

| As a/an | I want to be able to...                    | So that I can...                      |
| ------- | ------------------------------------------ | ------------------------------------- |
| Client  | View a chef's calendar and available dates | Pick and book a date                  |
| Client  | View the confirmation page before payment  | Make sure all booking data is correct |
| Client  | Make a secure payment                      | Complete the booking process          |
| Client  | View active and previous bookings          | See all bookings                      |
|         |                                            |                                       |
| Chef    | Easily add/remove availability dates       | Manage availability                   |
| Chef    | Create various deals                       | Promote my services                   |

## Technologies:

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML/) Used for the creation of the markup of Django templates for the website content.
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/) Cascading Style Sheets language used to style individual pages.
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/) Scripting language used mainly for making website interactive (Logic for mobile menu (show/hide toggle), controlling styles addition/removal based on 'mouse' events).
- [Django](https://www.djangoproject.com/) Python-based web framework that follows the model–template–views architectural pattern.
- [PostgreSQL](https://www.postgresql.org/) open-source relational database management system emphasizing extensibility and SQL compliance.

- [Bootstrap](https://getbootstrap.com/) the world’s most popular framework for building responsive, mobile-first sites
- [django-allauth](https://django-allauth.readthedocs.io/en/latest/) provides a set of reusable Django applications addressing authentication, registration, account management, and third-party (social) account authentication.
- [Full Calendar](https://fullcalendar.io/) is a lightweight yet powerful and developer-friendly JavaScript library to create flexible, draggable event calendars on the modern web app.
- [AWS S3 Bucket](https://aws.amazon.com/s3/) Amazon Simple Storage Service (Amazon S3) is an object storage service offering industry-leading scalability, data availability, security, and performance.
- [ElephantSQL](https://www.elephantsql.com/) Used to store PostgreSQL database in cloud.

## Database Model

Implemented Django's ORM (Object-Relational Mapping) to generate the app's database schema.

Database relationships between class objects:

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

** When logged in as a superuser the 'My Account' navbar dropdown have a link to the admin panel. **

The **Django Admin Interface** provides an intuitive way to manage essential data in the project. With the admin.site registration, administrators have the ability to manipulate various key entities such as Menus, Dishes, Chef Reviews, Bookings, as well as the authentication system provided by allauth. Additionally, the admin interface allows for the management of custom roles, specifically the Chef and Customer roles, including the ability to add, edit, and delete them as needed. This streamlined interface empowers administrators to efficiently handle important data within the project.

## Testing

Full testing process and results can be found [here](https://github.com/JiiXaa/PalatePrestige/blob/main/docs/TESTING.md).

## Deployment

PalatePrestige app is hosted on **Render** [live site](https://palate-prestige.onrender.com) hosting.

- Development process:
  - Create a new Web Service
  - Connect a GitHub repository
  - Use the following values during creation:
    - Environment Python
    - Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput
    - Start Command: gunicorn palateprestige.wsgi --bind 0.0.0.0:$PORT
  - Add environment variables:
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - DATABASE_URL
    - EMAIL_HOST_PASS
    - EMAIL_HOST_USER
    - PORT
    - SECRET_KEY
    - STRIPE_PUBLIC_KEY
    - STRIPE_SECRET_KEY
  - Going forward, every push to the repo will automatically build app and deploy it in production. If the build fails, Render will automatically stop the deploy process and the existing version of the app will keep running until the next successful deploy.

## Recreate Project Locally:

To set up a local development version of the app, follow these steps:

1. Ensure that Python 3 is installed on your system.
2. Clone the project repository from the desired source (e.g., GitHub) to your local machine.
3. Create a virtual environment for the project to keep the dependencies isolated. You can use tools like virtualenv or venv for this purpose.
4. Activate the virtual environment.
5. Install the required Python packages using the provided requirements.txt file. Run the following command: <br>
   `pip install -r requirements.txt`
6. Create a file named .env in the root directory of the project. Add the following content to the file: <br>

```DEVELOPMENT=True

SECRET_KEY=xxxxx

STRIPE_PUBLIC_KEY=pk_test_xxxxxx

STRIPE_SECRET_KEY=sk_test_xxxxxx

DATABASE_URL=postgres://username:password@host/username

AWS_ACCESS_KEY_ID=xxxxx

AWS_SECRET_ACCESS_KEY=xxxxx

```

Make sure to replace the values for SECRET_KEY, STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, DATABASE_URL, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY with your own values. The provided values are placeholders and should be replaced with real ones.

7. Set up a PostgreSQL database and update the DATABASE_URL value in the .env file accordingly. (I have used the ElephantSQL hosting)

8. Run the database migrations to set up the database schema. Execute the following command:

```
python manage.py migrate
```

9. Start the development server by running the following command:

```
python manage.py runserver

```

10. To make sure that images are stored in your AWS S3 Bucket:

- S3 Bucket Configuration:

  - Create an Amazon S3 bucket on the AWS Management Console.
  - Configure the bucket to store static files and media files for the app.
  - Obtain the AWS Access Key ID and Secret Access Key for the bucket.
  - In the project's settings.py replace your S3 bucket settings:

  ```
  AWS_STORAGE_BUCKET_NAME = "<YOUR BUCKET NAME>"
  AWS_S3_REGION_NAME = "<YOUR BUCKET REGION>"
  ```

11. Stripe Integration:

- Create a Stripe account at https://stripe.com.
- Obtain the Stripe publishable key and secret key from your Stripe account.
- Open the .env file in the project's root directory.
- Update the STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY values with your Stripe keys:

```
STRIPE_PUBLIC_KEY=<your_stripe_public_key>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

12. Final Steps:

- Run the following command to collect static files:

```
python manage.py collectstatic
```

```
python manage.py runserver
```

## Acknowledgements

- My mentor Dick Vlaanderen for his advice and guidance during this project.
- The Code Institute Slack community, comprised of a vibrant and talented group of developers, has been an invaluable resource throughout my coding journey.
- Google search engine for limitless resources about web development.
- [Stackoverflow](https://stackoverflow.com/) community for general advices and solution to problems I have encountered.

[Back to contents](#contents)
