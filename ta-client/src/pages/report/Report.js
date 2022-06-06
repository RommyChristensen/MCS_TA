import * as mui from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Report = () => {
    const [jobReport, setJobReport] = useState({
        labels: [],
        values: []
    });
    const [reportLoading, setReportLoading] = useState(false);
    const [reportType, setReportType] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedRange, setSelectedRange] = useState(0);
    const value = encryptStorage.getItem('admin-session-key');

    const handleRangeChange = async (event) => {
        let axiosConfig = {
            headers: {
                'x-auth-token': value
            }
        }
        setReportLoading(true);
        try{
            const res = await axios.post('/api/orders/admin/reportorder/by6Month/' + event.target.value, [], axiosConfig);

            const data = res.data;

            console.log(data);

            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }catch(ex){
            console.log(ex);
            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }

        setSelectedRange(event.target.value);
    }

    const handleRadioChange = (event) => {
        setReportType(event.target.value);
    }

    const handleMonthChange = async (event) => {
        let d = {
            month: event.target.value
        }
        let axiosConfig = {
            headers: {
                'x-auth-token': value
            }
        }
        setReportLoading(true);
        try{
            const res = await axios.post('/api/orders/admin/reportorder/byMonth', d, axiosConfig);

            const data = res.data;
            const dates = [];
            const datas = [];

            if(event.target.value == 0 || event.target.value == 2 || event.target.value == 4 || event.target.value == 6 || event.target.value == 7 || event.target.value == 9 || event.target.value == 11){
                for(let i = 1; i <= 31; i++){
                    dates.push(i);
                    datas.push(0);
                }
            }else if(event.target.value == 1){
                for(let i = 1; i <= 28; i++){
                    dates.push(i);
                    datas.push(0);
                }
            }else{
                for(let i = 1; i <= 30; i++){
                    dates.push(i);
                    datas.push(0);
                }
            }

            data.forEach(d => {
                const orderDate = new Date(d.order_created_at);
                const date = orderDate.getDate();
                datas[date]++;
            })

            console.log(dates);
            console.log(datas);

            setReportLoading(false);
            setSelectedMonth(event.target.value);
            setJobReport({
                labels: dates,
                values: datas
            })
        }catch(ex){
            console.log(ex);
            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }
    };

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Order Report</mui.Typography>
            </mui.Grid>
            <mui.Grid>
            <mui.FormControl>
                <mui.FormLabel id="demo-controlled-radio-buttons-group">Report Type</mui.FormLabel>
                    <mui.RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={reportType}
                        onChange={handleRadioChange}
                    >
                        <mui.FormControlLabel value="byMonth" control={<mui.Radio />} label="By Month" />
                        <mui.FormControlLabel value="by6Month" control={<mui.Radio />} label="By 6 Month" />
                    </mui.RadioGroup>
                </mui.FormControl>
            </mui.Grid>
            <mui.Grid mt={4}>
                {
                    !reportLoading ? 
                    <>
                        {
                            reportType == "byMonth" ? <mui.FormControl fullWidth>
                                <mui.InputLabel id="select-month">Month</mui.InputLabel>
                                <mui.Select
                                    labelId="select-month"
                                    id="select-month-component"
                                    value={selectedMonth}
                                    label="Month"
                                    onChange={handleMonthChange}
                                >
                                    <mui.MenuItem value={0}>January</mui.MenuItem>
                                    <mui.MenuItem value={1}>February</mui.MenuItem>
                                    <mui.MenuItem value={2}>March</mui.MenuItem>
                                    <mui.MenuItem value={3}>April</mui.MenuItem>
                                    <mui.MenuItem value={4}>May</mui.MenuItem>
                                    <mui.MenuItem value={5}>June</mui.MenuItem>
                                    <mui.MenuItem value={6}>July</mui.MenuItem>
                                    <mui.MenuItem value={7}>August</mui.MenuItem>
                                    <mui.MenuItem value={8}>September</mui.MenuItem>
                                    <mui.MenuItem value={9}>October</mui.MenuItem>
                                    <mui.MenuItem value={10}>November</mui.MenuItem>
                                    <mui.MenuItem value={11}>December</mui.MenuItem>
                                </mui.Select>
                            </mui.FormControl> : <mui.FormControl fullWidth>
                                <mui.InputLabel id="select-month">Month Range</mui.InputLabel>
                                <mui.Select
                                    labelId="select-month"
                                    id="select-month-component"
                                    value={selectedRange}
                                    label="Month"
                                    onChange={handleRangeChange}
                                >
                                    <mui.MenuItem value={0}>January - June</mui.MenuItem>
                                    <mui.MenuItem value={1}>July - December</mui.MenuItem>
                                </mui.Select>
                            </mui.FormControl>
                        }

                        {
                            reportType == "byMonth" ? <Line
                            data={
                                {
                                    labels: jobReport.labels,
                                    datasets: [
                                        {
                                            label: "Number of Orders",
                                            data: jobReport.values,
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        }
                                    ]
                                }
                            }
                        /> : <Bar
                            data={
                                {
                                    labels: jobReport.labels,
                                    datasets: [
                                        {
                                            label: "Number of Jobs",
                                            data: jobReport.data,
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        }
                                    ]
                                }
                            }
                        /> 
                        }
                    </> 
                    : "Loading..."
                }
            </mui.Grid>
        </mui.Container>
    )
}

export default Report
