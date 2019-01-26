const jsonld = require('jsonld');

function getRepresentation(body) {
  // We need to distinguish between a collection and a single resource
  if (Array.isArray(body)) {
    const orgCollection = new hal.Resource({total: body.length}, "/api/organizations");
    // For every object, create a resource.
    var orgArray = []
    for (var i = 0; i < body.length; i++) {
      orgArray.push(new hal.Resource(body[i], "/api/organizations/" + body[i].id));
    }
    // Then embed the resources:
    orgCollection.embed("organizations", orgArray);
    return orgCollection.toJSON();
    // todo create hal collection
  } else {
    return new hal.Resource(body, "/api/organizations/" + body.id);
  }
}

module.exports.getRepresentation = getRepresentation;
