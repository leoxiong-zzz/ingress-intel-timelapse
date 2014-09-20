/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Authored by Leo Xiong(@NameLessexe)<hello@leoxiong.com>
 *
 * By using this script, you accept that I (Leo Xiong) will not be
 * held responsible for any violations of the Ingress Terms of Service
 * (https://www.ingress.com/terms) which may result in the suspension
 * or ban of your Ingress account.
 */

// Session ID (SACSID)
var cookie_session_id = "[insert SACSID cookie here]";

// Latitude (ingress.intelmap.lat), longitude (ingress.intelmap.long), and zoom level (ingress.intelmap.map_zoom) of map. Can be found in URL too.
var map_latitude = -37.775176;
var map_longitude = 175.264924;
var map_zoom = 10;

// Portal level lower range.
var portal_lower_range = 1;
var portal_higher_range = 8;

// Width and height of screenshots.
var screenshot_width = 1920;
var screenshot_height = 1080;

// Name of screenshots. Ensure that the name does not contain illegal characters in your filesystem.
var screenshot_filename = function () {
    return new Date().YYYYMMDDHHMMSS() + ".png";
};

// Time in ms before timing out screenshot.
var timeout = 120000;



//
setTimeout(function () {
    console.log("timed out after " + (new Date() - start) + "ms");
    phantom.exit()
}, timeout);

var system = require('system');
var page = require('webpage').create();

page.viewportSize = {width: screenshot_width, height: screenshot_height};

phantom.addCookie({
    'name': 'SACSID',
    'value': cookie_session_id,
    'domain': 'www.ingress.com',
    'path': '/',
    'httponly': true,
    'secure': true
});
phantom.addCookie({
    'name': 'ingress.intelmap.lat',
    'value': map_latitude,
    'domain': 'www.ingress.com',
    'path': '/'
});
phantom.addCookie({
    'name': 'ingress.intelmap.lng',
    'value': map_longitude,
    'domain': 'www.ingress.com',
    'path': '/'
});
phantom.addCookie({
    'name': 'ingress.intelmap.zoom',
    'value': map_zoom,
    'domain': 'www.ingress.com',
    'path': '/'
});

var progress = 0;

var start = new Date();
page.open('https://ingress.com/intel', function (status) {
    switch (status) {
        case "success":
            setTimeout(function () {
                page.evaluate(function (portal_lower_range, portal_higher_range) {
                    // Set portal level range
                    var click = document.createEvent("MouseEvent");
                    click.initMouseEvent("click", true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById("level_low" + portal_lower_range).dispatchEvent(click);
                    document.getElementById("level_high" + portal_higher_range).dispatchEvent(click);

                    // Fullscreen map
                    var map = document.getElementById("map_canvas");
                    map.style.position = "fixed";
                    map.style.width = "100%";
                    map.style.height = "100%";
                    map.style.zIndex = 9999;
                    map.style.top = 0;
                    map.style.left = 0;

                    // Location button
                    document.getElementById("snapcontrol").style.display = "none";

                    K.setOptions({disableDefaultUI: true});
                }, portal_lower_range, portal_higher_range);

                // Poll #loading_msg till display: none
                (function () {
                    var progress = page.evaluate(function () {
                        return document.getElementById("percent_text").innerHTML | 0;
                    });
                    // Show progress bar in stdout
                    system.stdout.write("\r[");
                    for (var i = -5; i < progress; i += 5)  system.stdout.write("|");
                    for (; i < 100; i += 5) system.stdout.write(" ");
                    system.stdout.write("] " + progress + "%\t" + (new Date() - start) + "ms");

                    // If map loaded
                    if (page.evaluate(function () {
                        return document.getElementById("loading_msg").style.display;
                    }) == "none") {
                        system.stdout.writeLine("");

                        // Render screenshot after a delay
                        setTimeout(function () {
                            var f = screenshot_filename();
                            page.render(f);
                            console.log(f + " saved");
                            phantom.exit();
                        }, 1000);
                    } else
                        setTimeout(arguments.callee, 1000);
                })();
            }, 1000);
            break;
        default:
            console.log("Page open status: " + status);
            phantom.exit(-1);
    }
});

page.onResourceError = function (resourceError) {
    console.log("Unable to load resource (#" + resourceError.id + "URL:" + resourceError.url + ")");
    console.log("Error code: " + resourceError.errorCode + ". Description: " + resourceError.errorString);
};

Object.defineProperty(Date.prototype, "YYYYMMDDHHMMSS", {
    value: function () {
        function pad2(n) {
            return (n < 10 ? "0" : "") + n;
        }

        return this.getFullYear()
            + pad2(this.getMonth() + 1)
            + pad2(this.getDate())
            + pad2(this.getHours())
            + pad2(this.getMinutes())
            + pad2(this.getSeconds());
    }
});