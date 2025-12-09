
const btn_admin_registr = document.querySelector(".main_block-registr")
const form_admin_registr = document.querySelector(".block_registr")
//Пользователи 
const btm_user_list = document.querySelector(".block-admin_reg")
const form_user_list = document.querySelector(".user_list")
//Пользователи конец 

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

//Открываем лист зареганными пользователями что лежать в users.db 
let isOpen_user_list = false
btm_user_list.addEventListener("click", function(){
  if(!isOpen_user_list){
    form_user_list.style.display = "block"
    isOpen_user_list = true
  }else{
    form_user_list.style.display = "none"
     isOpen_user_list = false
  }
})


// Рендеринг регистрации 



console.log("adminApp.js Start!")