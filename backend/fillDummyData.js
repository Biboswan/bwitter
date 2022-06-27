import { faker } from '@faker-js/faker';
import dGraphql from './client/d-graphql.js';
import { generateRandomInteger } from './utils.js';

const FAKER_SEED = 1234567;

const createRandomUsers = async () => {
    for (let i = 0; i < 50; i++) {
        const input = [];
        for (let j = 0; j < 10; j++) {
            const name = faker.name.findName();
            const screenName = name + Math.ceil(Math.random() * 100);
            const imageUrl = faker.image.avatar();
            input.push({ name, screenName, imageUrl });
        }

        const value = JSON.stringify(input).replace(/"([^"]+)":/g, '$1:');
        const mutation = `addUser(input: ${value}) { user { screenName } } `;
        const { data } = await dGraphql({ mutation });
    }
};

const getUsers = async (limit, offset = 0) => {
    const query = `queryUser(first:${limit},offset:${offset}) { screenName }`;

    const { data } = await dGraphql({ query });
    return data?.queryUser;
};

const addTweet = async ({ author, text, replyTo, likedBy }) => {
    const postedAt = new Date().toISOString();
    console.log('text', text);
    console.log('liked', likedBy);
    const mutation = `addTweet(input: ${JSON.stringify({
        author,
        replyTo,
        text,
        postedAt,
        likedBy,
    }).replace(/"([^"]+)":/g, '$1:')}) { tweet { id } } `;

    const { data } = await dGraphql({ mutation });

    return data?.addTweet?.tweet;
};

const selectRandomUsers = (users, n) => {
    const randomUsers = new Set();
    while (randomUsers.size < n) {
        randomUsers.add(users[generateRandomInteger(0, 59)]);
    }

    return Array.from(randomUsers);
};

const createRandomTweets = async () => {
    const users = await getUsers(60);
    const subTweets = [];
    for (let i = 0; i < 50; i++) {
        const text = faker.lorem.text().substring(0, 1000);
        const tweet = await addTweet({
            author: { screenName: users[i].screenName },
            text,
            likedBy: selectRandomUsers(users, generateRandomInteger(0, 10)),
        });

        const tweetId = tweet[0].id;
        const noOfComments = generateRandomInteger(0, 6);
        for (let j = 0; j < noOfComments; j++) {
            const text = faker.lorem.text().substring(0, 1000);
            const subtweet = await addTweet({
                author: { screenName: users[generateRandomInteger(0, 59)].screenName },
                text,
                replyTo: { id: tweetId },
                likedBy: selectRandomUsers(users, generateRandomInteger(0, 10)),
            });
            subTweets.push(subtweet[0].id);
        }
    }

    for (let i = 0; i < subTweets.length; i++) {
        const tweetId = subTweets[i];
        const noOfComments = generateRandomInteger(0, 3);
        for (let j = 0; j < noOfComments; j++) {
            const text = faker.lorem.text().substring(0, 1000);
            await addTweet({
                author: { screenName: users[generateRandomInteger(0, 59)].screenName },
                text,
                replyTo: { id: tweetId },
                likedBy: selectRandomUsers(users, generateRandomInteger(0, 10)),
            });
        }
    }
};

const fillDummyData = async () => {
    faker.seed(FAKER_SEED);
    console.log('generating random users');
    await createRandomUsers();

    console.log('generating random tweets');
    await createRandomTweets();

    console.log('dummy data filled');
};

export default fillDummyData;
