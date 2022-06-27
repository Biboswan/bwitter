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

const MainContainer = styled.div`
    padding: ${BASE_SPACING * 16}px ${SPACING.pageside.sm}px ${SPACING.pageside.sm}px;
`;

const renderTweet = ({
    text,
    id,
    likedByAggregate,
    author: { screenName, name, imageUrl },
    likedBy,
    repliesAggregate,
}) => {
    return (
        <Tweet
            id={id}
            key={id}
            imageUrl={imageUrl}
            name={name}
            username={screenName}
            text={text}
            noC={repliesAggregate.count}
            noL={likedByAggregate.count}
            isViewerLiked={
                likedBy.length > 0 && likedBy.find(user => user.screenName === LoggedUser.userName)
            }
        />
    );
};

const Body = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [{ data }, executeQuery] = useQuery({
        query: getTweets,
        variables: { limit: 10, offset: 0 },
    });
    const [commentingOnTweetId, setCommentingOnTweetId] = useState(null);
    const [, executeUnLikeTweet] = useMutation(unlikeTweet);
    const [, executeLikeTweet] = useMutation(likeTweet);

    const [, executeCommentTweet] = useMutation(addTweetMutation);

    console.log('data', data.queryTweet);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    const handleClick = e => {
        console.log('e.target.dataset', e.target.dataset);
        if (e.target.dataset?.liketweet) {
            const value = e.target.dataset?.liketweet.split('-');

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
            openModal();
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
