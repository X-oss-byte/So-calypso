import { useLocale } from '@automattic/i18n-utils';
import { getQueryArg } from '@wordpress/url';
import { translate } from 'i18n-calypso';
import {
	AssertConditionResult,
	AssertConditionState,
	Flow,
} from 'calypso/landing/stepper/declarative-flow/internals/types';
import { useSelector } from 'calypso/state';
import { isUserLoggedIn } from 'calypso/state/current-user/selectors';

const Blog: Flow = {
	name: 'blog',
	get title() {
		return translate( 'Blog' );
	},
	useSteps() {
		return [
			{
				slug: 'blogger-intent',
				asyncComponent: () => import( './internals/steps-repository/blogger-intent' ),
			},
		];
	},

	useStepNavigation() {
		return {};
	},

	useAssertConditions(): AssertConditionResult {
		const flowName = this.name;
		const isLoggedIn = useSelector( isUserLoggedIn );
		const defaultLocale = useLocale();
		const locale = getQueryArg( window.location.search, 'locale' ) ?? defaultLocale;

		const logInUrl =
			locale && locale !== 'en'
				? `/start/account/user/${ locale }?redirect_to=/setup/blog&variationName=blogger-intent`
				: `/start/account/user?redirect_to=/setup/blog&variationName=blogger-intent`;

		let result: AssertConditionResult = { state: AssertConditionState.SUCCESS };

		if ( ! isLoggedIn ) {
			// eslint-disable-next-line no-console
			console.log( locale, logInUrl );
			result = {
				state: AssertConditionState.CHECKING,
				message: `${ flowName } requires a logged in user`,
			};
		}

		return result;
	},
};

export default Blog;
