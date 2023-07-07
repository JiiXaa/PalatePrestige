## Manual Testing

### Authentication

| Test Description                                 | Expected Result                                                                                                                                                            | Actual Result |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Navbar 'Sign Up' redirect to the Signup page     | Clicking the button redirects to the signup page                                                                                                                           | Pass          |
| Signup page field validation (excluding picture) | Input is empty, front-end/backend validation works correctly and user gets appropriate error message                                                                       | Pass          |
| Successful user signup                           | On signup button click, user is redirected to the 'verify your email' page                                                                                                 | Pass          |
| Email verification received                      | Received email contains necessary information and a link to confirm email address                                                                                          | Pass          |
| Confirm email address page                       | Clicking the 'Confirm' button finishes the signup process and redirects to the login page view                                                                             | Pass          |
| Sign in page view                                | If user is not logged in, they can use the login page to sign in with login/password                                                                                       | Pass          |
| Sign in page view Sign in button click           | If successfully logged in, user is redirected to the all chefs page view                                                                                                   | Pass          |
| Sign in page view 'Forgot password?'             | Clicking on the link redirects to the password reset view page                                                                                                             | Pass          |
| Password Reset page view                         | User can reset password with an email, clicking on 'Reset My Password' sends instructions to the correct user email                                                        | Pass          |
| Password reset email                             | User can use the received link in the email to reset their current password                                                                                                | Pass          |
| Password reset email (reset email link)          | Clicking on the reset link redirects to the change password view page                                                                                                      | Pass          |
| Change password view page                        | User can change password by filling new password/new password again, clicking on 'Change Password' changes the password and redirects to change password confirmation page | Pass          |

### Homepage view unlogged/logged-in user

| Test Description | Expected Result                                               | Actual Result |
| ---------------- | ------------------------------------------------------------- | ------------- |
| Homepage view    | Homepage shows information about the page and available menus | Pass          |

### Navbar actions unlogged/logged-in user

| Test Description       | Expected Result                                                                                                | Actual Result |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| Search for menus input | Searching for menus from the search input displays found menus, if not found, information is shown to the user | Pass          |
| All Chefs link         | Clicking on the All Chefs link redirects to the page showcasing all available chefs                            | Pass          |
| Search by categories   | Searching for menus by categories displays the chosen menu type on the page                                    | Pass          |

### Home Page unlogged/logged-in user actions

| Test Description                        | Expected Result                                                                                                                                  | Actual Result |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| Homepage view                           | Correct menus are shown with the corresponding chef name, rating, category, description image, price, and button pointing to the menu chef/owner | Pass          |
| Click on the menu title                 | Clicking on the menu's title redirects to the correct menu                                                                                       | Pass          |
| Click on the 'View Chef Profile' button | Clicking on the button redirects to the correct menu chef/owner                                                                                  | Pass          |
| Menus page pagination                   | Every page displays 8 menus                                                                                                                      | Pass          |

### Unlogged/logged-in user 404 page:

| Test Description | Expected Result                                                                              | Actual Result |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------- |
| 404 page         | When trying to access link that does not exists 404 page is displayed with button to go back | pass          |

### All chefs page unlogged/logged-in user:

| Test Description                                                                               | Expected Result                                                                  | Actual Result |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------- |
| All chef cards displayed with correct details and links to access a chef                       | cick on the chef’s Name or ‘More Details’ button redirect to correct chef’s page | pass          |
| Chef cards display description, menu categories and average rating                             | all chef details are clear to the user                                           | pass          |
| User have an access to the chefs calendar to see available dates before decide to login/signup | pass                                                                             |

### Chosen chef detail page unlogged user:

| Test Description                                                     | Expected Result                                                                                   | Actual Result |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| A clear indication that need to log in                               | in the chef detail there is cta button ‘Login to Book’ / navbar also provides Login/Signups links | pass          |
| Unlogged user can view available menus before decide to login/signup | click on the menu name opens all dishes available in the menu                                     | pass          |
| CTA ‘Login to Book’ and navbar Login redirect to the Login page      | click on each button directs to the login page                                                    | pass          |

### Chosen chef detail page logged-in customer actions:

