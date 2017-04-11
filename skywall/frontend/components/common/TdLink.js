import React from 'react'
import {Link} from 'react-router'
import styles from './TdLink.scss'


class TdLink extends React.Component {

  static propTypes = {
    // Props passed to component
    to: React.PropTypes.string.isRequired,

    // Default props
    children: React.PropTypes.node,
  }

  render() {
    const {to, children} = this.props
    return (
      <td className={styles.cell}>
        <Link to={to} className={styles.link} />
        {children}
      </td>
    )
  }
}

export default TdLink
