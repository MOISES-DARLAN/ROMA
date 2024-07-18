const HASH = "PRPVH";
const productForm = document.getElementById('product-form');
const $btn_cad = document.getElementById('btn-cad');

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productImage = document.getElementById('product-image').value;
  const productName = document.getElementById('product-name').value;
  const productCategory = document.getElementById('product-category').value;
  const productTags = document.getElementById('product-tags').value;
  const productDescription = document.getElementById('product-description').value;
  const productPrice = document.getElementById('product-price').value;
    const newTags = `${productTags}, roma`
const newcategory = `${productCategory}${HASH}`
  console.log(newcategory);

  try {
    const url = 'https://demo-project34821.p.rapidapi.com/catalog/product';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '7bafdafc62msh006083d103e5d7cp107b09jsn07382e7df8ff',
        'x-rapidapi-host': 'demo-project34821.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: productName,
        price: parseFloat(productPrice),
        manufacturer: productImage,
        category: newcategory,
        description: productDescription,
        tags: newTags
      })
    };

    const response = await fetch(url, options);
    const result = await response.json();
    alert('Produto cadastrado com sucesso!');
    window.location.href = 'cadastrarProd.html';
  } catch (error) {
    console.error(error);
  }

 
});
