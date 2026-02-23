import type { PagesFunction } from "@cloudflare/workers-types";

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
    const target = new URL(toPath, url).toString();
    const headers = new Headers({
        Location: target,
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        "X-I18n-Redirect": "1",
        // 你這個其實也該加，避免中介層用 Accept-Language 混 cache
        Vary: "Accept-Language",
    });
    if (cookieLang) {
        const maxAge = 60 * 60 * 24 * 180;
        headers.append(
            "Set-Cookie",
            `${COOKIE_NAME}=${encodeURIComponent(cookieLang)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
        );
    }
    return new Response(null, { status: 302, headers });
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
    const cookies = parseCookies(req.headers.get('cookie') || "");
    const cookieLang = cookies[COOKIE_NAME] as Lang | undefined;
    if (cookieLang && SUPPORTED.includes(cookieLang)) {
        return redirect(url, `/${cookieLang}/`)
    }
    const detected = detectLangFromAcceptLanguage(req.headers.get('accept-language')) ?? DEFAULT_LANG;
    return redirect(url, `/${detected}/`, detected)


}