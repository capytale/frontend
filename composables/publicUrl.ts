let builder: (url: string) => string | null;

function createBuilder() {
    const config = useRuntimeConfig();
    function builder(url: string) {
        let base = config.app?.baseURL;
        if (base == null) return null;
        if (!base.endsWith('/')) {
            base += '/';
        }
        if (url.startsWith('/')) {
            return base + url.substring(1);
        } else {
            return base + url;
        }
    }
    return builder;
}

function usePublicUrl() {
    return builder ??= createBuilder();
}

export { usePublicUrl };