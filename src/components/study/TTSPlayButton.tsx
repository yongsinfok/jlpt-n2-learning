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
    idle: 'bg-surface hover:bg-accent-pale text-accent border border-accent/20',
    playing: 'bg-accent text-white shadow-sm',
    paused: 'bg-accent-pale text-accent',
    error: 'bg-accent-pale text-accent',
};

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
        <div className="mt-4 p-4 bg-surface border border-border rounded-[10px] shadow-sm flex items-center justify-between border border-accent/20 bg-accent-pale">
            <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-accent-pale flex items-center justify-center text-accent">
                    <Volume2 size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-ink mb-0.5">智能语音朗读</h4>
                    <p className={`text-xs line-clamp-1 ${status === 'error' ? 'text-accent' : 'text-ink-soft'}`}>
                        {STATUS_LABEL[status]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isActive && (
                    <button
                        onClick={stopPlayback}
                        className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center bg-accent-pale text-accent hover:bg-accent-pale transition-all border border-accent/20"
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
