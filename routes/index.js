const homeRoutes = require('./home');
const path = require('path');

const constructorMethod =(app)=>{
    app.use('/',homeRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
      });
}; 

module.exports = constructorMethod;