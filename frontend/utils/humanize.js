

export const defaultGroupLabel = 'DEFAULT'
export const defaultGroupDescription = 'Default Group'

export const groupLabel = (group) => {
  if (!group) return defaultGroupLabel
  return group.name || 'Unnamed customer'
}
