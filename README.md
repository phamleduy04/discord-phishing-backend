# discord-phishing-backend
Discord Phishing API list with Redis and Docker

# Access to API
- You can access to [blacklist domain](https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-domains.json) and [blacklist links](https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-links.json) at this repo. 
- I have a [public API](https://discord-phishing-backend.herokuapp.com/) here.

# API Endpoints
## Authorization
Some API requests require the use of a generated API key. To set API key, please add `AUTHORIZATION` to your `.env` file. If not the default API key is `secret`. To authenticate an API request, you should provide your API key in the Authorization header.

| Method | Endpoint | Description | Require Authorzation Header? |
| :--- | :--- | :--- | :--- |
| `GET` | `/all` | Get all data (includes blacklist links and domains) | No |
| `GET` | `/links` | Get all blacklist domains | No |
| `GET` | `/check?url={query}` | Check if a url is in blacklist | No |
| `GET` | `/trace-redirect?url={query}` | Trace redirect a url (shorten link) | No |
| `POST` | `/add` | Add domain to blacklist **(Require url in body)** | Yes |
| `POST` | `/all` | Add link to blacklist **(Require url in body)** | Yes |

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
