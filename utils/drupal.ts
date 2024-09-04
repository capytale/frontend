export const drupal = (() => {
    let handler: undefined | (() => void)

    (window as any).$drupalCloseModal = () => {
        if (handler) {
            handler()
            handler = undefined
        }
    }

    const setCloseHandler = (h: () => void) => {
        if (handler === h) return
        if (handler) {
            handler()
        }
        handler = h
    }

    const removeCloseHandler = (h: () => void) => {
        if (handler === h) {
            handler = undefined
        }
    }

    return {
        setCloseHandler,
        removeCloseHandler
    }
})();
