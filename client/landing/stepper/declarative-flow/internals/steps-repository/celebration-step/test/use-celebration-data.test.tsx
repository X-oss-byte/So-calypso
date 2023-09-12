/**
 * @jest-environment jsdom
 */
import { isAssemblerDesign } from '@automattic/design-picker';
import {
	DESIGN_FIRST_FLOW,
	START_WRITING_FLOW,
	WITH_THEME_ASSEMBLER_FLOW,
} from '@automattic/onboarding';
import { renderHook } from '@testing-library/react';
import defaultCalypsoI18n, { I18NContext } from 'i18n-calypso';
import useCelebrationData from '../use-celebration-data';

jest.mock( '@automattic/design-picker', () => ( { isAssemblerDesign: jest.fn( () => false ) } ) );

const siteSlug = 'testcelebrationscreen.wordpress.com';

describe( 'The useCelebrationData hook', () => {
	let wrapper;

	beforeEach( () => {
		wrapper = ( { children } ) => (
			<I18NContext.Provider value={ defaultCalypsoI18n }>{ children }</I18NContext.Provider>
		);
	} );

	describe( `The ${ DESIGN_FIRST_FLOW } flow`, () => {
		const flow = DESIGN_FIRST_FLOW;

		it( 'renders correct texts and links when first post is NOT published', () => {
			const { result } = renderHook(
				() =>
					useCelebrationData( {
						flow,
						siteSlug,
						isFirstPostPublished: false,
					} ),
				{ wrapper }
			);

			expect( result.current ).toEqual( {
				title: 'Your blog’s ready!',
				subTitle: 'Now it’s time to start posting.',
				primaryCtaName: 'Write your first post',
				primaryCtaText: 'Write your first post',
				primaryCtaLink: `/post/${ siteSlug }`,
				secondaryCtaName: 'Visit your blog',
				secondaryCtaText: 'Visit your blog',
				secondaryCtaLink: `https://${ siteSlug }`,
				dashboardCtaName: 'Go to dashboard',
				dashboardCtaText: 'Go to dashboard',
				dashboardCtaLink: `/home/${ siteSlug }`,
			} );
		} );

		it( 'renders correct texts and links when first post is published', () => {
			const { result } = renderHook(
				() =>
					useCelebrationData( {
						flow,
						siteSlug,
						isFirstPostPublished: true,
					} ),
				{ wrapper }
			);

			expect( result.current ).toEqual( {
				title: 'Your blog’s ready!',
				subTitle: 'Now it’s time to connect your social accounts.',
				primaryCtaName: 'Connect to social',
				primaryCtaText: 'Connect to social',
				primaryCtaLink: `/marketing/connections/${ siteSlug }`,
				secondaryCtaName: 'Visit your blog',
				secondaryCtaText: 'Visit your blog',
				secondaryCtaLink: `https://${ siteSlug }`,
				dashboardCtaName: 'Go to dashboard',
				dashboardCtaText: 'Go to dashboard',
				dashboardCtaLink: `/home/${ siteSlug }`,
			} );
		} );
	} );

	describe( `The ${ START_WRITING_FLOW } flow`, () => {
		const flow = START_WRITING_FLOW;

		it( 'renders correct texts and links', () => {
			const { result } = renderHook(
				() =>
					useCelebrationData( {
						flow,
						siteSlug,
					} ),
				{ wrapper }
			);

			expect( result.current ).toEqual( {
				title: 'Your blog’s ready!',
				subTitle: 'Now it’s time to connect your social accounts.',
				primaryCtaName: 'Connect to social',
				primaryCtaText: 'Connect to social',
				primaryCtaLink: `/marketing/connections/${ siteSlug }`,
				secondaryCtaName: 'Visit your blog',
				secondaryCtaText: 'Visit your blog',
				secondaryCtaLink: `https://${ siteSlug }`,
				dashboardCtaName: 'Go to dashboard',
				dashboardCtaText: 'Go to dashboard',
				dashboardCtaLink: `/home/${ siteSlug }`,
			} );
		} );
	} );

	describe( `The ${ WITH_THEME_ASSEMBLER_FLOW } flow`, () => {
		const flow = WITH_THEME_ASSEMBLER_FLOW;

		beforeEach( () => {
			( isAssemblerDesign as jest.Mock ).mockReturnValue( true );
		} );

		afterEach( () => {
			jest.clearAllMocks();
		} );

		it( 'renders correct texts and links', () => {
			const { result } = renderHook(
				() =>
					useCelebrationData( {
						flow,
						siteSlug,
					} ),
				{ wrapper }
			);

			expect( result.current ).toEqual( {
				title: 'Your site’s ready!',
				subTitle: 'Now it’s time to edit your content',
				primaryCtaName: 'Edit your content',
				primaryCtaText: 'Edit your content',
				primaryCtaLink: `/site-editor/${ siteSlug }?canvas=edit&assembler=1`,
				secondaryCtaName: 'Visit your site',
				secondaryCtaText: 'Visit your site',
				secondaryCtaLink: `https://${ siteSlug }`,
				dashboardCtaName: 'Go to dashboard',
				dashboardCtaText: 'Go to dashboard',
				dashboardCtaLink: `/home/${ siteSlug }`,
			} );
		} );
	} );
} );
