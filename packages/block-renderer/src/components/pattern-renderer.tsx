import usePatternInlineCss from '../hooks/use-pattern-inline-css';
import usePatternMinHeightVh from '../hooks/use-pattern-min-height-vh';
import BlockRendererContainer from './block-renderer-container';
import { usePatternsRendererContext } from './patterns-renderer-context';

interface Props {
	patternId: string;
	viewportWidth?: number;
	viewportHeight?: number;
	minHeight?: number;
	maxHeight?: 'none' | number;
	placeholder?: JSX.Element;
	isNewSite: boolean;
}

const PatternRenderer = ( {
	patternId,
	viewportWidth,
	viewportHeight,
	minHeight,
	maxHeight,
	isNewSite,
}: Props ) => {
	const renderedPatterns = usePatternsRendererContext();
	const pattern = renderedPatterns[ patternId ];
	const patternHtml = usePatternMinHeightVh( pattern?.html, viewportHeight );
	const inlineCss = usePatternInlineCss( patternId, patternHtml, isNewSite );

	return (
		<BlockRendererContainer
			styles={ pattern?.styles ?? [] }
			scripts={ pattern?.scripts ?? '' }
			viewportWidth={ viewportWidth }
			maxHeight={ maxHeight }
			minHeight={ minHeight }
			inlineCss={ inlineCss }
		>
			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={ { __html: patternHtml ?? '' } }
			/>
		</BlockRendererContainer>
	);
};

export default PatternRenderer;
