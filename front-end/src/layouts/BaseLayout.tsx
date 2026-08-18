import {
    Box
} from '@mui/material';
import NavigatorBar from '../components/layouts/NavigatorBar';
import { Outlet } from 'react-router-dom';

const BaseLayout = () => {
    return (
        <Box>
            <NavigatorBar />
            <Outlet />
        </Box>
    )
}
export default BaseLayout;
