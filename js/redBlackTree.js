/* global BinarySearchTree */
var RedBlackTree = function(value, parent){
  //console.log('make red black tree ' + value + ' | '+ parent);
  BinarySearchTree.apply(this, arguments);
  this.value = value;
  this.color = (parent === undefined || parent === null)? 'black' : 'red';
  this.left = null;
  this.right = null;
  this.parent = parent || null;
};

(function(){
  RedBlackTree.prototype = Object.create(BinarySearchTree.prototype);
  RedBlackTree.prototype.contructor = RedBlackTree;
}());

RedBlackTree.isBlack = function(node){
  return (node === null || node.color === 'black');
};

RedBlackTree.isRed = function(node){
  return node !== null && node.color === 'red';
};

RedBlackTree.prototype.factory = function(value, parent){
  return new RedBlackTree(value, parent);
};
//=========================================================
RedBlackTree.prototype.blackDepth = function(){
  var depth = this.color === 'black'? 1: 0;
  return depth + (this.left === null? 1 : this.left.blackDepth());
};

RedBlackTree.prototype.hasRedViolation = function(){
  var violation = RedBlackTree.isRed(this) && (RedBlackTree.isRed(this.left) || RedBlackTree.isRed(this.right));
  violation = violation || (this.left !== null && this.left.hasRedViolation());
  violation = violation || (this.right !== null && this.right.hasRedViolation());
  return violation;
};

RedBlackTree.prototype.hasBlackViolation = function(){
  var left = this.left === null? 1 : this.left.blackDepth();
  var right = this.right === null? 1 : this.right.blackDepth();
  var leftResult = this.left === null? false : this.left.hasBlackViolation();
  var rightResult = this.right === null? false : this.right.hasBlackViolation();
  return left !== right || leftResult || rightResult;
};
//=========================================================
RedBlackTree.nullCounter = 0;
RedBlackTree.prototype.toJSON = function(){
  var map = {
    id: '',
    value: this.value,
    color: this.color,
    parent: this.parent === null? null : this.parent.value
  };
  map.children = [];
  map.children.push(this.left === null ? this.nullJSON(map) : this.left.toJSON());
  map.children.push(this.right === null ? this.nullJSON(map) : this.right.toJSON());
  return map;
};

RedBlackTree.prototype.nullJSON = function(parent){
  return {
    value: 'nl',
    id: RedBlackTree.nullCounter++,
    color: 'black',
    children: [],
    parent: parent
  };
};

RedBlackTree.prototype.toString = function(){
  return JSON.stringify(this.toJSON(), null, 2);
};
//=========================================================
RedBlackTree.prototype.removeSelf = function(){
  var doubleBlack = BinarySearchTree.prototype.removeSelf.call(this);
  if (doubleBlack.parent === null){
    //delete root?
    return;
  }
  if (doubleBlack.color === 'red'){
    //removing a red need no changes
    return;
  }
  treeViewer.break('removing ', doubleBlack.parent === null? 'near root' : doubleBlack.parent.value, 2);
  doubleBlack.propagateUp(doubleBlack.sibling());
  treeViewer.break('end removing ', doubleBlack.parent === null? 'near root' : doubleBlack.parent.value, 2);
};

RedBlackTree.prototype.propagateUp = function(sibling){
  if (this.parent !== null){
    this.parent.propagate(sibling || this.sibling());
  }
};

RedBlackTree.prototype.propagate = function(sibling){
  //sibling is referring to the sibling of the double black node
  //case 1
  treeViewer.break('propagated ' + sibling.value, this.value, 2);
  if (this.color === 'black' && sibling.color === 'red'){
    this.case1(sibling);
  } else if (sibling.color === 'black' && RedBlackTree.isBlack(sibling.left) && RedBlackTree.isBlack(sibling.right)){
    this.case2(sibling);
  } else if (sibling.color === 'black' && RedBlackTree.isRed(sibling[sibling.otherSide()]) && RedBlackTree.isBlack(sibling[sibling.side()]) ){
    this.case3(sibling);
  } else if (sibling.color === 'black' && RedBlackTree.isRed(sibling[sibling.side()])){
    this.case4(sibling);
  }
  if (this.color === 'red'){
    console.log('unhandled case ', this.value, sibling.value);
  }
};

RedBlackTree.prototype.case1 = function(sibling){
  treeViewer.break('case 1 ', sibling.value, 2);
  var side = sibling.side();
  this.rotateTo(sibling.otherSide());
  var newSibling = sibling[side];
  // if (sibling.left !== null && sibling.right !== null &&
  //     (RedBlackTree.isRed(sibling.left.left) ||
  //       RedBlackTree.isRed(sibling.left.right) ) ){
  //   newSibling = sibling.right;
  // }
  // if (sibling.left === null){
  //   newSibling = sibling.right;
  // }
  sibling.propagate(newSibling);
  // var left = sibling.left === null? 1 : sibling.left.blackDepth();
  // var right = sibling.right === null? 1 : sibling.right.blackDepth();
  // sibling.propagate(left < right? sibling.right : sibling.left);
};

