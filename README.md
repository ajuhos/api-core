# api-core
Core classes for building dynamic model based multi-level APIs for any provider (Express, socket.io, etc.).

**UNDER CONSTRUCTION**
First beta and documentation coming soon...

**SNEAK PEAK**
Working Demo: [api-demo on GitHub](https://github.com/ajuhos/api-demo)
```javascript
const Express = require('express'),
      app = new Express;

const studentEdge = new StudentEdge,
      classEdge = new ClassEdge,
      courseEdge = new CourseEdge,
      courseTypeEdge = new CourseTypeEdge,
      schoolEdge = new SchoolEdge;

const api
    = new Api('1.0')
        .edge(studentEdge)
        .edge(classEdge)
        .edge(courseEdge)
        .edge(courseTypeEdge)
        .edge(schoolEdge)
        .relation(new OneToOneRelation(courseEdge, courseTypeEdge))
        .relation(new OneToManyRelation(courseTypeEdge, courseEdge))
        .relation(new OneToManyRelation(studentEdge, courseEdge))
        .relation(new OneToOneRelation(studentEdge, classEdge))
        .relation(new OneToOneRelation(classEdge, schoolEdge))
        .relation(new OneToOneRelation(courseEdge, classEdge))
        .relation(new OneToManyRelation(classEdge, studentEdge))
        .relation(new OneToManyRelation(classEdge, courseEdge))
        .relation(new OneToManyRelation(schoolEdge, studentEdge))
        .relation(new OneToManyRelation(schoolEdge, classEdge));

app.use(require('body-parser').json());

const router = new ExpressApiRouter(api);
router.apply(app);

app.listen(8080);

//TEST: http://localhost:8080/api/v1.0/schools/s1/students/s2/class/courses?fields=id,name

//RETURNS:
// [
//     {
//         "id": "c1",
//         "name": "Maths A1"
//     },
//     {
//         "id": "c6",
//         "name": "Science A1"
//     }
// ]
```
