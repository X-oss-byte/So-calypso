import { Button, Gridicon, Spinner } from '@automattic/components';
import { HelpCenter } from '@automattic/data-stores';
import { useChatStatus, useChatWidget } from '@automattic/help-center/src/hooks';
import { useDispatch as useDataStoreDispatch } from '@wordpress/data';
import { useI18n } from '@wordpress/react-i18n';
import classnames from 'classnames';
import type { MessagingGroup } from '@automattic/help-center/src/hooks/use-messaging-availability';
import type { FC } from 'react';

type ChatIntent = 'SUPPORT' | 'PRESALES' | 'PRECANCELLATION';
export type KeyType = 'akismet' | 'jpAgency' | 'jpCheckout' | 'jpGeneral' | 'wpcom';

type Props = {
	borderless?: boolean;
	chatIntent?: ChatIntent;
	keyType?: KeyType;
	className?: string;
	initialMessage: string;
	onClick?: () => void;
	onError?: () => void;
	primary?: boolean;
	siteUrl?: string;
	children?: React.ReactNode;
};

const HELP_CENTER_STORE = HelpCenter.register();

function getGroupName( keyType: KeyType ) {
	switch ( keyType ) {
		case 'akismet':
		case 'jpAgency':
		case 'jpCheckout':
		case 'jpGeneral':
			return 'jp_presales';
		case 'wpcom':
		default:
			return 'wpcom_presales';
	}
}

function getMessagingGroupForIntent( chatIntent: ChatIntent, keyType: KeyType ): MessagingGroup {
	switch ( chatIntent ) {
		case 'PRESALES':
			return getGroupName( keyType );

		case 'PRECANCELLATION':
		case 'SUPPORT':
		default:
			return 'wpcom_messaging';
	}
}

const ChatButton: FC< Props > = ( {
	borderless = true,
	chatIntent = 'SUPPORT',
	keyType = 'wpcom',
	children,
	className = '',
	initialMessage,
	onClick,
	onError,
	primary = false,
	siteUrl,
} ) => {
	const { __ } = useI18n();

	const messagingGroup = getMessagingGroupForIntent( chatIntent, keyType );

	const {
		canConnectToZendesk,
		hasActiveChats,
		isChatAvailable,
		isEligibleForChat,
		isPrecancellationChatOpen,
		isPresalesChatOpen,
	} = useChatStatus( messagingGroup );

	const { setShowHelpCenter, setInitialRoute } = useDataStoreDispatch( HELP_CENTER_STORE );

	function shouldShowChatButton() {
		if ( isEligibleForChat && hasActiveChats ) {
			return true;
		}
		switch ( chatIntent ) {
			case 'PRESALES':
				if ( ! isPresalesChatOpen ) {
					return false;
				}
				break;

			case 'PRECANCELLATION':
				if ( ! isPrecancellationChatOpen ) {
					return false;
				}
				break;
			default:
				break;
		}

		if ( isEligibleForChat && isChatAvailable ) {
			return true;
		}
	}

	const { isOpeningChatWidget, openChatWidget } = useChatWidget();

	const handleClick = () => {
		if ( canConnectToZendesk ) {
			openChatWidget( initialMessage, siteUrl, onError, onClick );
		} else {
			setInitialRoute( '/contact-form?mode=CHAT' );
			setShowHelpCenter( true );
			onClick?.();
		}
	};

	const classes = classnames( 'chat-button', className );

	if ( ! shouldShowChatButton() ) {
		return null;
	}

	function getChildren() {
		if ( isOpeningChatWidget ) {
			return <Spinner />;
		}

		return children || <Gridicon icon="chat" />;
	}

	return (
		<Button
			className={ classes }
			primary={ primary }
			borderless={ borderless }
			onClick={ handleClick }
			title={ __( 'Support Chat' ) }
		>
			{ getChildren() }
		</Button>
	);
};

export default ChatButton;
