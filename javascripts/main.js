"use strict";

let apiKeys = {};
let uid = {};

function putTodoInDOM(){
  FbAPI.getTodos(apiKeys, uid).then(function(items){
    //console.log("itmems from FB", items);
    $("#incomplete").html("");
    $("#done-items").html("");
    items.forEach(function(item){
    if(item.isCompleted === false) {
    let newListItem = `<li class="ui-state-default">`;
    newListItem+=`<div class="checkbox" data-fbid="${item.id}" data-completed="${item.isCompleted}">`;
    newListItem+=`<input class="hidden inputTask" value=${item.task}>`;
    newListItem+=`<label>${item.task}</label>`;
    newListItem+=`<button class="delete remove-item btn btn-danger btn-default btn-xs pull-right" data-fbid="${item.id}"><span class="remove-item glyphicon glyphicon-remove"></span></button>`;
    newListItem+=`<button class="edit edit-item btn btn-info btn-default btn-xs pull-right" data-fbid="${item.id}"><span class="glyphicon glyphicon-edit"></button>`;
    newListItem+=`<button class="complete complete-item btn btn-success btn-default btn-xs pull-right" data-fbid="${item.id}"><span class="glyphicon glyphicon-ok"></span></button>`;
    newListItem+=`</div>`;
    newListItem+=`</li>`;
    $("#incomplete").append(newListItem);
    //apend to list
    } else {
    let newListItem = `<li class="ui-state-default">`;
    newListItem+=`<div class="checkbox" data-fbid="${item.id}" data-completed="${item.isCompleted}">`;
    newListItem+=`<label>${item.task}</label>`;
    newListItem+=`<button class="complete complete-item btn btn btn-default btn-xs pull-right" data-fbid="${item.id}"><span class="glyphicon glyphicon-remove"></span>`;
    newListItem+=`</button></div></li>`;
    newListItem+=`</div>`;
    newListItem+=`</li>`;
    $("#done-items").append(newListItem);
    //apend to list
    }
    });
  });
}

function createLogoutButton() {
  FbAPI.getUser(apiKeys, uid).then(function(userResponse){
    $("#logout-container").html("");
    console.log(userResponse);
    let currentUserName = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logout-button">LOGOUT ${currentUserName}</button>`;
    $("#logout-container").append(logoutButton);
  });
}

$("#add").on("click", function(){
  let newItem = {
    "task":$("#user-input").val(),
    "isCompleted": false,
    "uid": uid
  };
  FbAPI.addTodos(apiKeys, newItem).then(function(item){
    console.log("inside addTodos", item);
    putTodoInDOM();
  });
});

$(document).ready(function(){
  FbAPI.firebaseCredentials().then(function(keys){
    console.log("keys", keys);
    apiKeys = keys;
      firebase.initializeApp(apiKeys);
  });

  $("ul").on("click", ".delete", function(){
   let itemId = $(this).data("fbid");
   console.log(itemId);
   FbAPI.deleteTodos(apiKeys, itemId).then(function(){
      putTodoInDOM();
   });
  });

  $("ul").on('click', ".edit", function(){
    let itemId = $(this).data("fbid");
    let parent = $(this).closest("li");
    let labelUpdate =$(this).parent().children(':first-child');
    if(!parent.hasClass("editMode")){
      labelUpdate.removeClass("hidden");
      parent.addClass("editMode");
      $(this).parent().children(":nth-child(2)").addClass("hidden");
    } else {
      labelUpdate.addClass("hidden");
      let editedItem = {
        "task":labelUpdate.val(),
        "isCompleted": false,
        "uid": uid
      };
      FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(response){
        parent.removeClass("editMode");
        putTodoInDOM();

      });
    }


  });


  $("ul").on('click', '.complete', function() {
    let updateIsCompleted = $(this).parent().data("completed");
    let itemId = $(this).parent().data("fbid");
    let task = $(this).parent().children("label:first-of-type").html();
    let editedItem = {
      "task": task,
      "isCompleted": !updateIsCompleted,
      "uid": uid
    };
    FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(response){
    putTodoInDOM();

    });

  });


