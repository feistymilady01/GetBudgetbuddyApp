# User-registration-and-login-without-JWT
JWT-based user Authentication using ReactJs, Node Express, and MySQL

To obtain the skeletal structure for the package

npx create-react-app 

Please specify the project directory:
create-react-app GetBudgetbuddyApp

# on the server directory

Now install Express in the server application and save it in the dependencies list using the following command on the terminal.

npm install express -–save

Finally, we need to install the “mysql2” Javascript module on our server dependencies. However, the “mysql” module was used during the tutorial I followed, but newer versions of MySQL database servers don’t support the “mysql” Javascript module. Therefore, “MySQL2” should be used with the newer versions of MySQL database servers. To install the “mysql2” Javascript module, we can use the following command.

npm install --save mysql2

HTTP request using Axios in React

Then we need to install the Axios to our client application which helps us make HTTP requests to HTTP servers. To install the Axios module, we can use the following command.

npm install --save axios

Setting up CORS with Express

We need to install the cors to our server application. CORS is an acronym for Cross-Origin Resource Sharing. It is a mechanism to allow or restrict requested resources on a web server depending on where the HTTP request originated. In other words, CORS is a browser security feature that restricts cross-origin HTTP requests with other servers and specifies which domains can access your resources. The CORS javascript module can be installed using the below command.

npm install -- save cors


2. Implementing the Sessions and Cookies
2.1. Prepare libraries

Before the setup of “sessions” and “cookies”, we need to install three packages to our server application as follows.

npm install --save express-session body-parser cookie-parser
Here, the “body parser” is responsible for parsing the incoming request bodies in a middleware before you handle it. Then the “cookie parser” is used to parse the cookie header to store data on the browser whenever a session is established on the server side. And “express-session” is an HTTP server-side framework used to create and manage a session middleware.

1. Implement JWT
JWT represents a compact and self-contained method for securely transmitting information between parties as a JSON object. First, we need to install a package called JSON web token inside the server folder using the following command.

npm install --save jsonwebtoken

To spin up the containers

first login on docker hub

docker-compose build

docker-compose up -d

Here's a brief explanation of each command:

    docker-compose build: This command is used to build the Docker images defined in your Docker Compose file. It reads the instructions from your Dockerfile for each service defined in docker-compose.yml and creates a Docker image for each service. This is necessary before running containers from those images.

    docker-compose up -d: This command is used to start the services defined in your Docker Compose file. The -d flag stands for "detached" mode, which means the containers will run in the background. It starts containers based on the images that were built with a docker-compose build.

Here's the typical workflow for using these commands:

    Create a docker-compose.yml file in your project directory, defining the services, networks, and volumes required for your application.

    Run docker-compose build to build the Docker images for your services. This step is necessary whenever you make changes to your application code, dependencies, or Dockerfiles.

    After building the images, run docker-compose up -d to start the containers in detached mode. Your services will be running, and you can access them as configured in your docker-compose.yml.

    To stop and remove the containers started with docker-compose up, you can use docker-compose down.

Make sure you are in the directory where your docker-compose.yml file is located when running these commands.

## login into the site using : localhost:3000

## login into the database using : localhost:8080

#create a table with 5 rows: 
  -making sure the id is automated
  -the fullname and the password is VARCHAR length is 20 or 50
  -coalition of the whole table is utf8_general_ci