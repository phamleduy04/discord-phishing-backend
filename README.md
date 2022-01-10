# discord-phishing-backend
Discord Phishing API list with Redis and Docker

# Access to API
- You can access to [blacklist domain](https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-domains.json) and [blacklist links](https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-links.json) at this repo. 
- I have a [public API](https://discord-phishing-backend.herokuapp.com/) here.

# API Endpoints
1. GET `/all`:   Get all data (includes blacklist links and domains)
2. GET `/links`: Get all blacklist links
3. GET `/domains`: Get all blacklist domains
4. GET `/check?url={query}`: Check if your url is in blacklist
5. POST `/add`: Add domain to blacklist (Require authorization header and url in body)
7. POST `/addlink`: Add link to blacklist (Require authorization header and url in body)

# Installation
## Without Docker
### Redis 
- Download and setup redis
### Project
1. Clone the project
2. Rename `example.env` to `.env`
3. Change `REDIS_HOST` to your host (usually `localhost`)
4. Change others variable to fit your environment (`REDIS_PORT`, `REDIS_PASSWORD`, `PORT`, `TIMEZONE`)
5. Install package using `npm install` or `yarn install`
6. Run `npm start`

## With Docker
1. Clone the project
2. Rename `example.env` to `.env`
3. Change others variable to fit your environment (`PORT`, `TIMEZONE`)
4. Run `npm run docker-build` to build the image.
5. Run `npm run docker-start` to run the container.