| Test Description                                            | Expected Result                                                                                                                               | Actual Result                                                                                                                                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Booking summary visible only for logged in user             | only logged in user can add/clear selected booking date/menu                                                                                  | pass                                                                                                                                                                                        |
| Add menu to the booking                                     | on ‘Add to Booking’ click chosen menu is being added to the booking summary                                                                   | pass                                                                                                                                                                                        |
| Add to Booking button click                                 | when chosen menu is added to the booking clicked button disappears and is no longer accessible until other menu is added or booking finalised | pass                                                                                                                                                                                        |
| Add date/availability to the booking                        | customer can chose from available dates, when chosen date is clicked it gets added to the booking summary                                     | pass                                                                                                                                                                                        |
| Add date/availability to the booking (Not available)        | if Not Available date is clicked it notifies user about that and suggests to pick other date                                                  | pass                                                                                                                                                                                        |
| Add date/availability to the booking (Empty calendar field) | if customer clicks on empty calendar field, it gets notified about that the chef is not available                                             | pass                                                                                                                                                                                        |
| Booking summary                                             | if both available date and menu are added the chef/owner is also added to the booking                                                         | pass                                                                                                                                                                                        |
| Booking summary                                             | price is calculated depending on menu price and number of guests                                                                              | pass                                                                                                                                                                                        |
| Booking summary (number of guests)                          | price is automatically calculated with minimum guest count 8 but customer have option to add more                                             | pass                                                                                                                                                                                        |
| Booking summary (adding guests)                             | when customer adds more guests the ‘Total Price’ is updated                                                                                   | pass                                                                                                                                                                                        |
| Booking summary (localStorage)                              | the booking summary is saved to the localStorage                                                                                              | pass                                                                                                                                                                                        |
| Booking summary (localStorage persistence)                  | the booking summary is being saved in localStorage even when customer browse other chef profiles                                              | failed, localStorage is reset when customer visits other chef profiles. It need to be fixed.                                                                                                |
| Booking summary (clear booking)                             | when customer clicks on the clear booking the booking summary data is cleared                                                                 | pass                                                                                                                                                                                        |
| Reviews                                                     | customer can view all chefs reviews – customer can see average review score and all reviews                                                   | pass                                                                                                                                                                                        |
| Reviews (if more than 6)                                    | if there are more than 6 reviews only 6 are shown and rest collapses and can be open with Show More button                                    | pass                                                                                                                                                                                        |
| Booking finalization (success)                              | when all correct data is chosen customer can click book button                                                                                | pass                                                                                                                                                                                        |
| Booking finalization (missing data)                         | when customer does not choose all necessary items gets information what is missing                                                            | failed, the stripe modal is being shown but when customer tries to submit payment it gets notified about the missing item. That behaviour should be moved before Stripe modal is displayed. |
| Book button press                                           | when customer clicks on the ‘Book’ button the Stripe payment modal is opened                                                                  | pass                                                                                                                                                                                        |
| Stripe payment modal (success)                              | customer have to use email and fake card 4242-4242-4242-4242 future date and any CVC number to successfully finish booking and pay            | pass                                                                                                                                                                                        |
| Stripe payment modal (missing data)                         | if there is missing card numbers notify customer: Your card's security code is incomplete                                                     | pass                                                                                                                                                                                        |
| Stripe Payment Submit Payment                               | when customer submits payment it gets notified that the payment is successful                                                                 | pass                                                                                                                                                                                        |
| Booking completed                                           | all data is saved in the server and booking summary can be view in the customer profile                                                       | pass                                                                                                                                                                                        |

### Customer Profile:

| Test Description                                    | Expected Result                                                                                                                            | Actual Result |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| Only logged in customer can access own profile page | customer cannot view other customers profile pages                                                                                         | pass          |
| Customer Profile page is restricted Django view     | if customer is not logged in/trying access different customer profile gets redirected to the login page                                    | pass          |
| Customer Profile page displays customer details     | the email and username is displayed                                                                                                        | pass          |
| Customer Profile page contains all booking history  | customer can see summary for each booking containing booked: chef, menu, booking date, status, total cost and action for add/update review | pass          |
| Customer profile (booking summary actions)          | customer can add review per booking on ‘Add Review’ button click, if already added the ‘Update Review’ button is displayed instead         | pass          |
| Customer profile (Add review)                       | on click ‘Add Review’ button customer gets redirected to the Add review page                                                               | pass          |
| Customer profile (Edit review)                      | on click ‘Edit Review’ button customer gets redirected to the Add review page                                                              | pass          |

### Add/Edit Review page:

| Test Description                                                      | Expected Result                                                                                | Actual Result |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| Each add/edit review page allow user to add/edit review for a booking | add/edit page allows customer to click on the star base rating number and leave review message | pass          |

