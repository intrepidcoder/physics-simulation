(function main() {
    'use strict';

    var Simulation = function() {
        var canvas,
        context,
        self = this,
        width,
        height;

        var drawStatic = function() {
            context.fillStyle = '#000';
            context.fillRect(10, 10, width - 20, 50);
            context.fillRect(Math.floor(width / 2) - 5, Math.floor(height / 2) - 5, 10, 10);
        };

        this.draw = function() {
            drawStatic();
        };

        this.resize = function() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            self.draw();
        };

        this.init = function() {
            canvas = document.getElementById('main-canvas');
            if (canvas.getContext) {
                context = canvas.getContext('2d');
                self.resize();
            }
        };
    };

    var sim = new Simulation();

    document.addEventListener('DOMContentLoaded', sim.init, false);
    window.addEventListener('resize', sim.resize, false);
}());
