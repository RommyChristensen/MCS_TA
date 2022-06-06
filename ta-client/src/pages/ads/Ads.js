import * as mui from '@mui/material';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';

const Ads = () => {
    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Ads</mui.Typography>
            </mui.Grid>
        </mui.Container>
    )
}

export default Ads
