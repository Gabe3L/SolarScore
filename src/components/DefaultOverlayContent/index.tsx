import React, { JSX } from 'react';
import { Link } from 'react-router-dom';

import { Container, Heading, Buttons } from './styles';

interface Props {
  label: string;
  Description: JSX.Element;
  button1?: {
    text: string;
    link: string;
  };
  button2?: {
    text: string;
    link: string;
  };
}

const DefaultOverlayContent: React.FC<Props> = ({ label, Description, button1, button2 }) => {
  return (
    <Container>
      <Heading>
        <h1>{label}</h1>
        <h2>{Description}</h2>
      </Heading>

      <Buttons>
        {button1?.link && (
          <Link
            to={button1.link}
            className={!button2?.link ? 'only-one' : ''}
          >
            {button1.text}
          </Link>
        )}

        {button2?.link && (
          <Link
            to={button2.link}
            className="white"
          >
            {button2.text}
          </Link>
        )}
      </Buttons>
    </Container>
  );
};

export default DefaultOverlayContent;
