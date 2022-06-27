import { DGRAPH_ALPHA_URL, DGRAPH_CLIENT_API_KEY } from '../config.js';
import axios from 'axios';

const graphqlRequest = async ({ query, mutation }) => {
    let gqlQuery = '';
    if (query) {
        gqlQuery = `query {
        ${query}
      }`;
    }
    if (mutation) {
        gqlQuery = `mutation {
        ${mutation}
      }`;
    }
    const headers = {};
    if (DGRAPH_CLIENT_API_KEY) {
        headers['Dg-Auth'] = DGRAPH_CLIENT_API_KEY;
    }
    console.log('GQL', gqlQuery);
    const { data } = await axios({
        method: 'POST',
        url: `${DGRAPH_ALPHA_URL}/graphql`,
        data: {
            query: gqlQuery,
        },
        headers,
    });
    return data;
};

export default graphqlRequest;
