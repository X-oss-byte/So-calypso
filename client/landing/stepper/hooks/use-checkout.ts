import {
	setSignupCompleteSlug,
	persistSignupDestination,
	setSignupCompleteFlowName,
	setSignupCompleteStepName,
} from 'calypso/signup/storageUtils';

interface GoToCheckoutProps {
	flowName: string;
	stepName: string;
	siteSlug: string;
	destination: string;
	plan?: string;
}

const useCheckout = () => {
	const goToCheckout = ( {
		flowName,
		stepName,
		siteSlug,
		destination,
		plan,
	}: GoToCheckoutProps ) => {
		const relativeCurrentPath = window.location.href.replace( window.location.origin, '' );
		const params = new URLSearchParams( {
			redirect_to: destination,
			cancel_to: relativeCurrentPath,
			signup: '1',
		} );

		persistSignupDestination( destination );
		setSignupCompleteSlug( siteSlug );
		setSignupCompleteFlowName( flowName );
		setSignupCompleteStepName( stepName );

		let checkoutUrl = `/checkout/${ encodeURIComponent( siteSlug ) }`;
		if ( plan ) {
			checkoutUrl += `/${ plan }`;
		}

		// The theme upsell link does not work with siteId and requires a siteSlug.
		// See https://github.com/Automattic/wp-calypso/pull/64899
		window.location.href = `${ checkoutUrl }?${ params }`;
	};

	return { goToCheckout };
};

export default useCheckout;