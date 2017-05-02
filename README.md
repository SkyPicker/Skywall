# Skywall

Client-Server based manager for connecting systems together and running tasks.

## About

We want create system for handling various tasks on systems automatically. As a example we can use
firewalls. On each server will be running client sending information to server where we have
iptables module which is connecting servers together based in groups defined on server side. When
new client is connected it will get set of rules (predefined + dynamic) Dynamic rules are generated
by IP's of servers in groups ( you can generate rules based on all servers in groups).

### Client side:
* binary daemon connecting over web socket to server
* accepting commands from server
* authorize with server based on token
* sending basic information about system (os, ips, interfaces, uptime...)

### Server side:

#### Core:
* Care about authentication
* Registration clients
* Collecting information about clients
* Sending commands to clients
* Monitoring connected / disconnected clients

#### Modules
* Modules will be called by core
* Various modules can be push on selected clients
* Iptables module
* Predefined rules (hard-coded set of rules which will be same for all systems)
* Dynamic rules (connecting together servers based on their IP's and groups

## Skywall Server

### Requirements

To install Skywall server you need:
* Python 3 (tested on 3.5.2)
* Python 3 header files (Ubuntu package `python3-dev`)
* [python virtualenv](https://pypi.python.org/pypi/virtualenv) (Ubuntu package `virtualenv`)
* PostgreSQL database server (tested on 9.5.6)

### Installation

```
$ cd skywall
$ virtualenv --python=/usr/bin/python3 env
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall.git
(env) $ nodeenv -p
```

### Configuration

To see the current configuration run:

```
(env) $ skywall get
```

To see available settings run:

```
(env) $ skywall set --help
```

#### Database

To run skywall server you need to configure your database connection string:

```
(env) $ skywall set --server.database 'postgres://USER:PASSWORD@HOST/DATABASE'
```

#### Server host and port

By default the server listens on localhost on port 9000. To configure custom server host and port
run:

```
(env) $ skywall set --server.host HOST --server.port PORT
```

If the server is behind a proxy or the public websocket url of the server is different than the
server host and port for some reason, you may need to configure public websocket url as well:

```
(env) $ skywall set --server.publicUrl URL
```

#### Webserver host and port

Webserver and websocket servers for client systems are running on different ports. This way the
system admin can better configure who may access the webserver and who the websocket server. By
default the webserver listens on localhost on port 8080. To configure custom webserver host and
port set:

```
(env) $ skywall set --webserver.host HOST --sebserver.port PORT
```

#### Configuration file

Alternatively, you can manually edit the configuration file stored in `env/share/skywall/config.yaml`

### Running server

To run the Skywall server you first need to build the frontend app:

```
(env) $ skywall build
```

And then you can run the server:

```
(env) $ skywall server
```

To see Skywall frontend open `http://HOST:PORT/` in your browser, where HOST and PORT are
webserver host and port you configured. [http://localhost:8080/](http://localhost:8080/)
by default.

## Skywall Client

### Requirements

To install Skywall client you need:
* Python 3 (tested on 3.5.2)
* Python 3 header files (Ubuntu package `python3-dev`)
* [python virtualenv](https://pypi.python.org/pypi/virtualenv) (Ubuntu package `virtualenv`)

### Installation

```
$ cd skywall
$ virtualenv --python=/usr/bin/python3 env
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall.git
```

### Configuration

To see the current configuration run:

```
(env) $ skywall get
```

To see available settings run:

```
(env) $ skywall set --help
```

#### Server host and port

You need to configure host and port how your Skywall client can connect to your Skywall server. By
default the server listens on port 9000. If you changed it, you have to change it here as well.

```
(env) $ skywall set --server.host HOST --server.port PORT
```

#### Client label

To better identify your clients you may configure labels for them. Labels may be set in GUI or using
the following commandline setting.

```
(env) $ skywall set --client.label LABEL
```

#### Configuration file

Alternatively, you can manually edit the configuration file stored in `env/share/skywall/config.yaml`

### Running client

```
(env) $ skywall client
```

## Instructions for developers

### Installing server form a cloned repository

```
$ git clone https://github.com/SkyPicker/Skywall.git skywall
$ cd skywall
$ virtualenv --python=/usr/bin/python3 env
$ . env/bin/activate
(env) $ pip install -r requirements.txt
(env) $ nodeenv -p
(env) $ npm install
```

### Installing client form a cloned repository

```
$ git clone https://github.com/SkyPicker/Skywall.git skywall
$ cd skywall
$ virtualenv --python=/usr/bin/python3 env
$ . env/bin/activate
(env) $ pip install -r requirements.txt
```

### Configuration

To see the current configuration run:

```
(env) $ python skywall.py get
```

To see available settings run:

```
(env) $ python skywall.py set --help
```

### Running server in developement mode

To run your server in the developement mode with frontend hot-reload you need to enable it:

```
(env) $ python skywall.py set --devel true
```

And then run your server (without manually building it, it will build itself):

```
(env) $ python skywall.py server
```

This option will enable various debug messages and it will automatically reload the frontend app
whenever you change some code in it.

### Running client

Client has no developement mode yet. Just run:

```
(env) $ python skywall.py client
```

### Pylint and Eslint

Before commiting your code it's a good babit to lint it:

```
(env) $ npm run eslint
(env) $ npm run pylint
```

### Frontend API documentation

To see the frontend API documentation run the server and open `http://HOST:PORT/api` in your
browser, where HOST and PORT are webserver host and port you configured.
[http://localhost:8080/api](http://localhost:8080/api) by default.
