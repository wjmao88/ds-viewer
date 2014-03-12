var AsyncQueue = function(delay){
  this.queue = [];
  this.delay = delay;
  this.running = false;
};

AsyncQueue.prototype.next = function(){
  this.running = true;
  if (this.queue.length === 0){
    this.running = false;
    return;
  }
  this.queue.shift()();
  var context = this;
  setTimeout(function(){
    context.next();
  }, this.delay);
};

AsyncQueue.prototype.enqueue = function(func){
  this.queue.push(func);
  if (!this.running){
    this.next();
  }
};
