
const btn_admin_registr = document.querySelector(".main_block-registr")
const form_admin_registr = document.querySelector(".block_registr")


// Открывает в админке регистрацию ***
let isOpen_admin_registr = false;
btn_admin_registr.addEventListener("click", function(){
  if(!isOpen_admin_registr){
   form_admin_registr.style.display = "flex";
    isOpen_admin_registr = true;
  }else{
    form_admin_registr.style.display = "none";
    isOpen_admin_registr = false
  }
})

console.log("adminApp.js Start!")