import { gql } from '@urql/core';
import { LoggedUser } from 'app-constants';

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
    query listTweets($limit: Int!, $offset: Int) {
        queryTweet(first: $limit, offset: $offset, filter: { not: { has: replyTo } }) {
            id
            text
            author {
                screenName
                imageUrl
                name
            }
            replyTo {
                id
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
    query getTweetReplies($id: ID!) {
        getTweet(id: $id) {
            id
            replies {
                id
                text
                author {
                    screenName
                    imageUrl
                    name
                }
                replyTo {
                    id
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
        }
    }
`;
