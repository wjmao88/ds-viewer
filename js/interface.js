
$(document).ready(function() {

  //
  $('.selectStructure').on('click', function(){

  });




  $('.addValue').on('click', function() {
    var value = $('.newValue').val();

    //add values
    //using the method from the actual structure
    //that was defined in the structureBinder
    //or if not created, create using pre-defined ClassFunction
    if (structure === undefined) {
      structure[structureBinder.adder](value);
    } else {
      structure = new (structureBinder.ClassFunction)(value);
    }
    $('.newValue').val('');
  });
});
