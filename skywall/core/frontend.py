import os
import html
import json
import subprocess
import aiohttp.web
from skywall.core.config import config
from skywall.core.constants import API_ROUTE, BUILD_ROUTE


def get_frontend(request):
    devel = config.get('devel')
    host = config.get('webpack.host')
    port = config.get('webpack.port')

    data = dict(
            devel=devel,
            api=API_ROUTE,
            )

    if devel:
        style = ''
        script = 'http://{host}:{port}{build}/app.js'.format(host=host, port=port, build=BUILD_ROUTE)
    else:
        style = '<link href="{build}/app.css" rel="stylesheet" />'.format(build=html.escape(BUILD_ROUTE))
        script = '{build}/app.js'.format(build=BUILD_ROUTE)

    content = """
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta content="IE=edge" http-equiv="X-UA-Compatible">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Skywall</title>
          {style}
        </head>
        <body data="{data}">
          <div id="app"></div>
          <script>
            (function() {{
              var body = document.getElementsByTagName('body')[0];
              var app = document.createElement('script');
              app.type = 'text/javascript';
              app.async = true;
              app.src = {script};
              body.appendChild(app);
            }})()
          </script>
        </body>
      </html>
    """.format(
            style=style,
            script=html.escape(json.dumps(script), quote=False),
            data=html.escape(json.dumps(data)),
            )

    return aiohttp.web.Response(text=content, content_type='text/html')


def install_frontend():
    subprocess.run(['npm', 'install'])


def build_frontend():
    host = config.get('webpack.host')
    port = config.get('webpack.port')
    env = dict(os.environ, WEBPACK_HOST=host, WEBPACK_PORT=str(port))
    subprocess.run(['npm', 'run', 'build'], env=env)


def run_webpack():
    host = config.get('webpack.host')
    port = config.get('webpack.port')
    env = dict(os.environ, WEBPACK_HOST=host, WEBPACK_PORT=str(port))
    return subprocess.Popen(['npm', 'run', 'webpack'], env=env)
