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
var cookie_sacsid_id = '[insert SACSID cookie here]';

// CSRF token (csrftoken)
var cookie_csrf_token = '[insert csrftoken cookie here]';

// Intel URL, click 'Link' on the top right of the map to copy
var intel_url = 'https://www.ingress.com/intel?ll=-37.775176,175.264924&z=12';

// Portal level range (0 - 8 to display all)
var portal_min_level = 0;
var portal_max_level = 8;

// Size of screenshot
var screenshot_width = 1280;
var screenshot_height = 720;

// Time in ms before timing out screenshot
var timeout = 300000;

// Name of screenshots (ensure name does not contain illegal characters in your filesystem)
var screenshot_filename = function () {
    return YYYYMMDDHHMMSS() + '.png';
};

/* Configuration ends */
setTimeout(function () {
    system.stderr.writeLine('timed out');
    phantom.exit();
}, timeout);

phantom.addCookie({
    name: 'SACSID',
    value: cookie_sacsid_id,
    domain: 'www.ingress.com',
    path: '/',
    httponly: true,
    secure: true
});
phantom.addCookie({
    name: 'csrftoken',
    value: cookie_csrf_token,
    domain: 'www.ingress.com',
    path: '/'
});

var system = require('system');
var page = require('webpage').create();

page.settings.userAgent = 'IngressIntelTimelapse (+https://github.com/leoxiong/ingress-intel-timelapse)';

page.viewportSize = {
    width: screenshot_width,
    height: screenshot_height
};

page.onResourceError = function (resourceError) {
    system.stderr.writeLine('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    system.stderr.writeLine('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};

console.log('opening ' + intel_url);
page.open(intel_url, function () {
    console.log('opened');
    setTimeout(function () {
        page.evaluate(function (portal_min_level, portal_max_level) {
            var click = document.createEvent('MouseEvent');
            click.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
            document.getElementById('level_low' + portal_min_level).dispatchEvent(click);
            document.getElementById('level_high' + portal_max_level).dispatchEvent(click);

            var map = document.getElementById('map_canvas');
            map.style.position = 'fixed';
            map.style.width = '100%';
            map.style.height = '100%';
            map.style.zIndex = 9999;
            map.style.top = 0;
            map.style.left = 0;

            document.getElementById('snapcontrol').style.display = 'none';

            for (var i in window) {
                if (window[i] && window[i].setOptions) {
                    window[i].setOptions({disableDefaultUI: true});
                }
            }
        }, portal_min_level, portal_max_level);

        console.log('loading intel...');
        var start = new Date();
        (function () {
            if (page.evaluate(function () {
                    return document.getElementById('loading_msg').style.display;
                }) == 'none') {
                system.stdout.writeLine('');
                console.log('intel loaded, settling...');
                setTimeout(function () {
                    var filename = screenshot_filename();
                    page.render(filename);
                    console.log('cheese! ' + filename + ' saved');
                    phantom.exit();
                }, 2000);
            } else {
                var progress = page.evaluate(function () {
                    return document.getElementById('percent_text').innerHTML | 0;
                });
                system.stdout.write('\r[');
                for (var i = 0; i < progress; i += 5) system.stdout.write('|');
                for (var i = progress; i <= 95; i += 5) system.stdout.write(' ');
                system.stdout.write('] ' + progress + '%\t' + (new Date() - start) + 'ms');
                setTimeout(arguments.callee, 1000);
            }
        })();
    }, 2000);
});

function YYYYMMDDHHMMSS() {
    var date = new Date();

    return date.getFullYear()
        + pad2(date.getMonth() + 1)
        + pad2(date.getDate())
        + pad2(date.getHours())
        + pad2(date.getMinutes())
        + pad2(date.getSeconds());
}

function pad2(n) {
    return (n < 10 ? '0' : '') + n;
}