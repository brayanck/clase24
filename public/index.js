const linkCarro = document.querySelector('.carro')
  const obtenerCarrito = async () =>{
  try {
    const response = await fetch('/api/carts');
    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    const carrito = await response.json();
    console.log(carrito);
    return carrito;
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return null;
  }
}
document.addEventListener('DOMContentLoaded', async() => {
  const carro = await obtenerCarrito();
    linkCarro.href = `/api/carts/${carro}`
});