import React, { useState, useMemo } from 'react';
import { Button, Icon, Form } from 'semantic-ui-react';
import {
  ObjectItemInput,
  ObjectItemComponentProps,
  reportError,
  AuthorWidget,
} from '..';
import dayjs from 'dayjs';
import { CommentsList, PostCommentWidget } from './Comments';
import './Chat.css';
import './commonStyles.css';
import cx from 'classnames';
import { LikeWidget } from './LikeWidget';

export const type2icon = (type: ObjectItemInput['type']) => {
  switch (type) {
    case 'request':
      return 'hand paper';
    case 'offer':
      return 'heart';
    case 'donation':
      return 'heart';
    case 'chat':
    default:
      return 'chat';
  }
};
export const type2title = (type: ObjectItemInput['type']) => {
  switch (type) {
    case 'request':
      return 'Ask Help';
    case 'offer':
      return 'Offer Help';
    case 'donation':
      return 'Donate';
    case 'chat':
    default:
      return 'Chat';
  }
};

export const Chat: React.FC<ObjectItemComponentProps> = ({
  item,
  user,
  userVoted,
  votes,
  comments,
  expanded,
  onClick,
  onVote,
  onComment,
  onClose,
}) => {
  const { type, author, title, description, created } = item;

  const [showCommentsWidget, setShowCommentsWidget] = useState(false);

  const commentsCount = comments?.length || 0;

  const sortedComments = useMemo(() => {
    if (!comments) return comments;
    return comments.sort((l, r) => (l.created < r.created ? -1 : 1));
  }, [comments]);

  const icon: any = type2icon(type);

  return (
    <div
      className={cx({ item: true, 'chat-item': true, expanded })}
      onClick={onClick}
    >
      <div className="title">
        <Icon name={icon} />
        {title}
      </div>
      {expanded && (
        <div className="author-created">
          <AuthorWidget userId={author} watchForChanges />
          {' on '}
          {new Date(created).toLocaleString()}
        </div>
      )}
      <br />
      {expanded && description !== title && (
        <section className="description">{description}</section>
      )}
      {!!commentsCount && (
        <div className="replies-count">{commentsCount} replies</div>
      )}
      <div className="actions">
        <LikeWidget votes={votes} userVoted={userVoted} onVote={onVote} />

        <div>
          {expanded && user?.uid === author && (
            <Button
              icon="close"
              content="Close"
              basic
              onClick={() => {
                if (window.confirm('Are you sure you want to close it?'))
                  onClose().catch(reportError);
              }}
            />
          )}
          {!showCommentsWidget && !expanded && (
            <Button
              basic
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentsWidget(true);
              }}
            >
              Reply
            </Button>
          )}
        </div>
      </div>
      {expanded && !!commentsCount && (
        <section>
          <h4 className="pale-heading">Replies</h4>
          <CommentsList comments={sortedComments!} />
        </section>
      )}
      {(showCommentsWidget || expanded) &&
        (!!user ? (
          <PostCommentWidget onComment={onComment} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            You need to register or sign in to be able to post
          </div>
        ))}
    </div>
  );
};

const minutes2text = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 24 * 60) return `${minutes / 60} hours`;
  return `${minutes / (24 * 60)} days`;
};

const validUntilOptions = [
  5,
  15,
  30,
  60,
  3 * 60,
  12 * 60,
  24 * 60,
  2 * 24 * 60,
  7 * 24 * 60,
].map((minutes) => ({
  value: minutes,
  key: minutes,
  text: minutes2text(minutes),
}));

export const AddNewChatObject: React.FC<{
  type: ObjectItemInput['type'];
  onPost: (data: ObjectItemInput) => void;
}> = ({ type, onPost }) => {
  const [state, setState] = useState({ valid_until: 12 * 60 } as any);
  const onChange = (e: any) => {
    const { name, value } = e.target;
    console.debug(e.target.name, e.target.value);
    setState({ ...state, [name]: value });
  };
  return (
    <div className="add-new-chat">
      <h4>
        <Icon name={type2icon(type)} /> {type2title(type)}
      </h4>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          console.debug('submit', state);
          const { topic, message, valid_until } = state;

          onPost({
            type,
            title: topic || message,
            description: message,
            valid_until: dayjs().add(valid_until, 'minute').toISOString(),
          });
        }}
      >
        <Form.Input
          autoComplete="off"
          label="Topic (optional)"
          name="topic"
          onChange={onChange}
        />
        <Form.TextArea
          autoFocus
          label="Message"
          name="message"
          onChange={onChange}
        />
        <Form.Dropdown
          options={validUntilOptions}
          label="Valid for next"
          selection
          defaultValue={state.valid_until}
          onChange={(e, { value }) =>
            setState({ ...state, valid_until: value })
          }
        />

        <Form.Button primary>Post</Form.Button>
      </Form>
    </div>
  );
};
