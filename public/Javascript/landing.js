$(document).ready(function(){

  let LoginButton = document.getElementById("loginbtn");
  let registerButton = document.getElementById("registerbtn");
  let landingClose1 = document.querySelector(".landing-close-1");
  let landingClose2 = document.querySelector(".landing-close-2");
  


// .........................................FUNCTIONALITY FOR LANDING PAGE-------------------------------------------
    registerButton.addEventListener("click" , function(){
      document.getElementById("m1").style.display = "flex";
    });
  
    LoginButton.addEventListener("click" , function(){
      document.getElementById("m2").style.display = "flex";
    });

    landingClose1.addEventListener("click", function(){
      document.querySelector("#m1").style.display = "none";
    });
    landingClose2.addEventListener("click", function(){
      document.querySelector("#m2").style.display = "none";
    });
// .........................................FUNCTIONALITY FOR LANDING PAGE-------------------------------------------

});