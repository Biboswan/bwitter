import { useState } from 'react';
import HeaderContainer from 'components/Header';
import styled from 'styled-components';
import { H3 } from 'components/Fonts';
import { SPACING, BASE_SPACING } from 'app-constants';
import Tweet from 'components/Tweet';
import withUrqlContainer from 'client/urql';
import { useMutation, useQuery } from 'urql';
import LoadingBoundary from 'boundaries/loading';
import { getTweets, likeTweet, unlikeTweet, addTweetMutation } from 'queries/tweets';
import { LoggedUser } from 'app-constants';
import TweetModal from 'components/TweetModal';
import { InView } from 'react-intersection-observer';

const MainContainer = styled.div`
    padding: ${BASE_SPACING * 16}px ${SPACING.pageside.sm}px ${SPACING.pageside.sm}px;
    margin: auto;
    width: fit-content;
`;

const TweetOuterContainer = styled.div`
    padding: ${BASE_SPACING * 6}px 0 ${BASE_SPACING * 3}px;
    border-bottom: 1px solid var(--color-primaryLight);
    max-width: 65ch;
`;

const renderTweet = (
    {
        text,
        id,
        likedByAggregate,
        author: { screenName, name, imageUrl },
        likedBy,
        repliesAggregate,
        replies,
    },
    i
) => {
    return (
        <TweetOuterContainer key={id}>
            <Tweet
                id={id}
                imageUrl={imageUrl}
                name={name}
                username={screenName}
                text={text}
                noC={repliesAggregate.count}
                noL={likedByAggregate.count}
                isViewerLiked={
                    likedBy.length > 0 &&
                    likedBy.find(user => user.screenName === LoggedUser.userName)
                }
                replies={replies}
                isExtendThread={replies.length > 0 && i % 3 === 0}
            />
        </TweetOuterContainer>
    );
};

const Body = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [{ data }, executeQuery] = useQuery({
        query: getTweets,
        variables: { limit: 10, offset: 0 },
    });
    //const [tweets, setTotalTweets] = useState(data?.queryTweet);
    const [commentingOnTweetId, setCommentingOnTweetId] = useState(null);
    const [, executeUnLikeTweet] = useMutation(unlikeTweet);
    const [, executeLikeTweet] = useMutation(likeTweet);

    const [, executeCommentTweet] = useMutation(addTweetMutation);

    console.log('data', data.queryTweet);
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    const handleClick = e => {
        let value;
        if (e.target.dataset?.liketweet || e.target.parentNode?.dataset?.liketweet) {
            const value =
                e.target.dataset?.liketweet?.split('-') ||
                e.target.parentNode?.dataset?.liketweet.split('-');

            switch (value[0]) {
                case 'like':
                    executeLikeTweet({ id: value[1], screenName: LoggedUser.userName });
                    return;
                case 'unlike':
                    executeUnLikeTweet({ id: value[1], screenName: LoggedUser.userName });
                    return;
            }
        }

        if (e.target.dataset?.commenttweet) {
            const id = e.target.dataset.commenttweet;
            setCommentingOnTweetId(id);
            setIsOpen(true);
        }
    };

    const handleSubmitTweet = async text => {
        await executeCommentTweet({
            input: [
                {
                    replyTo: { id: commentingOnTweetId },
                    text,
                    author: { screenName: LoggedUser.userName },
                    postedAt: new Date().toISOString(),
                    replies: [],
                    likedBy: [],
                },
            ],
        });
    };

    return (
        <MainContainer onClick={handleClick}>
            {data?.queryTweet?.map(renderTweet)}
            <TweetModal
                handleSubmitTweet={handleSubmitTweet}
                isOpen={modalIsOpen}
                setIsOpen={setIsOpen}
            />
            {/* <InView as="div" onChange={handleScrollEnd} /> */}
        </MainContainer>
    );
};

function Home() {
    return (
        <>
            <HeaderContainer>
                <H3 as="h1">Home</H3>
            </HeaderContainer>
            <LoadingBoundary>
                <Body />
            </LoadingBoundary>
        </>
    );
}

export default withUrqlContainer(Home);
