import React from 'react'
import Spinner from 'react-spinjs'
import styles from './Loading.scss'


class Loading extends React.Component {

  static propTypes = {
    // Empty
  }

  render() {
    return (
      <div className={styles.container}>
        <Spinner color="#000" />
      </div>
    )
  }
}

export default Loading
