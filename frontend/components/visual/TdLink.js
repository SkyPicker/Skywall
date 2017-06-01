import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import styles from './TdLink.scss'


class TdLink extends React.Component {

  static propTypes = {
    // Props passed to component
    to: PropTypes.string.isRequired,

    // Default props
    children: PropTypes.node,
  }

  render() {
    const {to, children, ...props} = this.props
    return (
      <td {...props} className={styles.cell}>
        <Link to={to} className={styles.link} />
        {children}
      </td>
    )
  }
}

export default TdLink