RedBlackTree.prototype.case2 = function(sibling){
  treeViewer.break('case 2 ', sibling.value, 2);
  if (  RedBlackTree.isBlack(sibling.left) &&
        RedBlackTree.isBlack(sibling.right) ) {
    //sibling's children are black
    sibling.color = 'red';
    if (this.color === 'red'){
      //absorb extra black
      this.color = 'black';
    } else {
      this.propagateUp(this.sibling());
    }
  }
};

RedBlackTree.prototype.case3 = function(sibling){
  treeViewer.break('case 3 ', sibling.value, 2);
  sibling.rotateTo(sibling.side());
  this.case4(sibling);
};

RedBlackTree.prototype.case4 = function(sibling){
  treeViewer.break('case 4 ', sibling.value, 2);
  var side = sibling.side();
  this.rotateTo(sibling.otherSide());
  this[side].color = 'black';
};

//===========================
RedBlackTree.prototype.rebalance = function(newTree){
  treeViewer.break('rebalance', this.value, 1);
  if (!this.getRoot().hasBlackViolation() && !this.getRoot().hasRedViolation()){
    return;
  }
  //this is the parent of the new tree node
  if ( this.sibling() === undefined || RedBlackTree.isBlack(this) ){
    //sibling is undefined when this has no parent, thus is root
    return;
  }
  if (RedBlackTree.isRed(this.sibling())){
    if (this.parent !== null){
      this.parent.repaint(newTree);
    }
  } else if (RedBlackTree.isBlack(this.sibling())){
    if (this.side() !== null && newTree.side() !== this.side()){
      this.rotateTo(this.side());
    }
    this.parent.rotateTo(this.otherSide());
  }
};

RedBlackTree.prototype.repaint = function(newTree){
  treeViewer.break('repaint', this.value, 1);
  this.left.color = 'black';
  this.right.color = 'black';
  this.color = 'red';
  if (this.parent === null){
    this.color = 'black';
    return;
  }
  if (this.parent.color === 'red') {
    this.parent.rebalance(this); //put back severed links
  }
};

// RedBlackTree.prototype.reorganize = function(d1, d2, blackChildren){
//   //rotation occurs when 3 nodes are in a list structure
//   //they will be grandparent, parent and child
//   //inside this function, the keyword this is the child
//   //
//   //set up references for the local logic node's parent and children
//   var externalChildren = [];
//   //set up the children of the current node as a base
//   externalChildren[0] = this.left;
//   externalChildren[1] = this.right;
//   //concatenate the sibling of the child either to the left or right
//   //depending on whether the child is a right or left child of parent
//   if (this === this.parent.right){
//     externalChildren = [this.parent.left].concat(externalChildren);
//   } else {
//     externalChildren = externalChildren.concat([this.parent.right]);
//   }
//   //repeat the above step, except for parent and grand parent
//   if (this.parent === this.parent.parent.right){
//     externalChildren = [this.parent.parent.left].concat(externalChildren);
//   } else {
//     externalChildren = externalChildren.concat([this.parent.parent.right]);
//   }

//   //rearrage internal values
//   //store values under variables indicative of their final location
//   var values = {};
//   values['parent'] = d1===d2 ? this.parent.value : this.value;
//   if (d1 === d2){
//     values[d2] = this.value;
//     values[(d2==='left'? 'right' : 'left')] = this.parent.parent.value;
//   } else {
//     values[d1] = this.parent.value;
//     values[d2] = this.parent.parent.value;
//   }
//   //re-arrange parent and child to be children of grandparent
//   var tree = this.parent.parent;
//   tree.left = this;
//   tree.right = this.parent;
//   tree.left.parent = tree;
//   tree.right.parent = tree;
//   //coloring
//   if (blackChildren){
//     //grandparent need to be colored red to maintain black balance
//     tree.left.color = 'black';
//     tree.right.color = 'black';
//   } else {
//     //grandparent will remain black
//     tree.right.color = 'red';
//     tree.left.color = 'red';
//   }
//   //re-assign values to correct location
//   tree.value = values['parent'];
//   tree.left.value = values['left'];
//   tree.right.value = values['right'];
//   //re-attach external references to the new internal tree
//   tree.left.left = externalChildren[0];
//   externalChildren[0] === null? '' : externalChildren[0].parent = tree['left'];
//   tree.left.right = externalChildren[1];
//   externalChildren[1] === null? '' : externalChildren[1].parent = tree['left'];
//   tree.right.left = externalChildren[2];
//   externalChildren[2] === null? '' : externalChildren[2].parent = tree['right'];
//   tree.right.right = externalChildren[3];
//   externalChildren[3] === null? '' : externalChildren[3].parent = tree['right'];
//   return tree;
// };
