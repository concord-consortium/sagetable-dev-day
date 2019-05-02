var canvas = document.getElementById("canvasOutput");
var ctx = canvas.getContext("2d");

export default function renderNetwork(nodes) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNodes(nodes);
}

function drawNodes(nodes) {
  ctx.strokeStyle = "#FF0000";
  nodes.forEach(node => {
    const width = node.radius * 2;
    ctx.strokeRect(node.x - node.radius, node.y - node.radius, width, width);
  });
}