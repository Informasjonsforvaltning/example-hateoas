const logger = require('koa-logger');
const _ = require ('koa-route');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const Organization = require('./model/organization');
const hal = require('./representations/hal');
const jsonld = require('./representations/json-ld')

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
  const type = ctx.accepts("application/ld+json", "application/hal+json", "json");
  // accepts json-ld, we need to handle this:
  if (type === 'application/ld+json') {
    ctx.throw(406)
    ctx.body = new jsonld.getRepresentation(ctx.body);
    ctx.type = 'application/ld+json' // need to set this after body, but see this PR:https://github.com/koajs/koa/pull/1131
    //return;
  }
  // accepts hal, we need to handle this:
  if (type === 'application/hal+json') {
    ctx.body = hal.getRepresentation(ctx.body);
    ctx.type = 'application/hal+json' // need to set this after body, but see this PR:https://github.com/koajs/koa/pull/1131
    return;
  }
  // accepts json, koa handles this for us,so just return:
  if (type === 'json') return;
  // not acceptable
  if (type === false) ctx.throw(406);
});

const organizations = {
  list: (ctx) => {
    ctx.body = db; // otherwise return the whole lot
  },

  create: (ctx) => {
    id = ++maxId;
    const org = new Organization(ctx.request.body, id);
    console.log('Creating new organization: ', org);
    var index = db.push(org);
    ctx.set('Location', 'http://localhost:8080/api/organizations/' + org.id);
    ctx.status = 201;
  },

  show: (ctx, id) => {
    var organization = db.find( o => o.id === parseInt(id));
    if (!organization) return ctx.throw(404, 'Cannot find that organization');
    ctx.body = organization.toJSON();
  }
};

app.use(_.get('/api/organizations', organizations.list));
app.use(_.post('/api/organizations', organizations.create));
app.use(_.get('/api/organizations/:id', organizations.show));

const server = app.listen(8080, function (){
  console.log('listening on port 8080');
});
module.exports = server;
