# Mode in which the application is running
SERVER_MODE = 'server'
CLIENT_MODE = 'client'

# HTTP headers used for client-server connections
CLIENT_ID_HEADER = 'X-SKYWALL-CLIENT-ID'
CLIENT_TOKEN_HEADER = 'X-SKYWALL-CLIENT-TOKEN'

# Web server routes
API_ROUTE = '/api'
STATIC_ROUTE = '/static'
BUILD_ROUTE = '/build'

# Timeout to respond to actions (in seconds, may be a float number)
ACTION_CONFIRM_TIMEOUT = 5

# Number of seconds the client waits before reconnecting
CLIENT_RECONECT_INTERVAL = 10
