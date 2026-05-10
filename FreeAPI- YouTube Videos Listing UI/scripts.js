import { formatViews, formatDuration, timeAgo } from './utils/videoFormat.js';

const BASE_URI = 'https://api.freeapi.app/api/v1/public/youtube/videos';
let currentPage = 1;
let totalPages = 1;

async function fetchVideos(page = 1) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-3 py-20 px-5 text-gray-500 text-sm">
            <div class="w-9 h-9 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin"></div>
            <span>Loading videos…</span>
        </div>
    `;

    try {
        const res = await fetch(`${BASE_URI}?page=${page}&limit=12`);
        
        const json = await res.json();

        if (!json.success) throw new Error('API error');

        const videos = json.data.data || [];
        totalPages = json.data.totalPages || 1;
        currentPage = json.data.page || page;

        console.log('Fetched videos:', videos, 'Page:', currentPage, 'of', totalPages);

        if (!videos.length) {
        app.innerHTML = `<div class="flex flex-col items-center justify-center gap-3 py-20 px-5 text-gray-500 text-sm"><span>No videos found.</span></div>`;
        return;
        }

        const cards = videos.map(v => {
            const details = v.items.snippet.description;
            const videoId = v.items.id;
            const thumb = v.items.snippet.thumbnails.standard.url;
            const title = v.items.snippet.localized.title;
            const channel = v.items.snippet.channelTitle;
            const views = formatViews(v.items.statistics.viewCount);
            const duration = formatDuration(v.items.contentDetails.duration);
            const ago = timeAgo(v.items.snippet.publishedAt);

            return `
                <a class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg no-underline text-inherit block" href="https://youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
                <div class="relative w-full pt-[56.25%] bg-gray-200 overflow-hidden">
                    ${thumb ? `<img src="${thumb}" alt="${title.replace(/"/g,'')}" loading="lazy" class="absolute inset-0 w-full h-full object-cover"/>` : ''}
                    ${duration ? `<span class="absolute bottom-2 right-2 bg-black/75 text-white text-xs font-medium px-1.5 py-0.5 rounded tracking-wider">${duration}</span>` : ''}
                </div>
                <div class="p-3.5">
                    <p class="text-sm font-semibold leading-snug line-clamp-2 mb-2">${title}</p>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <span class="font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">${channel}</span>
                    <span class="flex-shrink-0">·</span>
                    <span class="whitespace-nowrap">${views}</span>
                    ${ago ? `<span class="flex-shrink-0">·</span><span class="whitespace-nowrap">${ago}</span>` : ''}
                    </div>
                </div>
                </a>`;
            })
        .join('');

        app.innerHTML = `
        <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">${cards}</div>
        <div class="flex justify-center items-center gap-3 mt-9">
            <button class="px-4 py-2 rounded-lg border border-gray-200 bg-white font-sans text-sm font-medium cursor-pointer transition-colors duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed" id="prev" ${currentPage <= 1 ? 'disabled' : ''}>← Prev</button>
            <span class="text-xs text-gray-500">Page ${currentPage} of ${totalPages}</span>
            <button class="px-4 py-2 rounded-lg border border-gray-200 bg-white font-sans text-sm font-medium cursor-pointer transition-colors duration-150 hover:enabled:bg-gray-100 hover:enabled:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed" id="next" ${currentPage >= totalPages ? 'disabled' : ''}>Next →</button>
        </div>`;

        document.getElementById('prev')?.addEventListener('click', () => fetchVideos(currentPage - 1));
        document.getElementById('next')?.addEventListener('click', () => fetchVideos(currentPage + 1));

    } catch (err) {
        app.innerHTML = `<div class="flex flex-col items-center justify-center gap-3 py-20 px-5 text-gray-500 text-sm"><span>Failed to load videos. Please try again.</span></div>`;
        console.error(err);
    }
}

fetchVideos(1);