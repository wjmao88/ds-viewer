/* global $, treeViewer, RedBlackTree */
/* exported app */
var app = {};

$(document).ready(function(){
  treeViewer.ready();
  $('button.insert').on('click', function(){
    var number = parseInt($('.input').val());
    console.log(number);
    if (treeViewer.tree === null){
      treeViewer.tree = new RedBlackTree(number);
      treeViewer.break('created', number);
    } else {
      treeViewer.tree.insert(number);
    }
  });

  $('button.remove').on('click', function(){
    var number = parseInt($('.input').val());
    console.log(number);
    if (treeViewer.tree === null || treeViewer.tree.value === null){
      return;
    }
    treeViewer.tree.remove(number);
  });

  $('button.insertRandom').on('click', function(){
    var times = $('.iterations').val() || 1;
    while (times > 0){
      var number = Math.random()*200 >> 1;
      console.log(number);
      if (treeViewer.tree === null){
        treeViewer.tree = new RedBlackTree(number);
        treeViewer.break('created', number);
      } else {
        treeViewer.tree.insert(number);
      }
      times--;
    }
  });

  $('button.removeRandom').on('click', function(){
    if (treeViewer.tree === null){
      return;
    }
    var times = $('.iterations').val() || 1;
    var array = treeViewer.tree.toArray();
    array = array.filter(function(d){
      return d !== undefined;
    });
    while (times > 0 && array.length > 0){
      var number = array.splice(Math.random()*2*(array.length) >> 1, 1)[0];
      treeViewer.tree.remove(number);
      times--;
    }
  });

  $('button.stepButton').on('click', function(){
    treeViewer.renderQueue.step();
  });

  $('button.autoMode').on('click', function(){
    treeViewer.renderQueue.setAuto();
  });

  $('button.stepMode').on('click', function(){
    treeViewer.renderQueue.setManual();
  });

  $('button.changeDelay').on('click', function(){
    var delay = $('.delay').val();
    if (isNaN(delay)){
      return;
    }
    treeViewer.renderQueue.delay = delay;
    treeViewer.delay = delay;
  });

  $('button.allBlack').on('click', function(){
    treeViewer.tree = new RedBlackTree(5);
    treeViewer.tree.insert(3);
    treeViewer.tree.insert(2);
    treeViewer.tree.insert(4);
    treeViewer.tree.insert(7);
    treeViewer.tree.insert(6);
    treeViewer.tree.insert(8);

    treeViewer.tree.insert(1);
    treeViewer.tree.insert(9);
    treeViewer.tree.remove(1);
    treeViewer.tree.remove(9);

    treeViewer.tree.findClosest(3).color = 'black';
    treeViewer.tree.findClosest(7).color = 'black';

    treeViewer.tree.insert(1);
    treeViewer.tree.remove(1);
  });
});
