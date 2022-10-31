const express = require('express')
const request=require('request')
const app = express()
const port = 3000


const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


app.set("view engine","ejs")
app.get('/', (req, res) => {
  res.render('planets')
})

app.get('/signin', (req, res) => {
    res.render('signin')
  })

  app.get("/signinsubmit",(req,res)=>{
    const email=req.query.email;
  
    const pwd=req.query.pwd; 
    db.collection('users')
    .where('email', '==', email)
    .where('password', '==', pwd)
    .get()
    .then((docs)=>{
      if(docs.size>0){
        res.render("planetsearch");
      }
      else{
        res.render("signinfail");
      }
  });
  });

  app.get('/signup', (req, res) => {
    res.render('signup')
  })

 app.get("/signupsubmit",(req,res)=>{
  const fullname=req.query.fullname;
  
  const email=req.query.email;
  
  const pwd=req.query.pwd;
  
  db.collection('users').add({
   name:fullname,
   email:email,
   password:pwd,

})
.then(() =>{
  res.render("signin");
});

 });

 app.get('/planet',(req,res)=>{
  const name=req.query.name;
  //res.send(name)
  var datainfo=[];
    
  request.get({
    url: 'https://api.api-ninjas.com/v1/planets?name=' + name,
    headers: {
      'X-Api-Key': 'F1tVukb/W3vZxaYzDHbmRw==fDAGGXsA8YdeOpla'
    },
  }, function(error, response, body)  
 {
  const data=JSON.parse(body)
     var a=data[0].name;
     var b=data[0].mass;
     var c=data[0].radius;
     var d=data[0].period;
     var e=data[0].semi_major_axis;
     var f=data[0].temperature;
     var g=data[0].distance_light_year;
     var h=data[0].host_star_mass;
     var i=data[0].host_star_temperature;
     datainfo.push(a)
     datainfo.push(b)
     datainfo.push(c)
     datainfo.push(d)
     datainfo.push(e)
     datainfo.push(f)
     datainfo.push(g)
     datainfo.push(h)
     datainfo.push(i)
     res.render("planetfound",{user:datainfo})  
})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})