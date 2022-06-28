import 'normalize.css';
import styled, { createGlobalStyle } from 'styled-components';
import { COLOR } from 'app-constants';

const GlobalStyle = createGlobalStyle`
	:root {
	font-size: 16px;
	}
	body {
		--color-primary: ${COLOR.yellow[500]};
		--color-bgColor: ${COLOR.white};
		--color-primaryText: ${COLOR.black[300]};
		--color-primaryTextMedium: ${COLOR.black[200]};
		--color-primaryTextDisabled: ${COLOR.black[100]};
		--color-headerBg: ${COLOR.yellow[500]};
		--color-primaryLight: ${COLOR.yellow[600]};
		--color-primaryDark: ${COLOR.yellow[900]};
		--color-error: ${COLOR.red};
		--color-modal-border:  ${COLOR.yellow[600]};
		--color-commentHover: hsl(0deg 25% 82% / 38%);
		font-family: 'Merriweather Sans', sans-serif;
		background-color: var(--color-bgColor);
		color: var(--color-primaryText);
	}

	@font-face {
		font-display: swap;
		font-family: 'Merriweather Sans';
		src: url('/fonts/MerriweatherSans-VF_wght.woff2') format('woff2 supports variations'),
			url('/fonts/MerriweatherSans-VF_wght.woff2') format('woff2-variations');
		font-weight: 300 800;
		font-style: normal;
	}

	@font-face {
		font-display: swap;
		font-family: 'Merriweather Sans';
		src: url('/fonts/MerriweatherSans-Italic-VF_wght.woff2') format('woff2 supports variations'),
			url('/fonts/MerriweatherSans-Italic-VF_wght.woff2') format('woff2-variations');
		font-weight: 300 800;
		font-style: italic;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	span,
	section,
	article,
	ul,
	li,
	figure,
	button,
	blockquote {
		margin: 0;
		padding: 0;
	}

	*[role=button] {
		cursor: pointer;
	}

	*[role=navigation] {
		cursor: pointer;
	}

	img,
	video {
		max-width: 100%;
	}

	a,
	button {
		cursor: pointer;
	}
`;

const AppContainer = styled.div`
    width: 100%;
`;

function MyApp({ Component, pageProps }) {
    return (
        <AppContainer id="main">
            <GlobalStyle />
            <Component {...pageProps} />
        </AppContainer>
    );
}

export default MyApp;
