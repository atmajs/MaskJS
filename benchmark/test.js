var Benchmark = function(name, fn, count) {
    this.name = name;
    this.fn = fn;
    this.count = count;
};
Benchmark.prototype.start = function() {

    var time = 0;

    for (var x = 0; x < 5; x++) {
        var start = Date.now();
        for (var i = 0; i < this.count; i++) {
            this.fn();
        }
        time += Date.now() - start;
    }

    time /= 5;

    document.body.appendChild(mask.renderDom('div > "#{name}: #{time}"', {
        name: this.name,
        time: time
    }));

    if (window.console)
      console.log('%s: %d', this.name, time);
};

if (!document.addEventListener)
  document.addEventListener = function (event, cb) {
    return document.attachEvent(
        event === 'DOMContentLoaded' ? 'onreadystatechange' : "on" + event,
        function (e) {
          if (document.readyState === "complete")
            cb(e)
        }
    );
  };

if (typeof Date.now === 'undefined') {
  Date.now = function() {
    return new Date().getTime();
  }
}


document.addEventListener('DOMContentLoaded', function() {

    var template = document.getElementById('mask-simple').innerHTML,
        values = {
            header: "Header",
            header2: "Header2",
            header3: "Header3",
            header4: "Header4",
            header5: "Header5",
            header6: "Header6",
            list: ['1000000000', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        fn = function() {
            return mask.renderDom(template, values);
        },
        benchmark = new Benchmark('mask-simple', fn, 1000);

    benchmark.start();

    document.body.appendChild(fn());

});