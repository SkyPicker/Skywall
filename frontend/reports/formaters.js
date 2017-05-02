import React from 'react'
import moment from 'moment'


const interfaces = (value) => value.map((iface) => <div key={iface}>{iface}</div>)
const ipAddresses = (value) => value.map((ip) => <div key={ip}>{ip}</div>)
const uptime = (value) => <span title={`${value} seconds`}>{moment.duration(value, 'seconds').humanize()}</span>

export default {
  'interfaces': interfaces,
  'ip-addresses': ipAddresses,
  'uptime': uptime,
}
