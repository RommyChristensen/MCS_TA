import * as mui from '@mui/material';
import { Bar } from 'react-chartjs-2';

const Report = () => {

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Reports</mui.Typography>
                <Bar 
                    width={400}
                    height={300}
                    data={
                        {
                            labels,
                            datasets: [
                                {
                                label: 'Dataset 1',
                                data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                label: 'Dataset 2',
                                data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                },
                            ],
                        }
                    }
                />
            </mui.Grid>
        </mui.Container>
    )
}

export default Report
