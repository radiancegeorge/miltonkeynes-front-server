const express =  require('express');
const port = process.env.PORT || 4000
const app = express();
const db = require('./models');
const user = require('./routes/user');
const cors = require('cors');


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use('/user', user)


db.sequelize.sync().then(e =>{
    app.listen(port, ()=>{
        console.log(`listening on port ${port}`)
    });
}).catch(err=>{
    console.log(err);
})