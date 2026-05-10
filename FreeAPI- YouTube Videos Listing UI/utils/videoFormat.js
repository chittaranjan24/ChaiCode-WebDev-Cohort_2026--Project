export function formatViews(n) {
    if (!n) return '0 views';

    n = parseInt(n);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M views';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K views';

    return n + ' views';
}

export function formatDuration(iso) {
    if (!iso) return '';

    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';

    const h = parseInt(m[1] || 0), min = parseInt(m[2] || 0), s = parseInt(m[3] || 0);
    if (h) return `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    return `${min}:${String(s).padStart(2,'0')}`;
}

export function timeAgo(dateStr) {
    if (!dateStr) return '';

    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + ' min ago';
    if (diff < 86400) return Math.floor(diff/3600) + ' hr ago';
    if (diff < 2592000) return Math.floor(diff/86400) + ' days ago';
    if (diff < 31536000) return Math.floor(diff/2592000) + ' mo ago';

    return Math.floor(diff/31536000) + ' yr ago';
}
