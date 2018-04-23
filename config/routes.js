
const siteController = require('../api/controllers/homePage');
const customerController = require('../api/controllers/customerController');
const fulfillmentController = require('../api/controllers/fulfillmentController');
const stockController = require('../api/controllers/stockController');

const passport = require('passport');
const requiredAuth = passport.authenticate('bearer', { session: false })

exports.initRoutes = function (app, express) {
  app.get('/', siteController.index);

  const apiRoutes = express.Router(),
    userRoutes = express.Router();

  var customerRouter = express.Router();
  apiRoutes.use('/customer', customerRouter);
  customerRouter.post('/getAll', customerController.getAll);
  customerRouter.post('/', customerController.create);
  customerRouter.put('/', customerController.update);
  customerRouter.get('/getById/:id', customerController.getById);
  customerRouter.delete('/:id', customerController.delete);
  customerRouter.post('/checkExistCode', customerController.getByCode);

  var fulfillmentRouter = express.Router();
  apiRoutes.use('/fulfillment', fulfillmentRouter);
  fulfillmentRouter.post('/getFulfillment', fulfillmentController.getFulfillment);
  fulfillmentRouter.post('/', fulfillmentController.create);

   var stockRouter = express.Router();
  apiRoutes.use('/stock', stockRouter);
  stockRouter.post('/getStock', stockController.getStock);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};