# Project Scaffolding

This project uses [fastify.js](https://fastify.dev/docs/latest/).

It was bootstrapped with [fastify-cli](https://www.npmjs.com/package/fastify-cli)

`fastify generate . --esm --standardlint`

## Database

The project uses **MongoDB** - It uses a JSON-like storage model and doesn’t require a predefined database schema making it suitable for the project requirements

### Running a MongoDB instance in Docker

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Pull default MongoDB docker image (tag latest) `docker pull mongo`
- Start the MongoDB server `docker run -d -p 27017:27017 --name mongo-dev mongo`
- The mongo instance should be accessible on `mongodb://localhost:27017`

## Available Scripts

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
