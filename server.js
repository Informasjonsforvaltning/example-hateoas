const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

app.use(logger());
app.use(bodyParser());

const db = [];
var maxId = 0;

// TODO check content-type 

// Content negotiation middleware.
// For now we only return application/json
app.use(async (ctx, next) => {
  await next();
  // no body? nothing to format, early return
  if (!ctx.body) return;
  // Check which type is best match by giving
  // a list of acceptable types to `req.accepts()`.
  const type = ctx.accepts("json", "application/hal+json");
  // accepts json, koa handles this for us,
  // so just return
  if (type === 'json') return;
  if (type === 'application/hal+json') return; //TODO need to make hal representation
  // not acceptable
  if (type === false) ctx.throw(406);
});

const organizations = {
  list: (ctx) => {
    // We accept a query on 'organization':
    if (ctx.query.organization) {
      console.log("searching for organization", ctx.query.organization);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].organization && db[i].organization === ctx.query.organization) {
          res.push(db[i]);
        }
      }
      ctx.body = res;
    }
    // We also accept a query on 'description':
    else if (ctx.query.description) {
      console.log("searching for description", ctx.query.description);
      var res = [];
      for (var i = 0; i < db.length; i++) {
        if (db[i].description && db[i].description.toLowerCase().includes(ctx.query.description.toLowerCase())) {
          res.push(db[i]);
        }
      }
      ctx.body = res;
    } else {
      ctx.body = db; // otherwise return the whole lot
    }
  },

  create: (ctx) => {
    console.log('Creating: ', ctx.request.body);
    var index = db.push(ctx.request.body);
    db[index-1].id = ++maxId;
    ctx.set('Location', 'http://localhost:8080/api/organizations/' + ctx.request.body.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var organization = db.find( o => o.id === parseInt(id));
    if (!organization) return ctx.throw(404, 'cannot find that organization');
    if (ctx.accepts('text/html')) {
      ctx.status = 303;
      ctx.set('Location', 'http://localhost:8080/api/organizations/' + id);
      return;
    }
    ctx.body = organization;
  }
};

app.use(_.get('/api/organizations', organizations.list));
app.use(_.post('/api/organizations', organizations.create));
app.use(_.get('/api/organizations/:id', organizations.show));

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
