import * as mui from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Report = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

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
                                data: labels.map(() => Math.floor(Math.random() * 1000)),
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                label: 'Dataset 2',
                                data: labels.map(() => Math.floor(Math.random() * 1000)),
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
