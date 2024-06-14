import { AppBar, Toolbar, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="sticky" sx={{marginBottom: '50px'}}>
            <Toolbar>
                <List sx={{display: 'inline-flex'}}>
                    <ListItem disablePadding>
                        <ListItemButton variant="outlined" component={Link} to="/">
                            Home
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton variant="outlined" component={Link} to="/firebase-form">
                            Forms
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;