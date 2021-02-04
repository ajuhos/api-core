### API Core

Lightweight framework for building dynamic multi-level APIs for any provider (Express, socket.io, etc.), consumable via multiple channels (HTTP, socket.io, etc.)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ajuhos/api-core/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ajuhos/api-core.svg)](https://github.com/ajuhos/api-core/issues)
[![Build Status](https://travis-ci.org/ajuhos/api-core.svg?branch=master)](https://travis-ci.org/ajuhos/api-core)
[![Coverage Status](https://coveralls.io/repos/github/ajuhos/api-core/badge.svg?branch=master)](https://coveralls.io/github/ajuhos/api-core?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b1dd6ebe9eb4634aef02811c374efaf)](https://www.codacy.com/app/ajuhos/api-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ajuhos/api-core&amp;utm_campaign=Badge_Grade)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fajuhos%2Fapi-core.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fajuhos%2Fapi-core?ref=badge_shield)

## Features

 - Dynamic model-based API routes
 - Extensible API queries with pre- and post-query steps  (coming soon)
     - Transformations (via api-core-mapper or your own library)
     - Authentication, ACL (via node-acl, passport, etc.)
 - Multi level API routes (eg. /schools/42/students/3/courses)
 - Multi channel APIs (eg. consuming HTTP and socket.io via api-provider packages)
 - Multi database APIs (different database for every route, if you need)
 - Versioned APIs
 - Swagger compatibility (via [api-core-mapper](https://github.com/ajuhos/api-core-mapper))

## Installation

**API Core is in ``beta`` and NOT ready for production use.**

To install the latest version, use NPM:

```bash
$ npm install api-core
```

## Basics

#### API Edges

In API Core every API is built from edges. 
An edge defines operations and relations of a Data Model.

Every edge provides the following operations:

 - List entries (eg. GET /students)
 - Get an entry (eg. GET /students/3)
 - Create an entry (eg. POST /students)
 - Replace/Update an entry (eg. PUT /students/3)
 - Edit an entry (eg. PATCH /students/3)
 - Remove an entry (eg. DELETE /students/3)
 - Access to operations of one-to-one relations (eg. GET /students/3/class)
 - Access to operations of one-to-many relations (eg. GET /schools/42/students/3/courses) 
 - Access to custom operations (eg. PUT /students/3/rename)

Every operation provides standard features like filtering, sorting, 
population and pagination.

**Also every operation is available via all enabled channels.**

So while you can list students via a HTTP request, you also can do the 
same via a socket.io message or any custom channel defined by you.

#### API Providers

You can use API Providers to make your API consumable via different
channels.

We have (or working on) providers for the following channels:
 
 - HTTP
     - Express: [api-provider-express](https://github.com/ajuhos/api-provider-express)
     - _Koa: api-provider-koa (coming soon)_
     - _Restify: api-provder-restify (coming soon)_
     - Ellipse: [api-provider-ellipse](https://github.com/ajuhos/api-provider-ellipse)
 - Socket
     - _socket.io: api-provider-socket.io (coming soon)_
     
Also you can implement your own API provider.

#### Data Models

Every API requires a set of data models. As with API Providers, you have
a bunch of options when choosing your library for creating the models.

We have (or working on) data model libraries for the following frameworks:

  - MongoDB: [api-model-mongoose](https://github.com/ajuhos/api-model-mongoose)
  - _MySQL_
  - ...
  
Also you can implement your own API model library.

## Usage

We have two working examples in the following repository, one with a 
local in-memory model (master branch) and one with a Mongoose model (mongodb branch).

Working Demo: [api-demo](https://github.com/ajuhos/api-demo)

**A complete API with 5 models and relations in 67 lines:**
```typescript
import {ApiEdgeError, OneToOneRelation, OneToManyRelation, ApiEdgeQueryResponse, Api} from "api-core";
import {MongooseModelFactory} from "api-model-mongoose";
import {EllipseApiRouter} from "api-provider-ellipse";
import * as mongoose from "mongoose";

const Ellipse = require('ellipse'),
      app = new Ellipse;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");
const ObjectId = mongoose.Schema.Types.ObjectId;

const studentEdge =
          MongooseModelFactory.createModel("student", "students", {
              id: String,
              firstName: String,
              lastName: String,
              email: String,
              phone: String,
              school: { type: ObjectId, ref: 'school' },
              classId: { type: ObjectId, ref: 'class' }
          }),
      classEdge =
          MongooseModelFactory.createModel("class", "classes", {
              id: String,
              name: String,
              semester: String,
              room: String,
              school: { type: ObjectId, ref: 'school' }
          }),
      courseEdge =
          MongooseModelFactory.createModel("course", "courses", {
              id: String,
              name: String,
              class: { type: ObjectId, ref: 'class' },
              courseType: { type: ObjectId, ref: 'courseType' }
          }),
      courseTypeEdge =
          MongooseModelFactory.createModel("courseType", "courseTypes", {
              id: String,
              name: String
          }),
      schoolEdge =
          MongooseModelFactory.createModel("school", "schools", {
              id: String,
              name: String,
              address: String,
              phone: String
          });

const api10
    = new Api({name: 'test-service', version: '1.0'})
        .edge(studentEdge);

const api11
    = new Api({name: 'test-service', version: '1.1'})
        .edge(studentEdge)
        .edge(classEdge)
        .edge(courseEdge)
        .edge(courseTypeEdge)
        .edge(schoolEdge);

app.use(require('body-parser').json());

const router = new EllipseApiRouter(api11, api10);
router.apply(app);

app.listen(8080);
```

## Tests

We maintain high test coverage to provide a reliable framework 
for your APIs.

To run tests, execute the following NPM commands:

```bash
$ npm install
$ npm test
```

## License

The [MIT License](https://github.com/ajuhos/api-core/blob/master/LICENSE). Free forever. :)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fajuhos%2Fapi-core.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fajuhos%2Fapi-core?ref=badge_large)