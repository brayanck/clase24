const router = require("express").Router();
const Cart = require("../daos/models/carts.model");
const Product = require("../daos/models/products.model")
const User = require('../daos/models/users.model')
const {isAuthenticated} = require('../utils/auth')

router.use(isAuthenticated)


router.get('/', async (req, res) => {
  try {
    const usuarioEmail = req.user.email; // Supongamos que obtienes el ID del usuario desde la autenticación
    const usuario = await User.findOne({email:usuarioEmail}); // Obtenemos el usuario y poblamos el campo 'cart' con el carrito

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario.cartId); // Devolvemos el carrito del usuario
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    let carrito = req.params.cid;
    let carro = await Cart.findOne({ _id: carrito });
    res.render("cart", {carro});
  } catch (err) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    let carrito = req.params.cid;
    let producto = req.params.pid;
    const cart = await Cart.findOne({ _id: carrito });
    if (cart) {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: carrito },
        { $pull: { cart: { _id: producto } } },
        { new: true }
      );
      res.json(updatedCart);
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    let carrito = req.params.cid;
    const result = await Cart.updateOne(
      { _id: carrito },
      { $set: { cart: [] } }
    );
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:cid", async (req, res) => {
  try {
    let carrito = req.params.cid;
    let products = req.body;
    const result = await Cart.updateOne(
      { _id: carrito },
      { $set: { cart: products } }
    );
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const count = req.body.count;
    const carrito = req.params.cid;
    const producto = req.params.pid;

    const carro = await Cart.findOne({ _id: carrito });
    const product = await Product.findOne({ _id: producto });

    if (carro && product) {
      const cartItem = carro.cart.find((item) =>{ 
        if(item.product._id.toString() === producto.toString()){
          return true
        }
      });
      if (cartItem) {
        const updatedCart = await Cart.findOneAndUpdate(
          { _id: carrito, "cart.product": producto },
          { $inc: { "cart.$.count": count } }, // Utilizamos $set en lugar de $inc
          { new: true }
        );
        return res.json(updatedCart);
      } else {
        const updatedCart = await Cart.findByIdAndUpdate(
          carrito,
          { $push: { cart: { product: product._id, count } } },
          { new: true }
        );
        return res.json(updatedCart);
      }
    } else {
      res.json("El producto o el carrito no existen");
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});



module.exports = router;
