import { useState, useEffect } from 'react';
import { Play, Square, Volume2, Pause } from 'lucide-react';

export function TTSPlayButton({ text }: { text: string }) {
    const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        return () => {
            stopPlayback();
        };
    }, []);

    const cleanHTML = (htmlStr: string) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = htmlStr;
        let raw = tmp.textContent || tmp.innerText || '';
        // Remove duplicated readings wrapped in parentheses e.g. (いちろうは) or （よこになる）
        if (raw) {
            raw = raw.replace(/\([^)]+\)|（[^）]+）/g, ' ');
            raw = raw.replace(/\s+/g, ' ').trim();
        }
        return raw;
    };

    const stopPlayback = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
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

        let t = cleanHTML(text);
        if (!t) return;

        stopPlayback();
        setStatus('playing');
        setErrorMsg('');

        // 将文本按照中日文特征进行智能分块
        const tokens = t.match(/[\u4E00-\u9FA5\u3040-\u30FF]+|[^\u4E00-\u9FA5\u3040-\u30FF]+/g) || [];

        type Chunk = { text: string; lang: 'ja-JP' | 'zh-CN' };
        const chunks: Chunk[] = [];
        let currentLang: 'ja-JP' | 'zh-CN' = 'zh-CN';

        for (const token of tokens) {
            if (/[\u4E00-\u9FA5\u3040-\u30FF]/.test(token)) {
                // 如果包含假名，则判定为日语片段
                if (/[\u3040-\u30FF]/.test(token)) {
                    currentLang = 'ja-JP';
                } else {
                    currentLang = 'zh-CN';
                }
            }

            if (chunks.length > 0 && chunks[chunks.length - 1].lang === currentLang) {
                chunks[chunks.length - 1].text += token;
            } else {
                chunks.push({ text: token, lang: currentLang });
            }
        }

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP') || voices.find(v => v.lang.includes('ja'));
        // 确保优先选择普通话 (zh-CN) 而不是粤语 (zh-HK) 或台湾国语 (zh-TW)
        const zhVoice = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN') || voices.find(v => v.lang.includes('zh'));

        chunks.forEach((chunk, index) => {
            const utterance = new SpeechSynthesisUtterance(chunk.text);
            utterance.lang = chunk.lang;
            utterance.rate = 0.9; // 稍微放慢语速适合学习

            if (chunk.lang === 'ja-JP' && jaVoice) {
                utterance.voice = jaVoice;
            } else if (chunk.lang === 'zh-CN' && zhVoice) {
                utterance.voice = zhVoice;
            }

            if (index === chunks.length - 1) {
                utterance.onend = () => {
                    setStatus('idle');
                };
            }

            utterance.onerror = (e) => {
                console.error('Speech synthesis error', e);
                // 忽略被手动取消或暂停导致的错误
                if (e.error !== 'interrupted' && e.error !== 'canceled') {
                    setStatus('error');
                    setErrorMsg('部分语音朗读失败');
                }
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch (err: any) {
                setStatus('error');
                setErrorMsg('浏览器不支持语音API');
            }
        });
    };

    return (
        <div className="mt-4 p-4 glass-card rounded-xl flex items-center justify-between border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Volume2 size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-0.5">智能语音朗读</h4>
                    <p className="text-xs text-text-secondary line-clamp-1">
                        {status === 'idle' && '系统原生引擎，极速秒读'}
                        {status === 'playing' && '正在朗读解析文本...'}
                        {status === 'paused' && '已暂停'}
                        {status === 'error' && <span className="text-error">{errorMsg}</span>}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {(status === 'playing' || status === 'paused') && (
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
                    className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${status === 'playing'
                        ? 'bg-primary text-white shadow-glow'
                        : status === 'paused'
                            ? 'bg-primary/20 text-primary'
                            : status === 'error'
                                ? 'bg-error/10 text-error'
                                : 'bg-white hover:bg-primary/10 text-primary border border-primary/20'
                        }`}
                >
                    {status === 'idle' || status === 'error' ? <Play size={20} className="ml-1" /> : null}
                    {status === 'playing' ? <Pause size={20} /> : null}
                    {status === 'paused' ? <Play size={20} className="ml-1" /> : null}
                </button>
            </div>
        </div>
    );
}
