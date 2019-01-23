var hal = require('halberd');

// A resource
var Organization = require('../model/organization.js');

// Create a collection:
var organizationsCollection = new hal.Resource({total: 2}, "/organizations");
// Links
organizationsCollection.link("next", "/organizations?page=2");
organizationsCollection.link("find", {href: "/organizations{?id}", templated: true});

// Another resource
var organization123 = new hal.Resource( new Organization(123, 'Donald'), "/organizations/123");
// Alternative ways to link
organization123.link(new hal.Link("organisasjonsform", "/organisasjonsformer/98712"));
organization123.link(new hal.Link("naeringskode", {href: "/naeringskoder/7809"}));

// Yet another resource
var organization124 = new hal.Resource(new Organization(124, 'Dolly'), "/organizations/124");
organization124.link("organisasjonsform", "/organisasjonsformer/97213");
organization124.link("naeringskode", "/naeringskoder/12369");

// Embed the resources
organizationsCollection.embed("organizations", [organization123, organization124]);

console.log('JSON:\n' + JSON.stringify(organizationsCollection));
console.log('\nXML:\n' + organizationsCollection.toXML());
