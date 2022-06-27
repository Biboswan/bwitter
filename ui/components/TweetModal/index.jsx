import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { BASE_SPACING, FONT_WEIGHT } from 'app-constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinHearts } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Picker = dynamic(() => import('emoji-picker-react'), {
    ssr: false,
});

Modal.setAppElement('#main');

const Icon = styled(FontAwesomeIcon)`
    font-size: 24px;
    cursor: pointer;
`;

const ModalContainer = styled.div``;

const CloseIcon = styled(Icon)`
    color: var(--color-primaryTextMedium);
    float: right;
`;

Modal.defaultStyles.content = {
    ...Modal.defaultStyles.content,
    border: '1px solid var(--color-modal-border)',
    borderRadius: '27px',
    padding: `${BASE_SPACING * 9}px`,
    marginTop: '60px',
    maxWidth: '600px',
    height: 'fit-content',
};

const EmojiButton = styled(Icon)`
    color: var(--color-primaryDark);
    float: right;
`;

const CommentInput = styled.textarea`
    width: 100%;
    height: 240px;

    &:focus {
        border: none;
        outline: none;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: ${BASE_SPACING * 25}px;
`;
const SubmissionButtonWrapper = styled.button`
    padding: ${BASE_SPACING * 4}px ${BASE_SPACING * 8}px;
    border-radius: 16px;
    border: none;
`;
const DiscardButton = styled(SubmissionButtonWrapper)`
    background-color: var(--color-error);
    color: var(--color-bgColor);
`;

const TweetSubmitButton = styled(SubmissionButtonWrapper)`
    background-color: var(--color-primary);
`;

const TweetModal = ({ isOpen, setIsOpen, handleSubmitTweet, ...rest }) => {
    const [text, setText] = useState('');
    const [isOpenPicker, setIsOpenPicker] = useState(false);

    const handleEmojiClick = e => {
        setIsOpenPicker(value => !value);
    };

    const onEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji);
    };

    const handleCloseModal = useCallback(() => setIsOpen(false), []);

    const onSubmitTweet = async e => {
        e.preventDefault();
        await handleSubmitTweet(text);
        setText('');
        setIsOpen(false);
    };

    return (
        <Modal isOpen={isOpen} contentLabel="Example Modal">
            <ModalContainer>
                <CloseIcon role="button" onClick={handleCloseModal} icon={faXmark} />
                <form onSubmit={onSubmitTweet}>
                    <CommentInput
                        name="comment"
                        type="text"
                        placeholder="Reply to the tweet"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <EmojiButton onClick={handleEmojiClick} role="button" icon={faFaceGrinHearts} />
                    {isOpenPicker && <Picker onEmojiClick={onEmojiClick} />}
                    <ButtonContainer>
                        {' '}
                        <DiscardButton onClick={handleCloseModal}>Discard</DiscardButton>
                        <TweetSubmitButton type="submit">Submit</TweetSubmitButton>
                    </ButtonContainer>
                </form>
            </ModalContainer>
        </Modal>
    );
};

export default TweetModal;
