import styled from 'styled-components';
import { SPACING, BREAKPOINTS, zIndex } from 'app-constants';

const Container = styled.header`
    padding: ${SPACING.pageside.sm}px;
    background: var(--color-headerBg);
    width: 100%;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: ${zIndex.header};
    @media only screen and (min-width: ${BREAKPOINTS.sm}px) {
        padding-left: ${SPACING.pageside.md}px;
        padding-right: ${SPACING.pageside.md}px;
    }
    @media only screen and (min-width: ${BREAKPOINTS.md}px) {
        padding-left: ${SPACING.pageside.lg}px;
        padding-right: ${SPACING.pageside.lg}px;
    }
`;

export default Container;
