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

        // Draw a vertical arrow. Positive length is downward.
        var drawArrow = function(startX, startY, length) {
            var arrowWidth = 6,
            arrowLength = length > 0 ? 8 : -8;

            context.lineCap = 'butt';
            context.lineWidth = 4;

            // Arrow body
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(startX, startY + length - arrowLength);
            context.stroke();

            // Arrowhead
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(startX + arrowWidth, startY + length - arrowLength);
            context.lineTo(startX - arrowWidth, startY + length - arrowLength);
            context.lineTo(startX, startY + length);
            context.lineTo(startX + arrowWidth, startY + length - arrowLength);
            context.fill();
        };

        var drawLine = function(startX, startY, endX, endY, color, dashed) {
            context.save();
            if (dashed) {
                context.setLineDash([5, 10]);
                context.lineDashOffset = 5;
            }

            startX = Math.round(startX);
            startY = Math.round(startY);
            endX = Math.round(endX);
            endY = Math.round(endY);

            context.lineCap = 'round';
            context.strokeStyle = color;
            context.lineWidth = 2;

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            context.restore();
        };

        var draw = function() {
            var centerX = Math.floor(width / 2),
            centerY = Math.floor(height / 2),
            angle = Math.asin(100 / focalLength);

            // Clear canvas
            context.clearRect(0, 0, width, height);

            // Draw lens
            context.lineWidth = 2;
            context.lineJoin = 'round';
            context.strokeStyle = '#666';
            context.fillStyle = 'rgba(217, 232, 240, 0.5)';
            context.beginPath();
            context.arc(centerX - 2 * focalLength * Math.cos(angle), centerY, focalLength * 2, -angle, angle, false);
            context.arc(centerX + 2 * focalLength * Math.cos(angle), centerY, focalLength * 2, Math.PI - angle, Math.PI + angle, false);
            context.closePath();
            context.fill();
            context.stroke();
            context.fillStyle = '#000';

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
            context.beginPath();
            context.arc(centerX - 2 * focalLength, centerY, 5, 0, 2 * Math.PI, false);
            context.fill();
            context.beginPath();
            context.arc(centerX + 2 * focalLength, centerY, 5, 0, 2 * Math.PI, false);
            context.fill();

            // Draw backward extention of rays for Virtual image
            if (imageDistance < 0) {
                drawLine(centerX, centerY - objectHeight, 0, centerY - objectHeight - objectHeight * centerX / focalLength, 'blue', true);
                drawLine(centerX - objectDistance, centerY - objectHeight, 0, centerY - objectHeight * centerX / objectDistance, 'green', true);
                drawLine(centerX, centerY - imageHeight, 0, centerY - imageHeight, 'red', true);
            }

            // Draw rays
            drawLine(centerX - objectDistance, centerY - objectHeight, centerX, centerY - objectHeight, 'blue');
            drawLine(centerX, centerY - objectHeight, width, centerY - objectHeight + objectHeight * centerX / focalLength, 'blue');

            drawLine(centerX - objectDistance, centerY - objectHeight, width, centerY + objectHeight * centerX / objectDistance, 'green');
            drawLine(centerX - objectDistance, centerY - objectHeight, centerX, centerY - imageHeight, 'red');
            drawLine(centerX, centerY - imageHeight, width, centerY - imageHeight, 'red');

            // Draw object and image.
            drawArrow(centerX - objectDistance, centerY, -objectHeight);
            drawArrow(centerX + imageDistance, centerY, -imageHeight);
        };

        var click = function(event) {
            if (event.clientX < width / 2) {
                objectDistance = Math.floor(width / 2) - event.clientX;
                objectHeight = Math.floor(height / 2) - event.clientY;
                imageDistance = 1 / (1 / focalLength - 1 / objectDistance);
                imageHeight = -objectHeight * imageDistance / objectDistance;
                draw();
            }
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
                canvas.addEventListener('click', click, false);
                context = canvas.getContext('2d');
                self.resize();
            }
        };
    };

    var sim = new Simulation();

    document.addEventListener('DOMContentLoaded', sim.init, false);
    window.addEventListener('resize', sim.resize, false);
}());
