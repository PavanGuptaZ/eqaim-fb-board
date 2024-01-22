import styles from '../styles/Loading.module.scss';
import PropTypes from 'prop-types'

export const LoadingComponent = ({ styles: addStyles }: { styles?: object }) => {
    return (
        <ul className={styles.waveMenu} style={{ ...addStyles }}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul >
    )
}

LoadingComponent.propTypes = {
    styles: PropTypes.object
}