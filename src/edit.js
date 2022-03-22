import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
//eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { format, dateI18n, __experimentalGetSettings } from '@wordpress/date';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, QueryControls } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { numberOfPosts, displayFeaturedImage, order, orderBy, category } =
		attributes;
	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
				orderby: orderBy,
				order,
				categories: category,
			});
		},
		[numberOfPosts, order, orderBy, category]
	);

	const allCats = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		});
	}, []);

	const onCategoryChange = (value) => {
		const returnCategories = value === '' ? [] : [value];
		setAttributes({ category: returnCategories });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={__('Display Featured Image', 'latest-posts')}
						checked={displayFeaturedImage}
						onChange={(value) =>
							setAttributes({ displayFeaturedImage: value })
						}
					/>
					<QueryControls
						numberOfItems={numberOfPosts}
						onNumberOfItemsChange={(value) =>
							setAttributes({ numberOfPosts: value })
						}
						maxItems={10}
						minItems={1}
						orderby={orderBy}
						onOrderByChange={(value) =>
							setAttributes({ orderby: value })
						}
						order={order}
						onOrderChange={(value) =>
							setAttributes({ order: value })
						}
						categoriesList={allCats}
						selectedCategoryId={category}
						onCategoryChange={onCategoryChange}
					/>
				</PanelBody>
			</InspectorControls>
			<ul {...useBlockProps()}>
				{posts &&
					posts.map((post) => {
						const featuredImage =
							post._embedded &&
							post._embedded['wp:featuredmedia'] &&
							post._embedded['wp:featuredmedia'].length > 0 &&
							post._embedded['wp:featuredmedia'][0];

						return (
							<li key={post.id}>
								{displayFeaturedImage && featuredImage && (
									<img
										alt={featuredImage.alt_text}
										src={
											featuredImage.media_details.sizes
												.full.source_url
										}
									/>
								)}
								<h5>
									<a href={post.link}>
										{post.title.rendered ? (
											<RawHTML>
												{post.title.rendered}
											</RawHTML>
										) : (
											__('No Title', 'latest-posts')
										)}
									</a>
								</h5>
								{post.date_gmt && (
									<time dateTime={format('c', post.date_gmt)}>
										{dateI18n(
											__experimentalGetSettings().formats
												.date,
											post.date_gmt
										)}
									</time>
								)}
								{post.excerpt.rendered && (
									<RawHTML>{post.excerpt.rendered}</RawHTML>
								)}
							</li>
						);
					})}
			</ul>
		</>
	);
}
