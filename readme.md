* Heroku:
 - Heroku toolkit (insert URL here)
 - First setup run heroku pg:psql < db/model.sql
* Run:
 - foreman start or node index.js
* Port:
 - If port 5000 is taken, select another port export PORT=<avail. port>
* Database
  - cd db && node setup.js
    - password prompt: choose a dev password
  - export DATABASE_URL=postgres://dev_krafthack:<dev_password>@localhost/krefthack
