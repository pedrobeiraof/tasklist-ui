// format task data to an html card
function cardHtml(data){
  card = "<div id="+data.id+" class='card mt-2' ondragstart='drag(event)' draggable='true'>"+
          "<div class='card-body'>"+
            "<button id="+data.id+" type='button' onClick='deleteTask(this)' class='close btn-delete'><i class='fa fa-times small'></i></button>"+
            "<button id="+data.id+" type='button' onClick='handleEditTask(this)' class='close btn-delete'><i class='fa fa-edit small mr-2'></i></button>"+
            "<h5 id='card-title-"+data.id+"' class='card-title'>"+data.title+"</h5>"+
            "<p id='card-description-"+data.id+"' class='card-text'>"+data.description+"</p>"+
            "<p class='card-text'><small class='text-muted'>#"+data.id+" - Last updated "+data.updated_at+"</small></p>"+
          "</div>"+
        "</div>"
  return card
}

// check the task status to append in the equivalent column
function appendCards(tasks) {
  tasks.forEach(function(task){
    card = cardHtml(task);
    switch(task.status) {
      case TODO:
        $("#todo").append(card)
        break;
      case DOING:
        $("#doing").append(card)
        break;
      case DONE:
        $("#done").append(card)
        break;
      default:
        break;
    }
  });
}

function clearBoard() {
  $("#todo").empty();
  $("#doing").empty();
  $("#done").empty();
}

function fetchTasks(search) {
  clearBoard();
  $.ajax({
    url:API_URL + "/tasks/",
    type: 'GET',
    data: { search },
    success: function(response){
      appendCards(response);
    },
    error: function(response){
      console.log(response);
    }
  });
}

// clear modal data when dismissed
function onDismissModal() {
  $('#task-modal').on('hidden.bs.modal', function () {
    $('#title-input').val("");
    $('#description-input').val("");
    $('#task-id').val("");
  })
}

$(document).ready(function(){
  // fetch tasks and render the result in the board
  fetchTasks();
  // add modal dismiss listener
  onDismissModal();
});

function updateStatus(id, dsStatus){
  const status = StatusIds[dsStatus];
  $.ajax({
    url: API_URL + "/tasks/"+id+"/update-status",
    type: 'patch',
    data: { status },
    success: function(response){
      fetchTasks();
    },
    error: function(response){
      console.log(response);
    }
  });
}

function deleteTask(btn) {
  const id = btn.id;
  $.ajax({
    url: API_URL + "/tasks/" + id + "/delete",
    type: 'delete',
    success: function(){
        fetchTasks();
    },
    error: function(response){
      console.log(response);
    }
  })
}

function addNewTask() {
  let title = $('#title-input').val();
  let description = $('#description-input').val();
  const data = {
    title,
    description
  };
  $.ajax({
    url: API_URL + "/tasks/",
    type: 'post',
    data: data,
    success: function(response){
      $('#task-modal').modal('hide');
      fetchTasks();
    },
    error: function(response){
      console.log(response.responseText);
    }
  });
}

function editTask(id) {
  let title = $('#title-input').val();
  let description = $('#description-input').val();
  const data = {
    title,
    description
  };
  $.ajax({
    url: API_URL + "/tasks/" + id,
    type: 'patch',
    data: data,
    success: function(response){
      $('#task-modal').modal('hide');
      fetchTasks();
    },
    error: function(response){
      console.log(response.responseText);
    }
  });
}

// fill the modal fields with the selected card data
function handleEditTask(btn) {
  const id = btn.id;
  const title = $('#card-title-' + id).text();
  const description = $('#card-description-' + id).text();
  $('#title-input').val(title);
  $('#description-input').val(description);
  $('#task-id').val(id);
  $('#task-modal').modal('show');
}

// Check if is an create or an update request when submiting the form
function submitForm() {
  const id = $('#task-id').val();
  if (id) {
    editTask(id);
    return;
  }
  addNewTask();
}

function filterTasks() {
  filter = $('#task-filter-input').val()
  fetchTasks(filter)
}
