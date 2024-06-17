import { AppBar, Toolbar, List, ListItem, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="sticky" sx={{marginBottom: '50px'}}>
            <Toolbar>
                <List sx={{display: 'inline-flex'}}>
                    <ListItem disablePadding>
                        <ListItemButton variant="text" component={Link} to="/">
                            Home
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton variant="text" component={Link} to="/documents">
                            Documents
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton variant="text" component={Link} to="/create-user">
                            Users
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;