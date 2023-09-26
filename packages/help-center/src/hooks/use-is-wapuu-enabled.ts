/* eslint-disable no-restricted-imports */
import config from '@automattic/calypso-config';
import { canAccessWpcomApis } from 'wpcom-proxy-request';
import { useSelector } from 'calypso/state';
import { isJetpackSite } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import { useSupportAvailability } from '../data/use-support-availability';

/**
 * Helper hook to determine if Wapuu should be enabled.
 * @returns {boolean} Whether Wapuu should be enabled or not.
 * @example
 * const isWapuuEnabled = useIsWapuuEnabled();
 * if ( isWapuuEnabled ) {
 *     // Do something
 * }
 */
export const useIsWapuuEnabled = () => {
	const { data: supportAvailability, isLoading } = useSupportAvailability( 'OTHER' );
	const canAccessWpcom = canAccessWpcomApis();
	const isFreeUser = ! supportAvailability?.is_user_eligible_for_tickets;
	const siteId = useSelector( ( state ) => getSelectedSiteId( state ) );
	const isSiteJetpack = useSelector( ( state ) => isJetpackSite( state, siteId ) );
	const isWapuuConfigEnabled = config.isEnabled( 'wapuu' );

	if ( isSiteJetpack === null || isFreeUser || isLoading || ! canAccessWpcom ) {
		return false;
	}

	return isWapuuConfigEnabled && ! isSiteJetpack;
};
