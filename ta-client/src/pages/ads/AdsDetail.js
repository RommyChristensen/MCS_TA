import { Typography } from '@mui/material';
import { useLocation } from 'react-router';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

const AdsDetail = () => {
    const { state } = useLocation();

    console.log(state);

    return (
        <Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <Grid>
                <Typography fontWeight={500} variant="h5">Ads Detail</Typography>
            </Grid>
        </Container>
    )
}

export default AdsDetail;