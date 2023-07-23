const router = require("express").Router();
const Product = require('../daos/models/products.model');
const {isAuthenticated} = require('../utils/auth')

router.use(isAuthenticated)

router.get('/api/', async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 10
    let page = parseInt(req.query.page, 10) || 1
    let order
    if(req.query.order === 'desc')
    {
      order = -1
    }
    if(req.query.order === 'asc'){
      order = 1
    }
    
    let query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    let sortOptions = {};
    if (req.query.order) {
      sortOptions.price = order;
    }
    let products = await Product.paginate(query, {limit,page,sort:sortOptions});
    // Agregar las propiedades nextLink y prevLink a products
    products.nextLink =`/api?page=${products.nextPage}`;
    products.prevLink =`/api?page=${products.prevPage}`;
    if (req.query.category) {
      products.nextLink = products.nextLink + `&category=${req.query.category}` ;
      products.prevLink = products.prevLink + `&category=${req.query.category}`;
    } 
    if (req.query.limit) {
      products.nextLink = products.nextLink + `&limit=${req.query.limit}` ;
      products.prevLink = products.prevLink + `&limit=${req.query.limit}`;
    } 
    if (req.query.order) {
      products.nextLink = products.nextLink + `&order=${req.query.order}` ;
      products.prevLink = products.prevLink + `&order=${req.query.order}`;
    } 
    res.render("paginate", { products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;