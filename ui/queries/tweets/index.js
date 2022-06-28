import { gql } from '@urql/core';
import { LoggedUser } from 'app-constants';

export const CommonTweetFields = gql`
    fragment coreCommonTweetFields on Tweet {
        id
        text
        author {
            screenName
            imageUrl
            name
        }
        likedBy(filter: { screenName: { eq: "Paulette Crist28" } }) {
            screenName
        }
        likedByAggregate {
            count
        }
        repliesAggregate {
            count
        }
    }
`;

export const addTweetMutation = gql`
    mutation addTweet($input: [AddTweetInput!]!) {
        addTweet(input: $input) {
            tweet {
                id
                text
                replyTo {
                    id
                    repliesAggregate {
                        count
                    }
                }
                author {
                    screenName
                }
            }
        }
    }
`;

export const getTweets = gql`
    ${CommonTweetFields}
    query listTweets($limit: Int!, $offset: Int) {
        queryTweet(first: $limit, offset: $offset, filter: { not: { has: replyTo } }) {
            ...coreCommonTweetFields
            replies(first: 1) {
                ...coreCommonTweetFields
            }
        }
    }
`;

export const likeTweet = gql`
    mutation likeTweet($id: ID!, $screenName: String!) {
        updateTweet(
            input: { filter: { id: [$id] }, set: { likedBy: [{ screenName: $screenName }] } }
        ) {
            tweet {
                id
                likedBy(filter: { screenName: { eq: $screenName } }) {
                    screenName
                }
                likedByAggregate {
                    count
                }
            }
        }
    }
`;

export const unlikeTweet = gql`
    mutation unlikeTweet($id: ID!, $screenName: String!) {
        updateTweet(
            input: { filter: { id: [$id] }, remove: { likedBy: [{ screenName: $screenName }] } }
        ) {
            tweet {
                id
                likedBy(filter: { screenName: { eq: $screenName } }) {
                    screenName
                }
                likedByAggregate {
                    count
                }
            }
        }
    }
`;

export const getTweetReplies = gql`
    ${CommonTweetFields}
    query getTweetReplies($id: ID!) {
        getTweet(id: $id) {
            ...coreCommonTweetFields
            replyTo {
                ...coreCommonTweetFields
                replyTo {
                    ...coreCommonTweetFields
                }
            }
            replies(first: 10) {
                ...coreCommonTweetFields
                replies(first: 1) {
                    ...coreCommonTweetFields
                }
            }
        }
    }
`;
