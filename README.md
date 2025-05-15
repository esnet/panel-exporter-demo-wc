# Grafana Panel Exporter Web Component Demo

This application is not transpiled, it is a browser-native vanilla JS application.

# Pre-requisites

This application loads the Grafana Panel Exporter bootstrapping library and the Grafana Panel Exporter Web Component from your running NPM proxy.

The grafana code contains instructions for starting your own npm proxy using Verdaccio. You can find instructions on starting Verdaccio in `grafana/packages/README.md` in the Grafana repo as of this writing.

You should download the 'panel-exporter' tgz from Verdaccio. I've already done so with the most recent -beta version.

You then need to un-tar/gz the file. (`tar zxvf ...`)

(I've also already done this in the current repo)

Next, you'll need a Grafana server on port 3000, serving the panel-exporter-bootstrapping package under /public.

# Running the application

`make run` to start the python proxy and web server.

If you are allergic to make you can just `python3 server.py`

There are no moving JS parts for this, all of the files are served statically.

