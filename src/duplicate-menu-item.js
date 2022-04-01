/**
 * WordPress dependencies.
 */
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { MenuItem, ToolbarItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { Spinner } from "@wordpress/components";
import { addQueryArgs } from "@wordpress/url";


/**
 * Internal dependencies.
 */
import "./editor.scss";

export function DuplicateMenuItem({ singleLabel, restBase }) {
	const [postId, setPostId] = useState(0);
	const [duplicationStatus, setDuplicationStatus] = useState(false);
	const [deletionStatus, setDeletionStatus] = useState(false);
	const { currentPostData } = useSelect((select) => {
		return {
			currentPostData: select("core/editor").getCurrentPost(),
		};
	});

	function getAdminUrl() {
		var href = window.location.href;
		var index = href.indexOf('/wp-admin');
		var homeUrl = href.substring(0, index);
		return homeUrl + '/wp-admin';
	}

	const DuplicatePost = {
		author: currentPostData.author,
		content: currentPostData.content,
		title: "Copy of " + currentPostData.title,
		excerpt: currentPostData.excerpt,
		comment_status: currentPostData.comment_status,
		ping_status: currentPostData.ping_status,
		password: currentPostData.password,
		parent: currentPostData.parent,
		menu_order: currentPostData.menu_order,
		meta: currentPostData.meta,
		template: currentPostData.template,
	};

	const fetchData = async () => {
		const response = await apiFetch({
			path: `wp/v2/${restBase}`,
			method: "POST",
			data: DuplicatePost,
		});
		setPostId(response.id);
		setDuplicationStatus(false);
	};
	function DuplicateThePost() {
		setDuplicationStatus(true);
		fetchData();
	}

	// Permanently Delete **************************************************


	const DeletePost = {
		force: true,
	};

	const fetchDeletedData = async () => {
		const response = await apiFetch({
			path: `wp/v2/${restBase}/${currentPostData.id}`,
			method: "DELETE",
			data: DeletePost,
		});
		setDeletionStatus(false);
		window.location.href = getAdminUrl() + '/post-new.php?post_type=' + currentPostData.type;

	};

	function DeleteThePost() {
		setDeletionStatus(true);
		fetchDeletedData();
	}

	// End Premanently Delete

	const ViewDuplicatedPost = () => {
		return (
			<ToolbarItem
				as="a"
				href={addQueryArgs("post.php", {
					post: postId,
					action: "edit",
				})}
				className="components-button components-dropdown-menu__toggle is-secondary"
			>
				{sprintf(
					/* translators: %s: singular label of current post type i.e Page, Post */
					__("Edit duplicated %s", "vairafiq-anpg"),
					singleLabel
				)}
			</ToolbarItem>
		);
	};
	const DuplicatePostButton = () => {
		return (
			<ToolbarItem
				onClick={DuplicateThePost}
				as={MenuItem}
				className="vairafiq-quick-post-duplicate-menu-item"
			>
				{sprintf(
					/* translators: %s: singular label of current post type i.e Page, Post */
					__("Duplicate %s", "vairafiq-anpg"),
					singleLabel
				)}

				{duplicationStatus && <Spinner />}
			</ToolbarItem>
		);
	};
	const DeletePostButton = () => {
		return (
			<ToolbarItem
				onClick={DeleteThePost}
				as={MenuItem}
				className="vairafiq-quick-post-delete-menu-item"
			>
				{sprintf(
					/* translators: %s: singular label of current post type i.e Page, Post */
					__("Delete Permanently", "vairafiq-anpg"),
				)}

				{deletionStatus && <Spinner />}
			</ToolbarItem>
		);
	};
	return (
		<>
			{0 === postId && <DuplicatePostButton />}
			{0 === postId && <DeletePostButton />}
			{0 !== postId && <ViewDuplicatedPost />}
		</>
	);
}
