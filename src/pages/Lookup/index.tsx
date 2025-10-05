/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import { ModelsWrapper, ModelSection } from '../../components/Model/index';
import DefaultOverlayContent from '../../components/DefaultOverlayContent/index';
import UniqueOverlay from '../../components/UniqueOverlay/index';

import models from './ModelsList';

import { Container, Spacer } from './styles';

const Page: React.FC = () => {
  return (
    <Container>
      <ModelsWrapper>
        <div>
          {models.map(model => (
            <ModelSection
              key={model.id}
              className="colored"
              modelName={model.title}
              modelId={model.id}
              background={{
                desktop: model.background,
                mobile: model.backgroundMobile,
              }}
              overlayNode={(
                <DefaultOverlayContent
                  label={model.title}
                  Description={model.Description}
                  button1={{ text: model.text1, link: model.link1 }}
                  button2={{ text: model.text2, link: model.link2 }}
                />
              )}
            />
          ))}
        </div>

        <Spacer />

        <UniqueOverlay />
      </ModelsWrapper>
    </Container>
  );
};

export default Page;