### Chef detail page logged-in chef actions:

| Test Description                                 | Expected Result                                                                                                     | Actual Result |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| Chef/owner can edit profile                      | click on the ‘Edit Profile’ redirects to the edit profile page                                                      | pass          |
| Chef/owner can add menu                          | click on the ‘Add Menu’ redirects to the add menu page                                                              | pass          |
| Chef/owner can view all added menus              | click on chosen menu will open menu detail page containing menu description and available dishes                    | pass          |
| Chef/owner can add/remove/update calendar events | by clicking on empty calendar slot availability is being added and stored in database                               | pass          |
| Chef/owner can add/remove/update calendar events | by clicking on chosen availability calendar slot chef can delete it                                                 | pass          |
| Chef/owner can add/remove/update calendar events | by dragging chosen availability calendar slot chef can edit it                                                      | pass          |
| Chef/owner can add/remove/update calendar events | by holding and dragging the bottom part of the availability slot chef can update time duration (default is 4 hours) | pass          |

### Add menu with chefs user permissions:

| Test Description                      | Expected Result                                                                                                                           | Actual Result |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Add a new menu page                   | all fields are required and validated on the front end backed and notify user if something is missing                                     | pass          |
| Add a new menu page (add menu action) | when clicked on ‘Add menu’ user is being notified that menu was added or not / depending on success/error and redirected to add dish page | pass          |
| Add a new menu page (back action)     | on ‘Back’ button click user is redirected to the chef’s profile                                                                           | pass          |

## Add dish to the specific menu:

| Test Description           | Expected Result                                                                                                       | Actual Result |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------- |
| Add a dish to a menu       | all fields (but not image) are required and validated on the front end backed and notify user if something is missing | pass          |
| Add a dish to a menu image | image is not necessary on the adding dish stage, it can be added/edited after                                         | pass          |
| Successfully added dish    | successfully added dish is saved in database and displayed in the specific menu                                       | pass          |

### Menu detail page:

| Test Description                                                                | Expected Result                                                                                                                   | Actual Result |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Viewed menu displays all available dishes with actions to add/edit/delete menus | all CRUD buttons are located on top of the menu page                                                                              | pass          |
| Displayed dishes contains edit/delete dish actions (buttons)                    | all action buttons are located on the bottom of each dish card                                                                    | pass          |
| Chef’s Profile button                                                           | chef have a easy access to go back to the profile on ‘Chef’s profile’ button click                                                | pass          |
| Add dish button                                                                 | allows chef add a dish to the menu by filling add dish form                                                                       | pass          |
| Edit Menu button                                                                | allows chef to edit specific menu by filling necessary form fields                                                                | pass          |
| Delete Menu button                                                              | chef can delete menu. Menu deletion uses ‘soft deletion’ technique that allows preserve data for customer booking summary/history | pass          |
| Edit Dish button                                                                | allows edit dish by filling necessary form fields                                                                                 | pass          |
| Delete Dish button                                                              | allows to delete a dish from the specific menu                                                                                    | pass          |
| Menu CRUD flow                                                                  | all actions for add/edit/delete menu was tested and works as intended                                                             | pass          |
| Dish CRUD flow                                                                  | all actions for add/edit/delete dish was tested and works as intended                                                             | pass          |

## Extra features:

- Past event dates automatic removal:
  - Passed-date chef availabilities are deleted with the fetch request sending to the server.
  - remove_past_availabilities Python function loops through all availabilities and removes the ones that are outdated.

## Known bugs / errors:

- The booking flow lacks address handling for the booking where the chef would have information about the booked event (date, address, name of the customer, and booked menu).

- The booking summary is currently only accessible from the chef's profile, which limits the user experience. It would be beneficial to separate the booking summary functionality and provide a better user flow. The initial approach was to handle booking functionality dynamically with JavaScript to avoid page reloads on every input change. However, in retrospect, it would be more effective to save the data in the database before the booking is finalized. This would allow for the display of a booking summary or cart before the completion of the booking. Addressing this issue will be a priority in the next iteration.

- Only users with the Chef role have the option to edit their profile at this stage. Need to add edit profile functionality to the user with Customer role

- LocalStorage only stores the booking summary data for the latest chef visited. Refactoring the JavaScript code is needed to preserve the last booking until the user adds a date or menu, then clear it and add new user-chosen data.

