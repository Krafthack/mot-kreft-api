* DL:
 - Heroku toolkit (insert URL here)
* Run:
 - foreman start
* Port:
 - If port 5000 is taken, select another port export PORT=<avail. port>
* Database
  - cd db && node setup.js
    - password prompt: choose a dev password
  - export DATABASE_URL=postgres://dev_krafthack:<dev_password>@localhost/krefthack
