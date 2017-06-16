

export const defaultGroupLabel = 'DEFAULT'
export const defaultGroupDescription = 'Default Group'

export const groupLabel = (group) => {
  if (!group) return defaultGroupLabel
  return group.name || 'Unnamed customer'
}

export const clientLabel = (client) => {
  if (!client) return null
  return client.label || 'Unnamed client'
}
