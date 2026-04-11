export function addComponent(opts) {
    const componentName = opts?.repoName.split("/")?.[1] || opts?.repoName;
    if (!componentName)
        throw new Error("wrong componentPath " + opts?.repoName);
    if (!opts?.version)
        throw new Error("wrong version " + opts?.version);
    const iifePath = opts?.iifePath || "main.iife.js";
    if (!document.getElementById(componentName + "-script") && !customElements?.get?.(componentName) && !window?.customElements?.get?.(componentName)) {
        try {
            const script = document.createElement("script");
            script.id = componentName + "-script";
            script.src = `https://cdn.jsdelivr.net/npm/${opts.repoName}@${opts.version}/${iifePath}`;
            if (opts?.local) {
                script.src = `${opts.local}`;
            }
            else if (location.href.includes("localhost:6006")) {
                const hprefix = componentName.split("-")[0];
                script.src = `http://localhost:6006/webcomponents/${componentName.replace(hprefix + "-", "")}/${iifePath}`;
            }
            document.head.appendChild(script);
        }
        catch (err) {
            console.warn(err);
        }
    }
}
export class LanguageTranslator {
    dictionary;
    lang = "";
    constructor(opts) {
        if (!opts?.dictionary)
            throw new Error("no dictionary provided");
        this.dictionary = opts.dictionary;
        this.setLang(opts?.lang);
    }
    setLang(lang) {
        if (!lang)
            lang = LanguageTranslator.getDefaultLang();
        this.lang = lang;
    }
    translateWord(wordKey, lang) {
        return LanguageTranslator.getDictionaryWord(wordKey, this.dictionary, lang || this.lang);
    }
    translateDate(dateISOString, timeOptions, lang) {
        return LanguageTranslator.formatDate(dateISOString, timeOptions, lang || this.lang);
    }
    static getDefaultLang() {
        let browserLang = "en";
        if (navigator?.languages &&
            navigator.languages[0]?.split("-")[0]?.toLowerCase()?.length) {
            browserLang = navigator.languages[0].split("-")[0].toLowerCase();
        }
        return browserLang;
    }
    static getDictionaryWord(wordKey, dictionary, lang) {
        if (!wordKey)
            throw new Error("no wordKey provided");
        if (!dictionary)
            throw new Error("no dictionary provided");
        if (lang && dictionary[lang]?.[wordKey])
            return dictionary[lang][wordKey];
        let w = "";
        const defLng = LanguageTranslator.getDefaultLang();
        if (!lang || defLng !== lang) {
            const defaultLng = dictionary?.[defLng];
            if (defaultLng?.[wordKey]) {
                w = defaultLng[wordKey];
            }
        }
        return w;
    }
    static formatDate(dateISOString, timeOptions, lang) {
        if (!dateISOString)
            throw new Error("no date provided");
        if (typeof dateISOString.getMonth !== "function") {
            throw new Error("wrong date format");
        }
        const dayDateFormat = new Intl.DateTimeFormat(lang || LanguageTranslator.getDefaultLang(), timeOptions);
        return dayDateFormat.format(dateISOString);
    }
}
//# sourceMappingURL=main.js.map