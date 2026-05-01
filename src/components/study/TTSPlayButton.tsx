import { useState, useEffect, useMemo } from 'react';
import { Play, Square, Volume2, Pause } from 'lucide-react';

type Status = 'idle' | 'playing' | 'paused' | 'error';
type Lang = 'ja-JP' | 'zh-CN';

const STATUS_LABEL: Record<Status, string> = {
    idle: '系统原生引擎，极速秒读',
    playing: '正在朗读解析文本...',
    paused: '已暂停',
    error: '部分语音朗读失败',
};

const PLAY_BTN_CLASS: Record<Status, string> = {
    idle: 'bg-white hover:bg-primary/10 text-primary border border-primary/20',
    playing: 'bg-primary text-white shadow-glow',
    paused: 'bg-primary/20 text-primary',
    error: 'bg-error/10 text-error',
};

// Cache voices once. getVoices() returns [] until 'voiceschanged' fires on Chromium.
let voicesCache: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const refresh = () => { voicesCache = window.speechSynthesis.getVoices(); };
    refresh();
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
}

function htmlToPlainText(htmlStr: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlStr;
    const raw = tmp.textContent || tmp.innerText || '';
    if (!raw) return '';
    return raw.replace(/\([^)]+\)|（[^）]+）/g, ' ').replace(/\s+/g, ' ').trim();
}

function chunkByLang(text: string): { text: string; lang: Lang }[] {
    const cjk = /[一-龥぀-ヿ]/;
    const kana = /[぀-ヿ]/;
    const tokens = text.match(/[一-龥぀-ヿ]+|[^一-龥぀-ヿ]+/g) || [];
    const chunks: { text: string; lang: Lang }[] = [];
    let currentLang: Lang = 'zh-CN';

    for (const token of tokens) {
        if (cjk.test(token)) {
            currentLang = kana.test(token) ? 'ja-JP' : 'zh-CN';
        }
        const last = chunks[chunks.length - 1];
        if (last && last.lang === currentLang) {
            last.text += token;
        } else {
            chunks.push({ text: token, lang: currentLang });
        }
    }
    return chunks;
}

export function TTSPlayButton({ text }: { text: string }) {
    const [status, setStatus] = useState<Status>('idle');

    const chunks = useMemo(() => chunkByLang(htmlToPlainText(text)), [text]);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        };
    }, [text]);

    const stopPlayback = () => {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        setStatus('idle');
    };

    const togglePlay = () => {
        if (status === 'playing') {
            window.speechSynthesis.pause();
            setStatus('paused');
            return;
        }
        if (status === 'paused') {
            window.speechSynthesis.resume();
            setStatus('playing');
            return;
        }
        if (chunks.length === 0) return;

        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        setStatus('playing');

        // Prefer Mandarin (zh-CN) over Cantonese (zh-HK) or Taiwanese (zh-TW).
        const jaVoice = voicesCache.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP') || voicesCache.find(v => v.lang.includes('ja'));
        const zhVoice = voicesCache.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN') || voicesCache.find(v => v.lang.includes('zh'));

        const finishIfDone = () => {
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                setStatus('idle');
            }
        };

        chunks.forEach((chunk) => {
            const utterance = new SpeechSynthesisUtterance(chunk.text);
            utterance.lang = chunk.lang;
            utterance.rate = 0.9;
            const voice = chunk.lang === 'ja-JP' ? jaVoice : zhVoice;
            if (voice) utterance.voice = voice;

            utterance.onend = finishIfDone;
            utterance.onerror = (e) => {
                // Manual cancel/pause emits 'interrupted'/'canceled' on every queued utterance — ignore.
                if (e.error !== 'interrupted' && e.error !== 'canceled') {
                    console.error('Speech synthesis error', e);
                    setStatus('error');
                }
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch {
                setStatus('error');
            }
        });
    };

    const isActive = status === 'playing' || status === 'paused';

    return (
        <div className="mt-4 p-4 glass-card rounded-xl flex items-center justify-between border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Volume2 size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-0.5">智能语音朗读</h4>
                    <p className={`text-xs line-clamp-1 ${status === 'error' ? 'text-error' : 'text-text-secondary'}`}>
                        {STATUS_LABEL[status]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isActive && (
                    <button
                        onClick={stopPlayback}
                        className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-error/10 text-error hover:bg-error/20 transition-all border border-error/20"
                        title="停止"
                    >
                        <Square size={14} fill="currentColor" />
                    </button>
                )}

                <button
                    onClick={togglePlay}
                    className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${PLAY_BTN_CLASS[status]}`}
                >
                    {status === 'playing'
                        ? <Pause size={20} />
                        : <Play size={20} className="ml-1" />}
                </button>
            </div>
        </div>
    );
}
