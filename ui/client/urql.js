import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { withUrqlClient } from 'next-urql';

const withUrqlContainer = Component =>
    withUrqlClient(
        (_ssrExchange, ctx) => {
            const exchanges = [
                dedupExchange,
                cacheExchange({
                    keys: {
                        User: data => data.screenName,
                    },
                }),
                _ssrExchange,
                fetchExchange,
            ];

            //   if (process.env.NODE_ENV !== 'production' && isBrowser()) {
            //     exchanges.unshift(require('@urql/devtools').devtoolsExchange)
            //   }

            return {
                url: 'http://localhost:8080/graphql',
                suspense: true,
                exchanges,
                fetchOptions: {
                    credentials: 'same-origin',
                },
            };
        },
        { ssr: true }
    )(Component);

export default withUrqlContainer;
