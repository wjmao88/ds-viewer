var AsyncQueue = function(delay){
  this.queue = [];
  this.delay = delay;
  this.running = false;
  this.timeout = undefined;
  this.auto = true;
};

AsyncQueue.prototype.setAuto = function(){
  if (this.auto){
    return;
  }
  this.auto = true;
  this.next();
};

AsyncQueue.prototype.setManual = function(){
  if (this.timeout){
    window.clearTimeout(this.timeout);
    this.timeout = undefined;
    this.running = false;
  }
  this.auto = false;
};

AsyncQueue.prototype.next = function(){
  this.running = true;
  if (this.queue.length === 0){
    this.running = false;
    return;
  }
  this.queue.shift()();
  if (!this.auto){
    return;
  }
  var context = this;
  this.timeout = setTimeout(function(){
    context.next();
  }, this.delay);
};

AsyncQueue.prototype.enqueue = function(func){
  this.queue.push(func);
  if (!this.running && this.auto){
    this.next();
  }
};

AsyncQueue.prototype.step = function(){
  if (!this.auto){
    this.next();
  }
};
