import * as React from 'react';
import { 
    Button, 
    Container, 
    TextField, 
    Grid, 
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import encryptStorage from '../../services/Storage';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-dark/dark.css';
import { useLocation } from 'react-router';

const CategoryCreate = () => {
    const location = useLocation();
    const [name, setName] = React.useState((location.state) ? location.state.category.category_name : "");
    const [desc, setDesc] = React.useState((location.state) ? location.state.category.category_description : "");
    const [onReqLoad, setOnReqLoad] = React.useState(false);

    console.log(location.state)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const catName = name;
        const catDesc = desc;
        const swalTitle = (location.state) ? "Update Category" : "Create Category";
        const swalMessage =  (location.state) ? " Updated!" : " Created!";
        const axiosConfig = {
            headers: {
                'admin-session-key': encryptStorage.getItem('admin-session-key')
            },
        };
        setOnReqLoad(true);

        try{
            let data = {
                name: catName,
                desc: catDesc
            };
            if(location.state){
                data['id'] = location.state.category.id;
            }
            const response = (!location.state) ? await axios.post("/api/jobscat/admin/category", data, axiosConfig) : await axios.put("/api/jobscat/admin/category", data, axiosConfig);
            setName('');
            setDesc(''); 
            Swal.fire({
                title: swalTitle,
                text: response.data.category_name + swalMessage,
                icon: "success",
                showCloseButton: true,
                confirmButtonColor: '#66BB6A'
            })
        }catch(ex){
            Swal.fire({
                title: swalTitle,
                text: ex.response.data.errors[0].message,
                icon: "error",
                showCloseButton: true,
                confirmButtonColor: '#66BB6A'
            })
        }

        setOnReqLoad(false);
    }
    return (
        <Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <Grid>
                <Typography fontWeight={500} variant="h5">{(location.state) ? "Update Job Category" : "New Job Category"}</Typography>
            </Grid>

            <Grid mt={4}>
            <React.Fragment>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container>
                        <Grid item xs={12}>
                        <TextField
                            required
                            id="categoryName"
                            label="Category Name"
                            name="name"
                            fullWidth
                            variant="filled"
                            onChange={e => setName(e.target.value)}
                            defaultValue={(location.state) ? location.state.category.category_name : name}
                        />
                        </Grid>
                        <Grid item xs={12} mt={2}>
                        <TextField
                            required
                            id="categoryDesc"
                            label="Description"
                            name="desc"
                            fullWidth
                            variant="filled"
                            minRows={4}
                            maxRows={7}
                            multiline
                            onChange={e => setDesc(e.target.value)}
                            defaultValue={(location.state) ? location.state.category.category_description : desc}
                        />
                        </Grid>
                        <Grid item xs={12} mt={2}>
                            <Button 
                                color="success" 
                                variant="contained" 
                                type="submit"
                                disabled={onReqLoad}
                                sx={{ position: 'relative' }}
                            >
                                Submit
                                {
                                    onReqLoad &&
                                        <CircularProgress 
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </React.Fragment>
            </Grid>
        </Container>
    )
}

export default CategoryCreate;