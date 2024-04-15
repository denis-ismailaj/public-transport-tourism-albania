/**
* Fetch comments from an instagram post page
*
* Note: This scraper is not meant to be portable or future-proof, it may not work in different scenarios of after
* Instagram updates.
 */

/** Find the root element that contains all comments */
let commentsRoot = getXPath(document, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/div/div[1]/div/div[2]/div/div[2]')

async function scrollComments() {
    /**
    * Scroll comment box until all comments are fetched.
    *
    * Instagram keeps all previously loaded comments in the DOM.
    *
    * The circular progress indicator can be used to tell if there are more comments to load.
    * It's not always visible, but it exists as an element for as long as more comments can be loaded.
    * */
    while (document.querySelector('[role="progressbar"]')) {
        commentsRoot.scrollTop = commentsRoot.scrollHeight;
        await delay(1000);
    }
}

async function fetchComments() {
    /**
     * Fetch all comments and replies, including hidden ones
     */
    await scrollComments()

    let comments = [];
    let c = 1;

    while (true) {
        // Get the root element for the comment
        let commentRoot = getXPath(commentsRoot, `div/div[2]/div[${c}]`);
        if (!commentRoot) break;

        // Try to get the comment's content
        let commentContent = getXPath(commentRoot, `div/div/div[2]/div[1]/div[1]/div/div[2]/span`);

        if (!commentContent) {
            // If it's not a comment, it could be the button to view hidden comments.
            let viewHiddenComments = getXPath(commentRoot, 'div/div/div/span');

            if (viewHiddenComments) {
                // fetch hidden comments too

                viewHiddenComments.click();

                await delay(1500);
                await scrollComments();

                c++;
                continue;
            } else if (commentRoot.textContent === "Hidden by Instagram") {
                // hidden comments have already been fetched, skip this divider
                c++;
                continue;
            } else {
                // no more comments
                break;
            }
        }

        let commentText = textContentWithoutLinks(commentContent);

        let viewRepliesButton = getXPath(commentRoot, 'div[2]/div')
        if (viewRepliesButton) {
            viewRepliesButton.click();
            await delay(1500);

            // Note: not handling scrolling for replies
        }

        let replies = [];
        let r = 1;

        while (true) {
            let replyContent = getXPath(commentRoot, `div[2]/ul/div[${r}]/div/div[2]/div[1]/div[1]/div/div[2]/span`);

            if (!replyContent) break;

            let replyText = textContentWithoutLinks(replyContent);

            replies.push({
                text: replyText,
            });
            r++;
        }

        comments.push({
            text: commentText,
            replies: replies,
        });

        c++;
    }

    return comments;
}

function getXPath(root, xpath) {
    /** Find a child on the specified `root` element based on its xpath */
    return document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function textContentWithoutLinks(element) {
    /**
     * Returns the text content of the element but with anchors stripped out
     *
     * Used to remove usernames from comments
     * */

    // Clone and remove anchors
    let clone = element.cloneNode(true);
    let links = clone.querySelectorAll('a');
    links.forEach(link =>
        link.parentNode.removeChild(link)
    );

    return clone.textContent;
}

console.log(await fetchComments());
