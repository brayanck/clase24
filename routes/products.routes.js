const router = require("express").Router();
const Product = require('../daos/models/products.model');


router.get('/:pid', async (req, res) => {
  try {
    let producto = req.params.pid
    let produc = await Product.findOne({_id:producto})
    console.log(produc)
    if (produc) {
      res.render("detalle", produc);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
    const product = new Product(req.body);
    const savedProduct = await product.save()
})



module.exports = router;