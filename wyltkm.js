// Global
var DEFAULT_INTERVAL = 30;
var PADDING = 10;
var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 240;

// Animation
function Animate(root) {
    var decrement = 0;
    var images;

    var canvas = $('#' +root +' canvas').get(0);
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var ctx = canvas.getContext("2d");

    var originX, originY, canvasY, farX;

    var drawImage = function(i) {
        originX += PADDING + farX;
        farX = images[i].width*(canvasY/images[i].height);
        ctx.drawImage(images[i], originX +decrement, originY, farX, canvasY);
    };

    this.load = function() {
        images = $('#' +root +' .preload img');
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
            $("#" +root +" .footer").css("visibility", "visible");
            return;
        }

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (var i = 0; i<images.length; i++) {
            drawImage(i);
        }
    };
};

// UI
function UI(root, config) {
    var animate;

    var drawCanvas = function() {
        $('#' +root).append($('<div class="preload"></div><div class="wrapper"><canvas class="canvas"></canvas></div>'));

        $('#' +root +' .wrapper').append($('<div class="footer"><p><a href="http://richmidwinter.github.com/wyltkm/">Would you like to know more?</a></p></div>'));
    };

    var showStart = function() {
        $('#' +root +' .wrapper').append($('<div class="start"><div class="circle"><div class="arrow"/></div></div>'));
    };

    this.start = function() {
        animate = new Animate(root);
        animate.load();
        animate.draw();

        $('#' +root +' .circle').click(function(e) {
            new Audio(config.audio).play();

            $('#' +root +' .start').remove();

            setInterval(function() { animate.draw(); }, config.interval || DEFAULT_INTERVAL);
        });
    };

    this.init = function() {
        drawCanvas();
        showStart();
    }
};

// Initialisation
function Wyltkm(root, url) {
    var waitCount = 0;
    var configReady = false;

    $.getJSON(url, function(config) {
        var ui = new UI(root, config);
        ui.init();

        for (var i = 0; i<config.frames.length; i++) {
            $('#' +root +' .preload').append($("<img/>", { "id": root +"-img" +i, "src": config.frames[i].src}));
            waitCount++;
            $('#' +root +'-img' +i).load(function() { waitCount--; });
        }
        configReady = true;

    var timeout;

    var checkLoaded = function() {
        if (configReady && waitCount == 0) {
            ui.start();
        } else {
            setTimeout(checkLoaded, 250);
        }
    };

    checkLoaded();

    });

};
