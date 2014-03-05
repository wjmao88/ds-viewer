/* exported List */
var List = function(value, prev){
  this.value = value;
  this.prev = prev || null;
};

List.prototype.add = function(value){
  this.next = new List(value);
};

List.prototype.find = function(value){
  if (this.value === value){
    return this;
  } else if (this.next !== null){
    return this.next.find(value);
  } else {
    return undefined;
  }
};

List.prototype.remove = function(value){
  var node = this.find(value);
  if (node === undefined){
    return;
  }
  this.prev === null? '' : this.prev.next = (this.next || null);
  this.next === null? '' : this.next.prev = (this.prev || null);
};
