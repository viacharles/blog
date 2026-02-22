interface PagesFunction {
    request: Request
    env: any
    params: Record<string, string>
    waitUntil: Function
    next: Function
    data: any
}

const COOKIE_NAME = 'locale';
const SUPPORTED = ['en', 'zh-Hant'] as const;
const DEFAULT_LANG = SUPPORTED[0];

type Lang = (typeof SUPPORTED)[number];

function isBot(userAgent: string | null): boolean {
    if (!userAgent) return false;
    return /(Googlebot|bingbot|DuckDuckBot|Baiduspider|YandexBot|Slurp|Sogou|facebot|ia_archiver)/i.test(
        userAgent
    );
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
    const out: Record<string, string> = {};
    if (!cookieHeader) return out;

    for (const part of cookieHeader.split(";")) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;

        const k = trimmed.slice(0, eq).trim();
        const v = trimmed.slice(eq + 1).trim();

        if (k) out[k] = decodeURIComponent(v);
    }
    return out;
}

function detectLangFromAcceptLanguage(al: string | null): Lang | null {
    if (!al) return null;

    // e.g. "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7"
    const parts = al.split(",").map(p => p.trim()).filter(Boolean);

    for (const p of parts) {
        // p could be "zh-TW" or "zh;q=0.9"
        const langTag = p.split(";")[0]?.trim().toLowerCase();
        if (!langTag) continue;

        if (langTag === "en" || langTag.startsWith("en-")) return "en";
        if (langTag === "zh" || langTag.startsWith("zh-")) return "zh-Hant";
    }

    return null;
}

function redirect(url: URL, toPath: string, cookieLang?: Lang): Response {
    const target = new URL(toPath, url);

    const res = Response.redirect(target, 302);

    // Redirect 不該被 cache：不然第一個人的語言會污染其他人
    res.headers.set("Cache-Control", "no-store, max-age=0");

    // 有些中介層更愛亂快取，保守加上
    res.headers.set("Pragma", "no-cache");

    // Debug 用：你可先留著，上線也不會害人（想乾淨再刪）
    res.headers.set("X-I18n-Redirect", "1");

    // 寫 cookie（可選）
    if (cookieLang) {
        // 180 days
        const maxAge = 60 * 60 * 24 * 180;

        // 注意：Secure 表示只在 HTTPS 傳送；Pages + 自訂網域通常都是 HTTPS
        res.headers.append(
            "Set-Cookie",
            `${COOKIE_NAME}=${encodeURIComponent(cookieLang)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
        );
    }

    return res;
}


export async function onRequest(context: PagesFunction) {
    const req: Request = context.request;
    const url = new URL(req.url);
    if (url.pathname !== '/') {
        return context.next();
    }
    const queryLang = url.searchParams.get('lang');
    if (queryLang && (SUPPORTED as readonly string[]).includes(queryLang)) {
        return redirect(url, `/${queryLang}/`, queryLang as Lang)
    }
    const userAgent = req.headers.get("user-agent");
    if (isBot(userAgent)) {
        return context.next();
    }
    const cookies = parseCookies(req.headers.get('cookie'));
    const cookieLang = cookies[COOKIE_NAME] as Lang | undefined;
    if (cookieLang && SUPPORTED.includes(cookieLang)) {
        return redirect(url, `/${cookieLang}/`)
    }
    const detected = detectLangFromAcceptLanguage(req.headers.get('accept-language')) ?? DEFAULT_LANG;
    return redirect(url, `/${detected}/`, detected)


}