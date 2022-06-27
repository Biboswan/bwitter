import styled from 'styled-components';
import { FONT_WEIGHT } from 'app-constants';

export const H1 = styled.h1`
    font-size: 2.875rem;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const H2 = styled.h2`
    font-size: 2rem;
    letter-spacing: 0.25px;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const H3 = styled.h3`
    font-size: 1.4375rem;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const H4 = styled.h4`
    font-size: 1.1875rem;
    letter-spacing: 0.15px;
    font-weight: 500;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const Sub1 = styled.div`
    font-size: 0.9375rem;
    letter-spacing: 0.15px;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const Sub2 = styled.div`
    font-size: 0.8125rem;
    letter-spacing: 0.1px;
    font-weight: 500;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;

export const Para = styled.p`
    font-size: 0.9375rem;
    letter-spacing: 0.5px;
    color: ${props => (props.color ? `var(--color-${props.color})` : 'var(--color-primaryText)')};
`;
