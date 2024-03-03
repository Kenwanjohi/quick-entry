## Project Scaffolding

This project uses [fastify.js](https://fastify.dev/docs/latest/).

It was bootstrapped with [fastify-cli](https://www.npmjs.com/package/fastify-cli)

`fastify generate . --esm --standardlint`

**Project structure**

```
├── Dockerfile
├── README.md
├── app.js
├── fly.toml
├── package-lock.json
├── package.json
├── plugins
│   ├── auth.js
│   ├── db.js
│   ├── sensible.js
│   └── swagger.js
├── routes
│   ├── accounts
│   │   ├── autohooks.js
│   │   ├── routes.js
│   │   └── schemas
│   ├── entries
│   │   ├── autoHooks.js
│   │   ├── routes.js
│   │   └── schemas
│   │       ├── createEntry.json
│   │       ├── deleteEntry.json
│   │       ├── fetchEntries.json
│   │       ├── loader.js
│   │       └── updateEntry.json
│   ├── routes.js
│   └── sessions
│       ├── autoHooks.js
│       └── routes.js
├── test
│   ├── helper.js
│   └── routes
│       ├── accounts.test.js
│       ├── entries.test.js
│       ├── root.test.js
│       └── sessions.test.js
└── utils.js
```

## Accessing Swagger API Documentation

### Production Environment

The Swagger documentation for the API in the production environment is available at [https://quick-entry.fly.dev/documentation](https://quick-entry.fly.dev/documentation) You can use this interface to explore and try out the API in the production environment.

### Development Environment

The Swagger documentation for the API is available at [http://127.0.0.1:3000/documentation](http://127.0.0.1:3000/documentation) when running in development mode. You can use this interface to explore and try out the API.

## Database

The project uses **MongoDB** - It uses a JSON-like storage model and doesn’t require a predefined database schema making it suitable for the project requirements

### Running a MongoDB instance in Docker for Development

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Pull default MongoDB docker image (tag latest) `docker pull mongo`
- Start the MongoDB server `docker run -d -p 27017:27017 --name mongo-dev mongo`
- The mongo instance should be accessible on `mongodb://localhost:27017`

### Running a MongoDB instance for production

For production, **Mongo Atlas** is used

## Depoying to production

I used [fly.io](https://fly.io/) to deploy. You will need an account, and fly cli locally (https://fly.io/docs/hands-on/install-flyctl/).

Run `fly auth login` to login in to your account

Inside the project root run `fly launch`. Fly will scan the project and create a dockerfile if you already don't have one

Run `fly deploy` to create a machine, choose a region and other services if required eg. redis, postgres

Set your secrets with `fly secret set JWT_SECRET="" MONGO_URI=""`

## Available Scripts for development

Before running the commands

### Environment Configuration

- Create a copy of the `.env.sample` file named `.env` in the project root.
- Replace the placeholder values in the `.env` file with your actual configuration.

```
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/quick-entry
JWT_SECRET=jwtsignsecret
```

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

### `npm run lint`

Run linter and fix code style issues

```

```
