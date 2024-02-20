---
---

---

# Notes to startup the services successfully

1. add an .env file with these varaibles

```env

# database variables
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
TYPEORM_SYNCHRONIZE=

# app
JWT_SECRET=

# pgAdmin
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

2. use command `docker compose up`

please note:

> I didn't implement unit testing for every service and every case, I just created enough unit tests to prove a point.

> for e2e testing I tried to use testcontainers but it required to have `docker` command to run without `sudo` command, but I don't have the right to do this on the current machine I use.

> so I just installed testcontainer package and created a ready-to-use test module.

### `How can we scale this users service to serve 10000 then 1M users?`

- I didn't have an answer of my own, but I tried to find a reasonable answer
- I found one answer that I think is reasonable to me

  1. Use a CDN for all static assets.
  2. use HTTP caching
  3. make sure servers are stateless so they can scale horizontally. This usually involves thinking carefully about how you do user sessions.
  4. use a good load balancer
  5. Be sure that your database, data structures, and APIs are optimized for the correct kind of performance. In most cases you have to choose between faster write performance or faster read performance. Most apps should optimize for read performance, but not always. You may have a mix of needs between different APIs and it could change over time. Stay on top of the requirements.
  6. Invest in multi-region deployments.
  7. use RAM instead of hard drive space, wherever possible.
  8. Use microservices, where appropriate.

---

**Coding Test for Senior Node.js Developer**

**Overview**

In this coding test, you will be asked to build a simple RESTful API using Node.js, NestJS, TypeScript, and PostgreSQL. The API will allow users to create, read, update, and delete (CRUD) posts. Each post will have a title, content, author, and timestamp. You will also need to write unit and e2e tests for the API using Jest and Testcontainers. You will also need to use Docker and Docker Compose to containerize the application and the database.

**Requirements**

- You should use Node.js version 14 or higher, NestJS version 8 or higher, TypeScript version 4 or higher, and PostgreSQL version 13 or higher.
- You should use TypeORM and the @nestjs/typeorm module to connect to the PostgreSQL database and define the entities and repositories.
- You should use the @nestjs/common, @nestjs/swagger, and @nestjs/config modules to handle common tasks such as validation, error handling, documentation, and configuration.
- You should use the @nestjs/testing module and Jest to write unit and e2e tests for the API. You should use Testcontainers and the  @databases/pg-test library to run tests against a real PostgreSQL database using Docker.
- You should use Docker and Docker Compose to create a container for the application and the database. You should use environment variables to store sensitive information such as database credentials.
- You should use Git to version control your code and commit your changes frequently and with meaningful messages.
- You should follow the coding standards and best practices of Node.js, TypeScript, and NestJS. You should use ESLint and Prettier to format and lint your code.
- You should write clear and concise comments and documentation for your code.
- You should use the @nestjs/swagger module to generate an interactive APIdocumentation using OpenAPI.\
  **Instructions**

- Fork this repository and clone it to your local machine.
- Create a new branch with your name and the date of the test (e.g., john-doe-2024-02-14).
- Install the dependencies using npm install.
- Create a .env file in the root of the project and add the following variables:

POSTGRES_USER=postgres

POSTGRES_PASSWORD=postgres

POSTGRES_DB=posts

POSTGRES_PORT=5432

- Run docker-compose up -d to start the PostgreSQL container.
- Run npm run start:dev to start the application in development mode.
- Implement the following endpoints for the posts API:

- GET /posts - Get all posts
- GET /posts/:id - Get a post by id
- POST /posts - Create a new post
- PUT /posts/:id - Update a post by id
- DELETE /posts/:id - Delete a post by id

- Add authentication and authorization features to the API using JWT and Passport. Require users to register and login before they can create, update, or delete posts. Assign different roles and permissions to users, such as admin, editor, or reader. Use the @nestjs/passport and @nestjs/jwt modules to implement this functionality

- Please design the api with low coupling between components and use onion or clean architecture to isolate business logic into its separate use cases.
- Write unit and e2e tests for the API using Jest and Testcontainers. You should achieve at least 80% code coverage.
- Run npm run test to run the tests and npm run test:cov to generate the test coverage report.
- Run npm run build to build the application for production.
- Run npm run start:prod to start the application in production mode.
- Run npm run lint to check the code quality and npm run format to format the code.
- Push your code to your forked repository and create a pull request to the original repository.
- How can we scale this users service to serve 10000 then 1M users? (Think and write your answer in readme file.)

**Evaluation Criteria**

- The functionality and correctness of the API and the tests
- The code quality, readability, and maintainability
- The use of coding standards and best practices
- The use of appropriate tools and libraries
- The documentation and comments
- The commit history and messages