$("#registerButton").on('click', function(){
  let userName = $("#inputUsername").val();
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.registerUser(user).then(function(registerResponse){
    console.log("register response", registerResponse);
    let newUser = {
      "username" : userName,
      "uid" : registerResponse.uid
    };
    return FbAPI.addUser(apiKeys, newUser);
  }).then(function(addUserResponse){


    return FbAPI.loginUser(user);
  }).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    putTodoInDOM();
    $("#login-container").addClass("hidden");
    $("#to-do-container").removeClass("hidden");
  });
});

$("#loginButton").on('click', function(){
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.loginUser(user).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    putTodoInDOM();
    $("#login-container").addClass("hidden");
    $("#to-do-container").removeClass("hidden");

  });
});

$("#logout-container").on('click','#logout-button', function(){
  FbAPI.logoutUser();
  uid = "";
  $("#to-do-container").addClass("hidden");
  $("#login-container").removeClass("hidden");
  $("#user-input").val("");
  $("#inputUsername").val("");
  $("#inputPassword").val("");
  $("#inputEmail").val("");
  $("#incomplete").html("");
  $("#done-items").html("");
  $("#inputEmail").focus();

});


















});























// let editing = false;
// $("#add").click(function(){
//   let userInput = $("#user-input").val();
//   if (userInput !== "") {
//   $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>${userInput}</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
//   }
//   $("#user-input").val("");
//   $("#user-input").focus();
// });

// $('#user-input').keypress(function(e){
//   if(e.which == 13){
//   if(!editing) {
//     let userInput = $("#user-input").val();
//     if (userInput !== "") {
//       $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>${userInput}</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
//       $("#user-input").val("");
//       $("#user-input").focus();
//     }
//   }
// }
// });


// $(document).on('click', '#sortable .complete-item', function(){
//     if(!$(this).hasClass("disabled")) {
//     $("#done-items").append(`<li class="ui-state-default"><div class="checkbox"><label>`+ $(this).parent().text().trim() + `</label><button class="complete-item btn btn btn-default btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button></div></li>`);
//     $(this).parent().parent().remove();
//   }
// });

// $(document).on('click', '#sortable .edit-item', function() {
//   if(!$(this).hasClass("disabled")) {
//     editing = true;
//     $(this).parent().addClass("editingTaskBorder");
//     $(this).parent().children("label").addClass("editing");
//     $("#user-input").val(($(this).parent().children("label").text()));
//     $("#user-input").focus();
//     $("#add").addClass("hidden disabled");
//     $("#edit").removeClass("hidden disabled");
//     $("#save").removeClass("hidden disabled");
//     $(".complete-item").addClass("disabled");
//     $(".edit-item").addClass("disabled");
//     $(".remove-item").addClass("disabled");
//   }
// });


// $(document).on('click', '#sortable .remove-item', function(){
//   if(!$(this).hasClass("disabled")) {
//     $(this).parent().parent().remove();
//   }
// });

// $(document).on('click', '#done-items .complete-item', function(){
//   $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>` + $(this).parent().text().trim()  + `</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
//   $(this).parent().parent().remove();
// });

// $(document).on('click', '#save', function(){
//   $(".editing").text($("#user-input").val());
//   $(".editing").removeClass("editing");
//   $("#sortable li div").removeClass("editingTaskBorder");
//   $("#user-input").val("");
//   $("#add").removeClass("hidden disabled");
//   $("#edit").addClass("hidden disabled");
//   $("#save").addClass("hidden disabled");
//   editing = false;
//   $(".complete-item").removeClass("disabled");
//   $(".edit-item").removeClass("disabled");
//   $(".remove-item").removeClass("disabled");
// });
