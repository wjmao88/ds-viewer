/* global $, StructureBinder, BinarySearchTree*/
/*exported render */

var sampleData = {
  value: 5,
  color: 'black',
  left: {
    value: 3,
    color: 'red'
  },
  right: {
    value: 8,
    color: 'red'
  }
};

//container for nodes and links
var data = {
  'nodes': [],
  'links': []
};

//call to refresh the rendering of the structure
var updateRender = function(stage, structure, traverseLog){
  stage.nodes = [];
  stage.links = [];
  structure[traverseLog](function(node) {
    if (node.parent) {
      node.depth = node.parent.depth + 1;
      stage.links.push({
        'source': node,
        'target': node.parent
      });
    } else {
      node.depth = 0;
    }
    stage.nodes.push(node);
  });
};

//create
var structureBinder = new StructureBinder('BinarySearchTree', BinarySearchTree);

var structure = undefined;




var width = 960,
    height = 500;

var svg = d3.select('#container')
  .append('svg')
    .attr('width', width)
    .attr('height', height);

var force = d3.layout.force()
  .charge(-1500)
  .gravity(0.05)
  .size([width, height])
  .linkDistance(function(d) { return 150 / (Math.log(d.source.depth) + 1); });

var update = function() {

  var text = svg.selectAll('text').data(data.nodes);
  var node = svg.selectAll('circle').data(data.nodes);
  var link = svg.selectAll('line').data(data.links);

  text.enter()
    .append('text')
      .attr('font-family', 'sans-serif')
      .attr('fill', 'black');

  text.text(function (d) { return d.value; })
      .attr('font-size', '20px');

  text.exit().remove();

  node.enter()
    .append('circle')
      .attr('r', 20)
      .attr('x', 0)
      .attr('y', 500)
      .attr('stroke', function(d) { return d.color; })
      .attr('stroke-width', 4)
      .attr('fill', 'transparent');

  node.attr('stroke', function(d) { return d.color; });

  node.exit().remove();

  link.enter()
    .append('line')
      .style('stroke','black');

  link.exit().remove();

  force.nodes(data.nodes)
    .links(data.links)
    .start();

  force.on('tick', function() {
    link.attr('x1', function(d) { return d.source.x + (22 / 80) * (d.target.x - d.source.x); })
        .attr('y1', function(d) { return d.source.y + (22 / 80) * (d.target.y - d.source.y); })
        .attr('x2', function(d) { return d.target.x + (22 / 80) * (d.source.x - d.target.x); })
        .attr('y2', function(d) { return d.target.y + (22 / 80) * (d.source.y - d.target.y); });
    node.attr('cx', function(d) {
                                  if (!d.parent) {
                                    d.x = width / 2;
                                  }
                                  return d.x;
                                })
        .attr('cy', function(d) { d.y = 30 + 70 * d.depth; return d.y; });
    text.attr('x', function(d) { return d.x - 5 * d.value.toString().length; })
        .attr('y', function(d) { return d.y + 8; });
  });

  node.call(force.drag);

};
