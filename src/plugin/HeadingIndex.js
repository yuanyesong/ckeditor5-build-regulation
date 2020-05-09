import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class HeadingIndex extends Plugin {
	afterInit() {
		const editor = this.editor;
		const conversion = editor.conversion;
		const schema = editor.model.schema;
		const model = editor.model;

		// Get information about headings from the editor's configuration.
		const headings = editor.config.get("heading").options;

		this._setupConversion(conversion, schema, headings);

		function isHeading(name) {
			return name.slice(0, -1) == "heading";
		}

		// Register a model post-fixer to add missing id attribute
		// to the heading* element.
		model.document.registerPostFixer((writer) => {
			let wasChanged = false;

			// Get changes
			const changes = model.document.differ.getChanges();

			for (const entry of changes) {
				// Check heading nodes on insert.
				// console.log( change );
				if (entry.type == "insert") {
					if (isHeading(entry.name)) {
						const heading = entry.position.nodeAfter;
						const textElement = heading.getChild(0);
						// Set 'id' attribute when it is missing in the model.
						if (!heading.hasAttribute("id")) {
							writer.setAttribute(
								"id",
								// getHeadingText( heading ).replace( /\s/g, '' ),
								textElement.data,
								heading
							);

							// Return true to notify that model was altered.
							wasChanged = true;
						}
					}
					if (
						entry.name == "$text" &&
						isHeading(entry.position.parent.name)
					) {
						const heading = entry.position.parent;
						const textElement = heading.getChild(0);
						if (heading.hasAttribute("id")) {
							writer.setAttribute(
								"id",
								// getHeadingText( heading ).replace( /\s/g, '' ),
								textElement.data,
								heading
							);

							// Return true to notify that model was altered.
							wasChanged = true;
						}
					}
				}
			}
			return wasChanged;
		});
	}

	_setupConversion(conversion, schema, headings) {
		conversion.attributeToAttribute({ model: "id", view: "id" });

		// Extend conversion only for headings.
		for (const heading of headings) {
			if (heading.model.match(/^heading/)) {
				schema.extend(heading.model, { allowAttributes: ["id"] });

				conversion.for("downcast").add((dispatcher) => {
					dispatcher.on(
						`insert:${heading.model}`,
						(evt, data, conversionApi) => {
							const modelElement = data.item;

							const id =
								modelElement.getAttribute("id") ||
								`header-${Math.floor(Math.random() * 10000)}`;
							// Set attribute on the view element
							conversionApi.writer.setAttribute(
								"id",
								id,
								conversionApi.mapper.toViewElement(modelElement)
							);
							// Set attribute on the model element
							conversionApi.writer.setAttribute(
								"id",
								id,
								modelElement
							);
						},
						{ priority: "low" }
					);
				});
			}
		}
	}
}
