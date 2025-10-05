import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { Drawer, Button, List, Divider, ListItem, ListItemText, ListItemButton } from '@mui/material';

import { Burger, Close } from './styles';

const useStyles = makeStyles({
  list: {
    width: '300px',
    padding: '10px 20px',
    fontFamily: 'var(--font-family) !important',
    '& .MuiTypography-body1': {
      fontFamily: 'var(--font-family) !important',
      textTransform: 'uppercase',
      fontSize: '14px',
      fontWeight: 700,
      padding: '5px',
    },
    '& a': {
      color: 'var(--subtitle-color)',
      textDecoration: 'none',
    },
  },
  fullList: {
    width: 'auto',
  },
  closeButton: {
    borderRadius: 0,
    margin: '10px 25px',
    padding: '6px 8px',
    width: '48px',
    height: '30px',
    alignSelf: 'flex-end',
  },
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const TemporaryDrawer: React.FC = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const items = [
    { text: 'HOME', link: '/' },
    { text: 'LOOKUP', link: '/lookup' },
    { text: 'OUR PROJECT', link: '/project' },
  ];

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <>
      <Button onClick={toggleDrawer(anchor, false)} className={clsx(classes.closeButton)}>
        <Close />
      </Button>
      <div
        className={clsx(classes.list, {
          [classes.fullList]: anchor === 'top' || anchor === 'bottom',
        })}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {items.map(item => (
            <div key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  onClick={toggleDrawer(anchor, false)}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    </>
  );

  return (
    <div>
      {(['right'] as Anchor[]).map(anchor => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <Burger />
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TemporaryDrawer;
