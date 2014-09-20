# Ingress Intel Timelapse

This is a [PhantomJS](http://phantomjs.org/) script to render screenshots of borderless [Ingress Intel Map](https://ingress.com/intel). It can be used in conjunction with task schedulers to periodically take screenshots of the map which can be used to create a timelapse. Originally written to create timelapse GIFs for operations.

![GIF timelapse of Enlightened operation](https://lh3.googleusercontent.com/-1D190tIm4u4/VBzhk-qHKhI/AAAAAAAAUok/HorLaDjScsQ/w1280-h720/timelapse.gif)

### How to setup
**Windows**

1. [Download](http://phantomjs.org/download.html) PhantomJS

2. Save and configure screenshot.js

3. Create batch script for scheduling
	```bat
	for /L %%i IN (1,0,96) do (
		start phantomjs.exe "screenshot.js"
		timeout /t 900 /nobreak
	)
	```

4. Run shell script

	`scheduler.bat`

**Linux**

1. Install PhantomJS from a repo or [download](http://phantomjs.org/download.html) from PhantomJs

	`# apt-get install phantomjs`

2. Save and configure screenshot.js

3. Create shell script for scheduling
	```bash
	#!/bin/bash
	for ((i = 0; i < 96; i += 0)) do
		phantomjs "screenshot.js" &
		sleep 15m
	done
	```

4. Run shell script

	`sh scheduler.sh`


### Tips

- The 'SACSID' (session ID) cookie can be found by using your browser's developer console.
- Map latitude, longitude, and zoom level can be found in the cookie. Alternatively (easier) it can be found in the page URL, by clicking 'Link' on the top right corner.

### Disclaimer

By using this script, you accept that I (Leo Xiong) will not be held responsible for any violations of the [Ingress Terms of Service](https://www.ingress.com/terms) which may result in the suspension or ban of your Ingress account.

Please be considerate of the Ingress servers and set a reasonable interval in between screenshots.
