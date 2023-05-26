import { START_WRITING_FLOW } from '@automattic/onboarding';
import { useDispatch, useSelect } from '@wordpress/data';
import { __experimentalMainDashboardButton as MainDashboardButton } from '@wordpress/edit-post';
import { useEffect, createPortal, useState } from '@wordpress/element';
import { registerPlugin as originalRegisterPlugin, PluginSettings } from '@wordpress/plugins';
import { getQueryArg } from '@wordpress/url';
import useLaunchpadTasksCompleted from '../../dotcom-fse/lib/launchpad/use-launchpad';
import WpcomBlockEditorNavSidebar from './components/nav-sidebar';
import ToggleSidebarButton from './components/toggle-sidebar-button';

type CoreEditPostPlaceholder = {
	isFeatureActive: ( ...args: unknown[] ) => boolean;
};

const registerPlugin = ( name: string, settings: Omit< PluginSettings, 'icon' > ) =>
	originalRegisterPlugin( name, settings as PluginSettings );

if ( typeof MainDashboardButton !== 'undefined' ) {
	registerPlugin( 'a8c-full-site-editing-nav-sidebar', {
		render: function NavSidebar() {
			const { addEntities } = useDispatch( 'core' );

			useEffect( () => {
				// Teach core data about the status entity so we can use selectors like `getEntityRecords()`
				addEntities( [
					{
						baseURL: '/wp/v2/statuses',
						key: 'slug',
						kind: 'root',
						name: 'status',
						plural: 'statuses',
					},
				] );

				// Only register entity once
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [] );

			const {
				launchpadSiteIntent: intent,
				launchpadTasksCompleted,
				launchpadFetched,
			} = useLaunchpadTasksCompleted();

			const hasStartWritingFlowActiveFromApi = launchpadFetched
				? intent === START_WRITING_FLOW && ! launchpadTasksCompleted
				: false;
			// We check the URL param along with site intent because the param loads faster and prevents element flashing.
			const isStartWritingFlow =
				hasStartWritingFlowActiveFromApi ||
				getQueryArg( window.location.search, START_WRITING_FLOW ) === 'true';

			const [ clickGuardRoot ] = useState( () => document.createElement( 'div' ) );
			useEffect( () => {
				document.body.appendChild( clickGuardRoot );
				return () => {
					document.body.removeChild( clickGuardRoot );
				};
			} );

			// Uses presence of data store to detect whether this is the experimental site editor.
			const isSiteEditor = useSelect( ( select ) => !! select( 'core/edit-site' ), [] );

			// Disable sidebar nav if the editor is not in fullscreen mode
			const isFullscreenActive = useSelect(
				( select ) =>
					( select( 'core/edit-post' ) as CoreEditPostPlaceholder ).isFeatureActive(
						'fullscreenMode'
					),
				[]
			);

			if ( isStartWritingFlow ) {
				return <MainDashboardButton></MainDashboardButton>;
			}

			if ( isSiteEditor || ! isFullscreenActive ) {
				return null;
			}

			return (
				<MainDashboardButton>
					<ToggleSidebarButton />
					{ createPortal( <WpcomBlockEditorNavSidebar />, clickGuardRoot ) }
				</MainDashboardButton>
			);
		},
	} );
}
