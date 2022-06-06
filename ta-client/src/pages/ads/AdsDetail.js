import { Typography } from '@mui/material';
import { useLocation } from 'react-router';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

const AdsDetail = () => {
    const { state } = useLocation();
    const [confirmed, setConfirmed] = useState(state.ads.status != "Diminta");
    const value = encryptStorage.getItem('admin-session-key');

    console.log(state);

    const verifyAds = async (status) => {
        const id = state.ads.id;
        const data = await axios.post('/api/ads/status/' + id, {
            status: status
        }, {
            headers: {
                'x-auth-token': value
            }
        });
        setConfirmed(false);
    }

    return (
        <Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <Grid>
                <Typography fontWeight={500} variant="h5">Ads Detail</Typography>
            </Grid>
            <Grid mt={4} container>
                <Grid item xs={12}>
                    <Typography variant="body">
                        {state.ads.title}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Description
                    </Typography>
                    <Typography variant="body2">
                        {state.ads.description}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Category
                    </Typography>
                    <Typography variant="body2">
                        {state.ads.category_name}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Status
                    </Typography>
                    <Typography variant="body2">
                        {state.ads.status}
                    </Typography>
                </Grid>
                <Button sx={{ marginTop: 3 }} onClick={() => verifyAds('Aktif')} variant="contained" color='success' disabled={confirmed}>Accept</Button> <Button sx={{ marginTop: 3 }} onClick={() => verifyAds('Ditolak')} variant="contained" color='danger' disabled={confirmed}>Reject</Button>
            </Grid>
        </Container>
    )
}

export default AdsDetail;