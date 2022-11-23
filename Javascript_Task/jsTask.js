
///for get all products
function GetProducts() {
    fetch('https://dummyjson.com/products')
        .then((response) => response.json())
        .then((data) => {
            data.products.forEach(function (ele) {
                showProductsCards(ele)
            })
        })
}
GetProducts()


//////////for display products in cards
function showProductsCards(data) {
    console.log(data.title)
    const productCard = document.createElement("div")
    productCard.classList.add("productCard")
    productCard.innerHTML = '<div class="product-img">' +
        ' <img class="img-fluid" src="' + data["images"][0] + '">' +
        ' </div>' +
        ' <div class="product-info">' +
        ' <h3 class="ProductName">' + data.title + '</h3>' +
        ' <h3 class="cateName">' + data["category"] + '</h3>' +
        ' <h2 class="price">' + data["price"] + '</h2>' +
        ' <a href="#" class="buy">Buy Now</a>' +
        ' </div>'
    document.getElementsByClassName('Products')[0].appendChild(productCard);
    productCard.addEventListener("click", () => {
        showProductDetails(data)
    })
}


// dropDown list 
const dropDown = document.querySelector(".dropDown")
const dropElem = document.querySelector(".drop")
const cate = document.querySelectorAll(".category")
const cateName = document.getElementsByClassName("cateName")

// for display or none display category menu 
dropDown.addEventListener("click", () => {
    dropElem.classList.toggle("showDropDown")
})


//for display the products by category 
cate.forEach(element => {
    element.addEventListener("click", () => {
        console.log(element.innerText)
        Array.from(cateName).forEach(ele => {
            if (element.innerText.includes(ele.innerText) || element.innerText == "All") {
                ele.parentElement.parentElement.style.display = "grid"
            }
            else {
                ele.parentElement.parentElement.style.display = "none"
            }
        })
    })
})

// search for Products 

const search = document.querySelector(".search")
const ProductName = document.getElementsByClassName("ProductName")
search.addEventListener("input", () => {
    Array.from(ProductName).forEach(ele => {
        if (ele.innerText.toLowerCase().includes(search.value.toLowerCase())) {
            ele.parentElement.parentElement.style.display = "grid"
        }
        else {
            ele.parentElement.parentElement.style.display = "none"
        }
    })
})



////////for display details of one product and button to back for all products page
const ProductDetails = document.querySelector(".ProductDetails")
function showProductDetails(data) {
    console.log("hiiii")
    console.log(data)
    ProductDetails.classList.toggle("show")
    ProductDetails.innerHTML = `<button class="back border-0">Back</button>` +
        `<div class="Details d-flex justify-content-between align-items-center w-100 h-100 bg-light">` +
        `<div class="Detail-Img">` +
        `<img src="` + data["images"][0] + `" alt="">` +
        `</div>` +
        `<div class="InfoOfProduct">` +
        `<h1 class="fs-1 fw-bold mb-5">` + data.title + `</h1>` +
        `<div class="Detail-Info">` +
        `<div class="left-Info ">` +
        `<h3 >` + `<small>` + 'Brand :' + `<small>` + data.brand + `</h3>` +
        ` <h3 ` + `<small>` + 'Price :' + `<small>` + data.price + `</h3>` +
        ` <h3>` + `<small>` + 'Category :' + `<small>` + data.category + `</h3>` +
        `</div>` +
        `<div class="right-Info me-5">` +
        ' <h3>' + `<small>` + 'Rating :' + `<small>` + data.rating + '</h3>' +
        `<h3>` + `<small>` + 'Discount :' + `<small>` + data.discountPercentage + `<h3>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `</div>`

    const back = ProductDetails.querySelector(".back")
    back.addEventListener("click", () => {
        ProductDetails.classList.toggle("show")
    })
}