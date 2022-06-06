import * as mui from '@mui/material';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';

const Withdraw = () => {
    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Withdraw</mui.Typography>
            </mui.Grid>
        </mui.Container>
    )
}

export default Withdraw
