$(document).ready(function(){

let addNotes = document.getElementById("Add-note");  
let close = document.querySelector(".close");
let postNotes = document.getElementById("post-notes-btn");
let editButton = document.getElementById("edit-btn");

// .........................................FUNCTIONALITY FOR INDEX/HOME PAGE-------------------------------------------
addNotes.addEventListener("click" , function(){
    document.getElementById("m3").style.display = "flex";
  });

  close.addEventListener("click", function(){
    document.querySelector("#m3").style.display = "none";
  });
  postNotes.addEventListener("click" , function(){
      document.getElementById("m3").style.display = "none";
  });


// .........................................FUNCTIONALITY FOR INDEX/HOME PAGE-------------------------------------------

// .........................................AJAX REQUESTS---------------------------------------------------------------



  // $("#add-notes").on("submit", function(event){

  //   event.preventDefault();

  //   const notesData = $(this).serialize();

  //   $.ajax({
  //     url : "/notes",
  //     method : "POST",
  //     data : notesData,
  //     success : function(results,status,xhr){

  //       console.log(results);
  //       let html = "";

  //       results.forEach(function(result){

  //         html += `
  //         <div class="notes-container" > 
  //         <h5> ${result.title}  </h5> 
  //         <p>  ${result.content}  </p> 
  //         <form action="/delete/${result._id}" method="POST">
  //         <button class="index-btn" type="submit">Edit</button> 
  //         <button class="index-btn delete" type="submit">Delete</button>
  //         <button class="index-btn" type="button">Share</button>
  //         </form>

  //         <form id="share-form" action="/shared/${result._id}" method="POST">
  //         <input id="toShareInput" type="number" name="username" placeholder="Enter the username to share :">
  //         <label for="read-only">Read only</label>
  //         <input id="read-only" type="radio">
  //         <label for="read-write">Read & Write</label>
  //         <input id="read-write" type="radio">
  //         <button class="index-btn" type="submit">share</button>
  //         </form>
  //         </div> `
  //       });

  //       let note = document.getElementById("my-notes");

  //       note.innerHTML = html;
  //     }

  //   });
  // });






});