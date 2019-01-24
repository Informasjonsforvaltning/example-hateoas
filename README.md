# hateoas-example

Small project to investigate HATEOAS. Specifically different specifications and their implementations in javascript/node

The goal of this project is to implement a basic server that loads some demo data which is served to the user based on the accept header (basic content-negotiation). Ultimately the range of formats should include all of the following specifications.

## Specifications
### HAL
* Spec: http://stateless.co/hal_specification.html
* Implementation tested: https://github.com/jpbochi/halberd
* Test: [hal-server.js](hal/hal-server.js)

### JSON API
* Spec: http://jsonapi.org/format/

### JSON SCHEMA
* Spec: https://json-schema.org/latest/json-schema-core.html

### JSON HYPER-SCHEMA
* Spec: http://json-schema.org/latest/json-schema-hypermedia.html

### JSON-LD
* Spec: https://www.w3.org/TR/json-ld/
* Implementation tested: https://github.com/digitalbazaar/jsonld.js

### HYDRA
* Spec: http://www.markus-lanthaler.com/hydra/

### Collection+JSON
* Spec: http://amundsen.com/media-types/collection/

### SIREN
* Spec: https://github.com/kevinswiber/siren

## References
https://sookocheff.com/post/api/on-choosing-a-hypermedia-format/

## Usage
```
git clone https://github.com/stigbd/hateoas-example.git
cd hateoas-example
npm install
npm run dev
```
In another terminal play with the server:
```
curl -i -H "Accept: application/hal+json" -X GET http://localhost:8080/api/organizations -w "\n"
curl -i -H "Accept: application/ld+json" -X GET http://localhost:8080/api/organizations -w "\n"
curl -i -X GET http://localhost:8080/api/organizations/1 -w "\n"
curl \
  --include \
  --header "Content-Type: application/json"  \
  --request POST \
  --data '{"name":"Example Organzation"}' \
  --url http://localhost:8080/api/organizations \
  --write-out "\n"
```
