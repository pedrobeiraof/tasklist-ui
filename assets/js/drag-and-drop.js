function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  draggableCard = $("#" + data)
  dragDiv = ev.target.getAttribute("dragdiv")
  draggableCard.appendTo($("#" + dragDiv))
  updateStatus(data, dragDiv)
}