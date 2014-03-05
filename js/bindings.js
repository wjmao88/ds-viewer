/* global StructureBinder, BinarySearchTree */
/* exported getStructureBinder */


var structureBinderList = [];

var getStructureBinder = function(name){
  for (var i=0; i< structureBinderList.length; i++){
    if (structureBinderList[i].className === name){
      return structureBinderList[i];
    }
  }
  return undefined;
};

var bstBinder = new StructureBinder('BinarySearchTree', BinarySearchTree);
bstBinder.bindAdd('insert');
bstBinder.bindRemove('remove');
bstBinder.bindFind('contains');
bstBinder.defRelationPrev('parent');
bstBinder.defRelationNext('left');
bstBinder.defRelationNext('right');

bstBinder.defBreakPoint('removeSelf');
bstBinder.defBreakPoint('rotateTo');
