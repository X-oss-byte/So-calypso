/**
 * Internal Dependencies
 */
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { registerHandlers } from 'calypso/state/data-layer/handler-registry';
import { ADMIN_MENU_REQUEST } from 'calypso/state/action-types';
import { receiveAdminMenu } from 'calypso/state/admin-menu/actions';
import { getSiteAdminUrl } from 'calypso/state/sites/selectors';

export const requestFetchAdminMenu = ( action ) =>
	http(
		{
			method: 'GET',
			path: `/sites/${ action.siteId }/admin-menu/`,
			apiNamespace: 'wpcom/v2',
		},
		action
	);

const sanitizeUrl = ( url, wpAdminUrl ) => {
	const isSafeInternalUrl = new RegExp( '^/' ).test( url );
	const isSafeWpAdminUrl = new RegExp( `^${ wpAdminUrl }` ).test( url );
	if ( isSafeInternalUrl || isSafeWpAdminUrl ) {
		return url;
	}

	return '';
};

const sanitizeMenuItem = ( menuItem, wpAdminUrl ) => {
	if ( ! menuItem ) {
		return menuItem;
	}

	let sanitizedChildren;
	if ( Array.isArray( menuItem.children ) ) {
		sanitizedChildren = menuItem.children.map( ( subMenuItem ) =>
			sanitizeMenuItem( subMenuItem, wpAdminUrl )
		);
	}

	return {
		...menuItem,
		url: sanitizeUrl( menuItem.url, wpAdminUrl ),
		...( sanitizedChildren ? { children: sanitizedChildren } : {} ),
	};
};

export const handleSuccess = ( { siteId }, menuData ) => ( dispatch, getState ) => {
	if ( ! Array.isArray( menuData ) ) {
		return dispatch( receiveAdminMenu( siteId, menuData ) );
	}

	// Sanitize menu data.
	const wpAdminUrl = getSiteAdminUrl( getState(), siteId );
	return dispatch(
		receiveAdminMenu(
			siteId,
			menuData.map( ( menuItem ) => sanitizeMenuItem( menuItem, wpAdminUrl ) )
		)
	);
};

export const handleError = () => {
	return null;
};

registerHandlers( 'state/data-layer/wpcom/admin-menu/index.js', {
	[ ADMIN_MENU_REQUEST ]: [
		dispatchRequest( {
			fetch: requestFetchAdminMenu,
			onSuccess: handleSuccess,
			onError: handleError,
		} ),
	],
} );
