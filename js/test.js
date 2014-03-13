/* global RedBlackTree */
/* exported */
var test = {
  fails: [],
};

test.insertTree = function(inputs){
  var tree = new RedBlackTree(inputs[0]);
  for (var i=1; i<30; i++){
    tree.insert( inputs[i] );
    if (tree.hasBlackViolation() || tree.hasRedViolation()){
      test.fails.push(inputs);
      debugger;
    }
  }
  return tree;
};

test.removeTree = function(inputs, tree){
  for (var i=1; i<30; i++){
    //console.log('removing value ', inputs[i]);
    tree.remove( inputs[i] );
    if (tree.hasBlackViolation() || tree.hasRedViolation()){
      test.fails.push(inputs);
      debugger;
    }
  }
};

test.generateInputs = function(n, m){
  var inputs = [];
  for (var i=0; n<100; i++){
    inputs.push( (Math.random() * 2 * m) >> 1);
  }
  return inputs;
};

test.start = function(mult, nodes, max){
  mult = mult || 1;
  while (test.fails.length === 0 && mult > 0){
    var inputs = test.generateInputs(nodes || 30, max || 100);
    var tree = test.insertTree(inputs);
    if (tree.hasBlackViolation() || tree.hasRedViolation()){
      test.fails.push(inputs);
      debugger;
    }
    test.removeTree(inputs, tree);
    if (tree.left !== null || tree.right !== null){
      test.fails.push(inputs);
      debugger;
    }
    mult--;
  }
};

