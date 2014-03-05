var BinarySearchTree = function(value, parent, comp){
  this.value = value;
  this.left = null;
  this.right = null;
  this.parent = parent || null;
  this.comparator = this.parent !== null? parent.comparator : comp || function(myValue, newValue){
    return myValue > newValue? -1 : 1;
  };
};

BinarySearchTree.prototype.factory = function(value, parent){
  return new BinarySearchTree(value, parent);
};
//=========================================================
//utility
BinarySearchTree.prototype.whichSide = function(value){
  return this.comparator(this.value, value) < 0? 'left' : 'right';
};

BinarySearchTree.prototype.side = function(){
  if (this.parent === null){
    return undefined;
  }
  if (this.parent.left === this){
    return 'left';
  }
  if (this.parent.right === this){
    return 'right';
  }
  return this.parent.left === null? 'left' : 'right';
};

BinarySearchTree.prototype.otherSide = function(side){
  return (side || this.side()) === 'left'? 'right' : 'left';
};

BinarySearchTree.prototype.sibling = function(){
  return this.parent === null? undefined : this.parent[this.otherSide()];
};

BinarySearchTree.prototype.uncle = function(){
  return this.parent === null? undefined : this.parent.sibling();
};

BinarySearchTree.prototype.depth = function(){
  return Math.max(this.leftDepth(), this.rightDepth()) + 1;
};

BinarySearchTree.prototype.leftDepth = function(){
  return this.left === null? 0 : this.left.depth();
};

BinarySearchTree.prototype.rightDepth = function(){
  return this.right === null? 0 : this.right.depth();
};

BinarySearchTree.prototype.unbalancedSide = function(){
  var left = this.leftDepth();
  var right = this.rightDepth();
  if ( left < right && ( (left === 0 && right >= 2) || (left !== 0 && left * 2 < right) ) ) {
    return 'left';
  }
  if ( right < left && ( (right === 0 && left >= 2) || (right !== 0 && right * 2 < left) ) ){
    return 'right';
  }
  return undefined;
};
//=========================================================
//base mathods
BinarySearchTree.prototype.findClosest = function(value){
  if (this.value === value){
    return this;
  }
  var side = this.whichSide(value);
  return this[side] === null? this : this[side].findClosest(value);
};

BinarySearchTree.prototype.attach = function(value){
  if (this.value === value){
    return;
  }
  this[this.whichSide(value)] = this.factory(value, this);
  this.rebalance(this[this.whichSide(value)]);
};

BinarySearchTree.prototype.removeSelf = function(root){
  var side = this.leftDepth() > this.rightDepth()? 'left' : 'right';
  if (this[side] !== null){
    var target = this[side].findClosest(this.value);
    this.value = target.value;
    return BinarySearchTree.prototype.removeSelf.call(target, root);
  }
  if (this.parent === null){
    //delete root?
    return this;
  }
  this.parent[this.side()] = null;
  if (root !== undefined){
    root.rebalance();
  }
  return this;
};

BinarySearchTree.prototype.rebalance = function(){
  var lesserSide = this.unbalancedSide();
  if (lesserSide === undefined){
    return;
  }
  this.shiftTo(lesserSide);
  this.left === null? '' : this.left.rebalance();
  this.right === null? '' : this.right.rebalance();
  this.rebalance();
};

BinarySearchTree.prototype.shiftTo = function(to){
  var target = this[this.otherSide(to)].findClosest(this.value);
  var oldHeadValue = this.value;
  this.value = target.value;
  target.removeSelf();
  this.insert(oldHeadValue);
};

BinarySearchTree.prototype.rotateTo = function(to){
  //rotating root left of its current position would be from left to right
  var from = this.otherSide(to);
  //swap value of parent and node in the from direction
  var temp = this.value;
  this.value = this[from].value;
  this[from].value = temp;
  //external nodes
  var toSideNode = this[to];
  var fromSideNode = this[from][from];
  //switch the side of links between root and child on the from side
  this[from][from] = this[from][to];
  this[to] = this[from];
  //re-assign externals
  this[from] = fromSideNode;
  fromSideNode === null? '' : fromSideNode.parent = this;
  this[to][to] = toSideNode;
  toSideNode === null? '' : toSideNode.parent = this[to];
};
//=========================================================
//interface methods
BinarySearchTree.prototype.insert = function(value){
  this.findClosest(value).attach(value);
};

BinarySearchTree.prototype.contains = function(value){
  return this.findClosest(value).value === value;
};

BinarySearchTree.prototype.remove = function(value){
  //value target is the node with the value to be deleted
  var valueTarget = this.findClosest(value);
  if (valueTarget.value !== value){
    //value is not here
    return;
  }
  valueTarget.removeSelf(this);
};

//=========================================================
//full traversal
BinarySearchTree.prototype.depthFirstLog = function(func){
  if (this.left !== null){
    this.left.depthFirstLog(func);
  }
  func(this.value);
  if (this.left !== null){
    this.left.depthFirstLog(func);
  }
};

BinarySearchTree.prototype.breadthFirstLog = function(func){
  var arr = [];
  this.toArray(arr, 0);

  for (var i=0; i< arr.length; i++){
    func(arr[i]);
  }
};

BinarySearchTree.prototype.toArray = function(arr, head){
  arr = arr || [];
  head = head || 0;
  arr[head] = this.value;
  if (this.left !== null){
    this.left.toArray(arr, (head+1)*2-1); //2n
  }
  if (this.right !== null){
    this.right.toArray(arr, (head+1)*2);  //2n+1
  }
  return arr;
};

BinarySearchTree.prototype.log = function(depth){
  var str = '';
  for (var i=0; i<depth; i++){
    str += '--';
  }
  this.left !== null && this.left.log(depth+1);
  console.log(str + this.value);
  this.right !== null && this.right.log(depth+1);
};