- The All chefs page needs pagination or a 'load more' functionality to avoid displaying too many entries to the customer at page load.

## Fixed bugs during testing:

### Issue: Booking modal ID DUPLICATION for large and mobile screens:

**Error Encountered:** <br>
During the development of the booking feature, a bug was encountered where the script for updating the price based on the number of guests count was not functioning correctly on mobile devices. The price and other selected booking details were not being updated when the number of guests input field was changed.
Troubleshooting Steps: To address the issue, the following troubleshooting steps were performed:

1. The JavaScript code was reviewed to ensure it was properly executing on mobile devices.
2. Console log statements were added to the relevant event listeners to check if the events were being triggered on mobile devices.
3. The HTML markup was examined to verify the presence and correctness of IDs for elements such as totalPrice, submitBookingBtn, selectedChef, selectedDate, selectedMenu, and numberOfGuests.
4. The JavaScript code was inspected to determine if the correct element IDs were being referenced in the event listeners.
5. The event listeners were checked to confirm if they were properly attached to the respective elements on mobile devices.
6. The variables used to store references to elements, such as totalPriceElement, selectedDate, selectedMenu, selectedChef, and numberOfGuestsInput, were reviewed to ensure they correctly targeted the elements in the mobile view.

**Resolution:** <br>
After thorough investigation, it was discovered that the issue was caused by ID duplication for the totalPrice, submitBookingBtn, selectedChef, selectedDate, selectedMenu, and numberOfGuests elements. To resolve this, the JavaScript code was modified to determine unique IDs for these elements dynamically using JavaScript. This ensured that the correct elements were targeted and updated based on the screen size.

**Conclusion:** <br>
By resolving the ID duplication issue and updating the JavaScript code to determine the unique IDs for the elements, the bug related to the price not updating based on the number of guests count on mobile devices was successfully resolved. The booking feature now functions as intended on both large screens and mobile devices.

---

### Issue: When opening the booking modal on a mobile device, Bootstrap adds a padding-right of 17px to the body element to compensate for the hidden vertical scrollbar. However, when the payment modal is opened and then closed, the padding-right on the body is not cleared, leading to an incorrect layout with additional padding. <br>

**Solution:** To resolve the issue, i have utilized the hidden.bs.modal event provided by Bootstrap, which is triggered when a modal is completely hidden. Attached an event listener to this event on the payment modal and used it to remove the inline style padding-right from the body element, effectively resetting the padding to its default value.
By listening for the hidden.bs.modal event on the payment modal and clearing the padding-right on the body element when the event is triggered, we ensure that the padding is correctly reset after closing the payment modal. This ensures a consistent and visually pleasing layout on mobile devices.

[SOLUTION FOUND HERE:](https://stackoverflow.com/questions/32862394/bootstrap-modals-keep-adding-padding-right-to-body-after-closed)

---

```js
Uncaught TypeError: can't access property "innerHTML", selectedMenu is null updateSelectionDisplay http://localhost:8000/static/js/index.js:427 <anonymous> http://localhost:8000/static/js/chefs/chef_availability.js:17 EventListener.handleEvent* http://localhost:8000/static/js/chefs/chef_availability.js:1 index.js:427:21
```

### Issue: There was an error in the code related to the JavaScript functionality of the booking feature. The error occurred because the booking JavaScript relied on elements from the booking_large.html template, but those elements were conditionally excluded from the DOM when the authentication and group conditions were not met. <br>

**Solution:** Instead of excluding the elements completely, it was necessary to keep them in the DOM but hide them conditionally. The solution involved modifying the code to include the booking_large.html template with a hide parameter set to True or False based on the authentication and group condition. Similarly, the booking_mobile.html template was included with the same hide parameter. In the included templates, a CSS class called hidden was added to the outermost container elements that needed to be hidden. The hidden class was defined in CSS with opacity: 0 to hide the elements while keeping them in the DOM.

## PEP 8 Validation:

PEP 8 is a widely accepted style guide for Python code that promotes clean and readable code. I have performed a thorough PEP 8 validation on all files in the project, ensuring compliance with the guidelines.

During the validation process, I reviewed each file and made necessary adjustments to eliminate any PEP 8 violations. This ensures consistent code formatting and reduces potential errors.

As a result, all files in the project have been checked for PEP 8 errors and modified to meet the PEP 8 requirements. This adherence to industry-standard conventions enhances code readability and maintainability.
