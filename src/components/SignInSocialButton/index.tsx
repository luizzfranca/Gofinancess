import React from 'react';

import { Container, Button, ImageContainer, Text } from './styles';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>
}

export function SignInSocialButton({ 
  title,
  svg: Svg,
  ...rest
}: Props)  {
  return (
    <Container>
      <Button {...rest}>
        <ImageContainer>
          <Svg />
        </ImageContainer>
        <Text>{title}</Text>
      </Button>
    </Container>
  );
}