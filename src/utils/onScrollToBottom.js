function onScrollToBottom(handleScrollToBottom, y=0){
    let scrollToBottomEventHandler = () => {
        let scrollTop = (
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop || 0
        );

        let distanceFromBottom = (
            document.documentElement.offsetHeight -
            (window.innerHeight + scrollTop )
        )

        if (distanceFromBottom === y) {
            handleScrollToBottom();
        }
    };

    return scrollToBottomEventHandler
}

export {onScrollToBottom}
