import { Card, Button, Gridicon } from '@automattic/components';
import { LaunchpadNavigator } from '@automattic/data-stores';
import { DefaultWiredLaunchpad } from '@automattic/launchpad';
import { select } from '@wordpress/data';
import { useTranslate } from 'i18n-calypso';

import './style.scss';

type ToggleLaunchpadIsVisible = ( shouldBeVisible: boolean ) => void;

export type FloatingNavigatorProps = {
	siteSlug: string | null;
	toggleLaunchpadIsVisible?: ToggleLaunchpadIsVisible;
};

const FloatingNavigator = ( { siteSlug, toggleLaunchpadIsVisible }: FloatingNavigatorProps ) => {
	const launchpadContext = 'launchpad-navigator';
	const translate = useTranslate();
	const checklistSlug = select( LaunchpadNavigator.store ).getActiveChecklistSlug() || null;

	if ( ! checklistSlug ) {
		return null;
	}

	const setLaunchpadIsVisible = toggleLaunchpadIsVisible || ( () => {} );

	return (
		<Card className="launchpad-navigator__floating-navigator">
			<div className="launchpad-navigator__floating-navigator-header">
				<h2>{ translate( 'Next steps for your site' ) }</h2>
				<Button
					aria-label={ translate( 'Close task list modal' ) }
					borderless
					className="launchpad-navigator__floating-navigator-close-button"
					onClick={ () => setLaunchpadIsVisible( false ) }
				>
					<Gridicon icon="cross" size={ 18 } />
				</Button>
			</div>
			<DefaultWiredLaunchpad
				siteSlug={ siteSlug }
				checklistSlug={ checklistSlug }
				launchpadContext={ launchpadContext }
			/>
			<div className="launchpad-navigator__floating-navigator-actions">
				<Button disabled>{ translate( 'Older tasks' ) }</Button>
			</div>
		</Card>
	);
};

export default FloatingNavigator;
