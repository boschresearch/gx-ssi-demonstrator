# catalog-demo

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# Initial Project setup
```
npx create-nuxt-app
```

## Docker Deployment
```
docker-compose -f docker-compose-prod.yaml build
docker save catalog-demo:latest | ssh root@<your-server> 'docker load'
scp docker-compose-prod.yaml root@<your-server>:<server-directory>/docker-compose.yaml
```
