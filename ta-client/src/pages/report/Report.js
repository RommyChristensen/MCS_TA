import * as mui from '@mui/material';

const Report = () => {

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Reports</mui.Typography>
            </mui.Grid>
        </mui.Container>
    )
}

export default Report
