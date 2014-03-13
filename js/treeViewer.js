/* global d3, AsyncQueue */
/* exported treeViewer */
var treeViewer = {
  debugMode: false,
  tree: null,
  focus: null,
  delay: 1000
};


treeViewer.ready = function(){
  //setup
  treeViewer.renderQueue = new AsyncQueue(this.delay);

  //d3 pre-select
  var h = window.innerHeight-80;
  var w = window.innerWidth;

  treeViewer.treeLayout = d3.layout.tree()
    .size([w, h-50]);

// d3.select('.container').selectAll('g')
//   .data([])
//   .exit().remove();

  treeViewer.svg = d3.select('.container')
    .attr('width', w)
    .attr('height', h)
    .append('g')
    .attr('transform', 'translate(0,60)');
};

treeViewer.break = function(msg, value, type){
  var json = treeViewer.tree.toJSON();
  treeViewer.renderQueue.enqueue(function(){
    if (treeViewer.debugMode){
      debugger;
    }
    //console.log(type + ' ' + msg + ' @ ' + value);
    treeViewer.focus = value;
    treeViewer.render(json);
  });
};

treeViewer.render = function(treeJSON) {
  console.log('rendering');
  var layoutNodes = treeViewer.treeLayout.nodes(treeJSON);

  var links = treeViewer.svg.selectAll('.link')
    .data(treeViewer.treeLayout.links(layoutNodes), function(d){
      return d.target.value+d.target.id;
    });

  var nodes = treeViewer.svg.selectAll('.node')
    .data(layoutNodes, function(d){
      return d.value + d.id;
    });

  var texts = treeViewer.svg.selectAll('.text')
    .data(layoutNodes, function(d){
      return d.value + d.id;
    });

  var captions = treeViewer.svg.selectAll('.captions')
    .data(layoutNodes, function(d){
      return d.value + d.id;
    });

  links.exit().remove();
  nodes.exit().remove();
  texts.exit().remove();
  captions.exit().remove();
  //entering
  links
    .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', 'blue');

  nodes
    .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('stroke-opacity', 0.2)
      .attr('stroke', 'green');

  texts
    .enter().append('text')
      .attr('fill', 'yellow')
      .attr('class', 'text')
      .attr('font-size', 30);

  captions
    .enter().append('text')
      .attr('fill', 'blue')
      .attr('class', 'captions')
      .attr('font-size', 30);

  //changing
  links
    .transition().duration(treeViewer.delay)
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
    .transition().duration(treeViewer.delay)
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
    .transition().duration(treeViewer.delay)
      .text(function(d) {
        if (d.value === null){
          return 'Nl';
        }
        return ('0' + d.value).slice(-2);
      })
      .attr('dx', function(d) {
        return d.x-15;
      })
      .attr('dy', function(d) {
        return d.y+10;
      });

  captions
    .transition().duration(treeViewer.delay)
      .text(function(d) {
        if (d.value === null || d.value === 'nl'){
          return 1;
        }
        console.log(d.value, d.blackDepth);
        return d.blackDepth;
      })
      .attr('dx', function(d) {
        return d.x-15;
      })
      .attr('dy', function(d) {
        return d.y-30;
      });

  nodes
    .transition().duration(treeViewer.delay)
      .attr('stroke-width', function(d){
        if (d.value === treeViewer.focus){
          return 60;
        } else {
          return 1.5;
        }
      })
      .attr('fill', function(d){
        return d.color;
      })
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      });
};
