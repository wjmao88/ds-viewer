/* global d3, RedBlackTree, AsyncQueue*/
//=========================================================
var delay = 0;
var height = window.innerHeight-80;//(tree.depth()+1)*50;
var width = window.innerWidth;//12 * Math.pow(2, tree.depth());
var treeLayout = d3.layout.tree()
  .size([width, height-50]);

d3.select('.container').selectAll('g')
  .data([])
  .exit().remove();

var svg = d3.select('.container')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(0,60)');

var render = function(treeJSON) {
  var layoutNodes = treeLayout.nodes(treeJSON);

  var links = svg.selectAll('.link')
    .data(treeLayout.links(layoutNodes), function(d){
      return d.target.value+d.target.id;
    });

  var nodes = svg.selectAll('.node')
    .data(layoutNodes, function(d){
      return d.value + d.id;
    });

  var texts = svg.selectAll('.text')
    .data(layoutNodes, function(d){
      return d.value + d.id;
    });

  links.exit().remove();
  nodes.exit().remove();
  texts.exit().remove();

  //entering
  links
    .enter().append('line')
      .attr('class', 'link')
      .attr('stroke-width', 2)
      .attr('stroke', 'blue');

  nodes
    .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 20);

  texts
    .enter().append('text')
      .attr('fill', 'yellow')
      .attr('class', 'text')
      .attr('font-size', 30)
      .text(function(d) { return ('0' + d.value).slice(-2); });

  //changing
  links
    .transition().duration(delay)
      .attr('x1', function(d){
        return d.source.x;
      })
      .attr('y1', function(d){
        return d.source.y;
      })
      .attr('x2', function(d){
        return d.target.x;
      })
      .attr('y2', function(d){
        return d.target.y;
      });

  nodes
    .transition().duration(delay)
      .attr('fill', function(d){
        return d.color;
      })
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      });

  texts
    .transition().duration(delay)
      .attr('dx', function(d) {
        return d.x-15;
      })
      .attr('dy', function(d) {
        return d.y+10;
      });
};

var tree = null;
var debug = false;
var renderQueue = new AsyncQueue(delay);
var treeBreak = function(msg, value, type){
  var json = tree.toJSON();
  renderQueue.enqueue(function(){
    if (debug){
      debugger;
    }
    //console.log(msg + ' @ ' + value);
    //render(json);
  });
};

var doInsert = function(){
  var number = d3.select('.input')[0][0].value;
  tree === null? tree = new RedBlackTree(number) : tree.insert(number);
};

var doRemove = function(){
  var number = d3.select('.input')[0][0].value;
  if (tree === null){
    return;
  }
  tree.remove(number);
};

//=========================================================
var insertTree = function(inputs){
  tree = new RedBlackTree(inputs[0]);
  for (var i=1; i<30; i++){
    tree.insert( inputs[i] );
    if (tree.hasBlackViolation() || tree.hasRedViolation()){
      fails.push(inputs);
      debugger;
    }
  }
};

var removeTree = function(inputs){
  for (var i=1; i<30; i++){
    //console.log('removing value ', inputs[i]);
    tree.remove( inputs[i] );
    if (tree.hasBlackViolation() || tree.hasRedViolation()){
      fails.push(inputs);
      debugger;
    }
  }
};

//=========================================================
//test
//

// var input = [70, 19, 65, 96, 31, 84, 73, 85, 1, 35, 45, 14, 83, 9, 49, 19, 95, 33, 30, 79, 5, 16, 48, 36, 15, 52, 38, 23, 22, 3];

// insertTree(input);
// debug = false;

// var input2 = [70, 19, 65, 96, 31, 84, 73, 85, 1, 35, 45, 14, 83, 9, 49, 19]
// //, 95];
// //, 33, 30];
// var input3 = [79, 5, 16, 48, 36, 15, 52, 38, 23, 22, 3];
// removeTree(input2);



//
var fails = [];
var counter = 200;
while (fails.length === 0 && counter > 0){
  var inputs = [];
  for (var i=0; i<100; i++){
    inputs.push( (Math.random() * 200) >> 1);
  }
  insertTree(inputs);
  if (tree.hasBlackViolation() || tree.hasRedViolation()){
    fails.push(inputs);
  }
  removeTree(inputs);
  if (tree.left !== null || tree.right !== null){
    debugger;
  }
  counter--;
}

//render(tree);
