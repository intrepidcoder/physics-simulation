(function main() {
    'use strict';

    var Simulation = function() {
        var canvas,
        context,
        self = this,
        width,
        height,
        focalLength = 300,
        objectDistance = 800,
        objectHeight = 50,
        imageDistance = 1 / (1 / focalLength - 1 / objectDistance),
        imageHeight = -objectHeight * imageDistance / objectDistance;

        var draw = function() {
            var centerX = Math.floor(width / 2),
            centerY = Math.floor(height / 2),
            angle = Math.asin(100 / focalLength),
            arrowHeight,
            arrowWidth = 6;

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

            // Draw object
            arrowHeight = 8 * Math.sign(objectHeight);
            context.lineCap = 'butt';
            context.lineWidth = 4;

            // Object body
            context.beginPath();
            context.moveTo(centerX - objectDistance, centerY);
            context.lineTo(centerX - objectDistance, centerY - objectHeight + arrowHeight);
            context.stroke();

            // Arrowhead
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(centerX - objectDistance + arrowWidth, centerY - objectHeight + arrowHeight);
            context.lineTo(centerX - objectDistance - arrowWidth, centerY - objectHeight + arrowHeight);
            context.lineTo(centerX - objectDistance, centerY - objectHeight);
            context.lineTo(centerX - objectDistance + arrowWidth, centerY - objectHeight + arrowHeight);
            context.fill();

            // Draw image
            arrowHeight = 8 * Math.sign(imageHeight);
            context.lineWidth = 4;

            // Image body
            context.beginPath();
            context.moveTo(centerX + imageDistance, centerY);
            context.lineTo(centerX + imageDistance, centerY - imageHeight + arrowHeight);
            context.stroke();

            // Arrowhead
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(centerX + imageDistance + arrowWidth, centerY - imageHeight + arrowHeight);
            context.lineTo(centerX + imageDistance - arrowWidth, centerY - imageHeight + arrowHeight);
            context.lineTo(centerX + imageDistance, centerY - imageHeight);
            context.lineTo(centerX + imageDistance + arrowWidth, centerY - imageHeight + arrowHeight);
            context.fill();
        };

        this.resize = function() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
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
