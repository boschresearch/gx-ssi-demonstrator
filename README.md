# Gaia-X SSI Demonstrator
This project is to publish the source code for a demonstrator built for the "Catalogue Working Group" meeting. The project was demonstrated in the meeting on 2021-05-11

The demonstration was recorded afterwards and can be watched here:
https://drive.google.com/file/d/1ruFaH_4ePfVTmd5vnDaJ2GHN7KsJcUQG/view

This project is NOT under active development. Merge Requests to fix / improve the code base might be accepted or declined.

Feel free to use the code in your own projects according to the license.

## Content of the Demonstration
The goal was to showcase that W3C Verifiable Credentials (VC) can be used without DID (Decentralized Identifier). The UI allows to:

- Create W3C Verifiable Credentials (Issuer perscpective)
- Add VC to a Self-Description (Holder perspective, e.g. Gaia-X Provider)
- Publish the Self-Description as a Verifiable Presentation (Holder perspective)
- Verify a 3rd party Self-Description (Verifier perspective, e.g. a Gaia-X Consumer or the Catalog)

## User Interface Screenshots
...

## Architecture / Components
The core of the demonstrator is an existing open source library provided by Digital Bazaar

https://github.com/digitalbazaar/vc-js

A very good starting point in their documentation is:
https://github.com/digitalbazaar/vc-js/blob/master/BACKGROUND.md#key-id

Thanks to Digital Bazaar for their work!

# Build Setup

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

# Notes
## Initial Project setup
```
npx create-nuxt-app
```

## Docker Deployment
```
docker-compose -f docker-compose-prod.yaml build
docker save catalog-demo:latest | ssh root@<your-server> 'docker load'
scp docker-compose-prod.yaml root@<your-server>:<server-directory>/docker-compose.yaml
```
