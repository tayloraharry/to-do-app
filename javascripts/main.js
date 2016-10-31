"use strict";

$(document).ready(function() {
let editing = false;

$("#add").click(function(){
  let userInput = $("#user-input").val();
  if (userInput !== "") {
  $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>${userInput}</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
  } else {
    //alert("Please, enter a task");
  }
  $("#user-input").val("");
  $("#user-input").focus();
});

$('#user-input').keypress(function(e){
  if(e.which == 13){
  if(!editing) {
    let userInput = $("#user-input").val();
    if (userInput !== "") {
      $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>${userInput}</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
      $("#user-input").val("");
      $("#user-input").focus();
    } else {
      //alert("Please, enter a task");
    }
  }
}
});


$(document).on('click', '#sortable .complete-item', function(){
    if(!$(this).hasClass("disabled")) {
    $("#done-items").append(`<li class="ui-state-default"><div class="checkbox"><label>`+ $(this).parent().text().trim() + `</label><button class="complete-item btn btn btn-default btn-xs pull-right"><span class="glyphicon glyphicon-remove"></span></button></div></li>`);
    $(this).parent().parent().remove();
  }
});

$(document).on('click', '#sortable .edit-item', function() {
  if(!$(this).hasClass("disabled")) {
    editing = true;
    $(this).parent().addClass("editingTaskBorder");
    $(this).parent().children("label").addClass("editing");
    $("#user-input").val(($(this).parent().children("label").text()));
    $("#user-input").focus();
    $("#add").addClass("hidden disabled");
    $("#edit").removeClass("hidden disabled");
    $("#save").removeClass("hidden disabled");
    $(".complete-item").addClass("disabled");
    $(".edit-item").addClass("disabled");
    $(".remove-item").addClass("disabled");
  }
});


$(document).on('click', '#sortable .remove-item', function(){
  if(!$(this).hasClass("disabled")) {
    $(this).parent().parent().remove();
  }
});

$(document).on('click', '#done-items .complete-item', function(){
  $("#sortable").append(`<li class="ui-state-default"><div class="checkbox"><label>` + $(this).parent().text().trim()  + `</label><button class="remove-item btn btn-danger btn-default btn-xs pull-right"><span class="remove-item glyphicon glyphicon-remove"></span></button><button class="edit-item btn btn-info btn-default btn-xs pull-right"><span class="glyphicon glyphicon-edit"></button><button class="complete-item btn btn-success btn-default btn-xs pull-right"><span class="glyphicon glyphicon-ok"></span></button></div></li>`);
  $(this).parent().parent().remove();
});

$(document).on('click', '#save', function(){
  $(".editing").text($("#user-input").val());
  $(".editing").removeClass("editing");
  $("#sortable li div").removeClass("editingTaskBorder");
  $("#user-input").val("");
  $("#add").removeClass("hidden disabled");
  $("#edit").addClass("hidden disabled");
  $("#save").addClass("hidden disabled");
  editing = false;
  $(".complete-item").removeClass("disabled");
  $(".edit-item").removeClass("disabled");
  $(".remove-item").removeClass("disabled");
});






});