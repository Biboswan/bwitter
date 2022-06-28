import { useState } from 'react';
import HeaderContainer from 'components/Header';
import styled from 'styled-components';
import { H3, H4 } from 'components/Fonts';
import { SPACING, BASE_SPACING } from 'app-constants';
import Tweet from 'components/Tweet';
import withUrqlContainer from 'client/urql';
import { useMutation, useQuery } from 'urql';
import LoadingBoundary from 'boundaries/loading';
import { getTweetReplies, likeTweet, unlikeTweet, addTweetMutation } from 'queries/tweets';
import { LoggedUser } from 'app-constants';
import TweetModal from 'components/TweetModal';
import { useRouter } from 'next/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const MainTweetSequenceContainer = styled(TweetOuterContainer)`
    margin-bottom: ${BASE_SPACING * 10}px;
`;

const RepliesHeading = styled(H4)`
    margin: ${BASE_SPACING * 8}px ${BASE_SPACING * 8}px;
`;
const HeaderInnerContainer = styled.div`
    display: flex;
    column-gap: 36px;
    align-items: center;
`;

const ArrowBack = styled(FontAwesomeIcon)`
    font-size: 32px;
`;

const createParentTrack = node => {
    const track = [];
    while (node !== null) {
        track.unshift(node);
        node = node.replyTo;
    }
    return track;
};

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

const renderMainTweetSequence = ({
    text,
    id,
    likedByAggregate,
    author: { screenName, name, imageUrl },
    likedBy,
    repliesAggregate,
    isExtendThread,
}) => {
    return (
        <Tweet
            key={id}
            id={id}
            imageUrl={imageUrl}
            name={name}
            username={screenName}
            text={text}
            noC={repliesAggregate.count}
            noL={likedByAggregate.count}
            isViewerLiked={
                likedBy.length > 0 && likedBy.find(user => user.screenName === LoggedUser.userName)
            }
            isExtendThread={isExtendThread}
        />
    );
};

const renderMainTweetSequenceContainer = track => {
    return (
        <MainTweetSequenceContainer>
            {track.map((item, i) =>
                i !== track.length - 1
                    ? renderMainTweetSequence({ ...item, isExtendThread: true })
                    : renderMainTweetSequence({ ...item, isExtendThread: false })
            )}
        </MainTweetSequenceContainer>
    );
};

const Body = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const [{ data }, executeQuery] = useQuery({
        query: getTweetReplies,
        variables: { id },
    });
    //const [tweets, setTotalTweets] = useState(data?.queryTweet);
    const [commentingOnTweetId, setCommentingOnTweetId] = useState(null);
    const [, executeUnLikeTweet] = useMutation(unlikeTweet);
    const [, executeLikeTweet] = useMutation(likeTweet);

    const [, executeCommentTweet] = useMutation(addTweetMutation);

    const handleClick = e => {
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
            return;
        }

        let parent = e.target;
        while (parent !== null) {
            if (parent.dataset?.tweetid) {
                const id = parent.dataset?.tweetid;
                router.push({ pathname: '/tweet/[id]', query: { id } });
                return;
            }
            parent = parent.parentNode;
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
            {renderMainTweetSequenceContainer(createParentTrack(data.getTweet))}
            <RepliesHeading as="h2">Replies</RepliesHeading>
            {data?.getTweet?.replies.map(renderTweet)}
            <TweetModal
                handleSubmitTweet={handleSubmitTweet}
                isOpen={modalIsOpen}
                setIsOpen={setIsOpen}
            />
        </MainContainer>
    );
};

function TweetPage() {
    const router = useRouter();
    return (
        <>
            <HeaderContainer>
                <HeaderInnerContainer>
                    <ArrowBack
                        onClick={() => router.back()}
                        role="navigation"
                        aria-label="back"
                        icon={faArrowLeft}
                    />
                    <H3 as="h1">Tweet</H3>
                </HeaderInnerContainer>
            </HeaderContainer>
            <LoadingBoundary>
                <Body />
            </LoadingBoundary>
        </>
    );
}

export default withUrqlContainer(TweetPage);
