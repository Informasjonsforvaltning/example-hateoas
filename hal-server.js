var hal = require('halberd');

// A resource
var ordersCollection = new hal.Resource({
  currentlyProcessing: 14,
  shippedToday: 20
}, "/orders");

// Links
ordersCollection.link("next", "/orders?page=2");
ordersCollection.link("find", {href: "/orders{?id}", templated: true});

// Another resource
var order123 = new hal.Resource({
  total: 30.00,
  currency: "USD",
  status: "shipped"
}, "/orders/123");
// Alternative ways to link
order123.link(new hal.Link("basket", "/baskets/98712"));
order123.link(new hal.Link("customer", {href: "/customers/7809"}));

// Yet another resource
var order124 = new hal.Resource({
  total: 20.00,
  currency: "USD",
  status: "processing"
}, "/orders/124");
order124.link("basket", "/baskets/97213");
order124.link("customer", "/customers/12369");

// Embed the resources
ordersCollection.embed("orders", [order123, order124]);

console.log(ordersCollection.toJSON());
