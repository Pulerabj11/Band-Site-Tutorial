//Important!!!
//If page is still loading, 'listen' for page to finish loading (DOMContentLoaded) before running ready().
if (document.readyState == 'loading') {
    //NOTE: ready does not have parentheses because it is a reference to the function.
    //NOTE: It is passed to addEventListener to be called by that method.
    document.addEventListener('DOMContentLoaded', ready)
} else {
    //If page is already loaded, run ready()
    ready()
}

//Does not run until the page is loaded.
function ready() {
    //Initialize add to cart buttons
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    //Loop through all add to cart buttons and add a listener to check for a click.
    for (var i=0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    
    //Add listener to the purchase button
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked(event) {
    alert('Thank you for your purchase!')
    var cartItems = document.getElementsByClassName('cart-items')[0]

    //Loop until all children of 'cart-items' have been removed
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

//If remove button is clicked, call updateCartTotal() to update the cart total price.
function removeCartItem(event) {
    //Remove button element is the target
    var buttonClicked = event.target
    //The parent of the parent of buttonClicked is cart-row.
    //Clicking the remove button removes the whole row.
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}


function quantityChanged(event) {
    //Quantity input element is the target
    var input = event.target
    //Check for valid input: isNaN => 'is Not a Number'
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    //Add to cart button element is the target
    var button = event.target
    //parent of parent of the add to cart button is the 'shop-item' class.
    //This holds all info about the item being added.
    var shopItem = button.parentElement.parentElement

    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src

    //Try to add the item to the cart
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    //
    //Build the cart row element
    //

    //Creates a div element
    var cartRow = document.createElement('div')
    //Give the cartRow div the class 'cart-row'
    cartRow.classList.add('cart-row')

    //Get the 'cart-items' div
    var cartItems = document.getElementsByClassName('cart-items')[0]
    //Get the cart item titles
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    //Check if the item to be added to cart is already in the cart
    for (var i=0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            //Generate a pop-up message
            alert('This item is already in the cart')
            //Return pulls you completely out of this function
            return
        }
    }

    //Style for the cart row contents.
    //Use backtick (or grave accent) to hold string across multiple lines.
    //Backtick also allows variables inside the string.  Use ${}.
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`

    //Set the HTML of cartRow
    cartRow.innerHTML = cartRowContents

    //add div element 'cartRow' to 'cart-items'
    cartItems.append(cartRow)

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

//Updates the total price of the cart.
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0

    //Loop through the cart rows to add up the total price of all items.
    for (var i=0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var quantity = quantityElement.value

        total = total + (price * quantity)
    }

    total = Math.round(total * 100) / 100
    
    //Update the cart's total price.
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}