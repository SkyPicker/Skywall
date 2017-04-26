from skywall.core.signals import Signal


before_config_load = Signal('before_config_load')
after_config_load = Signal('after_config_load')
before_config_save = Signal('before_config_save')
after_config_save = Signal('after_config_save')

before_command_run = Signal('before_command_run')
after_command_run = Signal('after_command_run')

before_server_start = Signal('before_server_start')
after_server_start = Signal('after_server_start')
before_server_stop = Signal('before_server_stop')
after_server_stop = Signal('after_server_stop')

before_server_connection_open = Signal('before_server_connection_open')
after_server_connection_open = Signal('after_server_connection_open')
before_server_connection_close = Signal('before_server_connection_close')
after_server_connection_close = Signal('after_server_connection_close')
after_server_connection_ended = Signal('after_server_connection_ended')

before_client_start = Signal('before_client_start')
after_client_start = Signal('after_client_start')
before_client_stop = Signal('before_client_stop')
after_client_stop = Signal('after_client_stop')

before_client_action_send = Signal('before_client_action_send')
after_client_action_send = Signal('after_client_action_send')
before_client_action_receive = Signal('before_client_action_receive')
after_client_action_receive = Signal('after_client_action_receive')
after_client_action_confirm = Signal('after_client_action_confirm')

before_server_action_send = Signal('before_server_action_send')
after_server_action_send = Signal('after_server_action_send')
before_server_action_receive = Signal('before_server_action_receive')
after_server_action_receive = Signal('after_server_action_receive')
after_server_action_confirm = Signal('after_server_action_confirm')

before_report_collect = Signal('before_report_collect')
after_report_collect = Signal('after_report_collect')

before_api_handler = Signal('before_api_handler')
after_api_handler = Signal('after_api_handler')
