const express = require('express');

const ProductsServices = require('../services/product.services');

const validatorHandler = require('../middlewares/validator.handler')

const { createProductSchema, updateProductSchema, getProductSchema } = require('../schemas/product.schema')

const router = express.Router();

const service = new ProductsServices();

router.get('/', async (req, res) => {
  const products = await service.find();
  res.json(products);
});

router.get('/filter', async (req, res) => {
  res.send('yo soy un filtro');
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),

  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error)
    }
  }
);

// filter has been taken as an id
//that makes out previous api crash with no data
//so we need to solve it with the next example
//the filter has to be before the section of products id
// and not before it
//EXAMPLE WITH ERROR
// app.get('/products/filter', (req, res) => {
//   res.send('yo soy un filtro')
// })

router.post('/',
  validatorHandler(createProductSchema, 'body'),
async (req, res, next) => {
    const body = req.body;
    const newProduct = await service.create(body);
    res.status(201).json(newProduct);
  }
);

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await service.delete(id);
  res.json(product);
});

module.exports = router;
