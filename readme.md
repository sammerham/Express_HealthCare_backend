# Healthcare Appointment System 

Healthcare Appointment System is a Backend API for making appointments for doctors, built with Node Express JS.


# Deployed Version: 
https://sodlcscare.herokuapp.com/

Adim user credentials (username:admin ) (password:admin)
regular user credentials (username:user ) (password:user1234)

- You can use this API using Insomnia or Postman
- make sure to get a token by accessing below like as POST request
   https://sodlcscare.herokuapp.com/auth/login
- using above credentials for admin or regular user
- Once you get a token back , make sure to included as an authorization header in all of your future request
- authorization: Bearer`TOKEN`


## Installation

Use the node package manager to install install all the dependencies.

```bash
npm install
```
## Starting Server 3001

```bash
node server.js
``` 
If you have nodemon installed:
```bash
nodemon server.js
``` 
## Testing
Tests are written using Jest and SuperTest, to run tests:

```bash
jest file name
``` 
## Notes about the app
- You can't make more than three appts for the same doctor at the same time.
- New appointments can only start at 15 minute intervals (ie, 8:15AM is a valid time
but 8:20AM is not)
A doctor can have multiple appointments with the same time, but no more than 3
appointments can be added with the same time for a given doctor.
- This API is fully authenticated. You need to register, get a token and add it as a header to access protected routes, ex. authorization: Bearer Token
## Routes : 
- Most of the routes are fully protected by (enusreAdmin, ensureLoggedIn, ensureCorrectUserOrAdmin)
#### /auth: 
- auth/login
* once successfully complete login you get a token to be used in other routes by adding it as a header authorization: Bearer Token.
- users: Adds, edit, delete user. This is not the registration endpoint --- instead, this is
 only for admin users to Adds, edit, delete user. The new user being added can be an admin.
#### These routes are protected :
### /users:
- /users : (Post) --> Adds a new user, requires Admin authorization.
-/users :(get) --> Returns list of all users , requires Admin authorization.
-/users/:username (get)--> Get a user by username, requires Admin or same user-as-:username authorization.
-/users/:username (patch)--> Edit a user by username, requires Admin or same user-as-:username authorization.
-/users/:username (delete)--> Delete a user by username, requires Admin authorization.
### /doctors:
- /doctors(get)--> Returns list of all doctors , requires login authorization.
- /doctors/name (get)--> (takes fName - lName )Returns doctor that matches , requires login authorization
- /doctors/name/appts (get)--> (takes fName - lName )Returns all the appts for the doctor that matches , requires login authorization
- /doctors/name/appts/date (get)--> (takes fName - lName, date )Returns all the appts on provided date for the doctor that matches , requires login authorization
- /doctors/:id (get)--> Returns doctor that matches provided id , requires login authorization
- /doctors/:id /appts(get)--> Returns all appts for the doctor that matches provided id , requires login authorization.
- /doctors/:id /appts/date (get)--> (takes date )Returns all appts on provided date for the doctor that matches provided id , requires login authorization.
- doctors/(post) adds a doctor. requires login authorization.requires login authorization.
- doctors/:id(delete) deletes a doctor that matches provided id.requires login authorization.
- doctors/:id(patch) updates a doctor that matches provided id, requires admin authorization.

### /appts:

- /appts(get)--> Returns list of all appointments , requires login authorization.
- /appts/:id (get)--> Returns appointments that matches provided id , requires login authorization
- /appts/(post) adds an appointment . requires login authorization.requires login authorization.
- /appts/:id(delete) deletes an appointment that matches provided id.requires login authorization.
- /appts/:id(patch) updates an appointment that matches provided id, requires login authorization.

## Thank you