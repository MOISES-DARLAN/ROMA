const cartIcon = document.getElementById('cart-icon');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const modal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const checkoutForm = document.getElementById('checkout-form');
const deliveryOptions = document.getElementsByName('delivery-option');
const addressField = document.getElementById('address-field');
const productsContainer = document.getElementById('products');

let cart = [];
const CATEGORIA = 'pãesPRPVH';
getProducts(CATEGORIA);

cartIcon.addEventListener('click', () => {
  cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (event) => {
  if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
    cartDropdown.style.display = 'none';
  }
});

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function setupEventListeners() {
  document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }
      updateCart();
      cartDropdown.style.display = 'block';
    });
  });

  document.querySelectorAll('.btn-order-now').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      alert(`Pedido rápido do produto ${id} realizado!`);
    });
  });
}

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
  } else {
    modal.style.display = 'block';
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

deliveryOptions.forEach(option => {
  option.addEventListener('change', () => {
    if (option.value === 'delivery') {
      addressField.style.display = 'block';
    } else {
      addressField.style.display = 'none';
    }
  });
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
  const address = document.getElementById('address').value;

  if (deliveryOption === 'delivery' && !address.trim()) {
    alert('Por favor, especifique o endereço de entrega.');
    return;
  }
  enviarItensDoCarrinhoNoWhatsApp(cart);
  alert(`Pedido finalizado! ${deliveryOption === 'local' ? 'Retire seu pedido na loja.' : `Entrega para: ${address}`}`);
  cart = [];
  updateCart();
  modal.style.display = 'none';
  cartDropdown.style.display = 'none';
});

function enviarMensagemNoWhatsApp(mensagem) {
  const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
  const address = document.getElementById('address').value;
  const texto = `${mensagem} \n\n ${deliveryOption === 'local' ? 'Irei retirar meu pedido na loja.' : `Entrega para: ${address}`} \n\n ${new Date().toLocaleString()}`;
  const textoCodificado = window.encodeURIComponent(texto);

  const link = `https://api.whatsapp.com/send?phone=${69999145535}&text=${textoCodificado}`;
  window.open(link, "_blank");
  console.log(link)

  console.log(`Enviando mensagem: ${mensagem}`);
}

// Função para enviar os itens do carrinho
function enviarItensDoCarrinhoNoWhatsApp(itensDoCarrinho) {
  // Monta a mensagem com os itens do carrinho
  let mensagem = '*Olá, queria fazer esse pedido*:\n\n';
  itensDoCarrinho.forEach(item => {
    mensagem += `x${item.quantity} | ${item.name}  - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });

  // Envia a mensagem via WhatsApp
  enviarMensagemNoWhatsApp(mensagem);
}

console.time()

async function getProducts(category) {
  const url = `https://demo-project34821.p.rapidapi.com/catalog/category/${category}/products?skip=2&limit=20`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '7bafdafc62msh006083d103e5d7cp107b09jsn07382e7df8ff',
      'x-rapidapi-host': 'demo-project34821.p.rapidapi.com',
      'X-RapidAPI-Mock-Response': '200'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    getid(data);
  } catch (error) {
    console.log(error);
  }
}

async function getid(res) {
  const data = res.products;
  let produtos = [];
  
  for (let item of data) {
    const produto = await getbyid(item.id);
    produtos.push(produto);
  }

  createCard(produtos);
}

async function getbyid(id) {
  const url = `https://demo-project34821.p.rapidapi.com/catalog/product/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '7bafdafc62msh006083d103e5d7cp107b09jsn07382e7df8ff',
      'x-rapidapi-host': 'demo-project34821.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function createCard(produtos) {
  let cards = '';

  let cardsError = []
  for (const produto of produtos) {
    const img = new Image();
    img.src = produto.manufacturer;

    const imageLoaded = await new Promise((resolve, reject) => {
      img.onload = () => {
        console.log('Imagem carregada com sucesso:', img.src);
        resolve(true);
      };

      img.onerror = function() {
        console.log("Erro ao carregar a imagem:", img.src, produto.id);
        cardsError.push(produto)
        console.log(cardsError)
        sendErrorDashboard(cardsError)
        resolve(false); // Não carregou a imagem
      };
    });

    if (imageLoaded) {
      const moldcard = `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-lg">
          <img src="${produto.manufacturer}" alt="${produto.name}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-bold mb-2 text-red-800">${produto.name}</h3>
            <p class="text-gray-600 mb-4">${produto.description}</p>
            <div class="flex justify-between">
              <button class="btn-add-cart px-4 py-2 rounded-full font-bold" data-id="${produto.id}" data-name="${produto.name}" data-price="${produto.price}">Adicionar ao Carrinho</button>
              <button class="btn-order-now px-4 py-2 rounded-full font-bold" data-id="${produto.id}">Pedir Agora</button>
            </div>
          </div>
        </div>`;

      cards += moldcard;
      sendErrorDashboard(cardsError)
    }
  }

  productsContainer.innerHTML = cards;
  setupEventListeners();
}

async function sendErrorDashboard(produto){

    const CATEGORIA_ERROR = 'ERRORPRPVH'
    let tempData = {
      name: '',
      price: 0,
      manufacturer: '',
      category: '',
      description: '',
      tags: ''
    }


    produto.forEach((produto) => {

      tempData = {
        name: produto.name,
        price: produto.price,
        manufacturer: produto.manufacturer,
        category: CATEGORIA_ERROR ,
        description: produto.description,
        tags: produto.tags
      }

      console.log(tempData)
      
      updateCategory(produto, tempData)
    })

}

async function updateCategory(produto, produtoTemp) {
  const id = produto.id;

  const deleteUrl = `https://demo-project34821.p.rapidapi.com/catalog/product/${id}`;
  const deleteOptions = {
    method: 'DELETE',
    headers: {
      'x-rapidapi-key': '7bafdafc62msh006083d103e5d7cp107b09jsn07382e7df8ff',
      'x-rapidapi-host': 'demo-project34821.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  try {

    const deleteResponse = await fetch(deleteUrl, deleteOptions);
    if (deleteResponse.ok) {

      const createUrl = 'https://demo-project34821.p.rapidapi.com/catalog/product';
      const createOptions = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '7bafdafc62msh006083d103e5d7cp107b09jsn07382e7df8ff',
          'x-rapidapi-host': 'demo-project34821.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: produtoTemp.name,
          price: parseFloat(produtoTemp.price),
          manufacturer: produtoTemp.manufacturer,
          category: 'ERRORPRPVH',
          description: produtoTemp.description,
          tags: produtoTemp.tags
        })
      };

      try {
        const createResponse = await fetch(createUrl, createOptions).then(()=>{
          const result = createResponse.text();
        console.log(result);
        });
        
      }
      
      catch (createError) {
        console.log(createError);
      }
    } 
    
    else {
      console.log('Erro ao deletar o produto:', deleteResponse.statusText);
    }
  } catch (deleteError) {
    console.log(deleteError);
  }
}
