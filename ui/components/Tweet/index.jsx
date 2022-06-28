import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { SPACING, BASE_SPACING, FONT_WEIGHT } from 'app-constants';
import { Sub1, Para } from 'components/Fonts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faFaceGrinHearts } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faXmark } from '@fortawesome/free-solid-svg-icons';
import { LoggedUser } from 'app-constants';

const Container = styled.article`
    display: grid;
    column-gap: ${BASE_SPACING * 4}px;
    grid-template-columns: 78px auto;
    padding-bottom: ${props => (props.isExtendThread ? `${BASE_SPACING * 4}px` : '0')};
    &:hover {
        background-color: var(--color-commentHover);
    }
    cursor: pointer;
`;

const Image = styled.img`
    border-radius: 50%;
`;

const Line = styled.div`
    width: 2px;
    background-color: var(--color-primaryLight);
    margin: auto;
    height: 100%;
`;

const TextContainer = styled.div``;

const Name = styled(Sub1)`
    font-weight: ${FONT_WEIGHT.bold};
`;

const UserName = styled(Sub1)`
    font-weight: ${FONT_WEIGHT.light};
`;

const Convo = styled(Para)`
    margin: ${BASE_SPACING * 4}px 0;
    max-width: 65ch;
    font-weight: ${FONT_WEIGHT.light};
`;

const ActionContainer = styled.div`
    display: flex;
    column-gap: ${BASE_SPACING * 8}px;
    font-weight: ${FONT_WEIGHT.light} !important;

    .hoverComment:hover {
        color: var(--color-primary) !important;
    }

    .hoverComment:hover > .actionCount {
        color: var(--color-primary) !important;
    }

    .hoverLike:hover {
        color: var(--color-error);
    }

    .hoverLike:hover > .actionCount {
        color: var(--color-error);
    }
`;

const Heading = styled.div`
    display: flex;
    column-gap: ${BASE_SPACING}px;
`;

const Icon = styled(FontAwesomeIcon)`
    font-size: 24px;
    cursor: pointer;
`;

const ActionButton = styled.button`
    min-width: 48px;
    min-height: 48px;
    border: none;
    display: flex;
    column-gap: ${BASE_SPACING * 2}px;
    align-items: center;
    background-color: transparent;
    color: var(--color-primaryTextMedium);

    .filledHeart {
        color: var(--color-error);
    }

    .actionCount {
        color: var(--color-primaryTextMedium);
    }
`;

const Tweet = ({
    imageUrl,
    id,
    text,
    username,
    name,
    noC,
    noL,
    replies,
    isViewerLiked = false,
    isExtendThread = false,
    showFullSequence = false,
    ...rest
}) => {
    const reply = isExtendThread && replies?.length ? replies[0] : undefined;

    return (
        <>
            <Container data-tweetid={id} isExtendThread={isExtendThread} {...rest}>
                <div>
                    <Image src={imageUrl} alt={`profile pic of ${name}`} />
                    {isExtendThread && <Line />}
                </div>
                <TextContainer>
                    <Heading>
                        <Name color="primaryDark">{name}</Name>
                        <UserName color="primaryDark">@{username}</UserName>
                    </Heading>
                    <Convo>{text}</Convo>
                    <ActionContainer>
                        <ActionButton data-commenttweet={id} className="hoverComment">
                            <Icon data-commenttweet={id} icon={faComment} />
                            <Para cdata-commenttweet={id} className="actionCount" as="div">
                                {noC}
                            </Para>
                        </ActionButton>
                        <ActionButton
                            data-liketweet={`${isViewerLiked ? 'unlike' : 'like'}` + `-${id}`}
                            className="hoverLike"
                        >
                            <Icon
                                data-liketweet={`${isViewerLiked ? 'unlike' : 'like'}` + `-${id}`}
                                className={isViewerLiked ? 'filledHeart' : ''}
                                icon={isViewerLiked ? faHeartSolid : faHeart}
                            />
                            <Para
                                data-liketweet={`${isViewerLiked ? 'unlike' : 'like'}` + `-${id}`}
                                className={'actionCount ' + (isViewerLiked ? 'filledHeart' : '')}
                                as="div"
                            >
                                {noL}
                            </Para>
                        </ActionButton>
                    </ActionContainer>
                </TextContainer>
            </Container>
            {isExtendThread && reply && (
                <Tweet
                    isExtendThread={false}
                    id={reply.id}
                    imageUrl={reply.author.imageUrl}
                    name={reply.author.name}
                    username={reply.author.screenName}
                    text={reply.text}
                    noC={reply.repliesAggregate.count}
                    noL={reply.likedByAggregate.count}
                    isViewerLiked={
                        reply.likedBy.length > 0 &&
                        reply.likedBy.find(user => user.screenName === LoggedUser.userName)
                    }
                />
            )}
        </>
    );
};

export default Tweet;
