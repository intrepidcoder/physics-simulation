(function main() {
    'use strict';

    var Simulation = function() {
        var canvas,
        context,
        self = this,
        width,
        height,
        focalLength = 300;

        var drawStatic = function() {
            var centerX = Math.floor(width / 2),
            centerY = Math.floor(height / 2),
            angle = Math.asin(100 / focalLength);

            // Draw dashed center line
            context.setLineDash([20, 20]);
            context.lineDashOffset = 10;
            // Draw in two segments so dashes are centered
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(0, centerY);
            context.stroke();
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(width, centerY);
            context.stroke();
            context.setLineDash([1, 0]);


            // Draw lens
            context.lineWidth = 2;
            context.strokeStyle = '#666';
            context.beginPath();
            context.arc(centerX - 2 * focalLength + focalLength * 2 * (1 - Math.cos(angle)), centerY, focalLength * 2, -angle, angle, false);
            context.stroke();
            context.beginPath();
            context.arc(centerX + 2 * focalLength - focalLength * 2 * (1 - Math.cos(angle)), centerY, focalLength * 2, Math.PI - angle, Math.PI + angle, false);
            context.stroke();
            context.strokeStyle = '#000';

            // Draw focal points
            context.beginPath();
            context.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
            context.fill();
            context.beginPath();
            context.arc(centerX - focalLength, centerY, 5, 0, 2 * Math.PI, false);
            context.fill();
            context.beginPath();
            context.arc(centerX + focalLength, centerY, 5, 0, 2 * Math.PI, false);
            context.fill();
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
