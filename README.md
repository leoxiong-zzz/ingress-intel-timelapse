# Ingress Intel Timelapse

This is a [PhantomJS](http://phantomjs.org/) script to render screenshots of borderless [Ingress Intel Maps](https://ingress.com/intel). It can be used in conjunction with task schedulers to periodically take screenshots to create GIF timelapse for operations.

[![GIF timelapse of Enlightened operation](https://lh3.googleusercontent.com/-1D190tIm4u4/VBzhk-qHKhI/AAAAAAAAUok/HorLaDjScsQ/w1280-h720/timelapse.gif)](https://plus.google.com/103659809344549208496/posts/dhD1Tt6nZL6)

### How to setup

1. Install PhantomJS from a repo or [download](http://phantomjs.org/download.html) from site

    `# apt-get install phantomjs`

2. Save and configure [screenshot.js](https://github.com/NameLess-exe/ingress-intel-timelapse/blob/master/screenshot.js)

3. Create script for scheduling

    **Shell script**

    ```bash
    #!/bin/bash
    for ((i = 0; i < 96; i += 0)) do
    	phantomjs "screenshot.js" &
    	sleep 15m
    done
    ```

    **Batch script**

    ```bat
    for /L %%i IN (1,0,96) do (
    	start phantomjs.exe "screenshot.js"
    	timeout /t 900 /nobreak
    )
    ```

4. Execute script

    **Linux**
    
    `$ ./scheduler.sh`

    **Windows**
    
    `scheduler.bat`

### Creating GIF

1. Install ImageMagick from a repo or [download](http://www.imagemagick.org/script/binary-releases.php) from site

	`# apt-get install imagemagick`

2. Create GIF

	`$ convert -delay 20 -loop 0 *.png timelapse.gif`


### Tips

- The 'SACSID' (session ID) and 'csrftoken' (cross-site request forgery token) cookies can be found by using your browser's developer console.
- The URL for the map can be located by clicking 'Link' in the top right corner.

### Disclaimer

By using this script, you accept that I (Leo Xiong) will not be held responsible for any violations of the [Ingress Terms of Service](https://www.ingress.com/terms) which may result in the suspension or ban of your Ingress account.

Please be considerate of the Ingress servers and set a reasonably long interval in between screenshots.
