import { Button } from '@automattic/components';
import { useDispatch } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { WAPUU_ERROR_MESSAGE } from '..';
import { useOdysseusAssistantContext } from '../context';
import { useOddyseusSendMessage } from '../query';
import { Message } from '../types';

import './style.scss';

export const SendMessageButton = ( {
	unencodedHref,
	children,
}: {
	unencodedHref: string;
	children: React.ReactNode;
} ) => {
	const { addMessage, setIsLoading } = useOdysseusAssistantContext();
	const { mutateAsync: sendOdysseusMessage } = useOddyseusSendMessage();
	const dispatch = useDispatch();
	return (
		<Button
			borderless
			className="odysseus-chatbox-message-action-button"
			primary
			onClick={ async ( event: { preventDefault: () => void } ) => {
				try {
					event.preventDefault();
					dispatch(
						recordTracksEvent( 'calypso_odysseus_chat_message_action_click', {
							bot_name_slug: 'wapuu',
							action: 'prompt',
							href: unencodedHref,
						} )
					);
					const message = {
						content: unencodedHref,
						role: 'user',
						type: 'message',
					} as Message;

					addMessage( {
						content: message.content,
						role: 'user',
						type: 'message',
					} );
					setIsLoading( true );
					await sendOdysseusMessage( { message } );
				} catch ( e ) {
					addMessage( {
						content: WAPUU_ERROR_MESSAGE,
						role: 'bot',
						type: 'error',
					} );
				} finally {
					setIsLoading( false );
				}
			} }
		>
			{ children }
		</Button>
	);
};