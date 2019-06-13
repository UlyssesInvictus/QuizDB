# QuizDB

Welcome to QuizDB!

This guide will explain the technical aspects of QuizDB. If you'd like to learn more about QuizDB itself, please read the [About](https://www.quizdb.org/about) guide.

## Information

All releases of QuizDB are listed under the release tab. The current version is **1.0.0** (the beta!). I will try and use semver (if I remember...)

The backend runs on Rails, and the client runs on React. Deployment uses Heroku with a PostgresQL database.

The modern web interface for QuizDB lives at [https://www.quizdb.org](https://www.quizdb.org) and the admin portal lives at [https://www.quizdb.org/admin](https://www.quizdb.org/admin).

After installing both the backend and frontend, you can run both simultaneously by running `rake start`, which launches the backend at `localhost:3000` and the frontend at `localhost:8080`.

## Installation

To install the backend of **Ruby 2.4** and **Rails 5.0**, use the [following guide](https://gorails.com/setup/ubuntu/16.04) and select your OS. Run `bundle install` to install all the missing gems.

Then, install the Heroku CLI to run the backend server locally. Do so by using the [download instructions on the following link](https://devcenter.heroku.com/articles/heroku-cli) and reading your OS specific instructions.

Afterwards, install **Node 8** [following this guide](https://nodejs.org/en/download/package-manager/#nvm) according to your system. To install all the dependencies, run `npm install`.

## Backend

The backend acts as the public API for QuizDB, and additionally manages the Admin Portal. The root of this repo acts as the backend.

You must have Ruby 2.4 and Rails 5.0 installed to run the application. Consult the Gemfile for a list of dependencies. It's assumed that you have experience installing Rails applications -- contact me for help if needed.

As mentioned above, you can run the backend by running `rake start`, but you can also run the backend individually with `rails s -p 3000`.

## Postgres Database

Prior to running your backend, you must set up a local Postgres server.

### Install Postgres

Find the installation instructions on [Postgres' site](https://www.postgresql.org/download/). Altneratively, simply Google _"installing postgres for [your OS]"_ as there are normally simpler instructions than the ones provided on their websites. This is especially recommended for Ubuntu (use [Digital Ocean's guide.](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04) It's much simpler).

### Start Postgres

- On Ubuntu/Linux, run `sudo service postgresql start`
- On MacOS, run `brew services start postgresql`
- On Windows, run `pg_ctl -D "C:\Program Files\PostgreSQL\9.6\data" start`

### Create a new role

Run `sudo -u postgres createuser --interactive`. This will prompt you to create a new user. The user should match your operating system username. Press `y` when asked if the new role should be a superuser.

### Create a new database

Run `sudo -u postgres createdb quizdb_development`.
This will create the `quizdb_development` database.

### Add a user and grant all privileges

Enter psql by running `sudo -u postgres psql`.
In the psql prompt, run `alter user [username] with encrypted password 'password';` to create a password for your user.
Then, run `grant all privileges on database quizdb_development to [username] ;`

## Frontend

The frontend consists of the modern web client that pings the API to display questions. It also includes Moxon, an online question reader in active development. The frontend lives entirely in a subfolder in `/client`, so if you're not interested in backend work, you can entirely work in that folder.

You must have Node 8 installed to run the application. I recommend using NVM. Consult the `package.json` for a list of dependencies. It's assumed that you have experience installing React applications -- contact me for help if needed.

As mentioned above, you can run the frontend by running `rake start`, but you can also run the frontend individually with `npm start`. (These launch the app in development mode: you can also prefix `NODE_ENV=production` for production, or run `npm build` to build the application.)

## Contribution

To contribute, please fork the repository and initiate a pull request. All PRs should include the following information:

- **Why**: What the PR is fixing/implementing
- **What:** How the PR is implementing it
- **Who**: If I've never seen you before, some background info on who you are / what your relationship to the QB community is, so I can have some level of trust in your code.

I don't really care about tests or anything like that, but I will need to personally read over all PRs, so please keep your changes readable.

I don't really expect that many people to contribute--I'll work harder on getting that done on the admin side--so anything is really appreciated!
