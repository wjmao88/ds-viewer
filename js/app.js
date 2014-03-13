/* global $, treeViewer, RedBlackTree */
/* exported app */
var app = {};

$(document).ready(function(){
  treeViewer.ready();
  $('button.insert').on('click', function(){
    var number = $('.input').val();
    console.log(number);
    if (treeViewer.tree === null){
      treeViewer.tree = new RedBlackTree(number);
      treeViewer.break('created', number);
    } else {
      treeViewer.tree.insert(number);
    }
  });

  $('button.remove').on('click', function(){
    var number = $('.input').val();
    console.log(number);
    if (treeViewer.tree === null){
      return;
    }
    if (treeViewer.tree.value = number){
      treeViewer.tree = null;
      treeViewer.break('destroyed', number);
    }
    treeViewer.tree.remove(number);
  });

  $('button.insertRandom').on('click', function(){
    var number = Math.random()*200 >> 1;
    console.log(number);
    if (treeViewer.tree === null){
      treeViewer.tree = new RedBlackTree(number);
      treeViewer.break('created', number);
    } else {
      treeViewer.tree.insert(number);
    }
  });
});
