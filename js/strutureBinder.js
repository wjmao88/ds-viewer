/* global $ */
/* exported StructureBinder */
var StructureBinder = function(name, ClassFunction, stepSize){
  this.stepSize = stepSize === undefined? 1000 : stepSize;
  this.name = name;
  this.ClassFunction = ClassFunction;
  this.exportProperties = [];
};

//decorate a selected function with a breakpoint.
//will look by function name in the class prototype
//
//before the execution of the original function, timeout
//for the stepSize amount of time
//can be skipped by an event from specified dom element
//
StructureBinder.prototype.defBreakPoint = function(funcName){
  var func = this.ClassFunction.prototype[funcName];
  this.ClassFunction.prototype[funcName] = function(){
    var context = this;
    var time = setTimeout(function(){
      func.apply(context, arguments);
    }, this.stepSize);

    $('.structure-binder-ignore-timeout').on('click', function(){
      window.clearTimeout(time);
      func.apply(context, arguments);
    });
  };
};

//define interface methods
//
//there should be an add, a find, and a remove
//
//the interface will use the binded methods to perform actions
//
StructureBinder.prototype.bindAdd = function(funcName){
  this.adder = this.ClassFunction.prototype[funcName];
};

StructureBinder.prototype.bindFind = function(funcName){
  this.finder = this.ClassFunction.prototype[funcName];
};

StructureBinder.prototype.bindRemove = function(funcName){
  this.remover = this.ClassFunction.prototype[funcName];
};

//defined the relationshop between each subcontainer
//it can be non-directed as in the plain methods
//or directed as prev and next methods
//
//if prev and next contains at most one property each
//the structure is considered a list like
//
//if one of prev and next contains multiple but the other
//contains 0 or 1, it is considered tree like
//
//if both contain more than one, it is considered graph like
//
StructureBinder.prototype.defRelation = function(property){
  this.undirectedLinks = this.undirectedLink || [];
  this.undirectedLinks.push(property);
};

StructureBinder.prototype.defRelationPrev = function(property){
  this.previousLinks = this.previousLink || [];
  this.previousLinks.push(property);
};

StructureBinder.prototype.defRelationNext = function(property){
  this.nextLinks = this.nextLink || [];
  this.nextLinks.push(property);
};

//
StructureBinder.prototype.render = function(instance, $parentNode){
  var $node = $('<div class="node"></div>');
  this.$node = $parentNode === undefined? $node : this.$node;
  for (var i=0; i< this.exportProperties.length; i++){
    $node.append('<div class="property">' + this.exportProperties[i] + ' : ' + instance[this.exportProperties[i]] + '</div>');
  }
  //recursively render the next links if they exist
  //put them in children for rendering links
  var children = [];
  if (this.nextLinks !== undefined){
    for (var i=0; i< this.nextLinks.length; i++){
      if (instance[this.nextLinks[i]] !== undefined){
        children.push(this.render(instance[this.nextLinks[i]]));
      }
    }
  }
  //rendering links

  return $node;
};
