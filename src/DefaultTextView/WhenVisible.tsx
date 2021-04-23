import React, {Fragment, FunctionComponent, useCallback, useState} from 'react'
import VisibilitySensor from 'react-visibility-sensor';

const WhenVisible: FunctionComponent<{width: number, height: number}> = ({width, height, children}) => {
    const [hasBeenVisible, setHasBeenVisible] = useState(false)
    const handleVisibilityChange = useCallback((isVisible: boolean) => {
        if ((isVisible) && (!hasBeenVisible)) setHasBeenVisible(true)
    }, [hasBeenVisible, setHasBeenVisible])
    return hasBeenVisible ? <Fragment>{children}</Fragment> : (
        <VisibilitySensor onChange={handleVisibilityChange} partialVisibility={true}>
            <div className="WhenVisible" style={{width, height}}></div>
        </VisibilitySensor>
    )
}

export default WhenVisible