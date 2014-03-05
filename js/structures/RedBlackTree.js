var RBtree = function(value, parent){
  //console.log('make red black tree ' + value + ' | '+ parent);
  BinarySearchTree.apply(this, arguments);
  this.value = value;
  this.color = (parent === undefined || parent === null)? 'black' : 'red';
  this.left = null;
  this.right = null;
  this.parent = parent || null;
};

(function(){
  RBtree.prototype = Object.create(BinarySearchTree.prototype);
  RBtree.prototype.contructor = RBtree;
}());

RBtree.isBlack = function(node){
  return (node === null || node.color === 'black');
};

RBtree.isRed = function(node){
  return node !== null && node.color === 'red';
};

RBtree.prototype.factory = function(value, parent){
  return new RBtree(value, parent);
};
//=========================================================
RBtree.prototype.blackDepth = function(){
  var depth = this.color === 'black'? 1: 0;
  return depth + (this.left === null? 1 : this.left.blackDepth());
};

RBtree.prototype.hasRedViolation = function(){
  var violation = RBtree.isRed(this) && (RBtree.isRed(this.left) || RBtree.isRed(this.right));
  violation = violation || (this.left !== null && this.left.hasRedViolation());
  violation = violation || (this.right !== null && this.right.hasRedViolation());
  return violation;
};

RBtree.prototype.hasBlackViolation = function(){
  var left = this.left === null? 1 : this.left.blackDepth();
  var right = this.right === null? 1 : this.right.blackDepth();
  var leftResult = this.left === null? false : this.left.hasBlackViolation();
  var rightResult = this.right === null? false : this.right.hasBlackViolation();
  return left !== right || leftResult || rightResult;
};
//=========================================================
RBtree.prototype.toJSON = function(){
  var map = {
    content: this.value + ' | ' + this.color + ' | ' + (this.parent === null? 'is root' : this.parent.value)
  };
  map.left = this.left === null ? null : this.left.toJSON();
  map.right = this.right === null? null : this.right.toJSON();
  return map;
};

RBtree.prototype.toString = function(){
  return JSON.stringify(this.toJSON(), null, 2);
};
//=========================================================
RBtree.prototype.removeSelf = function(){
  var doubleBlack = BinarySearchTree.prototype.removeSelf.call(this);
  console.log('deleting ' + doubleBlack.value);
  if (doubleBlack.parent === null){
    //delete root?
    return;
  }
  if (doubleBlack.color === 'red'){
    //removing a red need no changes
    return;
  }
  doubleBlack.propagateUp(doubleBlack.sibling());
};

RBtree.prototype.propagateUp = function(sibling){
  if (this.parent !== null){
    this.parent.propagate(sibling || this.sibling());
  }
};

RBtree.prototype.propagate = function(sibling){
  //sibling is referring to the sibling of the double black node
  //case 1
  if (this.color === 'black' && sibling.color === 'red'){
    this.case1(sibling);
  } else if (sibling.color === 'black' && RBtree.isBlack(sibling.left) && RBtree.isBlack(sibling.right)){
    this.case2(sibling);
  } else if (sibling.color === 'black' && RBtree.isRed(sibling[sibling.otherSide()]) && RBtree.isBlack(sibling[sibling.side()]) ){
    this.case3(sibling);
  } else if (sibling.color === 'black' && RBtree.isRed(sibling[sibling.side()])){
    this.case4(sibling);
  }
};

RBtree.prototype.case1 = function(sibling){
  this.rotateTo(sibling.otherSide());
  sibling.propagate(sibling.left === null? sibling.right : sibling.left);
};

RBtree.prototype.case2 = function(sibling){
  if (  RBtree.isBlack(sibling.left) &&
        RBtree.isBlack(sibling.right) ) {
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

RBtree.prototype.case3 = function(sibling){
  sibling.rotateTo(sibling.side());
  this.case4(sibling);
};

RBtree.prototype.case4 = function(sibling){
  var side = sibling.side();
  this.rotateTo(sibling.otherSide());
  this[side].color = 'black';
};

//===========================
RBtree.prototype.rebalance = function(newTree){
  //this is the parent of the new tree node
  if ( this.sibling() === undefined || RBtree.isBlack(this) ){
    //sibling is undefined when this has no parent, thus is root
    return;
  }
  if (RBtree.isRed(this.sibling())){
    if (this.parent !== null){
      this.parent.repaint();
    }
  } else if (RBtree.isBlack(this.sibling())){
    if (this.side() !== null && newTree.side() !== this.side()){
      this.rotateTo(this.side());
    }
    this.parent.rotateTo(this.otherSide());
  }
};

RBtree.prototype.repaint = function(){
  this.left.color = 'black';
  this.right.color = 'black';
  this.color = 'red';
  if (this.parent === null){
    this.color = 'black';
    return;
  }
  if (this.parent.color === 'red') {
    this.parent.parent.repaint();
  }
};

// RBtree.prototype.rotate = function(d1, d2, blackChildren){
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
