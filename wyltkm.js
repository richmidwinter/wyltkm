// Global
var config;
var DEFAULT_INTERVAL = 30;
var PADDING = 10;
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 240;

// Animation
function Animate() {
    var decrement = 0;
    var images;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var originX, originY, canvasY, farX;

    var drawImage = function(i) {
        originX += PADDING + farX;
        farX = images[i].width*(canvasY/images[i].height);
        ctx.drawImage(images[i], originX +decrement, originY, farX, canvasY);
    };

    this.load = function() {
        images = $('#preload img');
    };

    this.draw = function() {
        originX = 0;
        originY = PADDING;
        canvasY = CANVAS_HEIGHT - (2 * PADDING);
        farX = 0;

        var imageWidths = PADDING;
        for (var i = 0; i<images.length; i++) {
            imageWidths += images[i].width*(canvasY/images[i].height) +PADDING;
        }

        if (decrement-- <= -(imageWidths - CANVAS_WIDTH)) {
            $("#footer").css("visibility", "visible");
            return;
        }

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (var i = 0; i<images.length; i++) {
            drawImage(i);
        }
    };
};

// UI
function UI() {
    var animate;

    var drawCanvas = function() {
        $('#wyltkm').append($('<div id="preload"></div><div id="wrapper"><canvas id="canvas"></canvas></div>'));

        $('#wyltkm #wrapper').append($('<div id="footer"><p><a href="https://github.com/richmidwinter">Would you like to know more?</a></p></div>'));
    };

    var showStart = function() {
        $('#wrapper').append($('<div id="start"><div id="circle"><div id="arrow"/></div></div>'));
    };

    this.start = function() {
        animate = new Animate();
        animate.load();
        animate.draw();

        $('#circle').click(function(e) {
            new Audio(config.audio).play();

            $('#start').remove();

            setInterval(function() { animate.draw(); }, config.interval || DEFAULT_INTERVAL);
        });
    };

    this.init = function() {
        drawCanvas();
        showStart();

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    }
};

// Initialisation
function Wyltkm(url) {
    var waitCount = 0;
    var configReady = false;
    var ui = new UI();

    ui.init();

    $.get(url, function(res) {
        config = JSON.parse(res);
        for (var i = 0; i<config.frames.length; i++) {
            $('#preload').append($("<img/>", { "id": "img" +i, "src": config.frames[i].src}));
            waitCount++;
            $('#img' +i).load(function() { waitCount--; });
        }
        configReady = true;
    });

    var timeout;

    var checkLoaded = function() {
        if (configReady && waitCount == 0) {
            ui.start();
        } else {
            setTimeout(checkLoaded, 250);
        }
    };

    checkLoaded();
};
