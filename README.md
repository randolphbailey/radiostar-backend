# VideoPsi Backend
This is the API for VideoPsi, a simple video sharing website.

## Technical Discussion
### Backblaze B2
Videos are uploaded to the Backblaze B2 cloud storage solution.  Functionally identical to AWS S3, B2 is considerably less expensive.  For reasons of efficiency (bandwidth mostly), the backend API authenticates with the B2 API to receive an API endpoint to upload videos to.  This information is then relayed to the front end of the user, and file upload commences directly to B2.

For interaction with the B2 API, the backblaze-b2 npm module is used.

### MySQL
Video information is captured from the front-end upload form along with the file to be uploaded.  This information, along with the information about the file from B2, is stored in a MySQL database.  Some of the fields include: Video Description, Video Title, B2 video URL, SHA-1 hash, Username, as well as other information returned by B2 regarding the exact details of the file upload procedure.

#### Sequelize
Sequelize is used as an ORM for database functions, as well as model definition.

### Passport
PassportJS is used to provide user registration and authentication.  A local strategy is used for basic registration and authentication with the MySQL server.  A JSON Web Token (JWT) is also generated and passed to the user, which is stored in localStorage.  The JWT is then used for subsequent authorization for all API calls, using a JWT Passport strategy as Express middleware for all routes where authentication is desired.

## Complete File Upload Procedure
This is an exhaustive step-by-step list of the procedure to upload a video to the site.  Front end steps are also included.
1. User completes form on front end with video title, description, and file to be uploaded.
2. Upon file field change, an SHA-1 hash of the file is calculated to be sent to B2 for data integrity.
3. User requests file upload start with GET request to...

## Technologies Used
* Node
* Express
  * Passport
  * Helmet
  * CORS
  * Morgan
  * Body-Parser
* MySQL
* Sequelize
* Backblaze B2 (via backblaze-b2 npm module)
* JSON
