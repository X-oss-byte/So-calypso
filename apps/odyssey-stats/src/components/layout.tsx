import classnames from 'classnames';
import DocumentHead from 'calypso/components/data/document-head';

interface LayoutProps {
	sectionGroup: string;
	sectionName: string;
	primary: React.ReactNode;
	secondary: React.ReactNode;
}

export default function Layout( { sectionGroup, sectionName, primary, secondary }: LayoutProps ) {
	const sectionClass = classnames( 'layout', {
		[ 'is-group-' + sectionGroup ]: sectionGroup,
		[ 'is-section-' + sectionName ]: sectionName,
	} );

	return (
		<div className={ sectionClass }>
			<DocumentHead />
			<div id="content" className="layout__content">
				<div id="secondary" className="layout__secondary" role="navigation">
					{ secondary }
				</div>
				<div id="primary" className="layout__primary">
					{ primary }
				</div>
			</div>
		</div>
	);
}
