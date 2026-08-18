import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const NavigatorBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <Box sx={{ ...styles.container, ...(isScrolled && styles.navbarContainerScrolled) }}>
            <Box
                sx={{
                    ...styles.navbarContainer,
                }}
            >
                <Typography variant="h6" component="div">
                    VIMES TEST
                </Typography>
            </Box>
        </Box>
    )
}
const styles = {
    container: {
        position: 'sticky',
        top: 0,
        zIndex: 4,
        transition: 'background-color 0.3s ease',
        width: "100%",
    },
    navbarContainer: {
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
    },
    navbarContainerScrolled: {
        backgroundColor: '#fff',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
}
export default NavigatorBar;