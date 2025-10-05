import React from 'react';
import { Link } from 'react-router-dom';

import Drawer from './Drawer';

import { Container, HeaderLeft, HeaderRight } from './styles';
import Logo from "../../../assets/logo/solarscore-large.webp";

const Header: React.FC = () => {
  const headerLinks = {
    right: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Lookup',
        link: '/lookup',
      },
    ],
  };

  return (
    <Container>
      <HeaderLeft>
        <img src={Logo} style={{ height: '100px' }} />
      </HeaderLeft>

      <HeaderRight>
        <ul>
          {headerLinks.right.map(item => (
            <li key={item.text}>
              <Link to={item.link}>{item.text}</Link>
            </li>
          ))}
        </ul>

        <Drawer />
      </HeaderRight>
    </Container>
  );
};

export default Header;
