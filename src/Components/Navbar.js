import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import "./Navbar.css";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserContext } from './UserContext';

const Navbar = () => {
  const { setUserName,userName,userId, setUserId,} = useContext(UserContext);
  const navigate = useNavigate(); // Updated to useNavigate
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
  setUserId('')
  setUserName('')
  
    localStorage.removeItem('user_name');
    handleCloseUserMenu();
    navigate('/login'); // Updated to use navigate
  };

  return (
    <AppBar position="fixed" className='app-bar'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: "none", md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              {/* <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">About</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Services</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Contact</Typography>
              </MenuItem> */}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: "flex", md: 'flex' } }}>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
            {/* <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              About
            </Button>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              Services
            </Button>
            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
              Contact
            </Button> */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="fav.png" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{userName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
