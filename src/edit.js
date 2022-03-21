import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';
//eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { format, dateI18n, __experimentalGetSettings } from '@wordpress/date';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({ attributes }) {
	const { numberOfPosts, displayFeaturedImage } = attributes;
	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
			});
		},
		[numberOfPosts]
	);

	//console.log(posts);

	return (
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
										featuredImage.media_details.sizes.full
											.source_url
									}
								/>
							)}
							<h5>
								<a href={post.link}>
									{post.title.rendered ? (
										<RawHTML>{post.title.rendered}</RawHTML>
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
	);
}
