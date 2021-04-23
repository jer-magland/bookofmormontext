import { Button, Menu, MenuItem } from '@material-ui/core'
import React, { FunctionComponent, useCallback } from 'react'

type Props = {
    mode: 'default' | 'experimental1'
    setMode: (mode: 'default' | 'experimental1') => void
}

const menuBarHeight = 10
const MenuBar: FunctionComponent<Props> = ({mode, setMode}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = useCallback((event: any) => {
        setAnchorEl(event.currentTarget);
    }, [])
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [])
    const handleDefaultMode = useCallback(() => {
        setMode('default')
        handleClose()
    }, [])
    const handleExperimental1Mode = useCallback(() => {
        setMode('experimental1')
        handleClose()
    }, [])
    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                ...
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDefaultMode} disabled={mode === 'default'}>Default mode</MenuItem>
                <MenuItem onClick={handleExperimental1Mode} disabled={mode === 'experimental1'}>Experimental mode 1</MenuItem>
            </Menu>
        </div>
    )
}

export default MenuBar