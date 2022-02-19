const moongose = require("mongoose");
const {mongodb} = require('./keys')



moongose.connect(mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));