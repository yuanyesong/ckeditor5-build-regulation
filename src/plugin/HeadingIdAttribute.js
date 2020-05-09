import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import { randomBytes } from 'crypto';

export default class HeadingIdAttribute extends Plugin {
	init() {
		const editor = this.editor;
		const model = editor.model;
		const conversion = editor.conversion;

		// Allow 'id' attribute on heading* elements:

		// Either by extending each heading definition:
		// editor.model.schema.extend( 'heading1', { allowAttributes: [ 'id' ] } );
		// editor.model.schema.extend( 'heading2', { allowAttributes: [ 'id' ] } );
		// editor.model.schema.extend( 'heading3', { allowAttributes: [ 'id' ] } );

		// or by adding a more general attribute check:
		model.schema.addAttributeCheck( ( schemaContext, attribute ) => {
			if ( attribute == 'id' && isHeading( schemaContext.last.name ) ) {
				return true;
			}
		} );

		// Then the conversion might be a two way attribute-to-attribute:
		conversion.attributeToAttribute( {
			model: 'id',
			view: 'id'
		} );

		// Register a model post-fixer to add missing id attribute
		// to the heading* element.
		// model.document.registerPostFixer( writer => {
		// 	let wasChanged = false;

		// 	// Get changes
		// 	const changes = model.document.differ.getChanges();

		// 	for ( const change of changes ) {
		// 		// Check heading nodes on insert.
		// 		// console.log( change );
		// 		if ( change.type == 'insert' && isHeading( change.name ) ) {
		// 			const heading = change.position.nodeAfter;

		// 			// Set 'id' attribute when it is missing in the model.
		// 			if ( !heading.hasAttribute( 'id' ) ) {
		// 				writer.setAttribute(
		// 					'id',
		// 					// getHeadingText( heading ).replace( /\s/g, '' ),
		// 					generateToken(),
		// 					heading
		// 				);

		// 				// Return true to notify that model was altered.
		// 				wasChanged = true;
		// 			}
		// 		}
		// 	}

		// 	return wasChanged;
		// } );

		// Helper method for checking if name is any heading element.
		// Detects default headings: 'heading1', 'heading2', ... 'heading6'.
		function isHeading( name ) {
			return name.slice( 0, -1 ) == 'heading';
		}

		// function getHeadingText( heading ) {
		// 	const children = heading.getChildren();
		// 	let textContent = '';
		// 	for ( const child of children ) {
		// 		if ( child.is( 'text' ) ) {
		// 			textContent = textContent + child.data;
		// 			console.log( textContent );
		// 		} else {
		// 			textContent = textContent + getHeadingText( child );
		// 		}
		// 	}
		// 	return textContent;
		// }

		// function generateToken() {
		// 	return 's' + randomBytes( 3 ).toString( 'hex' );
		// }
	}
}
