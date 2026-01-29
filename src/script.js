let cartItems = [];
let totalAmount = 0;
const bookBtn = document.getElementById("bookBtn");

function addItem(serviceId,Itemname,Itemprice){
    const index = cartItems.findIndex(item => item.id === serviceId);
    const isItemInCart = index !== -1;
    const button = document.querySelector(`button[data-id="${serviceId}"]`)

    if(!isItemInCart){
        cartItems.push({id:serviceId,name:Itemname,price:Itemprice});
        totalAmount += Itemprice;
        button.innerHTML = `<span>Remove Item  <i class="fa-solid fa-circle-minus"></i></span>`;
        button.className = "add-btn flex justify-center items-center gap-2 bg-red-100 text-red-500 px-3 py-2 rounded-xl cursor-pointer outline-0";
    }   
    else{
        totalAmount -= cartItems[index].price;
        cartItems.splice(index,1);
        button.innerHTML = `<span>Add Item  <i class="fa-solid fa-circle-plus"></i></span>`;
        button.className = "add-btn flex justify-center items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-xl cursor-pointer outline-0";
    }

    updateCartUI();
    updateBookSericesForm();
    
}

function updateCartUI(){
    const emptyMsg = document.getElementById("emptyCartInfo");
    const showItems = document.getElementById("showAddedItem");
    const displayTotal = document.getElementById("displayTotal");
    let rupeesSym = "₹";
    let decZero = ".00";

    if(cartItems.length === 0){
      emptyMsg.style.display = "grid";
      showItems.innerHTML = "";
    }else{
        emptyMsg.style.display = "none";
        showItems.innerHTML = "";
        cartItems.forEach((item,index) =>{
            showItems.innerHTML += `
              
                   <tr class="table w-full table-fixed border-b border-gray-400 text-sm font-medium">
                        <td class="text-center pr-3 pt-2 pb-1.5 w-[25%]">${index+1}</td>
                        <td class="text-left pl-0 pt-2 pb-1.5 w-[50%]">${item.name}</td>
                        <td class="text-right pr-5 pt-2 pb-1.5 w-[25%]">${rupeesSym}${item.price}${decZero}</td>
                       
                    </tr>
        
            `;
        });
    }

    displayTotal.innerText = "₹" + totalAmount; 
}




    function updateBookSericesForm(){

    const fullName = document.getElementById("fullName");
    const emailAddress = document.getElementById("emailAddress");
    const phoneNumber = document.getElementById("phoneNumber");
    

    if(cartItems.length !== 0){
        bookBtn.disabled = false;
        bookBtn.classList.remove("opacity-50");
        bookBtn.classList.remove("cursor-not-allowed");
        bookBtn.classList.add("cursor-pointer");
    }
    else{
        bookBtn.disabled = true;
        bookBtn.classList.add("opacity-50");
        bookBtn.classList.add("cursor-not-allowed");
        bookBtn.classList.remove("cursor-pointer");
        fullName.value="";
        emailAddress.value="";
        phoneNumber.value="";
    }

}

function showMessage(text, type){
    const showMsg = document.getElementById("msg");
    
             if (type === "success"){
                showMsg.classList.remove("text-[16px]");   
                showMsg.classList.remove("text-yellow-800");
                showMsg.classList.remove("text-red-700");
                showMsg.classList.add("text-green-700");
                showMsg.classList.add("text-[12.50px]");
            }

            if (type === "emptyField"){
                showMsg.classList.remove("text-[12.50px]");  
                showMsg.classList.remove("text-green-700"); 
                showMsg.classList.remove("text-red-700");
                showMsg.classList.add("text-yellow-800");
                showMsg.classList.add("text-[16px]");
            }

            if (type === "emptyCart" || type === "error"){
                showMsg.classList.remove("text-[12.50px]");
                showMsg.classList.remove("text-green-700"); 
                showMsg.classList.remove("text-yellow-800");
                showMsg.classList.add("text-red-700");
                showMsg.classList.add("text-[16px]");
            }

            showMsg.innerHTML = text;
        
            setTimeout(() => {
            showMsg.classList.remove("opacity-0");
            showMsg.classList.add("opacity-100");
            }, 10);
        
            setTimeout(() => {
            showMsg.classList.remove("opacity-100");
            showMsg.classList.add("opacity-0");
            }, 3000);
    
}


bookBtn.addEventListener("click", function(e){
    e.preventDefault();

    const infoSym = `<i class="fa-solid fa-circle-info"></i>`;

    if (cartItems.length === 0) {
      showMessage(`${infoSym} Please select at least one item.`,"emptyCart");
      return;
    }
    
    const fName = document.getElementById("fullName").value;
    const emailAdd = document.getElementById("emailAddress").value;
    const phoneNum = document.getElementById("phoneNumber").value;

    

    
    if (fName === "" || emailAdd === "" || phoneNum === "") {
        showMessage(`${infoSym} Please fill all the field to book service.`,"emptyField")
        return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAdd)) {
        
        showMessage(`${infoSym} Please enter valid email address!`,"error");
        return;
    }
   


    if (phoneNum.length !== 10) {
        
        showMessage(`${infoSym} Phone number must be 10 digits!`,"error");
        return;
    }
    

    bookBtn.innerText = "";
    bookBtn.innerText = "Booking...";
    
    const serviceList = cartItems.map((item,i) =>
       ` ${i+1}. ${item.name} - ${item.price}`
    ).join("\n");

    
    const completeServiceDetail = {
      customer_name: fName,
      customer_email: emailAdd,
      customer_phone: phoneNum,
      service_details: serviceList,
      total_amount: totalAmount
    }; 

    
    
    emailjs.send("service_aoow97q","template_nwrvf1g",completeServiceDetail).then((res) =>{

        

    //    console.log(res);
       if(res.text === "OK"){

        showMessage(`${infoSym} Thank you For Booking the Service, We will get back to you soon!`,"success");

        cartItems = [];
       totalAmount = 0;

       document.getElementById("fullName").value = "";
       document.getElementById("emailAddress").value = "";
       document.getElementById("phoneNumber").value = "";
       

       document.querySelectorAll(".add-btn").forEach(btn => {
          btn.innerHTML = `<span>Add Item  <i class="fa-solid fa-circle-plus"></i></span>`;
          btn.className = "add-btn flex justify-center items-center gap-2 bg-gray-300 text-black px-6 py-2 rounded-xl cursor-pointer outline-0";
       });

       bookBtn.innerText = "";
       bookBtn.innerText = "Book Now";

       updateCartUI();
       updateBookSericesForm();
        
       }

       
    }).catch(() => {

        showMessage(`${infoSym} Booking Failed!`,"error");

    });
    
    
    
});

document.getElementById("subscribe-btn").addEventListener("click", function(e){
   e.preventDefault();
});





