/* global sinon, describe, it, beforeEach, expect, List */
/* exported StructureBinder */

describe('StructureBind', function() {

  var structureBinder;
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
    structureBinder = new StructureBinder('List', List);
  });


  it('should have name and ClassFunction', function() {
    expect(structureBinder.name).to.be.equal('List');
    expect(structureBinder.ClassFunction).to.be.equal(List);
  });

  it('should bind add, find, and remove functions and then should work when called from the binder', function() {
    structureBinder.bindAdd('add');
    structureBinder.bindRemove('remove');
    structureBinder.bindFind('find');

    var list = new List(1);
    structureBinder.adder.call(list, 1);
    list.find(1);
    expect(list.find(1).value).to.be.equal(1);
    expect(structureBinder.finder.call(list, 1).value).to.be.equal(1);
    structureBinder.remover.call(this, 1);
    expect(structureBinder.finder.call(list, 1)).to.be.equal(undefined);
  });

  it('should bind previous and next properties and be able to access through them ', function() {
    structureBinder.defRelationPrev('prev');
    structureBinder.defRelationNext('next');

    var list = new List(1);
    structureBinder.adder.call(list, 1);
    structureBinder.adder.call(list, 2);
    expect(list.find(2)[structureBinder.previousLinks[0]]).to.be.equal(1);
    expect(list[structureBinder.nextLinks[0]]).to.be.equal(2);
  });
})
